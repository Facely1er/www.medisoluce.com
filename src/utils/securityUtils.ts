// Enhanced security utilities for healthcare compliance

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'authentication' | 'data_access' | 'suspicious_input' | 'failed_auth' | 'csp_violation' | 'privacy_violation' | 'malware_detected' | 'injection_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  details: Record<string, unknown>;
  mitigated: boolean;
  investigated: boolean;
  riskScore: number; // 1-10 scale
  hipaaRelevant: boolean;
  responseActions: string[];
  automaticResponse: boolean;
}

interface SecurityMetrics {
  overallScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  encryptionCoverage: number;
  complianceScore: number;
  vulnerabilityCount: number;
  lastAssessment: string;
  activeThreats: number;
  mitigatedThreats: number;
  securityTrend: 'improving' | 'stable' | 'declining';
}

interface AdvancedSecurityReport {
  metrics: SecurityMetrics & {
    lastScan: string;
    scanDuration: number;
    phiProtectionLevel: number;
    accessControlScore: number;
    incidentResponseReadiness: number;
  };
  threats: {
    active: SecurityThreat[];
    mitigated: SecurityThreat[];
    total: number;
  };
  vulnerabilities: SecurityVulnerability[];
  complianceStatus: {
    hipaa: boolean;
    hitech: boolean;
    encryption: number;
    auditTrail: boolean;
    dataProtection: {
      coverage: number;
      weakPoints: string[];
    };
    accessManagement: {
      score: number;
      issues: string[];
    };
  };
  recommendations: string[];
  protections: string[];
  threatsByType: Record<string, number>;
  threatsBySeverity: Record<string, number>;
  securityTrend: {
    direction: 'improving' | 'stable' | 'declining';
    confidence: number;
    factors: string[];
  };
}

interface SecurityThreat {
  id: string;
  type: 'malware' | 'phishing' | 'injection' | 'data_breach' | 'unauthorized_access' | 'privacy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
  timestamp: string;
  mitigated: boolean;
  mitigation?: string;
  riskScore: number;
  hipaaImpact: boolean;
  evidencePreserved: boolean;
}

interface SecurityVulnerability {
  id: string;
  type: 'xss' | 'injection' | 'csrf' | 'data_exposure' | 'authentication' | 'privacy' | 'malware';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  evidence: string;
  impact: string;
  remediation: string;
  cvssScore?: number;
  hipaaImpact: boolean;
  autoFixable: boolean;
  detectTime: string;
}

interface PasswordStrengthResult {
  score: number; // 1-5 scale
  feedback: string[];
  isValid: boolean;
  estimatedCrackTime: string;
}

