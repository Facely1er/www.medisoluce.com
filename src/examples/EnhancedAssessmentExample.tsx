import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  Modal,
  FormField,
  ErrorBoundary,
  LoadingState,
  LoadingSpinner,
  ToastProvider,
  useToast
} from '../components/ui';
import { AccessibilityTestWrapper } from '../../utils/accessibilityTester';
import { useTranslation } from 'react-i18next';

// Example: Enhanced Assessment Form with all new components
const EnhancedAssessmentForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    phone: '',
    assessmentType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.assessmentType) {
      newErrors.assessmentType = 'Please select an assessment type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please correct the errors below and try again.'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast({
        type: 'success',
        title: 'Assessment Started',
        message: 'Your HIPAA compliance assessment has been initiated successfully.'
      });
      
      setIsModalOpen(false);
      
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to start assessment. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AccessibilityTestWrapper autoTest={!import.meta.env.PROD}>
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                {t('assessment.title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('assessment.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card hover className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    HIPAA Compliance
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Comprehensive assessment of your HIPAA compliance status
                  </p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full"
                  >
                    Start Assessment
                  </Button>
                </div>
              </Card>

              <Card hover className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Security Audit
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Evaluate your cybersecurity posture and vulnerabilities
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      showToast({
                        type: 'info',
                        title: 'Coming Soon',
                        message: 'Security audit feature will be available soon.'
                      });
                    }}
                  >
                    Coming Soon
                  </Button>
                </div>
              </Card>
            </div>

            {/* Assessment Modal */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Start HIPAA Assessment"
              size="lg"
              closeOnOverlayClick={false}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Organization Name"
                  required
                  error={errors.organizationName}
                  description="Enter your healthcare organization's legal name"
                  success={!errors.organizationName && formData.organizationName}
                >
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter organization name"
                    aria-describedby="org-name-description"
                  />
                </FormField>

                <FormField
                  label="Email Address"
                  required
                  error={errors.email}
                  description="We'll send your assessment results to this email"
                  success={!errors.email && formData.email}
                >
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter email address"
                    aria-describedby="email-description"
                  />
                </FormField>

                <FormField
                  label="Phone Number"
                  error={errors.phone}
                  description="Optional - for follow-up consultation"
                >
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter phone number"
                  />
                </FormField>

                <FormField
                  label="Assessment Type"
                  required
                  error={errors.assessmentType}
                  description="Select the type of assessment you need"
                >
                  <select
                    value={formData.assessmentType}
                    onChange={(e) => handleInputChange('assessmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    aria-describedby="assessment-type-description"
                  >
                    <option value="">Select assessment type</option>
                    <option value="hipaa-basic">HIPAA Basic Assessment</option>
                    <option value="hipaa-comprehensive">HIPAA Comprehensive Assessment</option>
                    <option value="security-audit">Security Audit</option>
                    <option value="compliance-review">Compliance Review</option>
                  </select>
                </FormField>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    <LoadingState isLoading={isLoading} loadingText="Starting...">
                      Start Assessment
                    </LoadingState>
                  </Button>
                </div>
              </form>
            </Modal>
          </Card>
        </motion.div>
      </div>
    </AccessibilityTestWrapper>
  );
};

// Example: Error Boundary Usage
const AppWithErrorBoundary: React.FC = () => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application error:', error, errorInfo);
        // Send to error reporting service
      }}
      showDetails={!import.meta.env.PROD}
    >
      <ToastProvider>
        <EnhancedAssessmentForm />
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default AppWithErrorBoundary;

