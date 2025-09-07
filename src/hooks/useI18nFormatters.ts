import { useTranslation } from 'react-i18next';
import { useLocale } from '../components/i18n/LocaleProvider';
import { useLocaleFormatter } from '../utils/i18nUtils';

// Custom hook for all i18n formatting needs
export const useI18nFormatters = () => {
  const { t, i18n } = useTranslation();
  const { locale, config, isRTL } = useLocale();
  const formatter = useLocaleFormatter(locale);

  return {
    // Core translation function
    t,
    
    // Locale information
    locale,
    config,
    isRTL,
    
    // Formatting functions
    formatNumber: formatter.formatNumber.bind(formatter),
    formatCurrency: formatter.formatCurrency.bind(formatter),
    formatPercentage: formatter.formatPercentage.bind(formatter),
    formatDate: formatter.formatDate.bind(formatter),
    formatTime: formatter.formatTime.bind(formatter),
    formatRelativeTime: formatter.formatRelativeTime.bind(formatter),
    formatFileSize: formatter.formatFileSize.bind(formatter),
    
    // Healthcare-specific formatters
    formatMedicalId: formatter.formatMedicalId.bind(formatter),
    
    // Advanced translation functions
    tPlural: (key: string, count: number, options?: Record<string, unknown>) => {
      return t(key, { count, ...options });
    },
    
    tWithComponents: (key: string, components: Record<string, React.ComponentType<Record<string, unknown>>>) => {
      return t(key, { 
        components,
        interpolation: { escapeValue: false }
      });
    },
    
    // Conditional translation based on context
    tConditional: (baseKey: string, condition: string, fallback?: string) => {
      const conditionalKey = `${baseKey}_${condition}`;
      const translation = t(conditionalKey, { defaultValue: null });
      return translation || t(fallback || baseKey);
    },
    
    // Business value formatters for healthcare
    formatComplianceScore: (score: number, maxScore: number) => {
      const percentage = Math.round((score / maxScore) * 100);
      return {
        percentage: formatter.formatPercentage(percentage),
        fraction: `${formatter.formatNumber(score)}/${formatter.formatNumber(maxScore)}`,
        raw: percentage
      };
    },
    
    formatDowntimeTolerance: (minutes: number) => {
      if (minutes < 60) {
        return t('time.minutes', { count: minutes });
      } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return t('time.hours', { count: hours });
      } else {
        const days = Math.floor(minutes / 1440);
        return t('time.days', { count: days });
      }
    },
    
    formatSystemCriticality: (level: 'Critical' | 'High' | 'Medium' | 'Low') => {
      return t(`systems.criticality.${level.toLowerCase()}`);
    },
    
    // Change language function
    changeLanguage: (newLocale: string) => {
      i18n.changeLanguage(newLocale);
    },
    
    // Get available languages
    getAvailableLanguages: () => {
      return Object.keys(i18n.services.resourceStore.data);
    },
    
    // Check if translation exists
    hasTranslation: (key: string, ns?: string) => {
      return i18n.exists(key, { ns });
    },
    
    // Get missing translation keys (development only)
    getMissingKeys: import.meta.env.DEV ? () => missingKeys : undefined
  };
};

// Specialized hooks for specific use cases
export const useHealthcareFormatters = () => {
  const formatters = useI18nFormatters();
  
  return {
    ...formatters,
    
    // Healthcare-specific revenue formatting
    formatRevenueAtRisk: (amount: number, period: 'hour' | 'day' | 'month' = 'day') => {
      const currency = formatters.formatCurrency(amount);
      const periodText = formatters.t(`time.per_${period}`);
      return `${currency}${periodText}`;
    },
    
    // Patient impact formatting
    formatPatientImpact: (level: number) => {
      const levels = ['minimal', 'low', 'medium', 'high', 'critical'];
      const levelText = levels[level - 1] || 'unknown';
      return formatters.t(`patientImpact.patient.${levelText}`);
    },
    
    // Risk assessment formatting
    formatRiskLevel: (score: number) => {
      if (score >= 4) return formatters.t('risk.critical');
      if (score >= 3) return formatters.t('risk.high'); 
      if (score >= 2) return formatters.t('risk.medium');
      return formatters.t('risk.low');
    },
    
    // Training progress formatting
    formatTrainingProgress: (completed: number, total: number) => {
      const percentage = Math.round((completed / total) * 100);
      return {
        percentage: formatters.formatPercentage(percentage),
        fraction: `${formatters.formatNumber(completed)}/${formatters.formatNumber(total)}`,
        message: formatters.t('training.progress_message', { completed, total, percentage })
      };
    }
  };
};

// Hook for RTL-aware styling
export const useRTLStyles = () => {
  const { isRTL } = useLocale();
  
  return {
    isRTL,
    
    // Get RTL-aware margin classes
    getMarginStart: (size: string) => isRTL ? `mr-${size}` : `ml-${size}`,
    getMarginEnd: (size: string) => isRTL ? `ml-${size}` : `mr-${size}`,
    
    // Get RTL-aware padding classes
    getPaddingStart: (size: string) => isRTL ? `pr-${size}` : `pl-${size}`,
    getPaddingEnd: (size: string) => isRTL ? `pl-${size}` : `pr-${size}`,
    
    // Get text alignment
    getTextAlign: (align: 'left' | 'right' | 'center' = 'left') => {
      if (align === 'center') return 'text-center';
      if (isRTL) {
        return align === 'left' ? 'text-right' : 'text-left';
      }
      return `text-${align}`;
    },
    
    // Get flex direction for RTL
    getFlexDirection: (direction: 'row' | 'row-reverse' | 'col' = 'row') => {
      if (direction === 'col') return 'flex-col';
      if (isRTL && direction === 'row') return 'flex-row-reverse';
      return `flex-${direction}`;
    },
    
    // Transform icons for RTL (for directional icons like arrows)
    getIconTransform: (shouldMirror: boolean = false) => {
      return isRTL && shouldMirror ? 'transform scale-x-[-1]' : '';
    }
  };
};