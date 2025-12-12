import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Server, BarChart, FileText, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type JourneyStep = 1 | 2 | 3 | 4;

interface JourneyProgressProps {
  currentStep: JourneyStep;
  completedSteps?: JourneyStep[];
  showLabels?: boolean;
  variant?: 'compact' | 'full';
  className?: string;
}

const journeySteps = [
  {
    step: 1 as JourneyStep,
    title: 'Assess',
    path: '/hipaa-check',
    icon: ShieldCheck,
    color: 'primary',
    estimatedTime: '10 min'
  },
  {
    step: 2 as JourneyStep,
    title: 'Map Systems',
    path: '/dependency-manager',
    icon: Server,
    color: 'secondary',
    estimatedTime: '15 min'
  },
  {
    step: 3 as JourneyStep,
    title: 'Analyze Impact',
    path: '/business-impact',
    icon: BarChart,
    color: 'accent',
    estimatedTime: '12 min'
  },
  {
    step: 4 as JourneyStep,
    title: 'Plan Recovery',
    path: '/continuity',
    icon: FileText,
    color: 'success',
    estimatedTime: '20 min'
  }
];

const JourneyProgress: React.FC<JourneyProgressProps> = ({
  currentStep,
  completedSteps = [],
  showLabels = true,
  variant = 'full',
  className = ''
}) => {
  const { t } = useTranslation();
  
  const isStepCompleted = (step: JourneyStep) => completedSteps.includes(step);
  const isStepCurrent = (step: JourneyStep) => step === currentStep;
  const isStepAccessible = (step: JourneyStep) => {
    // Step 1 is always accessible
    if (step === 1) return true;
    // Other steps are accessible if previous step is completed or current
    return isStepCompleted((step - 1) as JourneyStep) || isStepCurrent((step - 1) as JourneyStep);
  };

  const getStepStatus = (step: JourneyStep) => {
    if (isStepCompleted(step)) return 'completed';
    if (isStepCurrent(step)) return 'current';
    if (isStepAccessible(step)) return 'accessible';
    return 'locked';
  };

  const getStepClasses = (step: JourneyStep) => {
    const status = getStepStatus(step);
    const stepData = journeySteps.find(s => s.step === step);
    
    const baseClasses = 'flex flex-col items-center transition-all duration-300';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} opacity-100`;
      case 'current':
        return `${baseClasses} scale-110 opacity-100`;
      case 'accessible':
        return `${baseClasses} opacity-75 hover:opacity-100 cursor-pointer`;
      case 'locked':
        return `${baseClasses} opacity-40 cursor-not-allowed`;
    }
  };

  const getIconClasses = (step: JourneyStep) => {
    const status = getStepStatus(step);
    const stepData = journeySteps.find(s => s.step === step);
    
    const colorMap = {
      primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
      secondary: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400',
      accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
      success: 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'
    };
    
    const completedColorMap = {
      primary: 'bg-primary-500 text-white',
      secondary: 'bg-secondary-500 text-white',
      accent: 'bg-accent-500 text-white',
      success: 'bg-success-500 text-white'
    };
    
    const currentColorMap = {
      primary: 'bg-primary-500 text-white ring-4 ring-primary-200 dark:ring-primary-800',
      secondary: 'bg-secondary-500 text-white ring-4 ring-secondary-200 dark:ring-secondary-800',
      accent: 'bg-accent-500 text-white ring-4 ring-accent-200 dark:ring-accent-800',
      success: 'bg-success-500 text-white ring-4 ring-success-200 dark:ring-success-800'
    };
    
    if (status === 'completed') {
      return `w-12 h-12 rounded-full flex items-center justify-center ${completedColorMap[stepData?.color || 'primary']}`;
    }
    if (status === 'current') {
      return `w-12 h-12 rounded-full flex items-center justify-center ${currentColorMap[stepData?.color || 'primary']}`;
    }
    return `w-12 h-12 rounded-full flex items-center justify-center ${colorMap[stepData?.color || 'primary']}`;
  };

  const progressPercentage = (completedSteps.length / 4) * 100;

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Compliance Journey
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep} of 4
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          {journeySteps.map((step) => (
            <span key={step.step} className={isStepCurrent(step.step) ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}>
              {step.step}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Compliance Journey
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedSteps.length} of 4 completed
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 via-secondary-500 to-success-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {journeySteps.map((stepData, index) => {
          const Icon = stepData.icon;
          const status = getStepStatus(stepData.step);
          const isLast = index === journeySteps.length - 1;
          
          const stepContent = (
            <div className={getStepClasses(stepData.step)}>
              <div className={getIconClasses(stepData.step)}>
                {status === 'completed' ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>
              {showLabels && (
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${
                    status === 'current' 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : status === 'completed'
                      ? 'text-gray-600 dark:text-gray-400'
                      : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {stepData.title}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    ~{stepData.estimatedTime}
                  </div>
                </div>
              )}
            </div>
          );

          if (status === 'locked') {
            return (
              <div key={stepData.step} className="relative">
                {stepContent}
                {!isLast && (
                  <div className="absolute top-6 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-600" />
                )}
              </div>
            );
          }

          return (
            <div key={stepData.step} className="relative">
              <Link
                to={stepData.path}
                className="block"
                onClick={(e) => {
                  if (status === 'locked') {
                    e.preventDefault();
                  }
                }}
              >
                {stepContent}
              </Link>
              {!isLast && (
                <div className={`absolute top-6 left-full w-full h-0.5 ${
                  isStepCompleted(stepData.step)
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {currentStep < 4 && (
        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Next Step:</strong> {journeySteps.find(s => s.step === (currentStep + 1) as JourneyStep)?.title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {currentStep === 1 && "Map your critical systems to understand dependencies"}
            {currentStep === 2 && "Analyze the business impact of potential system failures"}
            {currentStep === 3 && "Create recovery plans for high-impact systems"}
          </p>
        </div>
      )}
    </div>
  );
};

export default JourneyProgress;

