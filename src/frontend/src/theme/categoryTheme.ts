import type { MicroAppCategory } from '../catalog/microAppsCatalog';

export interface CategoryTheme {
  color: string;
  iconPath: string;
}

export const categoryThemeMap: Record<MicroAppCategory, CategoryTheme> = {
  ai: {
    color: 'oklch(0.7 0.19 280)',
    iconPath: '/assets/generated/icon-ai.dim_256x256.png',
  },
  banking: {
    color: 'oklch(0.65 0.15 160)',
    iconPath: '/assets/generated/icon-banking.dim_256x256.png',
  },
  payments: {
    color: 'oklch(0.7 0.18 140)',
    iconPath: '/assets/generated/icon-payments.dim_256x256.png',
  },
  dao: {
    color: 'oklch(0.68 0.17 200)',
    iconPath: '/assets/generated/icon-dao.dim_256x256.png',
  },
  network: {
    color: 'oklch(0.65 0.16 220)',
    iconPath: '/assets/generated/icon-network.dim_256x256.png',
  },
  messaging: {
    color: 'oklch(0.72 0.19 180)',
    iconPath: '/assets/generated/icon-messaging.dim_256x256.png',
  },
  forums: {
    color: 'oklch(0.68 0.18 30)',
    iconPath: '/assets/generated/icon-forums.dim_256x256.png',
  },
  social: {
    color: 'oklch(0.7 0.2 340)',
    iconPath: '/assets/generated/icon-social.dim_256x256.png',
  },
  marketplace: {
    color: 'oklch(0.66 0.17 50)',
    iconPath: '/assets/generated/icon-marketplace.dim_256x256.png',
  },
  analytics: {
    color: 'oklch(0.64 0.16 260)',
    iconPath: '/assets/generated/icon-analytics.dim_256x256.png',
  },
  events: {
    color: 'oklch(0.69 0.18 10)',
    iconPath: '/assets/generated/icon-events.dim_256x256.png',
  },
  knowledge: {
    color: 'oklch(0.67 0.17 190)',
    iconPath: '/assets/generated/icon-knowledge.dim_256x256.png',
  },
  forms: {
    color: 'oklch(0.71 0.19 120)',
    iconPath: '/assets/generated/icon-forms.dim_256x256.png',
  },
  files: {
    color: 'oklch(0.66 0.16 240)',
    iconPath: '/assets/generated/icon-files.dim_256x256.png',
  },
  support: {
    color: 'oklch(0.69 0.18 80)',
    iconPath: '/assets/generated/icon-support.dim_256x256.png',
  },
};

export function getCategoryTheme(category: MicroAppCategory): CategoryTheme {
  return categoryThemeMap[category];
}
