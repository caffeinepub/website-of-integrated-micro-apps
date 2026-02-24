export type MicroAppCategory =
  | 'ai'
  | 'banking'
  | 'payments'
  | 'dao'
  | 'network'
  | 'messaging'
  | 'forums'
  | 'social'
  | 'marketplace'
  | 'analytics'
  | 'events'
  | 'knowledge'
  | 'forms'
  | 'files'
  | 'support';

export interface MicroApp {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: MicroAppCategory;
  iconKey: string;
}

export interface Category {
  key: MicroAppCategory;
  label: string;
}

export const categories: Category[] = [
  { key: 'ai', label: 'AI' },
  { key: 'banking', label: 'Banking' },
  { key: 'payments', label: 'Payments' },
  { key: 'dao', label: 'DAO' },
  { key: 'network', label: 'Network' },
  { key: 'messaging', label: 'Messaging' },
  { key: 'forums', label: 'Forums' },
  { key: 'social', label: 'Social' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'events', label: 'Events' },
  { key: 'knowledge', label: 'Knowledge' },
  { key: 'forms', label: 'Forms' },
  { key: 'files', label: 'Files' },
  { key: 'support', label: 'Support' },
];

export const microAppsCatalog: MicroApp[] = [
  // AI Category
  {
    id: 'ai-playground',
    slug: 'ai-playground',
    name: 'AI Playground',
    description: 'Experiment with AI prompts and responses in a safe environment.',
    category: 'ai',
    iconKey: 'ai',
  },

  // Banking Category
  {
    id: 'banking-dashboard',
    slug: 'banking-dashboard',
    name: 'Banking Dashboard',
    description: 'Manage accounts, transactions, and financial insights.',
    category: 'banking',
    iconKey: 'banking',
  },

  // Payments Category
  {
    id: 'payment-gateway',
    slug: 'payment-gateway',
    name: 'Payment Gateway',
    description: 'Process payments securely with multiple payment methods.',
    category: 'payments',
    iconKey: 'payments',
  },

  // DAO Category
  {
    id: 'dao-voting',
    slug: 'dao-voting',
    name: 'DAO Voting',
    description: 'Participate in decentralized governance and voting.',
    category: 'dao',
    iconKey: 'dao',
  },

  // Network Category
  {
    id: 'network-monitor',
    slug: 'network-monitor',
    name: 'Network Monitor',
    description: 'Monitor network performance and connectivity in real-time.',
    category: 'network',
    iconKey: 'network',
  },

  // Messaging Category
  {
    id: 'messaging-inbox',
    slug: 'messaging-inbox',
    name: 'Messaging Inbox',
    description: 'Send and receive messages with organization members. Supports real-time message updates, conversation threading, and multi-tenant data isolation.',
    category: 'messaging',
    iconKey: 'messaging',
  },

  // Forums Category
  {
    id: 'forum',
    slug: 'forum',
    name: 'Community Forum',
    description: 'Participate in organization discussions with topics and replies. Features real-time updates, user-generated content, and role-based moderation controls.',
    category: 'forums',
    iconKey: 'forums',
  },

  // Social Category
  {
    id: 'social-feed',
    slug: 'social-feed',
    name: 'Social Feed',
    description: 'Create, share, and interact with posts within your organization. Features real-time updates, user-generated content, and organization-scoped data isolation.',
    category: 'social',
    iconKey: 'social',
  },

  // Marketplace Category
  {
    id: 'vendor-marketplace',
    slug: 'vendor-marketplace',
    name: 'Vendor Marketplace',
    description: 'Browse and connect with verified vendors and service providers.',
    category: 'marketplace',
    iconKey: 'marketplace',
  },
];

export function getMicroAppBySlug(slug: string): MicroApp | undefined {
  return microAppsCatalog.find((app) => app.slug === slug);
}

export function getCategoryColor(category: MicroAppCategory): string {
  const colors: Record<MicroAppCategory, string> = {
    ai: 'oklch(0.7 0.2 340)',
    banking: 'oklch(0.65 0.18 220)',
    payments: 'oklch(0.72 0.18 160)',
    dao: 'oklch(0.68 0.19 280)',
    network: 'oklch(0.7 0.18 200)',
    messaging: 'oklch(0.68 0.19 35)',
    forums: 'oklch(0.7 0.19 60)',
    social: 'oklch(0.72 0.2 20)',
    marketplace: 'oklch(0.68 0.18 120)',
    analytics: 'oklch(0.65 0.19 260)',
    events: 'oklch(0.7 0.18 300)',
    knowledge: 'oklch(0.68 0.18 180)',
    forms: 'oklch(0.7 0.19 100)',
    files: 'oklch(0.66 0.18 240)',
    support: 'oklch(0.72 0.19 40)',
  };
  return colors[category] || 'oklch(0.68 0.19 35)';
}

export function getCategoryIcon(category: MicroAppCategory): string {
  const icons: Record<MicroAppCategory, string> = {
    ai: '/assets/generated/icon-ai.dim_256x256.png',
    banking: '/assets/generated/icon-banking.dim_256x256.png',
    payments: '/assets/generated/icon-payments.dim_256x256.png',
    dao: '/assets/generated/icon-dao.dim_256x256.png',
    network: '/assets/generated/icon-network.dim_256x256.png',
    messaging: '/assets/generated/icon-messaging.dim_256x256.png',
    forums: '/assets/generated/icon-forums.dim_256x256.png',
    social: '/assets/generated/icon-social.dim_256x256.png',
    marketplace: '/assets/generated/icon-marketplace.dim_256x256.png',
    analytics: '/assets/generated/icon-network.dim_256x256.png',
    events: '/assets/generated/icon-dao.dim_256x256.png',
    knowledge: '/assets/generated/icon-forums.dim_256x256.png',
    forms: '/assets/generated/icon-payments.dim_256x256.png',
    files: '/assets/generated/icon-banking.dim_256x256.png',
    support: '/assets/generated/icon-messaging.dim_256x256.png',
  };
  return icons[category] || icons.social;
}
