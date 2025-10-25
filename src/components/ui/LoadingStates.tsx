import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={`${sizeClasses[size]} text-primary-500`} />
        </motion.div>
        
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', lines = 1 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"
          style={{
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
    </div>
  );
};

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: boolean;
  skeletonLines?: number;
  loadingText?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  children,
  skeleton = false,
  skeletonLines = 3,
  loadingText,
  className = ''
}) => {
  if (isLoading) {
    if (skeleton) {
      return (
        <div className={className}>
          <Skeleton lines={skeletonLines} />
        </div>
      );
    }
    
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  return <>{children}</>;
};

export { LoadingSpinner, Skeleton, LoadingState };
