import { useState } from 'react';
import {
  useListVendors,
  useCreateVendor,
  useDeactivateVendor,
  useGetCallerUserProfile,
  useGetUserRole,
} from '../hooks/useQueries';
import { useTranslation } from '../i18n';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorManagementPage() {
  const { data: vendors = [], isLoading } = useListVendors();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userRole } = useGetUserRole(userProfile?.activeOrgId || null);
  const createVendor = useCreateVendor();
  const deactivateVendor = useDeactivateVendor();
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorDescription, setVendorDescription] = useState('');
  const [vendorContact, setVendorContact] = useState('');

  const canManageVendors = userRole === 'owner' || userRole === 'admin';

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.activeOrgId) {
      toast.error('Please select an organization first');
      return;
    }

    if (!vendorName.trim()) {
      toast.error('Vendor name is required');
      return;
    }

    try {
      await createVendor.mutateAsync({
        orgId: userProfile.activeOrgId,
        name: vendorName.trim(),
        description: vendorDescription.trim(),
        contactInfo: vendorContact.trim(),
      });
      toast.success('Vendor created successfully!');
      setDialogOpen(false);
      setVendorName('');
      setVendorDescription('');
      setVendorContact('');
    } catch (error) {
      console.error('Failed to create vendor:', error);
      toast.error('Failed to create vendor');
    }
  };

  const handleDeactivate = async (vendorId: bigint) => {
    try {
      await deactivateVendor.mutateAsync(vendorId);
      toast.success('Vendor deactivated successfully!');
    } catch (error) {
      console.error('Failed to deactivate vendor:', error);
      toast.error('Failed to deactivate vendor');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('vendor.title')}</h1>
            <p className="text-muted-foreground">Manage vendors for your organization</p>
          </div>
          {canManageVendors && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t('vendor.create')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('vendor.create')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateVendor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName">{t('vendor.name')} *</Label>
                    <Input
                      id="vendorName"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="Enter vendor name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorDescription">{t('vendor.description')}</Label>
                    <Textarea
                      id="vendorDescription"
                      value={vendorDescription}
                      onChange={(e) => setVendorDescription(e.target.value)}
                      placeholder="Describe the vendor"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorContact">{t('vendor.contact')}</Label>
                    <Input
                      id="vendorContact"
                      value={vendorContact}
                      onChange={(e) => setVendorContact(e.target.value)}
                      placeholder="contact@vendor.com"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createVendor.isPending}>
                    {createVendor.isPending ? t('common.loading') : t('common.create')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {vendors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">No vendors yet</p>
              {canManageVendors && <Button onClick={() => setDialogOpen(true)}>{t('vendor.create')}</Button>}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {vendors.map((vendor) => (
              <Card key={vendor.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Package size={24} />
                        {vendor.name}
                        <Badge variant={vendor.isActive ? 'default' : 'secondary'}>
                          {vendor.isActive ? t('vendor.active') : t('vendor.inactive')}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">{vendor.description}</CardDescription>
                    </div>
                    {canManageVendors && vendor.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(vendor.id)}
                        disabled={deactivateVendor.isPending}
                      >
                        {t('vendor.deactivate')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={16} />
                    <span>{vendor.contactInfo || 'No contact info'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
