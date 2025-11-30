import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Database, 
  Server, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useLocalStorage from '../../hooks/useLocalStorage';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingGuideProps {
  onComplete?: () => void;
  onSkip?: () => void;
  forceShow?: boolean; // Allow parent to force-show onboarding even if previously completed
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onComplete, onSkip, forceShow = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage<boolean>(
    'dependency-mapper-onboarding-completed',
    false
  );

  useEffect(() => {
    // Show onboarding if not completed OR if parent forces it to show
    if (!hasCompletedOnboarding || forceShow) {
      setIsVisible(true);
      // Reset to first step when force-showing
      if (forceShow && hasCompletedOnboarding) {
        setCurrentStep(0);
      }
    } else {
      setIsVisible(false);
    }
  }, [hasCompletedOnboarding, forceShow]);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Dependency Mapper',
      description: 'Learn how to map and manage your critical healthcare technology dependencies',
      position: 'center',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <Database className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            The Dependency Mapper helps you identify, document, and secure critical healthcare systems 
            and their relationships. This ensures business continuity and HIPAA compliance.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Why this matters:</strong> Understanding system dependencies helps prevent 
                cascading failures and ensures patient care continuity during outages.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'categories',
      title: 'System Categories',
      description: 'Organize systems by category for better management',
      position: 'bottom',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Healthcare systems fall into several key categories:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <Database className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">EHR Systems</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <Server className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Infrastructure</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <AlertTriangle className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Clinical Systems</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <CheckCircle className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Medical Devices</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select the appropriate category when adding a new system to help organize and filter your dependencies.
          </p>
        </div>
      )
    },
    {
      id: 'criticality',
      title: 'Criticality Levels',
      description: 'Understand how to assess system criticality',
      position: 'bottom',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Assign criticality levels based on impact to patient care and operations:
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <div>
                <div className="font-medium text-red-900 dark:text-red-200">Critical</div>
                <div className="text-sm text-red-700 dark:text-red-300">Patient safety at risk if unavailable</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <div>
                <div className="font-medium text-orange-900 dark:text-orange-200">High</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Significant operational impact</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <div>
                <div className="font-medium text-yellow-900 dark:text-yellow-200">Medium</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Moderate impact on operations</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <div>
                <div className="font-medium text-green-900 dark:text-green-200">Low</div>
                <div className="text-sm text-green-700 dark:text-green-300">Minimal impact if unavailable</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dependencies',
      title: 'Mapping Dependencies',
      description: 'Document relationships between systems',
      position: 'bottom',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Dependencies show which systems or resources your system relies on:
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Network connectivity</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Database servers</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Power supply</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Other systems (EHR, PACS, etc.)</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Tip:</strong> List dependencies as comma-separated values. This helps identify 
            cascading failure risks and plan recovery strategies.
          </p>
        </div>
      )
    },
    {
      id: 'downtime',
      title: 'Downtime Tolerance',
      description: 'Set maximum acceptable downtime for each system',
      position: 'bottom',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Define how long each system can be unavailable before it impacts patient care:
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-red-500">
              <div className="font-medium text-sm">Critical Systems</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">0-15 minutes</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-orange-500">
              <div className="font-medium text-sm">High Priority</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">15 minutes - 2 hours</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-yellow-500">
              <div className="font-medium text-sm">Medium Priority</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">2-24 hours</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This information is critical for business continuity planning and helps prioritize 
            recovery efforts during incidents.
          </p>
        </div>
      )
    },
    {
      id: 'next-steps',
      title: 'Next Steps',
      description: 'What to do after mapping dependencies',
      position: 'center',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-center">
            After mapping your dependencies, you can:
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Analyze Business Impact</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Assess how system failures affect patient care and operations
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Create Continuity Plans</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Develop recovery strategies for critical system outages
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Export Your Data</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Download dependency maps for documentation and reporting
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Only mark as completed if not force-showing (i.e., user-initiated completion)
    if (!forceShow) {
      setHasCompletedOnboarding(true);
    }
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    // Only mark as completed if not force-showing (i.e., user-initiated skip)
    if (!forceShow) {
      setHasCompletedOnboarding(true);
    }
    setIsVisible(false);
    if (onSkip) {
      onSkip();
    }
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleSkip}
          />
          
          {/* Guide Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50"
            style={{
              top: currentStepData.position === 'center' ? '50%' : 'auto',
              left: currentStepData.position === 'center' ? '50%' : 'auto',
              transform: currentStepData.position === 'center' ? 'translate(-50%, -50%)' : 'none',
              bottom: currentStepData.position === 'bottom' ? '2rem' : 'auto',
              right: currentStepData.position === 'right' ? '2rem' : 'auto',
            }}
          >
            <Card className="w-full max-w-md shadow-2xl">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      className="h-full bg-primary-600"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {currentStepData.description}
                  </p>
                  <div className="text-gray-700 dark:text-gray-200">
                    {currentStepData.content}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-sm"
                  >
                    Skip Tutorial
                  </Button>
                  <div className="flex items-center space-x-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        icon={<ArrowLeft className="h-4 w-4" />}
                      >
                        Previous
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      icon={currentStep === steps.length - 1 ? <CheckCircle className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    >
                      {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingGuide;

