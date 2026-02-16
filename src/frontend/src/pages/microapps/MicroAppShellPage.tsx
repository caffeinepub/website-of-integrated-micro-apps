import { useParams } from '@tanstack/react-router';
import { getMicroAppBySlug } from '../../catalog/microAppsCatalog';
import { getCategoryTheme } from '../../theme/categoryTheme';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function MicroAppShellPage() {
  const { slug } = useParams({ from: '/app/$slug' });
  const { data: userProfile } = useGetCallerUserProfile();
  const app = getMicroAppBySlug(slug);

  if (!app) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">App Not Found</h1>
          <p className="text-muted-foreground mb-6">The micro-app you're looking for doesn't exist.</p>
          <Link to="/directory">
            <Button>Back to Directory</Button>
          </Link>
        </div>
      </div>
    );
  }

  const theme = getCategoryTheme(app.category);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/directory">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Directory
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: theme.color }}
            >
              <img src={theme.iconPath} alt={app.name} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{app.name}</h1>
              <p className="text-muted-foreground">{app.description}</p>
            </div>
          </div>
          {userProfile?.activeOrgId && (
            <div className="text-sm text-muted-foreground">
              Active Organization ID: {userProfile.activeOrgId.toString()}
            </div>
          )}
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              This is a placeholder for the <strong>{app.name}</strong> micro-app.
            </p>
            <p className="text-sm text-muted-foreground">
              Full functionality will be implemented in future iterations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
