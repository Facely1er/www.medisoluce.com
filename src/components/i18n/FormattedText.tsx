import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocale } from './LocaleProvider';
import { useLocaleFormatter } from '../../utils/i18nUtils';

interface FormattedNumberProps {
  value: number;
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  className?: string;
}

export const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  style = 'decimal',
  currency,
  minimumFractionDigits,
  maximumFractionDigits,
  className = ''
}) => {
  const { locale } = useLocale();
  const formatter = useLocaleFormatter(locale);

  const formatValue = () => {
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits,
      maximumFractionDigits
    };

    switch (style) {
      case 'currency':
        return formatter.formatCurrency(value, { currency, ...options });
      case 'percent':
        return formatter.formatPercentage(value, options);
      default:
        return formatter.formatNumber(value, options);
    }
  };

  return <span className={className}>{formatValue()}</span>;
};

interface FormattedDateProps {
  value: Date | string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  relative?: boolean;
  className?: string;
}

export const FormattedDate: React.FC<FormattedDateProps> = ({
  value,
  dateStyle = 'medium',
  timeStyle,
  relative = false,
  className = ''
}) => {
  const { locale } = useLocale();
  const formatter = useLocaleFormatter(locale);

  const formatValue = () => {
    if (relative) {
      return formatter.formatRelativeTime(value);
    }

    const options: Intl.DateTimeFormatOptions = { dateStyle };
    if (timeStyle) {
      options.timeStyle = timeStyle;
    }

    return formatter.formatDate(value, options);
  };

  return <span className={className}>{formatValue()}</span>;
};

interface FormattedMessageProps {
  id: string;
  values?: Record<string, any>;
  components?: Record<string, React.ComponentType<any>>;
  className?: string;
  defaultMessage?: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({
  id,
  values = {},
  components = {},
  className = '',
  defaultMessage
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLocale();

  // Get translated message
  const message = t(id, { defaultValue: defaultMessage, ...values });

  // Process components in translation (e.g., <strong>{{text}}</strong>)
  const processMessage = (text: string): React.ReactNode => {
    if (!components || Object.keys(components).length === 0) {
      return text;
    }

    // Simple component replacement (can be enhanced with more sophisticated parsing)
    let processedText: React.ReactNode = text;
    
    Object.entries(components).forEach(([tag, Component]) => {
      const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'g');
      const parts = text.split(regex);
      
      if (parts.length > 1) {
        processedText = parts.map((part, index) => {
          if (index % 2 === 1) {
            return React.createElement(Component, { key: index }, part);
          }
          return part;
        });
      }
    });

    return processedText;
  };

  return (
    <span className={`${className} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {processMessage(message)}
    </span>
  );
};

interface FormattedListProps {
  items: string[];
  type?: 'conjunction' | 'disjunction' | 'unit';
  className?: string;
}

export const FormattedList: React.FC<FormattedListProps> = ({
  items,
  type = 'conjunction',
  className = ''
}) => {
  const { locale } = useLocale();

  const formatList = () => {
    try {
      return new Intl.ListFormat(locale, { 
        style: 'long', 
        type: type as any 
      }).format(items);
    } catch (error) {
      // Fallback for unsupported browsers
      if (items.length === 0) return '';
      if (items.length === 1) return items[0];
      if (items.length === 2) {
        return type === 'disjunction' ? 
          `${items[0]} or ${items[1]}` : 
          `${items[0]} and ${items[1]}`;
      }
      
      const lastItem = items[items.length - 1];
      const otherItems = items.slice(0, -1);
      const connector = type === 'disjunction' ? 'or' : 'and';
      
      return `${otherItems.join(', ')}, ${connector} ${lastItem}`;
    }
  };

  return <span className={className}>{formatList()}</span>;
};

// Healthcare-specific formatted components
interface MedicalRecordNumberProps {
  value: string;
  className?: string;
}

export const FormattedMedicalRecordNumber: React.FC<MedicalRecordNumberProps> = ({
  value,
  className = ''
}) => {
  const formatter = useLocaleFormatter();
  
  return (
    <span className={`font-mono ${className}`}>
      {formatter.formatMedicalId(value)}
    </span>
  );
};

interface ComplianceScoreProps {
  score: number;
  maxScore: number;
  showPercentage?: boolean;
  className?: string;
}

export const FormattedComplianceScore: React.FC<ComplianceScoreProps> = ({
  score,
  maxScore,
  showPercentage = true,
  className = ''
}) => {
  const formatter = useLocaleFormatter();
  const { t } = useTranslation();
  
  const percentage = Math.round((score / maxScore) * 100);
  
  return (
    <div className={className}>
      <span className="text-2xl font-bold">
        {showPercentage ? 
          formatter.formatPercentage(percentage) : 
          `${formatter.formatNumber(score)}/${formatter.formatNumber(maxScore)}`
        }
      </span>
      <span className="text-sm text-gray-500 ml-2">
        {t('assessment.compliance_score')}
      </span>
    </div>
  );
};