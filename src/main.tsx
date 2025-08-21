import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { projectHealthEnhancer } from './utils/healthEnhancer';
import { robustErrorHandler } from './utils/robustErrorHandler';
import { performanceEnhancer } from './utils/performanceEnhancer';
import { logger } from './utils/logger';

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
  const interactions = JSON.parse(localStorage.getItem('user-interactions') || '[]');
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
  const interactions = JSON.parse(localStorage.getItem('user-interactions') || '[]');
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
              failedChecks: Object.entries(result.checks).filter(([_, status]) => !status).map(([check]) => check),
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
    performanceEnhancer;
    
    // Initialize robust error handling
    robustErrorHandler;
    
    logger.log('✅ Health enhancement system initialized');
  } catch (error) {
    logger.error('Failed to initialize health system:', error);
  }
};

initializeMonitoring();
initializeHealthSystem();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);