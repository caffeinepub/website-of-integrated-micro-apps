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

export const microAppsCatalog: MicroApp[] = [
  // AI Category
  {
    id: 'ai-playground',
    slug: 'ai-playground',
    name: 'AI Playground',
    description: 'Experiment with AI prompts and responses in a safe environment',
    category: 'ai',
    iconKey: 'icon-ai',
  },
  {
    id: 'ai-assistant',
    slug: 'ai-assistant',
    name: 'AI Assistant',
    description: 'Your personal AI helper for daily tasks and questions',
    category: 'ai',
    iconKey: 'icon-ai',
  },

  // Banking Category
  {
    id: 'banking-dashboard',
    slug: 'banking-dashboard',
    name: 'Banking Dashboard',
    description: 'Manage your accounts and transactions securely',
    category: 'banking',
    iconKey: 'icon-banking',
  },

  // Payments Category
  {
    id: 'payments-hub',
    slug: 'payments-hub',
    name: 'Payments Hub',
    description: 'Send and receive payments instantly with low fees',
    category: 'payments',
    iconKey: 'icon-payments',
  },
  {
    id: 'wallet-manager',
    slug: 'wallet-manager',
    name: 'Wallet Manager',
    description: 'Manage multiple wallets and track your balances',
    category: 'payments',
    iconKey: 'icon-payments',
  },

  // DAO Category
  {
    id: 'dao-proposals',
    slug: 'dao-proposals',
    name: 'DAO Proposals',
    description: 'Create and vote on governance proposals for your organization',
    category: 'dao',
    iconKey: 'icon-dao',
  },
  {
    id: 'dao-treasury',
    slug: 'dao-treasury',
    name: 'DAO Treasury',
    description: 'Track and manage your organization treasury',
    category: 'dao',
    iconKey: 'icon-dao',
  },

  // Network Category
  {
    id: 'professional-network',
    slug: 'professional-network',
    name: 'Professional Network',
    description: 'Connect with professionals in your industry',
    category: 'network',
    iconKey: 'icon-network',
  },
  {
    id: 'job-board',
    slug: 'job-board',
    name: 'Job Board',
    description: 'Find opportunities and post job listings',
    category: 'network',
    iconKey: 'icon-network',
  },

  // Messaging Category
  {
    id: 'messaging',
    slug: 'messaging',
    name: 'Messaging',
    description: 'Secure, private messaging for teams and individuals',
    category: 'messaging',
    iconKey: 'icon-messaging',
  },
  {
    id: 'video-calls',
    slug: 'video-calls',
    name: 'Video Calls',
    description: 'High-quality video conferencing for remote teams',
    category: 'messaging',
    iconKey: 'icon-messaging',
  },

  // Forums Category
  {
    id: 'forum',
    slug: 'forum',
    name: 'Community Forum',
    description: 'Discuss topics and share knowledge with the community',
    category: 'forums',
    iconKey: 'icon-forums',
  },
  {
    id: 'qa-platform',
    slug: 'qa-platform',
    name: 'Q&A Platform',
    description: 'Ask questions and get answers from experts',
    category: 'forums',
    iconKey: 'icon-forums',
  },

  // Social Category
  {
    id: 'social-feed',
    slug: 'social-feed',
    name: 'Social Feed',
    description: 'Share updates and connect with friends and followers',
    category: 'social',
    iconKey: 'icon-social',
  },
  {
    id: 'stories',
    slug: 'stories',
    name: 'Stories',
    description: 'Share moments that disappear after 24 hours',
    category: 'social',
    iconKey: 'icon-social',
  },

  // Marketplace Category
  {
    id: 'marketplace',
    slug: 'marketplace',
    name: 'Marketplace',
    description: 'Buy and sell products from verified vendors',
    category: 'marketplace',
    iconKey: 'icon-marketplace',
  },
  {
    id: 'vendor-directory',
    slug: 'vendor-directory',
    name: 'Vendor Directory',
    description: 'Discover and connect with service providers',
    category: 'marketplace',
    iconKey: 'icon-marketplace',
  },

  // Analytics Category
  {
    id: 'analytics-dashboard',
    slug: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Track metrics and visualize your data',
    category: 'analytics',
    iconKey: 'icon-analytics',
  },
  {
    id: 'reports-builder',
    slug: 'reports-builder',
    name: 'Reports Builder',
    description: 'Create custom reports and export data',
    category: 'analytics',
    iconKey: 'icon-analytics',
  },

  // Events Category
  {
    id: 'events-calendar',
    slug: 'events-calendar',
    name: 'Events Calendar',
    description: 'Schedule and manage events for your organization',
    category: 'events',
    iconKey: 'icon-events',
  },
  {
    id: 'ticketing',
    slug: 'ticketing',
    name: 'Event Ticketing',
    description: 'Sell tickets and manage event registrations',
    category: 'events',
    iconKey: 'icon-events',
  },

  // Knowledge Category
  {
    id: 'knowledge-base',
    slug: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'Organize and share documentation and guides',
    category: 'knowledge',
    iconKey: 'icon-knowledge',
  },
  {
    id: 'wiki',
    slug: 'wiki',
    name: 'Wiki',
    description: 'Collaborative knowledge management for teams',
    category: 'knowledge',
    iconKey: 'icon-knowledge',
  },

  // Forms Category
  {
    id: 'form-builder',
    slug: 'form-builder',
    name: 'Form Builder',
    description: 'Create custom forms and collect responses',
    category: 'forms',
    iconKey: 'icon-forms',
  },
  {
    id: 'surveys',
    slug: 'surveys',
    name: 'Surveys',
    description: 'Gather feedback with powerful survey tools',
    category: 'forms',
    iconKey: 'icon-forms',
  },

  // Files Category
  {
    id: 'file-storage',
    slug: 'file-storage',
    name: 'File Storage',
    description: 'Store and share files securely in the cloud',
    category: 'files',
    iconKey: 'icon-files',
  },
  {
    id: 'document-editor',
    slug: 'document-editor',
    name: 'Document Editor',
    description: 'Collaborate on documents in real-time',
    category: 'files',
    iconKey: 'icon-files',
  },

  // Support Category
  {
    id: 'help-desk',
    slug: 'help-desk',
    name: 'Help Desk',
    description: 'Manage customer support tickets efficiently',
    category: 'support',
    iconKey: 'icon-support',
  },
  {
    id: 'live-chat',
    slug: 'live-chat',
    name: 'Live Chat',
    description: 'Provide instant support to your customers',
    category: 'support',
    iconKey: 'icon-support',
  },
];

export function getMicroAppBySlug(slug: string): MicroApp | undefined {
  return microAppsCatalog.find((app) => app.slug === slug);
}

export function getMicroAppsByCategory(category: MicroAppCategory): MicroApp[] {
  return microAppsCatalog.filter((app) => app.category === category);
}

export const categories: { key: MicroAppCategory; label: string }[] = [
  { key: 'ai', label: 'AI' },
  { key: 'banking', label: 'Banking' },
  { key: 'payments', label: 'Payments' },
  { key: 'dao', label: 'DAO' },
  { key: 'network', label: 'Professional Network' },
  { key: 'messaging', label: 'Messaging' },
  { key: 'forums', label: 'Forums' },
  { key: 'social', label: 'Social Media' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'events', label: 'Events' },
  { key: 'knowledge', label: 'Knowledge Base' },
  { key: 'forms', label: 'Forms & Surveys' },
  { key: 'files', label: 'File Sharing' },
  { key: 'support', label: 'Customer Support' },
];
