interface ErrorLog {
  id: string;
  timestamp: string;
  type: 'javascript' | 'network' | 'validation' | 'business' | 'security' | 'compliance';
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  environment?: string;
  version?: string;
  sessionId?: string;
  userContext?: UserContext;
  systemContext?: SystemContext;
  securityEvent?: SecurityEvent;
}

interface UserContext {
  isAuthenticated: boolean;
  currentPage: string;
  previousPage?: string;
  userActions: string[];
  sessionDuration: number;
  viewport: { width: number; height: number };
}

interface SystemContext {
  memoryUsage?: number;
  connectionType: string;
  devicePixelRatio: number;
  timezone: string;
  language: string;
  batteryLevel?: number;
}

interface SecurityEvent {
  eventType: 'csp_violation' | 'failed_auth' | 'suspicious_input' | 'data_access' | 'permission_escalation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, unknown>;
  riskScore: number; // 1-10 scale
  mitigated: boolean;
  investigated: boolean;
  responseActions: string[];
  automaticResponse: boolean;
}

// Production error monitoring configuration
interface ErrorMonitoringConfig {
  sentryDsn?: string;
  environment: string;
  version: string;
  sampleRate: number;
  beforeSend?: (errorLog: ErrorLog) => ErrorLog | null;
}

class ErrorHandler {
  private errorLogs: ErrorLog[] = [];
  private config: ErrorMonitoringConfig;
  private sessionId: string;

