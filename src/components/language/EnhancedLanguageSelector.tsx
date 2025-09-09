import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../i18n/LocaleProvider';
import { supportedLocales } from '../../utils/i18nUtils';
import Button from '../ui/Button';

interface EnhancedLanguageSelectorProps {
  variant?: 'dropdown' | 'toggle' | 'inline';
  showFlags?: boolean;
  showNativeNames?: boolean;
  className?: string;
}

const EnhancedLanguageSelector: React.FC<EnhancedLanguageSelectorProps> = ({
  variant = 'dropdown',
  showFlags = true,
  showNativeNames = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const flagEmojis: Record<string, string> = {
    en: '🇺🇸',
    fr: '🇫🇷',
    es: '🇪🇸',
    ar: '🇸🇦'
  };

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
    setIsOpen(false);
    
    // Track language change
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as { gtag: (command: string, action: string, params: Record<string, string>) => void }).gtag('event', 'language_change', {
        event_category: 'User Preference',
        event_label: newLocale
      });
    }
  };

  const currentConfig = supportedLocales[locale];

  if (variant === 'toggle' && Object.keys(supportedLocales).length === 2) {
    const availableLocales = Object.keys(supportedLocales);
    const otherLocale = availableLocales.find(l => l !== locale) || 'en';
    
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLanguageChange(otherLocale)}
        className={className}
        aria-label={t('language.switch_to', { language: supportedLocales[otherLocale].name })}
      >
        {showFlags && flagEmojis[otherLocale]}
        <span className="ml-1">
          {showNativeNames ? supportedLocales[otherLocale].nativeName : supportedLocales[otherLocale].name}
        </span>
      </Button>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Globe className="h-4 w-4 text-gray-500" />
        <div className="flex space-x-1">
          {Object.entries(supportedLocales).map(([code, config]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`px-2 py-1 text-sm rounded transition ${
                locale === code
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={t('language.select', { language: config.name })}
            >
              {showFlags && flagEmojis[code]} {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label={t('language.current', { language: currentConfig.name })}
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4" />
        {showFlags && <span>{flagEmojis[locale]}</span>}
        <span className="hidden sm:inline">
          {showNativeNames ? currentConfig.nativeName : currentConfig.name}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              <div className="py-2">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('language.select_language')}
                  </p>
                </div>
                {Object.entries(supportedLocales).map(([code, config]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                      locale === code
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    aria-label={t('language.switch_to', { language: config.name })}
                  >
                    <div className="flex items-center space-x-3">
                      {showFlags && <span className="text-lg">{flagEmojis[code]}</span>}
                      <div className="text-left">
                        <div className="font-medium">{config.name}</div>
                        {showNativeNames && config.nativeName !== config.name && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {config.nativeName}
                          </div>
                        )}
                      </div>
                    </div>
                    {locale === code && (
                      <Check className="h-4 w-4 text-primary-500" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Language detection info */}
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('language.auto_detected')}: {navigator.language}
                </p>
              </div>
            </motion.div>
            
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedLanguageSelector;