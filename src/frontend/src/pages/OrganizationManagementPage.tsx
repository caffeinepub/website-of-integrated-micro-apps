import { useState } from 'react';
import {
  useListOrganizations,
  useCreateOrganization,
  useJoinOrganization,
  useGetCallerUserProfile,
} from '../hooks/useQueries';
import { useTranslation } from '../i18n';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function OrganizationManagementPage() {
  const { data: organizations = [], isLoading } = useListOrganizations();
  const { data: userProfile } = useGetCallerUserProfile();
  const createOrg = useCreateOrganization();
  const joinOrg = useJoinOrganization();
  const { t } = useTranslation();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgEmail, setNewOrgEmail] = useState('');
  const [joinOrgId, setJoinOrgId] = useState('');

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) {
      toast.error('Organization name is required');
      return;
    }

    try {
      await createOrg.mutateAsync({ name: newOrgName.trim(), email: newOrgEmail.trim() });
      toast.success('Organization created successfully!');
      setCreateDialogOpen(false);
      setNewOrgName('');
      setNewOrgEmail('');
    } catch (error) {
      console.error('Failed to create organization:', error);
      toast.error('Failed to create organization');
    }
  };

  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = BigInt(joinOrgId);

    try {
      await joinOrg.mutateAsync(orgId);
      toast.success('Joined organization successfully!');
      setJoinDialogOpen(false);
      setJoinOrgId('');
    } catch (error) {
      console.error('Failed to join organization:', error);
      toast.error('Failed to join organization');
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
            <h1 className="text-4xl font-bold mb-2">{t('org.title')}</h1>
            <p className="text-muted-foreground">Manage your organizations and memberships</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t('org.create')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('org.create')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateOrg} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">{t('org.name')} *</Label>
                    <Input
                      id="orgName"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      placeholder="Enter organization name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgEmail">{t('org.email')}</Label>
                    <Input
                      id="orgEmail"
                      type="email"
                      value={newOrgEmail}
                      onChange={(e) => setNewOrgEmail(e.target.value)}
                      placeholder="org@example.com"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createOrg.isPending}>
                    {createOrg.isPending ? t('common.loading') : t('common.create')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">{t('org.join')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('org.join')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleJoinOrg} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinOrgId">{t('org.id')} *</Label>
                    <Input
                      id="joinOrgId"
                      value={joinOrgId}
                      onChange={(e) => setJoinOrgId(e.target.value)}
                      placeholder="Enter organization ID"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={joinOrg.isPending}>
                    {joinOrg.isPending ? t('common.loading') : t('org.join')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {organizations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">You haven't joined any organizations yet</p>
              <Button onClick={() => setCreateDialogOpen(true)}>{t('org.create')}</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {organizations.map((org) => (
              <Card
                key={org.id.toString()}
                className={org.id === userProfile?.activeOrgId ? 'border-2 border-primary' : ''}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 size={24} />
                        {org.name}
                        {org.id === userProfile?.activeOrgId && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">ID: {org.id.toString()}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-muted-foreground" />
                      <span>
                        {t('org.members')}: {org.members.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span>
                        {t('org.created')}: {new Date(Number(org.createdAt) / 1000000).toLocaleDateString()}
                      </span>
                    </div>
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
