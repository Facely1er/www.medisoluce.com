// Advanced internationalization utilities

export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  numberFormat: {
    decimal: string;
    thousands: string;
  };
}

// Supported locale configurations
export const supportedLocales: Record<string, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    rtl: false,
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'HH:mm',
    currency: 'USD',
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'CAD',
    numberFormat: {
      decimal: ',',
      thousands: ' '
    }
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'USD',
    numberFormat: {
      decimal: ',',
      thousands: '.'
    }
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    rtl: true,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'USD',
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  }
};

// Enhanced formatting utilities
export class LocaleFormatter {
  private locale: string;
  private config: LocaleConfig;

  constructor(locale: string) {
    this.locale = locale;
    this.config = supportedLocales[locale] || supportedLocales.en;
  }

  // Currency formatting with locale awareness
  formatCurrency(
    amount: number, 
    options: Intl.NumberFormatOptions = {}
  ): string {
    try {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: this.config.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options
      }).format(amount);
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.warn('Currency formatting failed:', error);
      }
      return `${this.config.currency} ${amount.toLocaleString()}`;
    }
  }

  // Number formatting with locale-specific separators
  formatNumber(
    number: number, 
    options: Intl.NumberFormatOptions = {}
  ): string {
    try {
      return new Intl.NumberFormat(this.locale, options).format(number);
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.warn('Number formatting failed:', error);
      }
      return number.toString();
    }
  }

  // Percentage formatting
  formatPercentage(
    value: number, 
    options: Intl.NumberFormatOptions = {}
  ): string {
    try {
      return new Intl.NumberFormat(this.locale, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
        ...options
      }).format(value / 100);
    } catch {
      return `${value}%`;
    }
  }

  // Date formatting with locale awareness
  formatDate(
    date: Date | string, 
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(this.locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
      }).format(dateObj);
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.warn('Date formatting failed:', error);
      }
      return date.toString();
    }
  }

  // Time formatting
  formatTime(
    date: Date | string, 
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(this.locale, {
        hour: '2-digit',
        minute: '2-digit',
        ...options
      }).format(dateObj);
    } catch {
      return date.toString();
    }
  }

  // Relative time formatting (e.g., "2 hours ago")
  formatRelativeTime(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      
      const days = Math.floor(diffInSeconds / 86400);
      if (days < 7) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
      
      return this.formatDate(dateObj, { month: 'short', day: 'numeric' });
    } catch {
      return date.toString();
    }
  }

  // File size formatting with locale-aware units
  formatFileSize(bytes: number): string {
    const sizes = this.locale === 'fr' ? ['octets', 'Ko', 'Mo', 'Go'] : ['bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return `0 ${sizes[0]}`;
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    
    return `${this.formatNumber(Math.round(size * 100) / 100)} ${sizes[i]}`;
  }

  // Healthcare-specific formatting
  formatMedicalId(id: string): string {
    // Format medical record numbers based on locale conventions
    if (this.locale === 'fr') {
      // French format: XXXX-XXXX-XXXX
      return id.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // US format: XXXX-XX-XXXX
    return id.replace(/(\d{4})(\d{2})(\d{4})/, '$1-$2-$3');
  }
}

// RTL layout utilities
export const rtlUtils = {
  // Check if locale requires RTL layout
  isRTL: (locale: string): boolean => {
    const rtlLocales = ['ar', 'he', 'fa', 'ur'];
    return rtlLocales.includes(locale);
  },

  // Get CSS direction value
  getDirection: (locale: string): 'ltr' | 'rtl' => {
    return rtlUtils.isRTL(locale) ? 'rtl' : 'ltr';
  },

  // Get text alignment class for locale
  getTextAlign: (locale: string, defaultAlign = 'left'): string => {
    if (rtlUtils.isRTL(locale)) {
      return defaultAlign === 'left' ? 'text-right' : 
             defaultAlign === 'right' ? 'text-left' : defaultAlign;
    }
    return `text-${defaultAlign}`;
  },

  // Get margin classes for RTL
  getMarginClass: (locale: string, side: 'left' | 'right', size: string): string => {
    if (rtlUtils.isRTL(locale)) {
      const oppositeSide = side === 'left' ? 'right' : 'left';
      return `m${oppositeSide[0]}-${size}`;
    }
    return `m${side[0]}-${size}`;
  },

  // Transform CSS for RTL
  transformStyles: (styles: Record<string, unknown>, isRTL: boolean): Record<string, unknown> => {
    if (!isRTL) return styles;

    const transformed = { ...styles };
    
    // Transform margin and padding
    if (styles.marginLeft !== undefined) {
      transformed.marginRight = styles.marginLeft;
      delete transformed.marginLeft;
    }
    if (styles.marginRight !== undefined) {
      transformed.marginLeft = styles.marginRight;
      delete transformed.marginRight;
    }
    
    // Transform positioning
    if (styles.left !== undefined) {
      transformed.right = styles.left;
      delete transformed.left;
    }
    if (styles.right !== undefined) {
      transformed.left = styles.right;
      delete transformed.right;
    }

    return transformed;
  }
};

// Translation validation utilities
export const translationUtils = {
  // Validate translation completeness
  validateTranslations: (translations: Record<string, unknown>, baseTranslations: Record<string, unknown>): {
    missing: string[];
    extra: string[];
    coverage: number;
  } => {
    const flatten = (obj: unknown, prefix = ''): string[] => {
      const keys: string[] = [];
      for (const key in obj) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          keys.push(...flatten(obj[key], newKey));
        } else {
          keys.push(newKey);
        }
      }
      return keys;
    };

    const baseKeys = flatten(baseTranslations);
    const translationKeys = flatten(translations);
    
    const missing = baseKeys.filter(key => !translationKeys.includes(key));
    const extra = translationKeys.filter(key => !baseKeys.includes(key));
    const coverage = ((baseKeys.length - missing.length) / baseKeys.length) * 100;

    return { missing, extra, coverage };
  },

  // Extract translation keys from code
  extractKeysFromText: (text: string): string[] => {
    const keyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
    const keys: string[] = [];
    let match;
    
    while ((match = keyRegex.exec(text)) !== null) {
      keys.push(match[1]);
    }
    
    return [...new Set(keys)];
  },

  // Generate translation report
  generateReport: (locales: Record<string, unknown>): {
    totalKeys: number;
    byLocale: Record<string, { keys: number; coverage: number; missing: string[] }>;
    recommendations: string[];
  } => {
    const baseLocale = locales.en || Object.values(locales)[0];
    const report = {
      totalKeys: 0,
      byLocale: {} as Record<string, { keys: number; coverage: number; missing: string[] }>,
      recommendations: [] as string[]
    };

    if (baseLocale) {
      report.totalKeys = translationUtils.extractKeysFromText(JSON.stringify(baseLocale)).length;
    }

    Object.entries(locales).forEach(([locale, translations]) => {
      const validation = translationUtils.validateTranslations(translations, baseLocale);
      report.byLocale[locale] = {
        keys: translationUtils.extractKeysFromText(JSON.stringify(translations)).length,
        coverage: validation.coverage,
        missing: validation.missing
      };

      // Generate recommendations
      if (validation.coverage < 95) {
        report.recommendations.push(`${locale}: Complete missing translations (${validation.missing.length} keys)`);
      }
      if (validation.extra.length > 0) {
        report.recommendations.push(`${locale}: Remove unused translation keys (${validation.extra.length} keys)`);
      }
    });

    return report;
  }
};

// Export formatting instance for global use
export const createFormatter = (locale: string) => new LocaleFormatter(locale);

// React hook for locale-aware formatting
export const useLocaleFormatter = (locale?: string) => {
  const currentLocale = locale || document.documentElement.lang || 'en';
  return new LocaleFormatter(currentLocale);
};