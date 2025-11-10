/**
 * Vanilla JavaScript i18n Translation System
 * A lightweight solution for handling translation issues
 */

class SimpleI18n {
  constructor(options = {}) {
    this.currentLocale = options.locale || 'en';
    this.fallbackLocale = options.fallback || 'en';
    this.translations = {};
    this.debug = options.debug || false;
    this.cache = new Map();
    
    // Initialize with options
    if (options.translations) {
      this.addTranslations(options.translations);
    }
  }

  /**
   * Add translations for multiple locales
   */
  addTranslations(translations) {
    Object.keys(translations).forEach(locale => {
      this.translations[locale] = {
        ...this.translations[locale],
        ...translations[locale]
      };
    });
    this.clearCache();
  }

  /**
   * Load translations from JSON files
   */
  async loadTranslations(locale, url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.status}`);
      }
      const data = await response.json();
      this.translations[locale] = { ...this.translations[locale], ...data };
      this.clearCache();
      this.log(`Loaded translations for ${locale}`);
    } catch (error) {
      this.log(`Error loading translations for ${locale}:`, error);
    }
  }

  /**
   * Get nested object value using dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Replace variables in translation string
   */
  interpolate(text, variables = {}) {
    if (!text || typeof text !== 'string') return text;
    
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? variables[key] : match;
    });
  }

  /**
   * Handle pluralization
   */
  pluralize(text, count) {
    if (typeof text === 'object' && text.plural !== undefined) {
      if (count === 0 && text.zero !== undefined) return text.zero;
      if (count === 1 && text.one !== undefined) return text.one;
      return text.plural || text.other || String(text);
    }
    return text;
  }

  /**
   * Main translation function
   */
  t(key, options = {}) {
    const cacheKey = `${this.currentLocale}:${key}:${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let translation = this.getTranslation(key);
    
    // Handle pluralization
    if (options.count !== undefined) {
      translation = this.pluralize(translation, options.count);
    }
    
    // Handle variable interpolation
    if (typeof translation === 'string') {
      translation = this.interpolate(translation, options);
    }

    // Cache the result
    this.cache.set(cacheKey, translation);
    
    return translation;
  }

  /**
   * Get translation with fallback logic
   */
  getTranslation(key) {
    // Try current locale
    let translation = this.getNestedValue(this.translations[this.currentLocale], key);
    
    // Try fallback locale if translation not found
    if (translation === null && this.currentLocale !== this.fallbackLocale) {
      translation = this.getNestedValue(this.translations[this.fallbackLocale], key);
      this.log(`Using fallback translation for key: ${key}`);
    }
    
    // Return key if no translation found
    if (translation === null) {
      this.log(`Missing translation for key: ${key}`);
      return key;
    }
    
    return translation;
  }

  /**
   * Change current locale
   */
  setLocale(locale) {
    if (this.currentLocale !== locale) {
      this.currentLocale = locale;
      this.clearCache();
      this.log(`Locale changed to: ${locale}`);
      
      // Trigger custom event for locale change
      this.triggerLocaleChange(locale);
    }
  }

  /**
   * Get current locale
   */
  getLocale() {
    return this.currentLocale;
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Debug logging
   */
  log(...args) {
    if (this.debug) {
      console.log('[i18n]', ...args);
    }
  }

  /**
   * Trigger locale change event
   */
  triggerLocaleChange(locale) {
    const event = new CustomEvent('localeChange', { 
      detail: { locale, i18n: this } 
    });
    document.dispatchEvent(event);
  }

  /**
   * Auto-translate elements with data-i18n attribute
   */
  translateElements(container = document) {
    const elements = container.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const options = this.parseElementOptions(element);
      
      const translation = this.t(key, options);
      
      // Check if we should update text content or innerHTML
      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
      
      // Handle placeholder attribute
      if (element.hasAttribute('data-i18n-placeholder')) {
        const placeholderKey = element.getAttribute('data-i18n-placeholder');
        element.placeholder = this.t(placeholderKey);
      }
      
      // Handle title attribute
      if (element.hasAttribute('data-i18n-title')) {
        const titleKey = element.getAttribute('data-i18n-title');
        element.title = this.t(titleKey);
      }
    });
  }

  /**
   * Parse options from element attributes
   */
  parseElementOptions(element) {
    const options = {};
    
    // Get count from data-i18n-count attribute
    const count = element.getAttribute('data-i18n-count');
    if (count !== null) {
      options.count = parseInt(count, 10);
    }
    
    // Get variables from data-i18n-vars attribute (JSON)
    const vars = element.getAttribute('data-i18n-vars');
    if (vars) {
      try {
        Object.assign(options, JSON.parse(vars));
      } catch (e) {
        this.log('Error parsing i18n variables:', e);
      }
    }
    
    return options;
  }

  /**
   * Format number according to locale
   */
  formatNumber(number, options = {}) {
    try {
      return new Intl.NumberFormat(this.currentLocale, options).format(number);
    } catch (e) {
      return number.toString();
    }
  }

  /**
   * Format date according to locale
   */
  formatDate(date, options = {}) {
    try {
      return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
    } catch (e) {
      return date.toString();
    }
  }
}

// Global instance and helper functions
window.i18n = null;

/**
 * Initialize i18n system
 */
function initI18n(options = {}) {
  window.i18n = new SimpleI18n(options);
  
  // Auto-translate on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.i18n.translateElements();
    });
  } else {
    window.i18n.translateElements();
  }
  
  return window.i18n;
}

/**
 * Helper function for translation
 */
function t(key, options) {
  return window.i18n ? window.i18n.t(key, options) : key;
}

/**
 * Helper function to change locale
 */
function setLocale(locale) {
  if (window.i18n) {
    window.i18n.setLocale(locale);
    window.i18n.translateElements();
  }
}

// Auto-detect language preference
function detectLanguage() {
  const stored = localStorage.getItem('preferred-language');
  if (stored) return stored;
  
  const browser = navigator.language || navigator.userLanguage;
  return browser.split('-')[0]; // Get language code only
}

// Example usage and initialization
document.addEventListener('DOMContentLoaded', () => {
  // Example translations
  const translations = {
    en: {
      greeting: 'Hello, {{name}}!',
      items: {
        zero: 'No items',
        one: '{{count}} item',
        plural: '{{count}} items'
      },
      navigation: {
        home: 'Home',
        about: 'About',
        contact: 'Contact'
      }
    },
    es: {
      greeting: '¡Hola, {{name}}!',
      items: {
        zero: 'Sin elementos',
        one: '{{count}} elemento',
        plural: '{{count}} elementos'
      },
      navigation: {
        home: 'Inicio',
        about: 'Acerca de',
        contact: 'Contacto'
      }
    },
    fr: {
      greeting: 'Bonjour, {{name}}!',
      items: {
        zero: 'Aucun élément',
        one: '{{count}} élément',
        plural: '{{count}} éléments'
      },
      navigation: {
        home: 'Accueil',
        about: 'À propos',
        contact: 'Contact'
      }
    }
  };

  // Initialize i18n
  initI18n({
    locale: detectLanguage(),
    fallback: 'en',
    debug: true,
    translations: translations
  });

  // Listen for locale changes
  document.addEventListener('localeChange', (event) => {
    console.log('Locale changed to:', event.detail.locale);
    // Save preference
    localStorage.setItem('preferred-language', event.detail.locale);
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SimpleI18n, initI18n, t, setLocale };
}