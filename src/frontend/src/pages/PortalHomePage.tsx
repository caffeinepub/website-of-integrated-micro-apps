import { Link } from '@tanstack/react-router';
import { useTranslation } from '../i18n';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';

export default function PortalHomePage() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.68_0.19_35)] to-[oklch(0.72_0.18_60)] text-white">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/portal-hero.dim_1600x600.png"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{t('home.hero.title')}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">{t('home.hero.subtitle')}</p>
            <Link to="/directory">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6">
                {t('home.hero.cta')}
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('home.features.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[oklch(0.68_0.19_35)] to-[oklch(0.72_0.18_60)] flex items-center justify-center">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('home.features.decentralized')}</h3>
              <p className="text-muted-foreground">{t('home.features.decentralized.desc')}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[oklch(0.7_0.2_340)] to-[oklch(0.72_0.18_60)] flex items-center justify-center">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('home.features.integrated')}</h3>
              <p className="text-muted-foreground">{t('home.features.integrated.desc')}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[oklch(0.65_0.15_160)] to-[oklch(0.7_0.18_140)] flex items-center justify-center">
                <Lock size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('home.features.secure')}</h3>
              <p className="text-muted-foreground">{t('home.features.secure.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our collection of integrated micro-apps and discover new ways to work, connect, and create.
          </p>
          <Link to="/directory">
            <Button size="lg" className="gap-2">
              Browse Directory
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
