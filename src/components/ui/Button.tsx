import React, { memo } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = memo(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  fullWidth = false,
  icon,
  iconPosition = 'left',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border';
  
  const variantStyles = {
    primary: '!bg-primary-500 !text-white !border-primary-500 hover:!bg-primary-600 hover:!border-primary-600 focus:ring-primary-500 active:!bg-primary-700',
    secondary: '!bg-secondary-500 !text-white !border-secondary-500 hover:!bg-secondary-600 hover:!border-secondary-600 focus:ring-secondary-500 active:!bg-secondary-700',
    outline: '!bg-white dark:!bg-gray-800 !text-gray-700 dark:!text-gray-200 !border-gray-300 dark:!border-gray-600 hover:!bg-gray-50 dark:hover:!bg-gray-700 hover:!text-gray-900 dark:hover:!text-white focus:ring-primary-500 active:!bg-gray-100 dark:active:!bg-gray-600',
    ghost: '!bg-transparent !text-gray-700 dark:!text-gray-200 !border-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 hover:!text-gray-900 dark:hover:!text-white focus:ring-primary-500 active:!bg-gray-200 dark:active:!bg-gray-700',
    danger: '!bg-accent-500 !text-white !border-accent-500 hover:!bg-accent-600 hover:!border-accent-600 focus:ring-accent-500 active:!bg-accent-700',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Create button classes with proper precedence
  const buttonClasses = `${[
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabledStyles,
    widthStyles,
  ].filter(Boolean).join(' ')} ${className}`.trim();
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && (
        <span className={`${children ? 'mr-2' : ''} flex-shrink-0`}>
          {icon}
        </span>
      )}
      {children && (
        <span className="flex-shrink-0">
          {children}
        </span>
      )}
      {icon && iconPosition === 'right' && (
        <span className={`${children ? 'ml-2' : ''} flex-shrink-0`}>
          {icon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;