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

// Validate environment variables on startup
const envValidation = validateEnvironment();
if (!envValidation.valid) {
  console.error('Environment validation failed. Some features may not work correctly.');
}

// Initialize CSP violation reporting
initializeCSPViolationReporting();

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