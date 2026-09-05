import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import {
  getAnalyticsConsent,
  isAnalyticsFeatureEnabled,
  onAnalyticsConsentChange,
  setAnalyticsConsent,
  type ConsentState,
} from '../../utils/consent';

/**
 * Opt-in banner for third-party analytics. Rendered only when the deployment
 * has analytics enabled and the visitor has not yet decided. Nothing loads
 * until they accept (see utils/analytics.ts).
 */
const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [consent, setConsent] = useState<ConsentState>(() => getAnalyticsConsent());

  useEffect(() => onAnalyticsConsentChange(setConsent), []);

  if (!isAnalyticsFeatureEnabled || consent !== 'unknown') {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('consent.aria_label')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg dark:border-gray-700 dark:bg-gray-900/95"
    >
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('consent.title')}</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {t('consent.message')}{' '}
            <Link to="/cookie-policy" className="underline text-primary-600 hover:text-primary-700 dark:text-primary-400">
              {t('consent.learn_more')}
            </Link>
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-3">
          <Button variant="outline" size="sm" onClick={() => setAnalyticsConsent('denied')}>
            {t('consent.decline')}
          </Button>
          <Button variant="primary" size="sm" onClick={() => setAnalyticsConsent('granted')}>
            {t('consent.accept')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
