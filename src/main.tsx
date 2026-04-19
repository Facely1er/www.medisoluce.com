import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPromise } from './i18n';
import { projectHealthEnhancer } from './utils/healthEnhancer';
import { robustErrorHandler } from './utils/robustErrorHandler';
import { performanceEnhancer } from './utils/performanceEnhancer';
import { logger } from './utils/logger';
import { validateEnvironment } from './utils/envValidation';
import { initializeCSPViolationReporting } from './utils/cspViolationReporter';
import { isSupabaseAuthEnabled } from './config/runtimeConfig';

interface UserInteraction {
  type: string;
  timestamp: string;
  page: string;
  message?: string;
  stack?: string;
  source?: string;
  reason?: string;
}

// Global error handler
window.addEventListener('error', (event) => {
  // Import error handler for security event tracking
  import('./utils/errorHandler').then(({ errorHandler }) => {
    // Check for potential security issues
    if (event.error?.message?.includes('script') || 
        event.error?.message?.includes('eval') ||
        event.error?.message?.includes('injection')) {
      errorHandler.handleSecurityEvent('suspicious_input', {
        errorMessage: event.error.message,
        filename: event.filename,
        source: 'global_error_handler'
      }, 'medium');
    }
  });
  
  // Track user interaction before error
  const interactions: UserInteraction[] = JSON.parse(localStorage.getItem('user-interactions') || '[]');
  interactions.push({
    type: 'error',
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    message: event.error?.message,
    stack: event.error?.stack,
    source: event.filename
  });
  localStorage.setItem('user-interactions', JSON.stringify(interactions.slice(-20)));
  
  logger.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  // Import error handler for security event tracking
  import('./utils/errorHandler').then(({ errorHandler }) => {
    // Check for potential security issues in promise rejections
    if (event.reason?.message?.includes('fetch') && 
        event.reason?.message?.includes('failed')) {
      errorHandler.handleSecurityEvent('data_access', {
        reason: event.reason.message,
        source: 'unhandled_rejection'
      }, 'low');
    }
  });
  
  // Track promise rejection context
  const interactions: UserInteraction[] = JSON.parse(localStorage.getItem('user-interactions') || '[]');
  interactions.push({
    type: 'rejection',
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    reason: event.reason?.message,
    stack: event.reason?.stack
  });
  localStorage.setItem('user-interactions', JSON.stringify(interactions.slice(-20)));
  
  logger.error('Unhandled promise rejection:', event.reason);
});

// Initialize monitoring in production
const initializeMonitoring = async () => {
  if (import.meta.env.PROD) {
    try {
      const { errorHandler } = await import('./utils/errorHandler');
      const { healthChecker } = await import('./utils/healthCheck');
      const { comprehensiveHealthManager } = await import('./utils/comprehensiveHealthManager');
      
      // Start health monitoring
      healthChecker.startPeriodicChecks((result) => {
        if (result.status === 'unhealthy') {
          logger.error('System health check failed:', result);
          
          // Log as security event if multiple systems failing
          if (Object.values(result.checks).filter(Boolean).length < 3) {
            errorHandler.handleSecurityEvent('data_access', {
              failedChecks: Object.entries(result.checks).filter(([, status]) => !status).map(([check]) => check),
              healthStatus: result.status
            }, 'high');
          }
        }
      });
      
      // Start comprehensive health monitoring
      setInterval(async () => {
        try {
          const healthReport = await comprehensiveHealthManager.getHealthReport();
          
          // Auto-optimize if health is poor
          if (healthReport.overall.status === 'critical' || healthReport.overall.status === 'poor') {
            await comprehensiveHealthManager.performEmergencyOptimization();
          }
        } catch (error) {
          logger.error('Comprehensive health check failed:', error);
        }
      }, 5 * 60 * 1000); // Every 5 minutes
      
    } catch (error) {
      logger.warn('Failed to initialize monitoring:', error);
    }
  }
};

// Initialize health enhancement system
const initializeHealthSystem = async () => {
  try {
    // Start comprehensive health monitoring
    logger.log('🏥 Initializing MediSoluce health enhancement system...');
    
    // Auto-enhance on startup in production
    if (!import.meta.env.PROD) {
      await projectHealthEnhancer.enhanceProjectHealth();
    }
    
    // Start performance monitoring
    performanceEnhancer.startMonitoring();
    
    // Initialize robust error handling
    robustErrorHandler.initialize();
    
    logger.log('✅ Health enhancement system initialized');
  } catch (error) {
    logger.error('Failed to initialize health system:', error);
  }
};

// Validate environment variables on startup (with fallback)
try {
  const envValidation = validateEnvironment();
  if (!envValidation.valid) {
    if (isSupabaseAuthEnabled) {
      throw new Error(
        'Startup blocked: Supabase mode requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Provide both variables or set VITE_AUTH_PROVIDER=local for demo/trial mode.'
      );
    }
    console.error('Environment validation failed. Some features may not work correctly.');
  }
} catch (error) {
  if (isSupabaseAuthEnabled) {
    // Render a visible error page rather than crashing silently with a blank screen
    const rootEl = document.getElementById('root');
    if (rootEl) {
      // Escape the error message to prevent XSS — never interpolate raw error strings into innerHTML
      const safeMessage = document.createElement('p');
      safeMessage.textContent = (error as Error).message;
      const escapedMessage = safeMessage.innerHTML;

      rootEl.innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f9fafb;font-family:sans-serif;padding:1rem">
          <div style="max-width:480px;width:100%;background:#fff;border-radius:0.75rem;box-shadow:0 4px 24px rgba(0,0,0,.1);padding:2rem;text-align:center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 1rem"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <h1 style="font-size:1.25rem;font-weight:700;color:#111827;margin-bottom:.5rem">Configuration Error</h1>
            <p style="color:#6b7280;margin-bottom:1.5rem;font-size:.95rem">
              Required environment variables are missing. The application cannot start without Supabase credentials.
            </p>
            <p style="background:#fef2f2;border:1px solid #fecaca;border-radius:.5rem;padding:.75rem;color:#b91c1c;font-size:.8rem;text-align:left;white-space:pre-wrap;word-break:break-word">${escapedMessage}</p>
            <p style="color:#9ca3af;font-size:.75rem;margin-top:1.5rem">If you are the site owner, please set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your deployment environment.</p>
          </div>
        </div>
      `;
    }
    throw error;
  }
  console.warn('Environment validation check failed, but continuing:', error);
}

// Initialize CSP violation reporting (with fallback)
try {
  initializeCSPViolationReporting();
} catch (error) {
  // Never fail app startup due to CSP reporting initialization
  console.warn('CSP violation reporting initialization failed, but continuing:', error);
}

// Wait for i18n to initialize before rendering
initPromise.then(() => {
  initializeMonitoring();
  initializeHealthSystem();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}).catch((error) => {
  logger.error('Failed to initialize i18n:', error);
  // Render app anyway to show error state
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
