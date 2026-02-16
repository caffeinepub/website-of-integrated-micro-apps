import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import LoginButton from './LoginButton';
import ProfileSetupModal from './ProfileSetupModal';
import OrgSwitcher from './OrgSwitcher';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../i18n';
import { Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.68_0.19_35)] to-[oklch(0.72_0.18_60)] flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <span className="font-bold text-xl hidden sm:inline">Arkly</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                <Link to="/directory">
                  <Button variant="ghost" size="sm">
                    {t('nav.directory')}
                  </Button>
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/organizations">
                      <Button variant="ghost" size="sm">
                        {t('nav.organizations')}
                      </Button>
                    </Link>
                    <Link to="/pricing">
                      <Button variant="ghost" size="sm">
                        {t('nav.pricing')}
                      </Button>
                    </Link>
                    {isAdmin && (
                      <>
                        <Link to="/dashboard">
                          <Button variant="ghost" size="sm">
                            {t('nav.dashboard')}
                          </Button>
                        </Link>
                        <Link to="/vendors">
                          <Button variant="ghost" size="sm">
                            {t('nav.vendors')}
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && <OrgSwitcher />}
              <LanguageSelector />
              <LoginButton />
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <Link to="/directory" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    {t('nav.directory')}
                  </Button>
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/organizations" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        {t('nav.organizations')}
                      </Button>
                    </Link>
                    <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        {t('nav.pricing')}
                      </Button>
                    </Link>
                    {isAdmin && (
                      <>
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            {t('nav.dashboard')}
                          </Button>
                        </Link>
                        <Link to="/vendors" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            {t('nav.vendors')}
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-muted/30 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              {t('footer.built')} <Heart size={14} className="text-[oklch(0.7_0.2_340)] fill-current" />{' '}
              {t('footer.using')}{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-xs">© {new Date().getFullYear()} Arkly Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
