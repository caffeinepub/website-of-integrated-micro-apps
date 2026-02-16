import { useGetCallerUserProfile, useGetActiveVendors } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function MarketplaceShell() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: vendors = [], isLoading } = useGetActiveVendors(userProfile?.activeOrgId || null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/directory">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Directory
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Marketplace</h1>

        {!userProfile?.activeOrgId ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">Please select an organization to view vendors</p>
              <Link to="/organizations">
                <Button>Go to Organizations</Button>
              </Link>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="text-center py-12">Loading vendors...</div>
        ) : vendors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">No vendors available yet</p>
              <Link to="/vendors">
                <Button>Manage Vendors</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {vendors.map((vendor) => (
              <Card key={vendor.id.toString()}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package size={24} />
                    {vendor.name}
                  </CardTitle>
                  <CardDescription>{vendor.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Mail size={16} />
                    <span>{vendor.contactInfo || 'No contact info'}</span>
                  </div>
                  <Button size="sm" className="w-full">
                    View Products
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
