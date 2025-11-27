/**
 * Trial Status Banner Component
 * Displays trial status, days remaining, and call-to-action
 */

import React from 'react';
import { AlertTriangle, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { trialService, type TrialStatus } from '../../services/trialService';

interface TrialBannerProps {
  trial: TrialStatus;
  onDismiss?: () => void;
}

const TrialBanner: React.FC<TrialBannerProps> = ({ trial, onDismiss }) => {
  const { t } = useTranslation();
  
  const getStatusColor = () => {
    if (trial.daysRemaining <= 1) return 'accent';
    if (trial.daysRemaining <= 3) return 'warning';
    return 'primary';
  };

  const getStatusMessage = () => {
    if (trial.daysRemaining <= 0) {
      return t('trial.banner.expired');
    }
    if (trial.daysRemaining === 1) {
      return t('trial.banner.expires_tomorrow');
    }
    if (trial.daysRemaining <= 3) {
      return t('trial.banner.expires_in_days', { days: trial.daysRemaining });
    }
    return t('trial.banner.days_remaining', { days: trial.daysRemaining });
  };

  const getActionButton = () => {
    if (trial.daysRemaining <= 0) {
      return (
        <Button as={Link} to={`/pricing/${trial.productId}`}>
          {t('trial.banner.upgrade_now')}
        </Button>
      );
    }

    if (!trial.paymentMethodOnFile && trial.paymentMethodRequired) {
      return (
        <Button as={Link} to={`/pricing/${trial.productId}?add-payment=true`}>
          {t('trial.banner.add_payment_method')}
        </Button>
      );
    }

    return (
      <Button variant="outline" as={Link} to={`/pricing/${trial.productId}`}>
        {t('trial.banner.view_plans')}
      </Button>
    );
  };

  return (
    <div className={`border-l-4 ${
      trial.daysRemaining <= 1 
        ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20' 
        : trial.daysRemaining <= 3
        ? 'border-warning-500 bg-warning-50 dark:bg-warning-900/20'
        : 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
    } p-4 rounded-lg mb-6`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {trial.daysRemaining <= 1 ? (
            <AlertTriangle className={`h-5 w-5 mt-0.5 ${
              trial.daysRemaining <= 0 
                ? 'text-accent-500' 
                : 'text-warning-500'
            }`} />
          ) : trial.paymentMethodRequired && !trial.paymentMethodOnFile ? (
            <CreditCard className="h-5 w-5 mt-0.5 text-primary-500" />
          ) : (
            <Clock className="h-5 w-5 mt-0.5 text-primary-500" />
          )}
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {trial.productName} - {t('trial.banner.tier_trial', { tier: trial.tier.charAt(0).toUpperCase() + trial.tier.slice(1) })}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {getStatusMessage()}
            </p>
            
            {trial.paymentMethodRequired && !trial.paymentMethodOnFile && trial.daysRemaining > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                {t('trial.banner.add_payment_description')}
              </p>
            )}

            {trial.daysRemaining > 0 && (
              <div className="flex items-center space-x-4">
                {getActionButton()}
                {trial.paymentMethodOnFile && (
                  <div className="flex items-center space-x-1 text-success-600 dark:text-success-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{t('trial.banner.payment_method_on_file')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {onDismiss && trial.daysRemaining > 3 && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default TrialBanner;

