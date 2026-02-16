import { getCategoryTheme } from '../theme/categoryTheme';
import type { MicroAppCategory } from '../catalog/microAppsCatalog';

interface CategoryBadgeProps {
  category: MicroAppCategory;
  label: string;
}

export default function CategoryBadge({ category, label }: CategoryBadgeProps) {
  const theme = getCategoryTheme(category);

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
      style={{
        backgroundColor: `${theme.color}20`,
        color: theme.color,
      }}
    >
      <img src={theme.iconPath} alt={label} className="w-4 h-4 object-contain" />
      <span>{label}</span>
    </div>
  );
}
