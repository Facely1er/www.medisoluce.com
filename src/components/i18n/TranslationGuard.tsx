import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface TranslationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showMissingKeys?: boolean;
}

const TranslationGuard: React.FC<TranslationGuardProps> = ({ 
  children, 
  fallback,
  showMissingKeys = false 
}) => {
  const { t, i18n } = useTranslation();
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [hasTranslationError, setHasTranslationError] = useState(false);

  useEffect(() => {
    // Monitor for missing translations in development
    if (import.meta.env.DEV) {
      const originalMissingKeyHandler = i18n.services.interpolator.missingKeyHandler;
      
      i18n.services.interpolator.missingKeyHandler = (lng: string[], ns: string, key: string) => {
        const missingKey = `${ns}:${key}`;
        setMissingKeys(prev => [...new Set([...prev, missingKey])]);
        
        if (originalMissingKeyHandler) {
          return originalMissingKeyHandler(lng, ns, key);
        }
        return key;
      };
    }

    // Error boundary for translation failures
    const handleTranslationError = (error: ErrorEvent) => {
      if (error.message.includes('i18n') || error.message.includes('translation')) {
        setHasTranslationError(true);
      }
    };

    window.addEventListener('error', handleTranslationError);
    
    return () => {
      window.removeEventListener('error', handleTranslationError);
    };
  }, [i18n]);

  const retryTranslations = () => {
    setHasTranslationError(false);
    setMissingKeys([]);
    i18n.reloadResources();
  };

  // Show error state if translations failed to load
  if (hasTranslationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="p-8 max-w-md text-center">
          <AlertTriangle className="h-16 w-16 text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Translation Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            There was an error loading translations. Please try refreshing the page.
          </p>
          <Button onClick={retryTranslations} icon={<RefreshCw className="h-4 w-4" />}>
            Retry Loading
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children}
      
      {/* Development mode: Show missing translation keys */}
      {import.meta.env.DEV && showMissingKeys && missingKeys.length > 0 && (
        <div className="fixed bottom-4 left-4 max-w-sm z-50">
          <Card className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-warning-800 dark:text-warning-200 mb-2">
                  Missing Translations ({missingKeys.length})
                </h4>
                <div className="max-h-32 overflow-y-auto">
                  <ul className="text-xs text-warning-700 dark:text-warning-300 space-y-1">
                    {missingKeys.slice(0, 10).map((key) => (
                      <li key={key} className="font-mono">
                        {key}
                      </li>
                    ))}
                    {missingKeys.length > 10 && (
                      <li className="text-warning-600 dark:text-warning-400">
                        +{missingKeys.length - 10} more...
                      </li>
                    )}
                  </ul>
                </div>
                <button
                  onClick={() => setMissingKeys([])}
                  className="mt-2 text-xs text-warning-600 dark:text-warning-400 hover:text-warning-700 dark:hover:text-warning-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default TranslationGuard;