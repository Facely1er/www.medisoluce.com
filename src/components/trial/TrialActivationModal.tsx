/**
 * Trial Activation Modal
 * Collects user information for tailored trial setup
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Shield, Server, FileText, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTrial } from '../../hooks/useTrial';
import { useToast } from '../ui/Toast';

interface TrialActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  tier: 'essential' | 'professional' | 'enterprise';
  userId: string;
  userEmail: string;
  onTrialStarted?: (trialId: string) => void;
}

// Role and use case options will be generated from translations
const getRoleOptions = (t: (key: string) => string) => [
  { value: 'compliance-officer', label: t('trial.modal.roles.compliance_officer'), icon: Shield },
  { value: 'it-director', label: t('trial.modal.roles.it_director'), icon: Server },
  { value: 'operations-manager', label: t('trial.modal.roles.operations_manager'), icon: FileText },
  { value: 'practice-manager', label: t('trial.modal.roles.practice_manager'), icon: Users },
  { value: 'executive', label: t('trial.modal.roles.executive'), icon: Briefcase },
  { value: 'other', label: t('trial.modal.roles.other'), icon: Users }
];

const getUseCaseOptions = (t: (key: string) => string) => [
  { value: 'audit-readiness', label: t('trial.modal.use_cases.audit_readiness') },
  { value: 'ransomware-protection', label: t('trial.modal.use_cases.ransomware_protection') },
  { value: 'hipaa-compliance', label: t('trial.modal.use_cases.hipaa_compliance') },
  { value: 'business-continuity', label: t('trial.modal.use_cases.business_continuity') },
  { value: 'security-assessment', label: t('trial.modal.use_cases.security_assessment') },
  { value: 'general-exploration', label: t('trial.modal.use_cases.general_exploration') }
];

const TrialActivationModal: React.FC<TrialActivationModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  tier,
  userId,
  userEmail,
  onTrialStarted
}) => {
  const { t } = useTranslation();
  const { startTrial, isEligible } = useTrial(userId);
  const { showToast } = useToast();
  const [step, setStep] = useState<'role' | 'use-case' | 'preferences'>('role');
  const [role, setRole] = useState<string>('');
  const [useCase, setUseCase] = useState<string>('');
  const [organizationType, setOrganizationType] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const ROLE_OPTIONS = getRoleOptions(t);
  const USE_CASE_OPTIONS = getUseCaseOptions(t);

  const handleStartTrial = async () => {
    if (!role || !useCase) {
      showToast({
        type: 'error',
        title: t('trial.modal.missing_information'),
        message: t('trial.modal.missing_information_message')
      });
      return;
    }

    // Check eligibility
    if (!isEligible(productId)) {
      showToast({
        type: 'error',
        title: t('trial.modal.trial_not_available'),
        message: t('trial.modal.trial_not_available_message')
      });
      return;
    }

    setLoading(true);

    try {
      const trial = await startTrial({
        email: userEmail,
        productId,
        productName,
        tier,
        tailoredData: {
          role,
          useCase,
          organizationType: organizationType || undefined,
          preferences: {}
        }
      });

      showToast({
        type: 'success',
        title: t('trial.modal.trial_started'),
        message: tier === 'essential' 
          ? t('trial.modal.trial_started_message_essential', { productName })
          : t('trial.modal.trial_started_message', { productName })
      });

      onTrialStarted?.(`${userId}-${productId}`);
      onClose();
    } catch (error) {
      showToast({
        type: 'error',
        title: t('trial.modal.failed_to_start'),
        message: error instanceof Error ? error.message : t('ui.errors.retry')
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('trial.modal.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('trial.modal.subtitle')}
          </p>

          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('trial.modal.step_role')}
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {ROLE_OPTIONS.map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setRole(option.value);
                        setStep('use-case');
                      }}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        role === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <Icon className="h-6 w-6 mb-2 text-primary-500" />
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Use Case Selection */}
          {step === 'use-case' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('trial.modal.step_use_case')}
              </h3>
              <div className="space-y-2 mb-6">
                {USE_CASE_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setUseCase(option.value);
                      setStep('preferences');
                    }}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                      useCase === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setStep('role')}
              >
                {t('trial.modal.back')}
              </Button>
            </div>
          )}

          {/* Step 3: Additional Preferences */}
          {step === 'preferences' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('trial.modal.step_organization')}
              </h3>
              <select
                value={organizationType}
                onChange={(e) => setOrganizationType(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">{t('trial.modal.select_organization')}</option>
                <option value="hospital">{t('trial.modal.organization_types.hospital')}</option>
                <option value="clinic">{t('trial.modal.organization_types.clinic')}</option>
                <option value="practice">{t('trial.modal.organization_types.practice')}</option>
                <option value="pharmacy">{t('trial.modal.organization_types.pharmacy')}</option>
                <option value="lab">{t('trial.modal.organization_types.lab')}</option>
                <option value="payer">{t('trial.modal.organization_types.payer')}</option>
                <option value="vendor">{t('trial.modal.organization_types.vendor')}</option>
                <option value="other">{t('trial.modal.organization_types.other')}</option>
              </select>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('use-case')}
                >
                  {t('trial.modal.back')}
                </Button>
                <Button
                  onClick={handleStartTrial}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? t('trial.modal.starting_trial') : t('trial.modal.start_trial')}
                </Button>
              </div>
            </div>
          )}

          {/* Trial Terms */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>{t('trial.modal.terms_title')}</strong> {tier === 'essential' 
                ? t('trial.modal.terms_essential')
                : t('trial.modal.terms_professional')}
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TrialActivationModal;

