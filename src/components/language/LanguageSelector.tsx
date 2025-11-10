import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-1 cursor-pointer group">
        <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        
        <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
          <div className="py-1">
            <button
              onClick={() => changeLanguage('en')}
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === 'en'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t('language.en')}
            </button>
            <button
              onClick={() => changeLanguage('fr')}
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === 'fr'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t('language.fr')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;