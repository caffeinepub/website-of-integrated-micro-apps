import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useInteropContext } from '../hooks/useInteropContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

interface RequireRoleProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireOwner?: boolean;
}

export default function RequireRole({ children, requireAdmin, requireOwner }: RequireRoleProps) {
  const { identity } = useInternetIdentity();
  const { data: context, isLoading } = useInteropContext();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>You must be logged in to access this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  const userRole = context?.userRole;

  if (requireOwner && userRole !== 'owner') {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This page is only accessible to organization owners.
            <div className="mt-4">
              <Link to="/organizations">
                <Button variant="outline" size="sm">
                  Go to Organizations
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (requireAdmin && userRole !== 'owner' && userRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This page is only accessible to organization admins and owners.
            <div className="mt-4">
              <Link to="/organizations">
                <Button variant="outline" size="sm">
                  Go to Organizations
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
