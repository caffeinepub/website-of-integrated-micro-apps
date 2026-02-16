import { enTranslations } from './locales/en';
import { esTranslations } from './locales/es';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'en' | 'es';

export type TranslationKey = keyof typeof enTranslations;

const translations: Record<Locale, Record<string, string>> = {
  en: enTranslations,
  es: esTranslations,
};

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'arkly-locale',
    }
  )
);

export function t(key: TranslationKey): string {
  const locale = useI18n.getState().locale;
  return translations[locale][key] || translations.en[key] || key;
}

export function useTranslation() {
  const { locale, setLocale } = useI18n();

  const translate = (key: TranslationKey): string => {
    return translations[locale][key] || translations.en[key] || key;
  };

  return { t: translate, locale, setLocale };
}
