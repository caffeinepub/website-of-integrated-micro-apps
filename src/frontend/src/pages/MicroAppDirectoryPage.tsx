import { useState, useMemo } from 'react';
import { microAppsCatalog, categories, type MicroAppCategory } from '../catalog/microAppsCatalog';
import MicroAppCard from '../components/MicroAppCard';
import CategoryBadge from '../components/CategoryBadge';
import { useTranslation } from '../i18n';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function MicroAppDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MicroAppCategory | 'all'>('all');
  const { t } = useTranslation();

  const filteredApps = useMemo(() => {
    return microAppsCatalog.filter((app) => {
      const matchesSearch =
        searchQuery === '' ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedApps = useMemo(() => {
    const groups: Record<string, typeof filteredApps> = {};
    filteredApps.forEach((app) => {
      if (!groups[app.category]) {
        groups[app.category] = [];
      }
      groups[app.category].push(app);
    });
    return groups;
  }, [filteredApps]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('directory.title')}</h1>
          <p className="text-xl text-muted-foreground">{t('directory.subtitle')}</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder={t('directory.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              {t('directory.filter.all')}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.key}
                variant={selectedCategory === cat.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">{t('directory.empty')}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedApps).map(([categoryKey, apps]) => {
              const category = categories.find((c) => c.key === categoryKey);
              if (!category) return null;

              return (
                <div key={categoryKey}>
                  <div className="mb-6">
                    <CategoryBadge category={category.key} label={category.label} />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app) => (
                      <MicroAppCard key={app.id} app={app} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
