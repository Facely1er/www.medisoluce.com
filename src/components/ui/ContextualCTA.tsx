import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface CTAAction {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  external?: boolean;
  trackingLabel?: string;
}

interface ContextualCTAProps {
  title: string;
  description: string;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
  variant?: 'default' | 'gradient' | 'minimal' | 'feature';
  className?: string;
  showBenefit?: boolean;
  benefit?: string;
}

const ContextualCTA: React.FC<ContextualCTAProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  className = '',
  showBenefit = false,
  benefit
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0';
      case 'minimal':
        return 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700';
      case 'feature':
        return 'bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-800 shadow-lg';
      default:
        return 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'text-white';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  const getDescriptionClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'text-white/90';
      default:
        return 'text-gray-600 dark:text-gray-300';
    }
  };

  const renderAction = (action: CTAAction, isPrimary: boolean = false) => {
    const buttonContent = (
      <Button
        size="lg"
        variant={action.variant || (variant === 'gradient' ? 'outline' : 'primary')}
        className={variant === 'gradient' && isPrimary ? 
          '!bg-white !text-primary-600 !border-white hover:!bg-primary-50 hover:!text-primary-700' : 
          variant === 'gradient' ? '!border-white !text-white hover:!bg-white/10' : ''
        }
        icon={action.external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        iconPosition="right"
      >
        {action.text}
      </Button>
    );

    const linkAttributes = {
      'data-analytics': 'contextual-cta',
      'data-cta-label': action.trackingLabel || action.text,
      'data-cta-position': isPrimary ? 'primary' : 'secondary',
      'data-link-destination': action.href
    };

    if (action.external || action.href.startsWith('http') || action.href.includes('medisoluce.com')) {
      return (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          {...linkAttributes}
        >
          {buttonContent}
        </a>
      );
    }

    return (
      <Link to={action.href} {...linkAttributes}>
        {buttonContent}
      </Link>
    );
  };

  return (
    <Card className={`p-6 text-center ${getVariantClasses()} ${className}`}>
      <div className="max-w-2xl mx-auto">
        <h3 className={`text-xl font-medium mb-3 ${getTextClasses()}`}>
          {title}
        </h3>
        <p className={`mb-6 ${getDescriptionClasses()}`}>
          {description}
        </p>
        
        {showBenefit && benefit && (
          <div className={`mb-6 p-3 rounded-lg ${
            variant === 'gradient' ? 'bg-white/10' : 'bg-primary-100 dark:bg-primary-900/30'
          }`}>
            <p className={`text-sm font-medium ${
              variant === 'gradient' ? 'text-white' : 'text-primary-800 dark:text-primary-200'
            }`}>
              💡 {benefit}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {renderAction(primaryAction, true)}
          {secondaryAction && renderAction(secondaryAction, false)}
        </div>
      </div>
    </Card>
  );
};

export default ContextualCTA;