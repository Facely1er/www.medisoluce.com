/**
 * Trial Activation Modal
 * Collects user information for tailored trial setup
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Shield, Server, FileText, Users } from 'lucide-react';
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

const ROLE_OPTIONS = [
  { value: 'compliance-officer', label: 'Compliance Officer', icon: Shield },
  { value: 'it-director', label: 'IT Director / CISO', icon: Server },
  { value: 'operations-manager', label: 'Operations Manager', icon: FileText },
  { value: 'practice-manager', label: 'Practice Manager', icon: Users },
  { value: 'executive', label: 'C-Level Executive', icon: Briefcase },
  { value: 'other', label: 'Other', icon: Users }
];

const USE_CASE_OPTIONS = [
  { value: 'audit-readiness', label: 'Prepare for Compliance Audit' },
  { value: 'ransomware-protection', label: 'Ransomware Protection & Response' },
  { value: 'hipaa-compliance', label: 'HIPAA Compliance Management' },
  { value: 'business-continuity', label: 'Business Continuity Planning' },
  { value: 'security-assessment', label: 'Security Assessment' },
  { value: 'general-exploration', label: 'General Platform Exploration' }
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
  const { startTrial, isEligible } = useTrial(userId);
  const { showToast } = useToast();
  const [step, setStep] = useState<'role' | 'use-case' | 'preferences'>('role');
  const [role, setRole] = useState<string>('');
  const [useCase, setUseCase] = useState<string>('');
  const [organizationType, setOrganizationType] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleStartTrial = async () => {
    if (!role || !useCase) {
      showToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please complete all fields to start your tailored trial.'
      });
      return;
    }

    // Check eligibility
    if (!isEligible(productId)) {
      showToast({
        type: 'error',
        title: 'Trial Not Available',
        message: 'You have already used your free trial for this product.'
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
        title: 'Trial Started!',
        message: `Your ${productName} trial has begun. Enjoy full access for ${tier === 'essential' ? '14' : '30'} days.`
      });

      onTrialStarted?.(`${userId}-${productId}`);
      onClose();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to Start Trial',
        message: error instanceof Error ? error.message : 'Please try again.'
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
            Start Your Free Trial
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Help us personalize your experience by answering a few quick questions.
          </p>

          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What's your primary role?
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
                What's your primary use case?
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
                Back
              </Button>
            </div>
          )}

          {/* Step 3: Additional Preferences */}
          {step === 'preferences' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Organization Type (Optional)
              </h3>
              <select
                value={organizationType}
                onChange={(e) => setOrganizationType(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select organization type...</option>
                <option value="hospital">Hospital</option>
                <option value="clinic">Clinic</option>
                <option value="practice">Private Practice</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="lab">Laboratory</option>
                <option value="payer">Insurance/Payer</option>
                <option value="vendor">Healthcare Vendor</option>
                <option value="other">Other</option>
              </select>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('use-case')}
                >
                  Back
                </Button>
                <Button
                  onClick={handleStartTrial}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Starting Trial...' : 'Start Free Trial'}
                </Button>
              </div>
            </div>
          )}

          {/* Trial Terms */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Free Trial Terms:</strong> {tier === 'essential' ? '14' : '30'} days of full access. 
              {tier !== 'essential' && ' Payment method required. '}
              Automatically converts to paid subscription unless cancelled. 
              One trial per user per product.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TrialActivationModal;

