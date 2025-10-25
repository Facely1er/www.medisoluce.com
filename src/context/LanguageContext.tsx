import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../utils/analytics';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export type { LanguageContextType };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language, i18n]);

  const changeLanguage = (lang: Language) => {
    analytics.trackLanguageChange(lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook moved to src/hooks/useLanguage.ts to fix fast refresh warning