import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import PortalLayout from './components/PortalLayout';
import PortalHomePage from './pages/PortalHomePage';
import MicroAppDirectoryPage from './pages/MicroAppDirectoryPage';
import OrganizationManagementPage from './pages/OrganizationManagementPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import VendorManagementPage from './pages/VendorManagementPage';
import PricingPlansPage from './pages/PricingPlansPage';
import SocialFeedShell from './pages/microapps/SocialFeedShell';
import MessagingInboxShell from './pages/microapps/MessagingInboxShell';
import DaoProposalsShell from './pages/microapps/DaoProposalsShell';
import ForumShell from './pages/microapps/ForumShell';
import MarketplaceShell from './pages/microapps/MarketplaceShell';
import AiPromptPlaygroundShell from './pages/microapps/AiPromptPlaygroundShell';
import MicroAppShellPage from './pages/microapps/MicroAppShellPage';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <PortalLayout>
      <Outlet />
    </PortalLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PortalHomePage,
});

const directoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/directory',
  component: MicroAppDirectoryPage,
});

const organizationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/organizations',
  component: OrganizationManagementPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: AdminDashboardPage,
});

const vendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors',
  component: VendorManagementPage,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: PricingPlansPage,
});

const socialFeedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/social-feed',
  component: SocialFeedShell,
});

const messagingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/messaging',
  component: MessagingInboxShell,
});

const daoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/dao-proposals',
  component: DaoProposalsShell,
});

const forumRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/forum',
  component: ForumShell,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/marketplace',
  component: MarketplaceShell,
});

const aiPlaygroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/ai-playground',
  component: AiPromptPlaygroundShell,
});

const genericAppRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/$slug',
  component: MicroAppShellPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  directoryRoute,
  organizationsRoute,
  dashboardRoute,
  vendorsRoute,
  pricingRoute,
  socialFeedRoute,
  messagingRoute,
  daoRoute,
  forumRoute,
  marketplaceRoute,
  aiPlaygroundRoute,
  genericAppRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
