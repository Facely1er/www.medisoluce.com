/**
 * CSP Violation Reporter
 * Handles Content Security Policy violation reports
 */

interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    'referrer': string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'disposition': 'enforce' | 'report';
    'blocked-uri': string;
    'line-number'?: number;
    'column-number'?: number;
    'source-file'?: string;
    'status-code': number;
    'script-sample'?: string;
  };
}

interface ViolationLog {
  id: string;
  timestamp: string;
  documentUri: string;
  violatedDirective: string;
  blockedUri: string;
  sourceFile?: string;
  lineNumber?: number;
  columnNumber?: number;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reported: boolean;
}

class CSPViolationReporter {
  private violations: ViolationLog[] = [];
  private maxViolations = 100;
  private reportEndpoint?: string;

  constructor() {
    this.setupViolationListener();
  }

  /**
   * Set up CSP violation listener
   */
  private setupViolationListener(): void {
    if (typeof window === 'undefined') return;

    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleViolation(event);
    });
  }

  /**
   * Handle CSP violation event
   */
  private handleViolation(event: SecurityPolicyViolationEvent): void {
    const violation: ViolationLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      documentUri: event.documentURI || window.location.href,
      violatedDirective: event.violatedDirective,
      blockedUri: event.blockedURI || '',
      sourceFile: event.sourceFile || undefined,
      lineNumber: event.lineNumber || undefined,
      columnNumber: event.columnNumber || undefined,
      userAgent: navigator.userAgent,
      severity: this.calculateSeverity(event),
      reported: false
    };

    // Add to violations log
    this.violations.push(violation);
    if (this.violations.length > this.maxViolations) {
      this.violations.shift(); // Remove oldest
    }

    // Log violation
    this.logViolation(violation);

    // Report to endpoint if configured
    if (this.reportEndpoint) {
      this.reportToEndpoint(violation, event);
    }

    // Report to error tracking if critical
    if (violation.severity === 'critical' || violation.severity === 'high') {
      this.reportToErrorTracking(violation);
    }
  }

  /**
   * Calculate violation severity
   */
  private calculateSeverity(event: SecurityPolicyViolationEvent): 'low' | 'medium' | 'high' | 'critical' {
    const blockedUri = event.blockedURI || '';
    const violatedDirective = event.violatedDirective;

    // Critical: Script injection attempts
    if (violatedDirective.includes('script-src') && 
        (blockedUri.includes('eval') || blockedUri.includes('inline'))) {
      return 'critical';
    }

    // High: External script/stylesheet from untrusted source
    if ((violatedDirective.includes('script-src') || violatedDirective.includes('style-src')) &&
        !blockedUri.includes('supabase.co') &&
        !blockedUri.includes('googleapis.com') &&
        !blockedUri.includes('gstatic.com')) {
      return 'high';
    }

    // Medium: Resource loading violations
    if (violatedDirective.includes('img-src') || 
        violatedDirective.includes('font-src') ||
        violatedDirective.includes('connect-src')) {
      return 'medium';
    }

    // Low: Other violations
    return 'low';
  }

  /**
   * Log violation to console
   */
  private logViolation(violation: ViolationLog): void {
    const message = `CSP Violation: ${violation.violatedDirective} blocked ${violation.blockedUri}`;
    
    if (violation.severity === 'critical' || violation.severity === 'high') {
      console.error('🚨', message, violation);
    } else {
      console.warn('⚠️', message);
    }
  }

  /**
   * Report violation to endpoint
   */
  private async reportToEndpoint(violation: ViolationLog, event: SecurityPolicyViolationEvent): Promise<void> {
    if (!this.reportEndpoint) return;

    try {
      const report: CSPViolationReport = {
        'csp-report': {
          'document-uri': violation.documentUri,
          'referrer': document.referrer,
          'violated-directive': violation.violatedDirective,
          'effective-directive': event.effectiveDirective,
          'original-policy': event.originalPolicy,
          'disposition': event.disposition as 'enforce' | 'report',
          'blocked-uri': violation.blockedUri,
          'line-number': violation.lineNumber,
          'column-number': violation.columnNumber,
          'source-file': violation.sourceFile,
          'status-code': 200,
          'script-sample': event.sample
        }
      };

      await fetch(this.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/csp-report'
        },
        body: JSON.stringify(report),
        keepalive: true // Important for CSP reports
      });

      violation.reported = true;
    } catch (error) {
      console.error('Failed to report CSP violation:', error);
    }
  }

  /**
   * Report critical violations to error tracking
   */
  private async reportToErrorTracking(violation: ViolationLog): Promise<void> {
    try {
      const { errorHandler } = await import('./errorHandler');
      errorHandler.handleSecurityEvent('csp_violation', {
        violatedDirective: violation.violatedDirective,
        blockedUri: violation.blockedUri,
        sourceFile: violation.sourceFile,
        lineNumber: violation.lineNumber,
        severity: violation.severity
      }, violation.severity);
    } catch (error) {
      console.error('Failed to report CSP violation to error tracking:', error);
    }
  }

  /**
   * Set report endpoint
   */
  setReportEndpoint(endpoint: string): void {
    this.reportEndpoint = endpoint;
  }

  /**
   * Get violation statistics
   */
  getViolationStats(): {
    total: number;
    bySeverity: Record<string, number>;
    recent: ViolationLog[];
  } {
    const bySeverity: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    this.violations.forEach(v => {
      bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1;
    });

    return {
      total: this.violations.length,
      bySeverity,
      recent: this.violations.slice(-10) // Last 10 violations
    };
  }

  /**
   * Get all violations
   */
  getViolations(): ViolationLog[] {
    return [...this.violations];
  }

  /**
   * Clear violations log
   */
  clearViolations(): void {
    this.violations = [];
  }
}

// Create singleton instance
export const cspViolationReporter = new CSPViolationReporter();

/**
 * Initialize CSP violation reporting
 */
export function initializeCSPViolationReporting(endpoint?: string): void {
  if (endpoint) {
    cspViolationReporter.setReportEndpoint(endpoint);
  }

  // Set default endpoint if in production
  if (import.meta.env.PROD && !endpoint) {
    // Use a relative endpoint that can be handled by the server
    cspViolationReporter.setReportEndpoint('/api/csp-violation');
  }
}

