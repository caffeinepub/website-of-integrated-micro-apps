import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '../i18n';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button onClick={handleAuth} disabled={disabled} size="sm" variant={isAuthenticated ? 'outline' : 'default'}>
      {loginStatus === 'logging-in' ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          {t('common.loading')}
        </span>
      ) : isAuthenticated ? (
        <span className="flex items-center gap-2">
          <LogOut size={16} />
          {t('nav.logout')}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <LogIn size={16} />
          {t('nav.login')}
        </span>
      )}
    </Button>
  );
}