  constructor(config?: Partial<ErrorMonitoringConfig>) {
    this.config = {
      environment: import.meta.env.MODE || 'development',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      sampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% sampling in production
      ...config
    };
    
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandling();
    this.initializeExternalMonitoring();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeExternalMonitoring() {
    // Initialize Sentry or other production error monitoring
    if (import.meta.env.PROD && this.config.sentryDsn) {
      // Dynamic import for Sentry to avoid bundling in development
      import('@sentry/browser').then(({ init, configureScope }) => {
        init({
          dsn: this.config.sentryDsn,
          environment: this.config.environment,
          release: this.config.version,
          sampleRate: this.config.sampleRate,
          beforeSend: (event) => {
            // Filter out known non-critical errors
            if (event.message?.includes('Script error')) return null;
            if (event.message?.includes('Non-Error promise rejection')) return null;
            if (event.message?.includes('ResizeObserver loop limit exceeded')) return null;
            if (event.message?.includes('Non-Error exception captured')) return null;
            return event;
          }
        });
        
        configureScope((scope) => {
          scope.setTag('component', 'medisoluce-frontend');
          scope.setContext('application', {
            name: 'MediSoluce',
            version: this.config.version,
            environment: this.config.environment
          });
        });
        
        this.log('External error monitoring initialized');
      }).catch((error) => {
        if (!import.meta.env.PROD) {
          console.warn('Failed to initialize external error monitoring:', error);
        }
      });
    }
  }
  
  // Initialize error tracking (Sentry or similar)
  private initErrorTracking() {
    if (typeof window !== 'undefined') {
      // Enhanced error tracking with more context
      window.addEventListener('error', (event) => {
        // Filter out common non-critical errors
        if (event.message?.includes('Script error')) return;
        if (event.message?.includes('Non-Error promise rejection')) return;
        
        this.logError({
          type: 'javascript',
          message: event.error?.message || 'Unknown error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        // Filter out common non-critical rejections
        if (event.reason?.message?.includes('Non-Error')) return;
        
        this.logError({
          type: 'javascript',
          message: event.reason?.message || 'Unknown rejection',
          reason: String(event.reason),
          stack: event.reason?.stack
        });
      });
    }
  }

  private setupGlobalErrorHandling() {
    // Enhanced error tracking with security context
    // JavaScript errors
    window.addEventListener('error', (event) => {
      // Check for potential security-related errors
      const securityIndicators = [
        'script error',
        'permission denied',
        'access is denied',
        'blocked by client',
        'csp violation',
        'mixed content'
      ];
      
      const isSecurityRelated = securityIndicators.some(indicator => 
        event.message.toLowerCase().includes(indicator.toLowerCase())
      );
      
      this.logError({
        type: isSecurityRelated ? 'security' : 'javascript',
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        securityEvent: isSecurityRelated ? {
          eventType: 'suspicious_input',
          severity: 'medium',
          details: {
            errorMessage: event.message,
            filename: event.filename,
            lineNumber: event.lineno,
            columnNumber: event.colno
          },
          riskScore: 6,
          mitigated: false,
          investigated: false,
          responseActions: [],
          automaticResponse: true
        } : undefined
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const rejectionMessage = event.reason?.message || String(event.reason);
      const isSecurityRelated = rejectionMessage.includes('fetch') || 
                                rejectionMessage.includes('network') ||
                                rejectionMessage.includes('cors');
      
      this.logError({
        type: isSecurityRelated ? 'network' : 'javascript',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        securityEvent: isSecurityRelated ? {
          eventType: 'data_access',
          severity: 'low',
          details: {
            rejectionReason: rejectionMessage,
            url: window.location.href
          },
          riskScore: 3,
          mitigated: false,
          investigated: false,
          responseActions: [],
          automaticResponse: false
        } : undefined
      });
    });
    
    // CSP violation monitoring
    document.addEventListener('securitypolicyviolation', (event) => {
      this.logError({
        type: 'security',
        message: `CSP Violation: ${event.violatedDirective}`,
        url: event.documentURI,
        securityEvent: {
          eventType: 'csp_violation',
          severity: event.violatedDirective.includes('script-src') ? 'high' : 'medium',
          details: {
            blockedURI: event.blockedURI,
            violatedDirective: event.violatedDirective,
            originalPolicy: event.originalPolicy,
            disposition: event.disposition
          },
          riskScore: event.violatedDirective.includes('script-src') ? 8 : 5,
          mitigated: true, // CSP automatically blocked the violation
          investigated: false,
          responseActions: ['automatic_csp_block'],
          automaticResponse: true
        }
      });
    });
  }

  logError(error: Partial<ErrorLog>) {
    const userContext = this.captureUserContext();
    const systemContext = this.captureSystemContext();
    
    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: error.type || 'javascript',
      message: error.message || 'Unknown error',
      stack: error.stack,
      url: error.url || window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      environment: this.config.environment,
      version: this.config.version,
      sessionId: this.sessionId,
      userContext,
      systemContext,
      securityEvent: error.type === 'security' ? error.securityEvent : undefined,
    };

    this.errorLogs.push(errorLog);
    
    // Store in localStorage (privacy-first)
    const storedLogs = JSON.parse(localStorage.getItem('error-logs') || '[]');
    storedLogs.push(errorLog);
    
    // Keep only last 100 errors
    if (storedLogs.length > 100) {
      storedLogs.splice(0, storedLogs.length - 100);
    }
    
    localStorage.setItem('error-logs', JSON.stringify(storedLogs));

    // Log to console in development
    if (!import.meta.env.PROD) {
      console.error('Error logged:', errorLog);
    }

    // Send to external monitoring in production
    if (import.meta.env.PROD && this.shouldSampleError()) {
      this.sendToExternalMonitoring(errorLog);
    }

    // Show user-friendly error message for critical errors
    if (error.type === 'business' || error.message?.includes('network') || error.type === 'security') {
      this.showUserError(error.message || 'An error occurred');
    }
    
    // Trigger security alerts for security events
    if (error.type === 'security') {
      this.handleSecurityEvent(errorLog);
    }
    
    // Enhanced automatic incident response
    if (error.securityEvent?.severity === 'critical' || error.securityEvent?.severity === 'high') {
      this.triggerIncidentResponse(errorLog);
    }
  }

  private triggerIncidentResponse(errorLog: ErrorLog): void {
    // Implement automatic incident response procedures
    const response = {
      incidentId: errorLog.id,
      timestamp: new Date().toISOString(),
      errorType: errorLog.type,
      severity: errorLog.securityEvent?.severity || 'medium',
      automaticActions: [],
      manualActionsRequired: []
    };
    
    // Automatic containment actions
    if (errorLog.securityEvent?.eventType === 'csp_violation') {
      response.automaticActions.push('CSP automatically blocked malicious content');
    }
    
    if (errorLog.securityEvent?.eventType === 'failed_auth') {
      response.automaticActions.push('Rate limiting applied to prevent brute force');
    }
    
    // Manual actions required for critical events
    if (errorLog.securityEvent?.severity === 'critical') {
      response.manualActionsRequired.push('Immediate security review required');
      response.manualActionsRequired.push('Consider system isolation if pattern continues');
    }
    
    // Store incident response record
    const incidents = JSON.parse(localStorage.getItem('security-incidents') || '[]');
    incidents.push(response);
    localStorage.setItem('security-incidents', JSON.stringify(incidents.slice(-50)));
    
    // Notify administrators in production
    if (import.meta.env.PROD && errorLog.securityEvent?.severity === 'critical') {
      this.notifySecurityTeam(response);
    }
  }

  private notifySecurityTeam(incident: SecurityEvent): void {
    // In production, this would send alerts via email, SMS, or SIEM integration
    console.error('Critical security incident detected:', incident);
    
    if (typeof window !== 'undefined' && 'showToast' in window) {
      (window as Window & { showToast: (options: { type: string; title: string; message: string; duration: number }) => void }).showToast({
        type: 'error',
        title: 'Critical Security Alert',
        message: 'Security incident detected and logged for investigation',
        duration: 15000
      });
    }
  }

  private handleSecurityEvent(errorLog: ErrorLog): void {
    // Enhanced security event handling
    if (!errorLog.securityEvent) return;
    
    const _event = errorLog.securityEvent;
    
    // Store security event separately for analysis
    const securityEvents = JSON.parse(localStorage.getItem('security-event-details') || '[]');
    securityEvents.push({
      ...event,
      errorId: errorLog.id,
      context: {
        url: errorLog.url,
        userAgent: errorLog.userAgent,
        userId: errorLog.userId,
        sessionId: errorLog.sessionId
      }
    });
    
    localStorage.setItem('security-event-details', JSON.stringify(securityEvents.slice(-100)));
    
    // Trigger enhanced monitoring for repeated events
    this.checkForSecurityPatterns(event);
  }
  
  private checkForSecurityPatterns(newEvent: SecurityEvent): void {
    const _events = JSON.parse(localStorage.getItem('security-event-details') || '[]');
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentEvents = events.filter((event: { timestamp?: string }) => 
      new Date(event.timestamp || Date.now()).getTime() > oneHourAgo
    );
    
    // Check for attack patterns
    const sameTypeEvents = recentEvents.filter((event: { eventType: string }) => 
      event.eventType === newEvent.eventType
    );
    
    if (sameTypeEvents.length >= 5) {
      // Potential coordinated attack
      this.logError({
        type: 'security',
        message: `Potential coordinated attack detected: ${newEvent.eventType}`,
        securityEvent: {
          eventType: 'permission_escalation',
          severity: 'critical',
          details: {
            attackType: newEvent.eventType,
            eventCount: sameTypeEvents.length,
            timeWindow: '1 hour'
          },
          riskScore: 9,
          mitigated: false,
          investigated: false,
          responseActions: [],
          automaticResponse: true
        }
      });
    }
  }
  private shouldSampleError(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  private captureUserContext(): UserContext {
    try {
      return {
        isAuthenticated: !!localStorage.getItem('supabase.auth.token'),
        currentPage: window.location.pathname,
        previousPage: document.referrer || undefined,
        userActions: [], // Would be populated by user action tracking
        sessionDuration: Date.now() - parseInt(sessionStorage.getItem('session-start') || Date.now().toString()),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        currentPage: 'unknown',
        userActions: [],
        sessionDuration: 0,
        viewport: { width: 0, height: 0 }
      };
    }
  }

  private captureSystemContext(): SystemContext {
    try {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const battery = (navigator as any).getBattery ? (navigator as any).getBattery() : null;
      
      return {
        memoryUsage: (performance as any).memory ? Math.round(((performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize) * 100) : undefined,
        connectionType: connection?.effectiveType || 'unknown',
        devicePixelRatio: window.devicePixelRatio,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        batteryLevel: battery?.level ? Math.round(battery.level * 100) : undefined
      };
    } catch (error) {
      return {
        connectionType: 'unknown',
        devicePixelRatio: 1,
        timezone: 'UTC',
        language: 'en'
      };
    }
  }

  private sendToExternalMonitoring(errorLog: ErrorLog) {
    // Send to external service (Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.addBreadcrumb({
        message: errorLog.message,
        category: errorLog.type,
        level: errorLog.type === 'business' ? 'error' : 'info',
        data: {
          url: errorLog.url,
          sessionId: errorLog.sessionId,
          userId: errorLog.userId
        }
      });
      
      (window as any).Sentry.captureException(new Error(errorLog.message), {
        tags: {
          type: errorLog.type,
          environment: errorLog.environment,
          version: errorLog.version
        },
        extra: errorLog
      });
    }
  }
  private getCurrentUserId(): string | undefined {
    try {
      const session = localStorage.getItem('user-session');
      return session ? JSON.parse(session).sessionId : undefined;
    } catch {
      return undefined;
    }
  }

  private showUserError(message: string) {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'error',
        title: 'Error',
        message,
        duration: 5000
      });
    }
  }

