import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(({
  label,
  error,
  success = false,
  required = false,
  description,
  children,
  className = ''
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-accent-500 ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      <div className="relative">
        {children}
        
        {/* Status Icons */}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-accent-500" />
          </div>
        )}
        
        {success && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CheckCircle className="h-5 w-5 text-success-500" />
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent-600 dark:text-accent-400 flex items-center"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
