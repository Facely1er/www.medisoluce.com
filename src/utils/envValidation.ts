/**
 * Environment Variable Validation
 * Validates required and optional environment variables at runtime
 */
import { isSupabaseAuthEnabled } from '../config/runtimeConfig';

interface EnvConfig {
  required: string[];
  optional: string[];
  defaults?: Record<string, string>;
}

interface ValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
  errors: string[];
}

class EnvironmentValidator {
  private config: EnvConfig;

  constructor(config: EnvConfig) {
    this.config = config;
  }

  /**
   * Validate all environment variables
   */
  validate(): ValidationResult {
    const missing: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    const requiredKeys = [...this.config.required];
    if (isSupabaseAuthEnabled) {
      requiredKeys.push('VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY');
    }

    // Check required variables
    for (const key of requiredKeys) {
      const value = import.meta.env[key];
      if (!value || value.trim() === '') {
        missing.push(key);
        errors.push(`Required environment variable ${key} is missing or empty`);
      }
    }

    // Check optional variables and warn if missing in production
    if (import.meta.env.PROD) {
      for (const key of this.config.optional) {
        const value = import.meta.env[key];
        if (!value || value.trim() === '') {
          warnings.push(`Optional environment variable ${key} is not set (recommended for production)`);
        }
      }
    }

    // Validate format of specific variables
    this.validateFormats(errors, warnings);

    return {
      valid: errors.length === 0,
      missing,
      warnings,
      errors
    };
  }

  /**
   * Validate format of specific environment variables
   */
  private validateFormats(errors: string[], warnings: string[]): void {
    // Validate Supabase URL format
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.match(/^https:\/\/.*\.supabase\.co$/)) {
      warnings.push('VITE_SUPABASE_URL does not match expected format (https://*.supabase.co)');
    }

    // Validate Supabase key format (should be a JWT-like string)
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseKey && supabaseKey.length < 100) {
      warnings.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short)');
    }

    // Validate Sentry DSN format
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (sentryDsn && !sentryDsn.match(/^https:\/\/[a-f0-9]+@[^/]+\/[0-9]+$/)) {
      warnings.push('VITE_SENTRY_DSN does not match expected Sentry DSN format');
    }

    // Validate Google Analytics ID format
    const gaId = import.meta.env.VITE_GA_TRACKING_ID;
    if (gaId && !gaId.match(/^G-[A-Z0-9]+$/i) && !gaId.match(/^UA-[0-9]+-[0-9]+$/)) {
      warnings.push('VITE_GA_TRACKING_ID does not match expected Google Analytics ID format');
    }

    // Validate app base URL
    const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;
    if (appBaseUrl && !appBaseUrl.match(/^https?:\/\/.+/)) {
      errors.push('VITE_APP_BASE_URL must be a valid URL (http:// or https://)');
    }
  }

  /**
   * Get environment variable with fallback
   */
  get(key: string, defaultValue?: string): string | undefined {
    const value = import.meta.env[key];
    if (value && value.trim() !== '') {
      return value;
    }
    return defaultValue || this.config.defaults?.[key];
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return import.meta.env.PROD === true;
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return import.meta.env.DEV === true;
  }
}

// MediSoluce environment configuration
const medisoluceEnvConfig: EnvConfig = {
  required: [
    // Add required variables here if any
    // Currently all are optional for privacy-first design
  ],
  optional: [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SENTRY_DSN',
    'VITE_GA_TRACKING_ID',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_APP_BASE_URL'
  ],
  defaults: {
    VITE_APP_BASE_URL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
  }
};

// Create validator instance
export const envValidator = new EnvironmentValidator(medisoluceEnvConfig);

/**
 * Validate environment on app startup
 * Call this early in the application lifecycle
 * Throws in Supabase mode when required auth env vars are missing
 */
export function validateEnvironment(): ValidationResult {
  const result = envValidator.validate();

  if (result.errors.length > 0) {
    console.error('❌ Environment validation failed:', result.errors);
    if (isSupabaseAuthEnabled) {
      throw new Error(
        'Supabase mode requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. ' +
        'Set both variables or set VITE_AUTH_PROVIDER=local for demo/trial mode.'
      );
    }
    if (envValidator.isProduction()) {
      // In production, log to error tracking service (with fallback)
      console.error('Critical environment variables are missing. Application may not function correctly.');
      
      // Try to log to error tracking, but don't fail if it's not available
      import('./errorHandler')
        .then(({ errorHandler }) => {
          errorHandler.logError({
            type: 'validation',
            message: 'Environment validation failed',
            url: typeof window !== 'undefined' ? window.location.href : undefined
          });
        })
        .catch(() => {
          // Error handler not available - continue anyway
        });
    }
  }

  if (result.warnings.length > 0 && envValidator.isProduction()) {
    console.warn('⚠️ Environment validation warnings:', result.warnings);
  }

  if (result.valid && result.warnings.length === 0) {
    console.log('✅ Environment validation passed');
  }

  return result;
}

/**
 * Get validated environment variable
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  return envValidator.get(key, defaultValue);
}

/**
 * Check if environment is production
 */
export function isProduction(): boolean {
  return envValidator.isProduction();
}

/**
 * Check if environment is development
 */
export function isDevelopment(): boolean {
  return envValidator.isDevelopment();
}