  // Business logic error handling
  handleBusinessError(operation: string, error: unknown) {
    this.logError({
      type: 'business',
      message: `${operation}: ${error.message || error}`,
      stack: error.stack,
    });
  }

  // Network error handling
  handleNetworkError(url: string, error: unknown) {
    this.logError({
      type: 'network',
      message: `Network request failed: ${url}`,
      url,
    });
  }

  // Validation error handling
  handleValidationError(field: string, value: unknown, rule: string) {
    this.logError({
      type: 'validation',
      message: `Validation failed for ${field}: ${rule}`,
    });
  }

  // Get error statistics
  getErrorStats() {
    const logs = JSON.parse(localStorage.getItem('error-logs') || '[]');
    const last24Hours = logs.filter((log: ErrorLog) => {
      const logTime = new Date(log.timestamp).getTime();
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      return logTime > oneDayAgo;
    });

    // Enhanced statistics with context analysis
    const _contextAnalysis = this.analyzeErrorContext(logs);
    
    return {
      total: logs.length,
      last24Hours: last24Hours.length,
      byType: logs.reduce((acc: unknown, log: ErrorLog) => {
        acc[log.type] = (acc[log.type] || 0) + 1;
        return acc;
      }, {}),
      recent: logs.slice(-10),
      contextAnalysis
    };
  }

