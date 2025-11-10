import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en';
import frTranslation from './locales/fr';

// Enhanced i18n configuration with automatic language detection
const initPromise = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Namespace support for better organization
    ns: ['translation'],
    defaultNS: 'translation',
    
    resources: {
      en: {
        translation: enTranslation
      },
      fr: {
        translation: frTranslation
      }
    },
    
    // Enhanced fallback handling
    fallbackLng: {
      'en-US': ['en'],
      'fr-CA': ['fr', 'en'],
      'fr-FR': ['fr', 'en'],
      'default': ['en']
    },
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
      excludeCacheFor: ['cimode']
    },
    
    // Interpolation with enhanced formatting
    interpolation: {
      escapeValue: false, // React already safes from XSS
      formatSeparator: ',',
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'currency') return formatCurrency(value, lng);
        if (format === 'number') return formatNumber(value, lng);
        if (format === 'date') return formatDate(value, lng);
        if (format === 'dateTime') return formatDateTime(value, lng);
        return value;
      }
    },
    
    // Debug mode for development
    debug: !import.meta.env.PROD,
    
    // React options
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em']
    }
  });

// Enhanced formatting utilities
const formatCurrency = (value: number, locale: string): string => {
  try {
    const currencyMap: Record<string, string> = {
      'en': 'USD',
      'fr': 'CAD',
      'es': 'USD'
    };
    const currency = currencyMap[locale] || 'USD';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `$${value.toLocaleString()}`;
  }
};

const formatNumber = (value: number, locale: string): string => {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return value.toLocaleString();
  }
};

const formatDate = (value: Date | string, locale: string): string => {
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return value.toString();
  }
};

const formatDateTime = (value: Date | string, locale: string): string => {
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return value.toString();
  }
};

// Export the initialization promise for waiting
export { initPromise };

export default i18n;