class SecurityManager {
  private securityEvents: SecurityEvent[] = [];
  private threatHistory: SecurityThreat[] = [];
  private vulnerabilities: SecurityVulnerability[] = [];
  private encryptionKey: string | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    this.setupRealTimeMonitoring();
    this.setupSecurityHeaders();
    this.startThreatMonitoring();
    this.loadSecurityHistory();
  }

  private setupRealTimeMonitoring(): void {
    // Monitor for suspicious activities
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      this.scanInputForThreats(target.value, target);
    });

    // Monitor for CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      this.logSecurityEvent('csp_violation', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        disposition: event.disposition
      }, event.violatedDirective.includes('script-src') ? 'high' : 'medium');
    });

    // Monitor for suspicious DOM manipulation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.scanElementForSecurity(node as HTMLElement);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private setupSecurityHeaders(): void {
    // Add additional security meta tags if missing
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    securityHeaders.forEach(header => {
      if (!document.querySelector(`meta[http-equiv="${header.name}"]`)) {
        const meta = document.createElement('meta');
        meta.httpEquiv = header.name;
        meta.content = header.content;
        document.head.appendChild(meta);
      }
    });
  }

  private startThreatMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.performThreatAssessment();
      this.updateSecurityMetrics();
      this.maintainSecurityHistory();
    }, 60000); // Every minute
  }

  private loadSecurityHistory(): void {
    try {
      const events = JSON.parse(localStorage.getItem('security-events') || '[]');
      const threats = JSON.parse(localStorage.getItem('security-threats') || '[]');
      const vulns = JSON.parse(localStorage.getItem('security-vulnerabilities') || '[]');

      this.securityEvents = events;
      this.threatHistory = threats;
      this.vulnerabilities = vulns;
    } catch (error) {
      console.error('Failed to load security history:', error);
    }
  }

  public logSecurityEvent(
    eventType: SecurityEvent['eventType'], 
    details: Record<string, unknown>, 
    severity: SecurityEvent['severity']
  ): void {
    const event: SecurityEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      eventType,
      severity,
      source: window.location.href,
      details,
      mitigated: false,
      investigated: false,
      riskScore: this.calculateRiskScore(eventType, severity, details),
      hipaaRelevant: this.isHIPAARelevant(eventType, details),
      responseActions: [],
      automaticResponse: false
    };

    this.securityEvents.push(event);
    this.storeSecurityEvent(event);

    // Auto-respond to high-severity events
    if (severity === 'high' || severity === 'critical') {
      this.triggerSecurityResponse(event);
    }

    // Real-time threat detection
    if (this.detectThreatPattern(event)) {
      this.escalateThreat(event);
    }
  }

  private calculateRiskScore(eventType: string, severity: string, details: Record<string, any>): number {
    let baseScore = 5;

    // Adjust based on severity
    switch (severity) {
      case 'critical': baseScore = 9; break;
      case 'high': baseScore = 7; break;
      case 'medium': baseScore = 5; break;
      case 'low': baseScore = 3; break;
    }

    // Adjust based on event type
    switch (eventType) {
      case 'malware_detected': baseScore += 2; break;
      case 'injection_attempt': baseScore += 1; break;
      case 'privacy_violation': baseScore += 1; break;
      case 'failed_auth': baseScore += 0.5; break;
    }

    // Adjust based on HIPAA relevance
    if (this.isHIPAARelevant(eventType, details)) {
      baseScore += 1;
    }

    return Math.min(10, Math.max(1, baseScore));
  }

  private isHIPAARelevant(eventType: string, details: Record<string, any>): boolean {
    const hipaaEventTypes = ['data_access', 'privacy_violation', 'malware_detected'];
    if (hipaaEventTypes.includes(eventType)) return true;

    // Check if details contain PHI-related keywords
    const detailsString = JSON.stringify(details).toLowerCase();
    const phiKeywords = ['patient', 'medical', 'health', 'phi', 'hipaa', 'diagnosis'];
    return phiKeywords.some(keyword => detailsString.includes(keyword));
  }

  private detectThreatPattern(newEvent: SecurityEvent): boolean {
    const recentEvents = this.securityEvents.filter(event => 
      new Date(event.timestamp).getTime() > Date.now() - (60 * 60 * 1000) // Last hour
    );

    // Detect patterns that indicate coordinated attacks
    const sameTypeEvents = recentEvents.filter(event => event.eventType === newEvent.eventType);
    if (sameTypeEvents.length >= 3) return true;

    // Detect escalating severity
    const sortedEvents = recentEvents.sort((a, b) => a.riskScore - b.riskScore);
    if (sortedEvents.length >= 3 && sortedEvents[sortedEvents.length - 1].riskScore > 7) return true;

    return false;
  }

  private triggerSecurityResponse(event: SecurityEvent): void {
    const response = {
      incidentId: event.id,
      timestamp: new Date().toISOString(),
      eventType: event.eventType,
      severity: event.severity,
      automaticActions: [] as string[],
      manualActionsRequired: [] as string[]
    };

    // Automatic response actions
    switch (event.eventType) {
      case 'injection_attempt':
        response.automaticActions.push('Input sanitized and blocked');
        this.blockSuspiciousInput();
        break;
      case 'malware_detected':
        response.automaticActions.push('Malicious content removed');
        this.quarantineMalware();
        break;
      case 'csp_violation':
        response.automaticActions.push('Content blocked by CSP');
        break;
      case 'failed_auth':
        response.automaticActions.push('Rate limiting applied');
        this.applyRateLimiting(event.details.email);
        break;
    }

    // Manual actions for critical events
    if (event.severity === 'critical') {
      response.manualActionsRequired.push('Immediate security review required');
      response.manualActionsRequired.push('Consider system isolation if pattern continues');
      response.manualActionsRequired.push('Notify compliance team');
    }

    event.responseActions = [...response.automaticActions, ...response.manualActionsRequired];
    event.automaticResponse = response.automaticActions.length > 0;
    event.mitigated = response.automaticActions.length > 0;

    // Store incident response
    const incidents = JSON.parse(localStorage.getItem('security-incidents') || '[]');
    incidents.push(response);
    localStorage.setItem('security-incidents', JSON.stringify(incidents.slice(-100)));
  }

  private escalateThreat(event: SecurityEvent): void {
    const threat: SecurityThreat = {
      id: event.id,
      type: this.mapEventTypeToThreatType(event.eventType),
      severity: event.severity,
      description: `${event.eventType.replace('_', ' ')} pattern detected`,
      source: event.source,
      timestamp: event.timestamp,
      mitigated: event.mitigated,
      riskScore: event.riskScore,
      hipaaImpact: event.hipaaRelevant,
      evidencePreserved: true
    };

    this.threatHistory.push(threat);
    this.storeThreat(threat);

    // Alert for critical threats
    if (threat.severity === 'critical') {
      this.alertCriticalThreat(threat);
    }
  }

  private mapEventTypeToThreatType(eventType: string): SecurityThreat['type'] {
    const mapping: Record<string, SecurityThreat['type']> = {
      'malware_detected': 'malware',
      'injection_attempt': 'injection',
      'privacy_violation': 'privacy_violation',
      'failed_auth': 'unauthorized_access',
      'suspicious_input': 'injection',
      'data_access': 'data_breach'
    };

    return mapping[eventType] || 'unauthorized_access';
  }

  private blockSuspiciousInput(): void {
    // Clear all form inputs as a precaution
    document.querySelectorAll('input[type="text"], textarea').forEach(input => {
      const element = input as HTMLInputElement;
      if (element.value && this.containsSuspiciousContent(element.value)) {
        element.value = '';
        element.style.borderColor = '#dc3545';
        element.placeholder = 'Input blocked for security';
      }
    });
  }

  private quarantineMalware(): void {
    // Remove potentially malicious elements
    document.querySelectorAll('script[src*="suspicious"], iframe[src*="malicious"]').forEach(element => {
      element.remove();
    });
  }

  private applyRateLimiting(identifier: string): void {
    const rateLimitData = JSON.parse(localStorage.getItem('rate-limits') || '{}');
    rateLimitData[identifier] = {
      attempts: (rateLimitData[identifier]?.attempts || 0) + 1,
      lastAttempt: Date.now(),
      blocked: true,
      blockedUntil: Date.now() + (15 * 60 * 1000) // 15 minutes
    };
    localStorage.setItem('rate-limits', JSON.stringify(rateLimitData));
  }

  private alertCriticalThreat(threat: SecurityThreat): void {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'error',
        title: 'Critical Security Threat',
        message: `${threat.description} - Immediate attention required`,
        duration: 15000
      });
    }
  }

  private containsSuspiciousContent(content: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i,
      /\bunion\b.*\bselect\b/i,
      /\beval\s*\(/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(content));
  }

  private scanInputForThreats(input: string, element: HTMLInputElement): void {
    if (this.containsSuspiciousContent(input)) {
      this.logSecurityEvent('suspicious_input', {
        inputLength: input.length,
        elementType: element.type,
        elementName: element.name,
        suspiciousContent: input.substring(0, 100)
      }, 'high');

      // Clear the input immediately
      element.value = '';
      element.style.borderColor = '#dc3545';
      
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast({
          type: 'error',
          title: 'Security Threat Blocked',
          message: 'Potentially malicious input detected and blocked',
          duration: 5000
        });
      }
    }
  }

  private scanElementForSecurity(element: HTMLElement): void {
    // Check for dangerous attributes
    const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover'];
    let removedAttributes = 0;

    dangerousAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
        removedAttributes++;
      }
    });

    if (removedAttributes > 0) {
      this.logSecurityEvent('malware_detected', {
        elementTag: element.tagName,
        removedAttributes: removedAttributes,
        location: element.outerHTML.substring(0, 100)
      }, 'medium');
    }
  }

  private performThreatAssessment(): void {
    const recentThreats = this.threatHistory.filter(threat => 
      new Date(threat.timestamp).getTime() > Date.now() - (24 * 60 * 60 * 1000)
    );

    const criticalThreats = recentThreats.filter(threat => threat.severity === 'critical');
    const highThreats = recentThreats.filter(threat => threat.severity === 'high');

    if (criticalThreats.length > 0 || highThreats.length > 3) {
      this.logSecurityEvent('authentication', {
        criticalThreats: criticalThreats.length,
        highThreats: highThreats.length,
        totalRecentThreats: recentThreats.length
      }, criticalThreats.length > 0 ? 'critical' : 'high');
    }
  }

  private updateSecurityMetrics(): void {
    const metrics = this.calculateSecurityMetrics();
    localStorage.setItem('security-metrics', JSON.stringify(metrics));
  }

  private maintainSecurityHistory(): void {
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
      localStorage.setItem('security-events', JSON.stringify(this.securityEvents));
    }

    // Keep only last 24 hours of threats
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    this.threatHistory = this.threatHistory.filter(threat => 
      new Date(threat.timestamp).getTime() > oneDayAgo
    );
    localStorage.setItem('security-threats', JSON.stringify(this.threatHistory));
  }

  public generateSecurityReport(): {
    https: boolean;
    csp: {
      enabled: boolean;
      violations: Array<{
        timestamp: string;
        violatedDirective: string;
        blockedURI: string;
        sourceFile?: string;
        lineNumber?: number;
      }>;
    };
    headers: Record<string, boolean>;
    cookies: {
      secureCount: number;
      insecureCount: number;
      httpOnlyCount: number;
    };
    localStorage: {
      encrypted: boolean;
      sensitiveDataCount: number;
    };
    metrics: {
      overallScore: number;
      threatLevel: string;
      encryptionCoverage: number;
      complianceScore: number;
    };
  } {
    return {
      https: window.location.protocol === 'https:',
      csp: {
        enabled: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
        violations: this.getCSPViolations()
      },
      headers: this.checkSecurityHeaders(),
      cookies: this.analyzeCookies(),
      localStorage: this.checkLocalStorageSecurity(),
      metrics: this.calculateSecurityMetrics()
    };
  }

  public generateAdvancedSecurityReport(): AdvancedSecurityReport {
    const metrics = this.calculateAdvancedSecurityMetrics();
    const threats = this.analyzeThreats();
    const vulnerabilities = this.getActiveVulnerabilities();
    const complianceStatus = this.assessComplianceStatus();

    return {
      metrics,
      threats,
      vulnerabilities,
      complianceStatus,
      recommendations: this.generateSecurityRecommendations(),
      protections: this.getActiveProtections(),
      threatsByType: this.groupThreatsByType(),
      threatsBySeverity: this.groupThreatsBySeverity(),
      securityTrend: this.calculateSecurityTrend()
    };
  }

  public async performAdvancedSecurityScan(): Promise<any> {
    const startTime = Date.now();
    
    const threats = await this.scanForThreats();
    const vulnerabilities = await this.scanForVulnerabilities();
    const compliance = this.assessCompliance();

    const scanResult = {
      threats,
      vulnerabilities,
      compliance,
      threatLevel: this.calculateThreatLevel(threats),
      mitigatedThreats: threats.filter((t: any) => t.mitigated).length,
      scanDuration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };

    // Store scan results
    const scanHistory = JSON.parse(localStorage.getItem('security-scan-history') || '[]');
    scanHistory.push(scanResult);
    localStorage.setItem('security-scan-history', JSON.stringify(scanHistory.slice(-50)));

    return scanResult;
  }

  private async scanForThreats(): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Scan for malware indicators
    const malwareIndicators = this.detectMalwareIndicators();
    threats.push(...malwareIndicators);

    // Scan for injection attempts
    const injectionAttempts = this.detectInjectionAttempts();
    threats.push(...injectionAttempts);

    // Scan for data exposure risks
    const dataExposureRisks = this.detectDataExposureRisks();
    threats.push(...dataExposureRisks);

    return threats;
  }

  private detectMalwareIndicators(): SecurityThreat[] {
    const threats: SecurityThreat[] = [];

    // Check for suspicious scripts
    document.querySelectorAll('script').forEach((script, index) => {
      if (script.src && this.isSuspiciousSource(script.src)) {
        threats.push({
          id: `malware-script-${index}`,
          type: 'malware',
          severity: 'high',
          description: 'Suspicious script source detected',
          source: script.src,
          timestamp: new Date().toISOString(),
          mitigated: false,
          riskScore: 8,
          hipaaImpact: true,
          evidencePreserved: true
        });
      }
    });

    return threats;
  }

  private detectInjectionAttempts(): SecurityThreat[] {
    const threats: SecurityThreat[] = [];

    // Check localStorage for injection patterns
    Object.keys(localStorage).forEach(key => {
      const value = localStorage.getItem(key) || '';
      if (this.containsInjectionPattern(value)) {
        threats.push({
          id: `injection-${key}-${Date.now()}`,
          type: 'injection',
          severity: 'high',
          description: 'SQL injection pattern detected in stored data',
          source: `localStorage[${key}]`,
          timestamp: new Date().toISOString(),
          mitigated: false,
          riskScore: 7,
          hipaaImpact: key.includes('hipaa') || key.includes('patient'),
          evidencePreserved: true
        });
      }
    });

    return threats;
  }

  private detectDataExposureRisks(): SecurityThreat[] {
    const threats: SecurityThreat[] = [];

    // Check for PHI in DOM
    const textNodes = this.getAllTextNodes();
    textNodes.forEach((node, index) => {
      const text = node.textContent || '';
      if (this.containsPHI(text)) {
        threats.push({
          id: `phi-exposure-${index}`,
          type: 'data_breach',
          severity: 'critical',
          description: 'PHI exposed in DOM content',
          source: node.parentElement?.tagName || 'unknown',
          timestamp: new Date().toISOString(),
          mitigated: false,
          riskScore: 9,
          hipaaImpact: true,
          evidencePreserved: true
        });
      }
    });

    return threats;
  }

  private isSuspiciousSource(src: string): boolean {
    const suspiciousPatterns = [
      /[a-z0-9]{32,}/i, // Random strings
      /eval|exec|function/i,
      /data:text\/html/i,
      /javascript:/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(src));
  }

  private containsInjectionPattern(content: string): boolean {
    const injectionPatterns = [
      /\bunion\b.*\bselect\b/gi,
      /\bor\b\s+\d+\s*=\s*\d+/gi,
      /;\s*drop\s+table/gi,
      /\beval\s*\(/gi,
      /<script/gi
    ];

    return injectionPatterns.some(pattern => pattern.test(content));
  }

  private containsPHI(text: string): boolean {
    const phiPatterns = [
      /\b\d{3}-?\d{2}-?\d{4}\b/g, // SSN
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // Credit Card
      /\b\d{10,15}\b/g // Medical Record Numbers
    ];

    return phiPatterns.some(pattern => pattern.test(text));
  }

  private getAllTextNodes(): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node = walker.nextNode();
    while (node) {
      textNodes.push(node as Text);
      node = walker.nextNode();
    }

    return textNodes;
  }

  private calculateAdvancedSecurityMetrics(): AdvancedSecurityReport['metrics'] {
    const baseMetrics = this.calculateSecurityMetrics();
    
    return {
      ...baseMetrics,
      lastScan: new Date().toISOString(),
      scanDuration: 0,
      phiProtectionLevel: this.calculatePHIProtectionLevel(),
      accessControlScore: this.calculateAccessControlScore(),
      incidentResponseReadiness: this.calculateIncidentResponseReadiness()
    };
  }

  private calculateSecurityMetrics(): SecurityMetrics {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentEvents = this.securityEvents.filter(event => 
      new Date(event.timestamp).getTime() > oneHourAgo
    );

    const criticalEvents = recentEvents.filter(event => event.severity === 'critical');
    const highEvents = recentEvents.filter(event => event.severity === 'high');

    let overallScore = 100;
    if (criticalEvents.length > 0) overallScore -= 30;
    if (highEvents.length > 0) overallScore -= 15;
    if (recentEvents.length > 10) overallScore -= 10;

    const threatLevel = criticalEvents.length > 0 ? 'critical' :
                      highEvents.length > 2 ? 'high' :
                      recentEvents.length > 5 ? 'medium' : 'low';

    return {
      overallScore: Math.max(0, overallScore),
      threatLevel,
      encryptionCoverage: this.calculateEncryptionCoverage(),
      complianceScore: this.calculateComplianceScore(),
      vulnerabilityCount: this.vulnerabilities.length,
      lastAssessment: new Date().toISOString(),
      activeThreats: this.threatHistory.filter(t => !t.mitigated).length,
      mitigatedThreats: this.threatHistory.filter(t => t.mitigated).length,
      securityTrend: this.calculateSecurityTrendDirection()
    };
  }

  private calculatePHIProtectionLevel(): number {
    let score = 100;

    // Check HTTPS
    if (window.location.protocol !== 'https:') score -= 30;

    // Check encryption coverage
    const encryptionCoverage = this.calculateEncryptionCoverage();
    score -= (100 - encryptionCoverage) * 0.5;

    // Check for PHI exposure
    const phiExposure = this.checkPHIExposure();
    if (phiExposure > 0) score -= phiExposure * 20;

    return Math.max(0, score);
  }

  private calculateAccessControlScore(): number {
    let score = 100;

    // Check for authentication
    const hasAuth = !!localStorage.getItem('user-session');
    if (!hasAuth) score -= 20;

    // Check for access logging
    const hasAuditLog = !!localStorage.getItem('audit-logs');
    if (!hasAuditLog) score -= 30;

    // Check for role-based access
    const hasRBAC = this.checkRoleBasedAccess();
    if (!hasRBAC) score -= 25;

    return Math.max(0, score);
  }

  private calculateIncidentResponseReadiness(): number {
    let score = 100;

    // Check for incident response plan
    const hasIncidentPlan = !!localStorage.getItem('incident-response-plan');
    if (!hasIncidentPlan) score -= 40;

    // Check for breach notification procedures
    const hasBreachProcedures = !!localStorage.getItem('breach-procedures');
    if (!hasBreachProcedures) score -= 30;

    // Check for security team contacts
    const hasSecurityContacts = !!localStorage.getItem('security-contacts');
    if (!hasSecurityContacts) score -= 20;

    return Math.max(0, score);
  }

  public encryptSensitiveData(data: string): string {
    try {
      // Simple encryption for demo purposes (use proper encryption in production)
      return btoa(JSON.stringify({
        data: btoa(data),
        timestamp: Date.now(),
        encrypted: true,
        checksum: this.generateChecksum(data)
      }));
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  public decryptSensitiveData(encryptedData: string): string {
    try {
      const parsed = JSON.parse(atob(encryptedData));
      if (parsed.encrypted && parsed.data) {
        return atob(parsed.data);
      }
      return encryptedData;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  public generateMFASecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  public validateMFACode(code: string, email: string): boolean {
    // Simple MFA validation for demo (use proper TOTP in production)
    const expectedCode = '123456'; // Demo code
    return code === expectedCode;
  }

  public checkPasswordStrength(password: string): PasswordStrengthResult {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) score++;
    else feedback.push('Use at least 8 characters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Include uppercase letters');

    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Include lowercase letters');

    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push('Include numbers');

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('Include special characters');

    const isValid = score >= 4;
    const estimatedCrackTime = this.estimateCrackTime(password, score);

    return {
      score,
      feedback,
      isValid,
      estimatedCrackTime
    };
  }

  private estimateCrackTime(password: string, score: number): string {
    if (score <= 2) return 'Less than 1 day';
    if (score <= 3) return '1-30 days';
    if (score <= 4) return '1-12 months';
    return 'Many years';
  }

  private generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private storeSecurityEvent(event: SecurityEvent): void {
    try {
      localStorage.setItem('security-events', JSON.stringify(this.securityEvents));
    } catch (error) {
      console.error('Failed to store security event:', error);
    }
  }

  private storeThreat(threat: SecurityThreat): void {
    try {
      localStorage.setItem('security-threats', JSON.stringify(this.threatHistory));
    } catch (error) {
      console.error('Failed to store threat:', error);
    }
  }

  private getCSPViolations(): any[] {
    return JSON.parse(localStorage.getItem('csp-violations') || '[]');
  }

  private checkSecurityHeaders(): any {
    return {
      xFrameOptions: !!document.querySelector('meta[http-equiv="X-Frame-Options"]'),
      xContentTypeOptions: !!document.querySelector('meta[http-equiv="X-Content-Type-Options"]'),
      xXSSProtection: !!document.querySelector('meta[http-equiv="X-XSS-Protection"]'),
      referrerPolicy: !!document.querySelector('meta[http-equiv="Referrer-Policy"]')
    };
  }

  private analyzeCookies(): any {
    const cookies = document.cookie.split(';');
    const secureCount = cookies.filter(cookie => cookie.includes('Secure')).length;
    const httpOnlyCount = cookies.filter(cookie => cookie.includes('HttpOnly')).length;
    
    return {
      total: cookies.length,
      secureCount,
      httpOnlyCount,
      insecureCount: cookies.length - secureCount
    };
  }

  private checkLocalStorageSecurity(): boolean {
    const sensitiveKeys = ['user-session', 'hipaa-assessments', 'system-dependencies'];
    return sensitiveKeys.every(key => {
      const data = localStorage.getItem(key);
      return !data || this.isDataEncrypted(data);
    });
  }

  private isDataEncrypted(data: string): boolean {
    try {
      const parsed = JSON.parse(atob(data));
      return parsed.encrypted === true;
    } catch {
      return false;
    }
  }

  private calculateEncryptionCoverage(): number {
    const sensitiveKeys = ['user-session', 'hipaa-assessments', 'system-dependencies'];
    let encryptedCount = 0;

    sensitiveKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data && this.isDataEncrypted(data)) {
        encryptedCount++;
      }
    });

    return sensitiveKeys.length > 0 ? Math.round((encryptedCount / sensitiveKeys.length) * 100) : 100;
  }

  private calculateComplianceScore(): number {
    let score = 100;

    // HTTPS check
    if (window.location.protocol !== 'https:') score -= 25;

    // Privacy policy check
    if (!document.querySelector('[href*="privacy"]')) score -= 20;

    // Audit trail check
    if (!localStorage.getItem('audit-logs')) score -= 15;

    // Data encryption check
    const encryptionCoverage = this.calculateEncryptionCoverage();
    score -= (100 - encryptionCoverage) * 0.4;

    return Math.max(0, score);
  }

  private calculateSecurityTrendDirection(): SecurityMetrics['securityTrend'] {
    const recentMetrics = JSON.parse(localStorage.getItem('security-metrics-history') || '[]');
    if (recentMetrics.length < 2) return 'stable';

    const current = recentMetrics[recentMetrics.length - 1];
    const previous = recentMetrics[recentMetrics.length - 2];
    
    const scoreDiff = current.overallScore - previous.overallScore;
    
    if (scoreDiff > 5) return 'improving';
    if (scoreDiff < -5) return 'declining';
    return 'stable';
  }

  private analyzeThreats(): AdvancedSecurityReport['threats'] {
    const activeThreats = this.threatHistory.filter(t => !t.mitigated);
    const mitigatedThreats = this.threatHistory.filter(t => t.mitigated);

    return {
      active: activeThreats,
      mitigated: mitigatedThreats,
      total: this.threatHistory.length
    };
  }

  private getActiveVulnerabilities(): SecurityVulnerability[] {
    return this.vulnerabilities.filter(v => 
      new Date(v.detectTime).getTime() > Date.now() - (24 * 60 * 60 * 1000)
    );
  }

  private assessComplianceStatus(): AdvancedSecurityReport['complianceStatus'] {
    return {
      hipaa: this.checkHIPAACompliance(),
      hitech: this.checkHITECHCompliance(),
      encryption: this.calculateEncryptionCoverage(),
      auditTrail: !!localStorage.getItem('audit-logs'),
      dataProtection: {
        coverage: this.calculateDataProtectionCoverage(),
        weakPoints: this.identifyDataProtectionWeakPoints()
      },
      accessManagement: {
        score: this.calculateAccessControlScore(),
        issues: this.identifyAccessManagementIssues()
      }
    };
  }

  private checkHIPAACompliance(): boolean {
    const checks = [
      window.location.protocol === 'https:',
      !!document.querySelector('[href*="privacy"]'),
      this.calculateEncryptionCoverage() >= 80,
      !!localStorage.getItem('audit-logs')
    ];

    return checks.filter(Boolean).length >= 3;
  }

  private checkHITECHCompliance(): boolean {
    return !!(
      localStorage.getItem('breach-procedures') &&
      localStorage.getItem('incident-response-plan')
    );
  }

  private calculateDataProtectionCoverage(): number {
    const protectionFactors = [
      this.calculateEncryptionCoverage(),
      this.checkAccessControls() ? 100 : 0,
      this.checkDataMinimization() ? 100 : 0,
      this.checkSecureTransmission() ? 100 : 0
    ];

    return Math.round(protectionFactors.reduce((sum, factor) => sum + factor, 0) / protectionFactors.length);
  }

  private identifyDataProtectionWeakPoints(): string[] {
    const weakPoints: string[] = [];

    if (this.calculateEncryptionCoverage() < 100) {
      weakPoints.push('Incomplete data encryption coverage');
    }

    if (!this.checkAccessControls()) {
      weakPoints.push('Weak access control implementation');
    }

    if (!this.checkDataMinimization()) {
      weakPoints.push('Data minimization not enforced');
    }

    return weakPoints;
  }

  private identifyAccessManagementIssues(): string[] {
    const issues: string[] = [];

    if (!localStorage.getItem('user-session')) {
      issues.push('No active session management');
    }

    if (!localStorage.getItem('audit-logs')) {
      issues.push('Access logging not implemented');
    }

    if (!this.checkRoleBasedAccess()) {
      issues.push('Role-based access controls missing');
    }

    return issues;
  }

  private checkAccessControls(): boolean {
    return !!(
      localStorage.getItem('user-session') ||
      document.querySelector('[data-auth-required]')
    );
  }

  private checkDataMinimization(): boolean {
    const dataKeys = Object.keys(localStorage);
    const unnecessaryData = dataKeys.filter(key => 
      key.includes('debug') || key.includes('analytics') || key.includes('tracking')
    );
    return unnecessaryData.length < 3;
  }

  private checkSecureTransmission(): boolean {
    return window.location.protocol === 'https:';
  }

  private checkRoleBasedAccess(): boolean {
    try {
      const session = localStorage.getItem('user-session');
      if (session) {
        const userData = JSON.parse(this.decryptSensitiveData(session));
        return userData.role !== undefined;
      }
      return false;
    } catch {
      return false;
    }
  }

  private checkPHIExposure(): number {
    const textNodes = this.getAllTextNodes();
    let exposureCount = 0;

    textNodes.forEach(node => {
      if (this.containsPHI(node.textContent || '')) {
        exposureCount++;
      }
    });

    return exposureCount;
  }

  private generateSecurityRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.calculateSecurityMetrics();

    if (metrics.overallScore < 80) {
      recommendations.push('Implement comprehensive security controls');
    }

    if (metrics.threatLevel === 'high' || metrics.threatLevel === 'critical') {
      recommendations.push('Address active security threats immediately');
    }

    if (metrics.encryptionCoverage < 100) {
      recommendations.push('Complete data encryption implementation');
    }

    if (metrics.activeThreats > 0) {
      recommendations.push('Investigate and mitigate active security threats');
    }

    if (!this.checkHIPAACompliance()) {
      recommendations.push('Strengthen HIPAA compliance measures');
    }

    return recommendations;
  }

  private getActiveProtections(): string[] {
    const protections: string[] = [];

    if (window.location.protocol === 'https:') {
      protections.push('HTTPS Encryption');
    }

    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      protections.push('Content Security Policy');
    }

    if (this.checkSecurityHeaders().xFrameOptions) {
      protections.push('Clickjacking Protection');
    }

    if (this.calculateEncryptionCoverage() > 0) {
      protections.push('Data Encryption');
    }

    if (localStorage.getItem('audit-logs')) {
      protections.push('Audit Logging');
    }

    protections.push('Input Sanitization');
    protections.push('XSS Protection');
    protections.push('Real-time Threat Detection');

    return protections;
  }

  private groupThreatsByType(): Record<string, number> {
    return this.threatHistory.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupThreatsBySeverity(): Record<string, number> {
    return this.threatHistory.reduce((acc, threat) => {
      acc[threat.severity] = (acc[threat.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateSecurityTrend(): AdvancedSecurityReport['securityTrend'] {
    const history = JSON.parse(localStorage.getItem('security-metrics-history') || '[]');
    if (history.length < 3) {
      return { direction: 'stable', confidence: 0, factors: [] };
    }

    const recent = history.slice(-5);
    const scores = recent.map((h: any) => h.overallScore);
    const trend = scores[scores.length - 1] - scores[0];

    const factors: string[] = [];
    if (trend > 10) factors.push('Reduced threat activity');
    if (trend > 5) factors.push('Improved security controls');
    if (trend < -10) factors.push('Increased threat activity');
    if (trend < -5) factors.push('New vulnerabilities detected');

    return {
      direction: trend > 5 ? 'improving' : trend < -5 ? 'declining' : 'stable',
      confidence: Math.min(100, recent.length * 20),
      factors
    };
  }

  private calculateThreatLevel(threats: SecurityThreat[]): string {
    const criticalThreats = threats.filter(t => t.severity === 'critical').length;
    const highThreats = threats.filter(t => t.severity === 'high').length;

    if (criticalThreats > 0) return 'critical';
    if (highThreats > 2) return 'high';
    if (threats.length > 5) return 'medium';
    return 'low';
  }

  private async scanForVulnerabilities(): Promise<SecurityVulnerability[]> {
    // This would integrate with the advancedSecurityScanner
    return this.vulnerabilities;
  }

  private assessCompliance(): any {
    return {
      hipaa: this.checkHIPAACompliance(),
      hitech: this.checkHITECHCompliance(),
      encryption: this.calculateEncryptionCoverage(),
      auditTrail: !!localStorage.getItem('audit-logs')
    };
  }

  public getSecurityMetrics(): SecurityMetrics {
    return this.calculateSecurityMetrics();
  }

  public getThreatHistory(): SecurityThreat[] {
    return this.threatHistory;
  }

  public cleanup(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

export const securityManager = new SecurityManager();

// Security utilities for other components
export const securityUtils = securityManager;

// Auto-start security monitoring in production
if (import.meta.env.PROD) {
  securityManager;
}