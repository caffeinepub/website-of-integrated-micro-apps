import { useNavigate } from '@tanstack/react-router';
import type { MicroApp } from '../catalog/microAppsCatalog';
import { getCategoryTheme } from '../theme/categoryTheme';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface MicroAppCardProps {
  app: MicroApp;
}

export default function MicroAppCard({ app }: MicroAppCardProps) {
  const theme = getCategoryTheme(app.category);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: `/app/${app.slug}` as any });
  };

  return (
    <div onClick={handleClick} className="block group cursor-pointer">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-[var(--category-color)]" style={{ '--category-color': theme.color } as any}>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.color }}
            >
              <img src={theme.iconPath} alt={app.name} className="w-10 h-10 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg group-hover:text-[var(--category-color)] transition-colors" style={{ '--category-color': theme.color } as any}>
                {app.name}
              </CardTitle>
              <div
                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1"
                style={{
                  backgroundColor: `${theme.color}20`,
                  color: theme.color,
                }}
              >
                {app.category}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">{app.description}</CardDescription>
          <div className="flex items-center gap-2 mt-4 text-sm font-medium group-hover:text-[var(--category-color)] transition-colors" style={{ '--category-color': theme.color } as any}>
            <span>Open App</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
