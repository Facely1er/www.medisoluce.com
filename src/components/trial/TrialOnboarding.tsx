/**
 * Tailored Trial Onboarding Component
 * Provides personalized onboarding experience based on user role and use case
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  FileText, 
  Server, 
  Target,
  Zap,
  X
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { trialService, type TrialStatus } from '../../services/trialService';

interface TrialOnboardingProps {
  trial: TrialStatus;
  onComplete?: () => void;
  onSkip?: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: {
    label: string;
    path: string;
  };
  priority: 'high' | 'medium' | 'low';
}

const TrialOnboarding: React.FC<TrialOnboardingProps> = ({ 
  trial, 
  onComplete, 
  onSkip 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>(
    trial.tailoredOnboarding?.completedSteps || []
  );
  const [_recommendations] = useState(
    trialService.getTailoredRecommendations(trial)
  );

  const getStepsForRecommendation = (rec: ReturnType<typeof trialService.getTailoredRecommendations>[0]): OnboardingStep[] => {
    const stepMap: Record<string, OnboardingStep> = {
      'hipaa-assessment': {
        id: 'hipaa-assessment',
        title: 'Complete HIPAA Assessment',
        description: 'Evaluate your current HIPAA compliance posture',
        icon: <Shield className="h-6 w-6" />,
        action: { label: 'Start Assessment', path: '/hipaa-check' },
        priority: 'high'
      },
      'policy-templates': {
        id: 'policy-templates',
        title: 'Review Policy Templates',
        description: 'Access ready-to-use HIPAA policy templates',
        icon: <FileText className="h-6 w-6" />,
        action: { label: 'View Templates', path: '/toolkit' },
        priority: 'high'
      },
      'training-tracking': {
        id: 'training-tracking',
        title: 'Set Up Training Tracking',
        description: 'Track staff HIPAA training and certifications',
        icon: <Target className="h-6 w-6" />,
        action: { label: 'Get Started', path: '/training' },
        priority: 'medium'
      },
      'dependency-mapping': {
        id: 'dependency-mapping',
        title: 'Map System Dependencies',
        description: 'Identify critical technology dependencies',
        icon: <Server className="h-6 w-6" />,
        action: { label: 'Map Dependencies', path: '/dependency-manager' },
        priority: 'high'
      },
      'security-assessment': {
        id: 'security-assessment',
        title: 'Run Security Assessment',
        description: 'Evaluate your security posture',
        icon: <Shield className="h-6 w-6" />,
        action: { label: 'Assess Security', path: '/security' },
        priority: 'high'
      },
      'threat-analysis': {
        id: 'threat-analysis',
        title: 'Analyze Threats',
        description: 'Review current security threats',
        icon: <Zap className="h-6 w-6" />,
        action: { label: 'View Threats', path: '/ransomware' },
        priority: 'medium'
      },
      'continuity-planning': {
        id: 'continuity-planning',
        title: 'Create Continuity Plan',
        description: 'Develop business continuity procedures',
        icon: <FileText className="h-6 w-6" />,
        action: { label: 'Create Plan', path: '/continuity' },
        priority: 'high'
      },
      'impact-analysis': {
        id: 'impact-analysis',
        title: 'Analyze Business Impact',
        description: 'Understand the impact of system failures',
        icon: <Target className="h-6 w-6" />,
        action: { label: 'Analyze Impact', path: '/business-impact' },
        priority: 'high'
      },
      'recovery-procedures': {
        id: 'recovery-procedures',
        title: 'Document Recovery Procedures',
        description: 'Create step-by-step recovery procedures',
        icon: <FileText className="h-6 w-6" />,
        action: { label: 'Document', path: '/continuity' },
        priority: 'medium'
      },
      'ransomware-playbook': {
        id: 'ransomware-playbook',
        title: 'Review Ransomware Playbook',
        description: 'Access ransomware response procedures',
        icon: <Shield className="h-6 w-6" />,
        action: { label: 'View Playbook', path: '/ransomware' },
        priority: 'high'
      },
      'incident-response': {
        id: 'incident-response',
        title: 'Set Up Incident Response',
        description: 'Configure incident response procedures',
        icon: <Zap className="h-6 w-6" />,
        action: { label: 'Configure', path: '/ransomware' },
        priority: 'high'
      },
      'backup-verification': {
        id: 'backup-verification',
        title: 'Verify Backup Procedures',
        description: 'Ensure backup and recovery processes',
        icon: <Server className="h-6 w-6" />,
        action: { label: 'Verify', path: '/continuity' },
        priority: 'medium'
      },
      'dashboard-overview': {
        id: 'dashboard-overview',
        title: 'Explore Dashboard',
        description: 'Get familiar with the main dashboard',
        icon: <Target className="h-6 w-6" />,
        action: { label: 'View Dashboard', path: '/dashboard' },
        priority: 'low'
      },
      'feature-tour': {
        id: 'feature-tour',
        title: 'Take Feature Tour',
        description: 'Learn about key platform features',
        icon: <Zap className="h-6 w-6" />,
        action: { label: 'Start Tour', path: '/dashboard' },
        priority: 'low'
      },
      'first-assessment': {
        id: 'first-assessment',
        title: 'Complete Your First Assessment',
        description: 'Run your first compliance assessment',
        icon: <CheckCircle className="h-6 w-6" />,
        action: { label: 'Start Assessment', path: '/hipaa-check' },
        priority: 'medium'
      }
    };

    return rec.steps
      .map(stepId => stepMap[stepId])
      .filter(Boolean) as OnboardingStep[];
  };

  const allSteps: OnboardingStep[] = _recommendations
    .flatMap(rec => getStepsForRecommendation(rec))
    .filter((step, index, self) => 
      index === self.findIndex(s => s.id === step.id)
    );

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      trialService.updateOnboardingProgress(trial.userId, trial.productId, stepId);
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  const currentStepData = allSteps[currentStep];
  const progress = ((completedSteps.length + 1) / allSteps.length) * 100;

  if (!currentStepData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-6 relative">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep + 1} of {allSteps.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-primary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${
                currentStepData.priority === 'high' 
                  ? 'bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400'
                  : currentStepData.priority === 'medium'
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {currentStepData.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {currentStepData.description}
            </p>
          </div>

          {/* Recommendations context */}
          {recommendations.find(rec => rec.steps.includes(currentStepData.id)) && (
            <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Recommended for you:</strong>{' '}
                {recommendations.find(rec => rec.steps.includes(currentStepData.id))?.description}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip for Now
            </Button>
            <Button
              onClick={() => {
                handleStepComplete(currentStepData.id);
                window.location.href = currentStepData.action.path;
              }}
              className="flex-1"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              {currentStepData.action.label}
            </Button>
          </div>

          {/* Step indicators */}
          <div className="mt-6 flex justify-center space-x-2">
            {allSteps.slice(0, 5).map((step, index) => (
              <div
                key={step.id}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep
                    ? 'bg-primary-500'
                    : index < currentStep || completedSteps.includes(step.id)
                    ? 'bg-success-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
            {allSteps.length > 5 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                +{allSteps.length - 5} more
              </span>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TrialOnboarding;

