// Translation helper utilities for complex scenarios

import { TFunction } from 'i18next';

// Translation key builder for dynamic keys
export const buildTranslationKey = (
  namespace: string, 
  section: string, 
  key: string
): string => {
  return `${namespace}.${section}.${key}`;
};

// Safe translation with fallback
export const safeTranslate = (
  t: TFunction, 
  key: string, 
  fallback: string, 
  options?: any
): string => {
  const translation = t(key, { defaultValue: null, ...options });
  return translation || fallback || key;
};

// Pluralization helper for complex rules
export const pluralizeHealthcare = (
  t: TFunction,
  baseKey: string,
  count: number,
  entityType: 'patient' | 'system' | 'assessment' | 'issue'
): string => {
  // Healthcare-specific pluralization rules
  const key = `${baseKey}.${entityType}`;
  
  return t(key, { 
    count,
    context: count === 0 ? 'zero' : count === 1 ? 'one' : 'other'
  });
};

// Translation interpolation with rich formatting
export const formatTranslation = (
  t: TFunction,
  key: string,
  values: Record<string, any> = {},
  options: {
    html?: boolean;
    components?: Record<string, React.ComponentType<any>>;
  } = {}
): string => {
  const interpolationOptions = {
    ...values,
    interpolation: { 
      escapeValue: !options.html,
      format: (value: any, format: string) => {
        switch (format) {
          case 'currency':
            return new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'USD' 
            }).format(value);
          case 'percent':
            return new Intl.NumberFormat('en-US', { 
              style: 'percent' 
            }).format(value / 100);
          case 'date':
            return new Date(value).toLocaleDateString();
          case 'uppercase':
            return String(value).toUpperCase();
          case 'lowercase':
            return String(value).toLowerCase();
          default:
            return value;
        }
      }
    }
  };

  return t(key, interpolationOptions);
};

// Healthcare-specific translation utilities
export const healthcareTranslations = {
  // Format compliance score with context
  formatComplianceScore: (t: TFunction, score: number, maxScore: number) => {
    const percentage = Math.round((score / maxScore) * 100);
    let context = 'poor';
    
    if (percentage >= 80) context = 'excellent';
    else if (percentage >= 60) context = 'good';
    else if (percentage >= 40) context = 'fair';
    
    return t('assessment.score_with_context', {
      score,
      maxScore,
      percentage,
      context: t(`assessment.score_context.${context}`)
    });
  },

  // Format system criticality with explanation
  formatSystemCriticality: (t: TFunction, level: string, systemType: string) => {
    return t('systems.criticality_explanation', {
      level: t(`systems.criticality.${level.toLowerCase()}`),
      systemType,
      impact: t(`systems.systemImpact.${level.toLowerCase()}`)
    });
  },

  // Format training progress with milestones
  formatTrainingProgress: (t: TFunction, completed: number, total: number) => {
    const percentage = Math.round((completed / total) * 100);
    let milestone = 'getting_started';
    
    if (percentage >= 100) milestone = 'expert';
    else if (percentage >= 75) milestone = 'advanced';
    else if (percentage >= 50) milestone = 'intermediate';
    else if (percentage >= 25) milestone = 'beginner';
    
    return t('training.progress_with_milestone', {
      completed,
      total,
      percentage,
      milestone: t(`training.milestones.${milestone}`)
    });
  },

  // Format regulatory deadlines with urgency
  formatRegulatory Deadline: (t: TFunction, dueDate: Date, complianceType: string) => {
    const now = new Date();
    const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let urgency = 'normal';
    if (diffInDays <= 7) urgency = 'urgent';
    else if (diffInDays <= 30) urgency = 'soon';
    else if (diffInDays <= 90) urgency = 'upcoming';
    
    return t('compliance.deadline_with_urgency', {
      dueDate: dueDate.toLocaleDateString(),
      complianceType,
      urgency: t(`compliance.urgency.${urgency}`),
      daysRemaining: diffInDays
    });
  }
};

// Translation validation utilities
export const translationValidation = {
  // Check if all required keys exist
  validateRequiredKeys: (
    t: TFunction, 
    requiredKeys: string[]
  ): { valid: boolean; missingKeys: string[] } => {
    const missingKeys = requiredKeys.filter(key => {
      const translation = t(key, { defaultValue: null });
      return translation === null || translation === key;
    });

    return {
      valid: missingKeys.length === 0,
      missingKeys
    };
  },

  // Validate translation parameters
  validateTranslationParams: (
    translation: string, 
    expectedParams: string[]
  ): { valid: boolean; missingParams: string[] } => {
    const missingParams = expectedParams.filter(param => 
      !translation.includes(`{{${param}}}`)
    );

    return {
      valid: missingParams.length === 0,
      missingParams
    };
  },

  // Check for translation consistency
  checkTranslationConsistency: (
    translations: Record<string, string>,
    baseTranslations: Record<string, string>
  ): { consistent: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    // Check for HTML tag consistency
    Object.entries(translations).forEach(([key, translation]) => {
      const baseTranslation = baseTranslations[key];
      if (!baseTranslation) return;
      
      const baseTagMatches = baseTranslation.match(/<[^>]+>/g) || [];
      const translationTagMatches = translation.match(/<[^>]+>/g) || [];
      
      if (baseTagMatches.length !== translationTagMatches.length) {
        issues.push(`HTML tag mismatch in key: ${key}`);
      }
    });
    
    // Check for interpolation parameter consistency
    Object.entries(translations).forEach(([key, translation]) => {
      const baseTranslation = baseTranslations[key];
      if (!baseTranslation) return;
      
      const baseParams = baseTranslation.match(/\{\{[^}]+\}\}/g) || [];
      const translationParams = translation.match(/\{\{[^}]+\}\}/g) || [];
      
      if (baseParams.length !== translationParams.length) {
        issues.push(`Parameter mismatch in key: ${key}`);
      }
    });

    return {
      consistent: issues.length === 0,
      issues
    };
  }
};

// Export utilities for component use
export const useTranslationHelpers = () => {
  const { t } = useTranslation();
  
  return {
    safeT: (key: string, fallback: string, options?: any) => 
      safeTranslate(t, key, fallback, options),
    
    buildKey: buildTranslationKey,
    
    formatHealthcare: {
      complianceScore: (score: number, maxScore: number) =>
        healthcareTranslations.formatComplianceScore(t, score, maxScore),
      
      systemCriticality: (level: string, systemType: string) =>
        healthcareTranslations.formatSystemCriticality(t, level, systemType),
      
      trainingProgress: (completed: number, total: number) =>
        healthcareTranslations.formatTrainingProgress(t, completed, total)
    },
    
    validate: {
      requiredKeys: (keys: string[]) =>
        translationValidation.validateRequiredKeys(t, keys),
      
      params: (translation: string, params: string[]) =>
        translationValidation.validateTranslationParams(translation, params)
    }
  };
};