  private analyzeErrorContext(logs: ErrorLog[]) {
    try {
      const recentLogs = logs.slice(-50); // Analyze last 50 errors
      
      // Page-based error analysis
      const _errorsByPage = recentLogs.reduce((acc: unknown, log) => {
        const page = log.userContext?.currentPage || log.url || 'unknown';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {});
      
      // User action correlation
      const _errorsWithActions = recentLogs.filter(log => 
        log.userContext?.userActions && log.userContext.userActions.length > 0
      );
      
      const commonActionBeforeError = errorsWithActions.reduce((acc: unknown, log) => {
        const lastAction = log.userContext?.userActions[0];
        if (lastAction) {
          acc[lastAction] = (acc[lastAction] || 0) + 1;
        }
        return acc;
      }, {});
      
      // System condition correlation
      const highMemoryErrors = recentLogs.filter(log => 
        log.systemContext?.memoryUsage && log.systemContext.memoryUsage > 80
      ).length;
      
      const mobileErrors = recentLogs.filter(log => 
        log.userContext?.viewport && log.userContext.viewport.width < 768
      ).length;
      
      return {
        errorsByPage,
        commonActionBeforeError,
        highMemoryErrors,
        mobileErrors,
        totalAnalyzed: recentLogs.length
      };
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.warn('Error context analysis failed:', error);
      }
      return {
        errorsByPage: {},
        commonActionBeforeError: {},
        highMemoryErrors: 0,
        mobileErrors: 0,
        totalAnalyzed: 0
      };
    }
  }

  // Export error logs for debugging
  exportErrorLogs() {
    const logs = JSON.parse(localStorage.getItem('error-logs') || '[]');
    const securityEvents = JSON.parse(localStorage.getItem('security-events') || '[]');
    const stats = this.getErrorStats();
    
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalErrors: logs.length,
        totalSecurityEvents: securityEvents.length,
        environment: this.config.environment,
        version: this.config.version,
        sessionId: this.sessionId
      },
      statistics: stats,
      errorLogs: logs,
      securityEvents: securityEvents,
      recommendations: this.generateSecurityRecommendations(stats)
    };
    
    const content = JSON.stringify(exportData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medisoluce-security-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
  
  private generateSecurityRecommendations(stats: unknown): string[] {
    const recommendations: string[] = [];
    
    if (stats.securityAnalysis.highRiskEvents > 0) {
      recommendations.push('Review high-risk security events and implement additional controls');
    }
    
    if (stats.securityAnalysis.averageRiskScore > 6) {
      recommendations.push('Overall security risk is elevated - conduct security review');
    }
    
    if (stats.securityAnalysis.eventsByType.failed_auth > 3) {
      recommendations.push('Multiple authentication failures detected - consider implementing account lockout');
    }
    
    if (stats.securityAnalysis.eventsByType.csp_violation > 5) {
      recommendations.push('Frequent CSP violations - review and tighten content security policy');
    }
    
    if (stats.contextAnalysis.mobileErrors > stats.contextAnalysis.totalAnalyzed * 0.3) {
      recommendations.push('High mobile error rate - test mobile security implementation');
    }
    
    if (stats.securityAnalysis.securityTrend === 'declining') {
      recommendations.push('Security trend is declining - immediate security review recommended');
    }
    
    return recommendations;
  }
}

export const _errorHandler = new ErrorHandler();