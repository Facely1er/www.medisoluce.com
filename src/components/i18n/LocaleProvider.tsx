import React, { createContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { rtlUtils, supportedLocales, LocaleConfig } from '../../utils/i18nUtils';

interface LocaleContextType {
  locale: string;
  config: LocaleConfig;
  isRTL: boolean;
  setLocale: (locale: string) => void;
}

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);
export type { LocaleContextType };

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const config = supportedLocales[locale] || supportedLocales.en;
  const isRTL = rtlUtils.isRTL(locale);

  useEffect(() => {
    // Update document attributes for locale
    document.documentElement.lang = locale;
    document.documentElement.dir = rtlUtils.getDirection(locale);
    
    // Add locale-specific body classes
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(isRTL ? 'rtl' : 'ltr');
    
    // Update meta tags
    const existingMeta = document.querySelector('meta[name="language"]');
    if (existingMeta) {
      existingMeta.setAttribute('content', locale);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'language';
      meta.content = locale;
      document.head.appendChild(meta);
    }
  }, [locale, isRTL]);

  const setLocale = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, config, isRTL, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

// Hook moved to src/hooks/useLocale.ts to fix fast refresh warning