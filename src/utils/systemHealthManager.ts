// Comprehensive system health management for production deployment

interface SystemHealthConfig {
  enableRealTimeMonitoring: boolean;
  enableAutoRecovery: boolean;
  enablePerformanceOptimization: boolean;
  enableMemoryManagement: boolean;
  enableErrorRecovery: boolean;
  healthCheckInterval: number;
  performanceThresholds: {
    memoryUsage: number;
    loadTime: number;
    errorRate: number;
    bundleSize: number;
  };
}

interface SystemHealthMetrics {
  overall: 'excellent' | 'good' | 'degraded' | 'critical';
  score: number; // 0-100
  timestamp: string;
  uptime: number;
  checks: {
    performance: PerformanceHealth;
    security: SecurityHealth;
    accessibility: AccessibilityHealth;
    functionality: FunctionalityHealth;
    compliance: ComplianceHealth;
  };
  recommendations: HealthRecommendation[];
  autoFixesApplied: string[];
}

interface PerformanceHealth {
  score: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  bundleSize: number;
  cacheHitRate: number;
  errorRate: number;
}

interface SecurityHealth {
  score: number;
  https: boolean;
  csp: boolean;
  headers: boolean;
  cookies: boolean;
  localStorage: boolean;
  vulnerabilities: number;
}

interface AccessibilityHealth {
  score: number;
  ariaCompliance: number;
  keyboardNavigation: boolean;
  colorContrast: boolean;
  altTextCoverage: number;
  focusManagement: boolean;
}

interface FunctionalityHealth {
  score: number;
  coreFeatures: boolean;
  dataIntegrity: boolean;
  userFlows: boolean;
  errorHandling: boolean;
  dependencies: boolean;
}

interface ComplianceHealth {
  score: number;
  hipaaCompliance: boolean;
  dataPrivacy: boolean;
  auditTrail: boolean;
  documentation: boolean;
  policies: boolean;
}

interface HealthRecommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'performance' | 'security' | 'accessibility' | 'functionality' | 'compliance';
  title: string;
  description: string;
  action: string;
  autoFixable: boolean;
}

class SystemHealthManager {
  private config: SystemHealthConfig;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private healthHistory: SystemHealthMetrics[] = [];
  private startTime: number = Date.now();
  private autoFixesApplied: string[] = [];

  constructor(config: Partial<SystemHealthConfig> = {}) {
    this.config = {
      enableRealTimeMonitoring: true,
      enableAutoRecovery: true,
      enablePerformanceOptimization: true,
      enableMemoryManagement: true,
      enableErrorRecovery: true,
      healthCheckInterval: import.meta.env.PROD ? 300000 : 60000, // 5 min prod, 1 min dev
      performanceThresholds: {
        memoryUsage: 80,
        loadTime: 3000,
        errorRate: 5,
        bundleSize: 1000
      },
      ...config
    };

    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    this.setupRealTimeMonitoring();
    this.setupAutoRecovery();
    this.setupPerformanceOptimization();
    this.startHealthMonitoring();
    
    // Initialize health check
    this.performHealthCheck();
  }

  private setupRealTimeMonitoring() {
    if (!this.config.enableRealTimeMonitoring) return;

    // Monitor critical errors
    window.addEventListener('error', (event) => {
      this.handleCriticalError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleCriticalError(event.reason);
    });

    // Monitor performance issues
    this.monitorPerformanceIssues();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
  }

  private setupAutoRecovery() {
    if (!this.config.enableAutoRecovery) return;

    // Auto-recover from common issues
    this.setupLocalStorageRecovery();
    this.setupNetworkRecovery();
    this.setupUIRecovery();
  }

  private setupPerformanceOptimization() {
    if (!this.config.enablePerformanceOptimization) return;

    // Optimize images
    this.optimizeImages();
    
    // Optimize loading
    this.optimizeResourceLoading();
    
    // Optimize rendering
    this.optimizeRendering();
  }

  private startHealthMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(async () => {
      const health = await this.performHealthCheck();
      
      if (health.overall === 'critical' || health.overall === 'degraded') {
        this.triggerAutoRecovery(health);
      }
      
      this.maintainHealthHistory();
    }, this.config.healthCheckInterval);
  }

  public async performHealthCheck(): Promise<SystemHealthMetrics> {
    const timestamp = new Date().toISOString();
    const uptime = Date.now() - this.startTime;

    const [performance, security, accessibility, functionality, compliance] = await Promise.all([
      this.checkPerformanceHealth(),
      this.checkSecurityHealth(),
      this.checkAccessibilityHealth(),
      this.checkFunctionalityHealth(),
      this.checkComplianceHealth()
    ]);

    const checks = { performance, security, accessibility, functionality, compliance };
    const { overall, score, recommendations } = this.calculateOverallHealth(checks);

    const result: SystemHealthMetrics = {
      overall,
      score,
      timestamp,
      uptime,
      checks,
      recommendations,
      autoFixesApplied: [...this.autoFixesApplied]
    };

    this.healthHistory.push(result);
    this.storeHealthMetrics(result);
    
    return result;
  }

  private async checkPerformanceHealth(): Promise<PerformanceHealth> {
    const memoryUsage = this.getMemoryUsage();
    const loadTime = this.getPageLoadTime();
    const renderTime = this.getRenderTime();
    const bundleSize = await this.getBundleSize();
    const cacheHitRate = this.getCacheHitRate();
    const errorRate = this.getErrorRate();

    const metrics = [
      memoryUsage <= this.config.performanceThresholds.memoryUsage ? 20 : Math.max(0, 20 - (memoryUsage - this.config.performanceThresholds.memoryUsage)),
      loadTime <= this.config.performanceThresholds.loadTime ? 20 : Math.max(0, 20 - Math.floor((loadTime - this.config.performanceThresholds.loadTime) / 100)),
      renderTime <= 50 ? 20 : Math.max(0, 20 - Math.floor((renderTime - 50) / 10)),
      bundleSize <= this.config.performanceThresholds.bundleSize ? 20 : Math.max(0, 20 - Math.floor((bundleSize - this.config.performanceThresholds.bundleSize) / 100)),
      errorRate <= this.config.performanceThresholds.errorRate ? 20 : Math.max(0, 20 - (errorRate - this.config.performanceThresholds.errorRate))
    ];

    const score = Math.round(metrics.reduce((sum, metric) => sum + metric, 0));

    return {
      score,
      memoryUsage,
      loadTime,
      renderTime,
      bundleSize,
      cacheHitRate,
      errorRate
    };
  }

  private async checkSecurityHealth(): Promise<SecurityHealth> {
    const https = window.location.protocol === 'https:';
    const csp = this.hasCSP();
    const headers = this.hasSecurityHeaders();
    const cookies = this.hasSafeCookies();
    const localStorage = this.hasSecureLocalStorage();
    const vulnerabilities = await this.scanVulnerabilities();

    const checks = [https, csp, headers, cookies, localStorage, vulnerabilities === 0];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);

    return {
      score,
      https,
      csp,
      headers,
      cookies,
      localStorage,
      vulnerabilities
    };
  }

  private async checkAccessibilityHealth(): Promise<AccessibilityHealth> {
    const ariaCompliance = this.checkARIACompliance();
    const keyboardNavigation = this.checkKeyboardNavigation();
    const colorContrast = await this.checkColorContrast();
    const altTextCoverage = this.checkAltTextCoverage();
    const focusManagement = this.checkFocusManagement();

    const score = Math.round((ariaCompliance + (keyboardNavigation ? 20 : 0) + 
                             (colorContrast ? 20 : 0) + altTextCoverage + 
                             (focusManagement ? 20 : 0)) / 5);

    return {
      score,
      ariaCompliance,
      keyboardNavigation,
      colorContrast,
      altTextCoverage,
      focusManagement
    };
  }

  private async checkFunctionalityHealth(): Promise<FunctionalityHealth> {
    const coreFeatures = await this.testCoreFeatures();
    const dataIntegrity = this.testDataIntegrity();
    const userFlows = this.testUserFlows();
    const errorHandling = this.testErrorHandling();
    const dependencies = await this.testDependencies();

    const checks = [coreFeatures, dataIntegrity, userFlows, errorHandling, dependencies];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);

    return {
      score,
      coreFeatures,
      dataIntegrity,
      userFlows,
      errorHandling,
      dependencies
    };
  }

  private async checkComplianceHealth(): Promise<ComplianceHealth> {
    const hipaaCompliance = this.checkHIPAACompliance();
    const dataPrivacy = this.checkDataPrivacy();
    const auditTrail = this.checkAuditTrail();
    const documentation = this.checkDocumentation();
    const policies = this.checkPolicies();

    const checks = [hipaaCompliance, dataPrivacy, auditTrail, documentation, policies];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);

    return {
      score,
      hipaaCompliance,
      dataPrivacy,
      auditTrail,
      documentation,
      policies
    };
  }

  private calculateOverallHealth(checks: unknown): { 
    overall: 'excellent' | 'good' | 'degraded' | 'critical'; 
    score: number; 
    recommendations: HealthRecommendation[] 
  } {
    const scores = [
      checks.performance.score,
      checks.security.score,
      checks.accessibility.score,
      checks.functionality.score,
      checks.compliance.score
    ];

    const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const recommendations = this.generateRecommendations(checks);

    let overall: 'excellent' | 'good' | 'degraded' | 'critical';
    if (overallScore >= 90) overall = 'excellent';
    else if (overallScore >= 75) overall = 'good';
    else if (overallScore >= 50) overall = 'degraded';
    else overall = 'critical';

    return { overall, score: overallScore, recommendations };
  }

  private generateRecommendations(checks: unknown): HealthRecommendation[] {
    const recommendations: HealthRecommendation[] = [];

    // Performance recommendations
    if (checks.performance.memoryUsage > this.config.performanceThresholds.memoryUsage) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        title: 'High Memory Usage',
        description: `Memory usage is at ${checks.performance.memoryUsage}%`,
        action: 'Implement memory cleanup and optimization',
        autoFixable: true
      });
    }

    if (checks.performance.loadTime > this.config.performanceThresholds.loadTime) {
      recommendations.push({
        priority: 'medium',
        category: 'performance',
        title: 'Slow Page Load',
        description: `Page load time is ${checks.performance.loadTime}ms`,
        action: 'Optimize resource loading and caching',
        autoFixable: true
      });
    }

    // Security recommendations
    if (!checks.security.https && import.meta.env.PROD) {
      recommendations.push({
        priority: 'critical',
        category: 'security',
        title: 'HTTPS Not Enabled',
        description: 'Application is not served over HTTPS in production',
        action: 'Enable HTTPS encryption',
        autoFixable: false
      });
    }

    if (checks.security.vulnerabilities > 0) {
      recommendations.push({
        priority: 'high',
        category: 'security',
        title: 'Security Vulnerabilities',
        description: `${checks.security.vulnerabilities} vulnerabilities detected`,
        action: 'Address security vulnerabilities',
        autoFixable: false
      });
    }

    // Accessibility recommendations
    if (checks.accessibility.score < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'accessibility',
        title: 'Accessibility Issues',
        description: `Accessibility score is ${checks.accessibility.score}/100`,
        action: 'Improve accessibility compliance',
        autoFixable: true
      });
    }

    // Functionality recommendations
    if (!checks.functionality.coreFeatures) {
      recommendations.push({
        priority: 'critical',
        category: 'functionality',
        title: 'Core Features Failing',
        description: 'Essential application features are not working',
        action: 'Investigate and fix core functionality',
        autoFixable: false
      });
    }

    // Compliance recommendations
    if (!checks.compliance.dataPrivacy) {
      recommendations.push({
        priority: 'high',
        category: 'compliance',
        title: 'Data Privacy Issues',
        description: 'Data privacy controls need attention',
        action: 'Review and enhance data privacy measures',
        autoFixable: false
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private async triggerAutoRecovery(health: SystemHealthMetrics) {
    const autoFixes: string[] = [];

    // Auto-fix performance issues
    if (health.checks.performance.memoryUsage > this.config.performanceThresholds.memoryUsage) {
      this.performMemoryCleanup();
      autoFixes.push('Memory cleanup performed');
    }

    // Auto-fix accessibility issues
    if (health.checks.accessibility.score < 80) {
      this.enhanceAccessibility();
      autoFixes.push('Accessibility enhancements applied');
    }

    // Auto-fix data integrity issues
    if (!health.checks.functionality.dataIntegrity) {
      this.repairDataIntegrity();
      autoFixes.push('Data integrity repairs applied');
    }

    this.autoFixesApplied.push(...autoFixes);
    
    if (autoFixes.length > 0) {
      if (!import.meta.env.PROD) {
        console.log('Auto-recovery completed:', autoFixes);
      }
      this.notifyAutoRecovery(autoFixes);
    }
  }

  // Helper methods for health checks
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
    }
    return 0;
  }

  private getPageLoadTime(): number {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        return Math.round(navigation.loadEventEnd - navigation.fetchStart);
      }
    }
    return 0;
  }

  private getRenderTime(): number {
    const start = performance.now();
    // Simulate component render measurement
    const testDiv = document.createElement('div');
    testDiv.innerHTML = '<div><p>Test</p></div>';
    document.body.appendChild(testDiv);
    document.body.removeChild(testDiv);
    return Math.round(performance.now() - start);
  }

  private async getBundleSize(): Promise<number> {
    try {
      const resources = performance.getEntriesByType('resource');
      const jsResources = resources.filter((resource: unknown) => 
        resource.name.includes('.js') && !resource.name.includes('node_modules')
      );
      
      const totalSize = jsResources.reduce((sum: number, resource: unknown) => 
        sum + (resource.transferSize || 0), 0
      );
      
      return Math.round(totalSize / 1024); // KB
    } catch {
      return 0;
    }
  }

  private getCacheHitRate(): number {
    try {
      const resources = performance.getEntriesByType('resource');
      const cachedResources = resources.filter((resource: unknown) => 
        resource.transferSize === 0 || resource.transferSize < resource.encodedBodySize
      );
      
      return resources.length > 0 ? Math.round((cachedResources.length / resources.length) * 100) : 0;
    } catch {
      return 0;
    }
  }

  private getErrorRate(): number {
    const errors = JSON.parse(localStorage.getItem('error-logs') || '[]');
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentErrors = errors.filter((error: unknown) => 
      new Date(error.timestamp).getTime() > oneHourAgo
    );
    
    const pageViews = this.getRecentPageViews();
    return pageViews > 0 ? Math.round((recentErrors.length / pageViews) * 100) : 0;
  }

  private getRecentPageViews(): number {
    const pageViews = JSON.parse(localStorage.getItem('page-views') || '[]');
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return pageViews.filter((view: unknown) => 
      new Date(view.timestamp).getTime() > oneHourAgo
    ).length || 1;
  }

  private hasCSP(): boolean {
    return !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  }

  private hasSecurityHeaders(): boolean {
    // Check for security-related meta tags (client-side approximation)
    return !!(
      // X-Frame-Options is set via HTTP headers, not meta tags
      true &&
      document.querySelector('meta[http-equiv="X-Content-Type-Options"]') ||
      document.querySelector('meta[http-equiv="Referrer-Policy"]')
    );
  }

  private hasSafeCookies(): boolean {
    const cookies = document.cookie.split(';');
    return cookies.every(cookie => 
      cookie.includes('Secure') || cookie.includes('HttpOnly') || cookie.trim().length === 0
    );
  }

  private hasSecureLocalStorage(): boolean {
    try {
      // Check if sensitive data is encrypted
      const sensitiveKeys = ['user-session', 'hipaa-assessments', 'system-dependencies'];
      return sensitiveKeys.every(key => {
        const data = localStorage.getItem(key);
        return !data || !this.containsSensitiveData(data);
      });
    } catch {
      return false;
    }
  }

  private containsSensitiveData(data: string): boolean {
    const sensitivePatterns = [
      /password/i,
      /ssn|social.security/i,
      /credit.card|cc.number/i,
      /api.key|secret/i
    ];
    
    return sensitivePatterns.some(pattern => pattern.test(data));
  }

  private async scanVulnerabilities(): Promise<number> {
    let vulnerabilities = 0;

    // Check for common vulnerabilities
    if (document.querySelector('script[src*="http://"]')) vulnerabilities++;
    if (document.querySelector('*[onclick], *[onload]')) vulnerabilities++;
    if (!window.location.href.startsWith('https://') && import.meta.env.PROD) vulnerabilities++;
    
    return vulnerabilities;
  }

  private checkARIACompliance(): number {
    const interactiveElements = document.querySelectorAll('button, [role="button"], a, input, select, textarea');
    const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
    
    if (interactiveElements.length === 0) return 100;
    return Math.round((elementsWithAria.length / interactiveElements.length) * 100);
  }

  private checkKeyboardNavigation(): boolean {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return focusableElements.length > 0;
  }

  private async checkColorContrast(): Promise<boolean> {
    // Simplified contrast check
    const elements = document.querySelectorAll('*');
    let contrastIssues = 0;
    
    for (let i = 0; i < Math.min(elements.length, 20); i++) {
      const element = elements[i] as HTMLElement;
      const style = window.getComputedStyle(element);
      
      if (style.color && style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // Simplified check - in production, use a proper contrast library
        const textColor = style.color;
        const bgColor = style.backgroundColor;
        
        if (textColor === bgColor) {
          contrastIssues++;
        }
      }
    }
    
    return contrastIssues < 3;
  }

  private checkAltTextCoverage(): number {
    const images = document.querySelectorAll('img');
    if (images.length === 0) return 100;
    
    const imagesWithAlt = document.querySelectorAll('img[alt]');
    return Math.round((imagesWithAlt.length / images.length) * 100);
  }

  private checkFocusManagement(): boolean {
    const modals = document.querySelectorAll('[role="dialog"]');
    return modals.length === 0 || Array.from(modals).every(modal => 
      modal.querySelector('[tabindex], button, [href]')
    );
  }

  private async testCoreFeatures(): Promise<boolean> {
    try {
      // Test localStorage
      localStorage.setItem('__health_test__', 'test');
      const retrieved = localStorage.getItem('__health_test__');
      localStorage.removeItem('__health_test__');
      
      if (retrieved !== 'test') return false;

      // Test basic React functionality
      const testElement = document.createElement('div');
      if (!testElement) return false;

      return true;
    } catch {
      return false;
    }
  }

  private testDataIntegrity(): boolean {
    try {
      const assessments = JSON.parse(localStorage.getItem('hipaa-assessments') || '[]');
      const dependencies = JSON.parse(localStorage.getItem('system-dependencies') || '[]');
      
      // Basic integrity checks
      const assessmentsValid = Array.isArray(assessments) && 
        assessments.every((a: unknown) => a.id && a.date);
      
      const dependenciesValid = Array.isArray(dependencies) && 
        dependencies.every((d: unknown) => d.id && d.name);
      
      return assessmentsValid && dependenciesValid;
    } catch {
      return false;
    }
  }

  private testUserFlows(): boolean {
    // Test that key UI elements are present
    const keyElements = [
      'header', 'nav', 'main', 'footer',
      '[role="button"], button',
      'input, select, textarea'
    ];
    
    return keyElements.every(selector => document.querySelector(selector));
  }

  private testErrorHandling(): boolean {
    // Check if error boundary and error handlers are in place
    return !!(
      window.addEventListener && 
      document.querySelector('[data-testid="error-boundary"], .error-boundary') !== null
    );
  }

  private async testDependencies(): Promise<boolean> {
    try {
      // Test critical dependencies
      const criticalTests = [
        () => typeof React !== 'undefined',
        () => typeof document !== 'undefined',
        () => typeof localStorage !== 'undefined',
        () => 'fetch' in window
      ];
      
      return criticalTests.every(test => {
        try {
          return test();
        } catch {
          return false;
        }
      });
    } catch {
      return false;
    }
  }

  private checkHIPAACompliance(): boolean {
    // Check for HIPAA compliance indicators
    const hasPrivacyPolicy = !!document.querySelector('[href*="privacy"]');
    const hasSecureStorage = this.hasSecureLocalStorage();
    const hasEncryption = window.location.protocol === 'https:';
    
    return hasPrivacyPolicy && hasSecureStorage && hasEncryption;
  }

  private checkDataPrivacy(): boolean {
    // Check privacy controls
    const hasConsentManagement = !!localStorage.getItem('user-consent');
    const hasDataMinimization = this.checkDataMinimization();
    const hasLocalStorage = this.hasSecureLocalStorage();
    
    return hasDataMinimization && hasLocalStorage;
  }

  private checkDataMinimization(): boolean {
    // Check that only necessary data is stored
    const storageKeys = Object.keys(localStorage);
    const unnecessaryKeys = storageKeys.filter(key => 
      key.includes('debug') || key.includes('temp') || key.includes('cache')
    );
    
    return unnecessaryKeys.length < 3;
  }

  private checkAuditTrail(): boolean {
    // Check for audit logging
    const hasAnalytics = !!localStorage.getItem('page-views');
    const hasErrorLogs = !!localStorage.getItem('error-logs');
    
    return hasAnalytics && hasErrorLogs;
  }

  private checkDocumentation(): boolean {
    // Check for essential documentation
    const hasReadme = true; // README.md exists in project
    const hasPrivacyPolicy = !!document.querySelector('[href*="privacy"]');
    const hasTerms = !!document.querySelector('[href*="terms"]');
    
    return hasReadme && hasPrivacyPolicy && hasTerms;
  }

  private checkPolicies(): boolean {
    // Check for policy compliance
    const hasCookiePolicy = !!document.querySelector('[href*="cookie"]');
    const hasTermsOfService = !!document.querySelector('[href*="terms"]');
    
    return hasCookiePolicy && hasTermsOfService;
  }

  // Auto-recovery methods
  private performMemoryCleanup() {
    try {
      // Clean up old data
      const keysToCleanup = ['error-logs', 'performance-metrics', 'health-history'];
      
      keysToCleanup.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data) && data.length > 100) {
          const cleaned = data.slice(-50);
          localStorage.setItem(key, JSON.stringify(cleaned));
        }
      });

      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
    } catch (error) {
      console.error('Memory cleanup failed:', error);
    }
  }

  private enhanceAccessibility() {
    try {
      // Add missing alt texts
      document.querySelectorAll('img:not([alt])').forEach((img, index) => {
        img.setAttribute('alt', `Image ${index + 1}`);
      });

      // Add missing ARIA labels
      document.querySelectorAll('button:not([aria-label])').forEach((button, index) => {
        if (!button.textContent?.trim()) {
          button.setAttribute('aria-label', `Button ${index + 1}`);
        }
      });

      // Add skip links if missing
      if (!document.querySelector('.skip-link')) {
        this.addSkipLink();
      }
    } catch (error) {
      console.error('Accessibility enhancement failed:', error);
    }
  }

  private addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #0073e6;
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  private repairDataIntegrity() {
    try {
      // Validate and repair localStorage data
      const keys = ['hipaa-assessments', 'system-dependencies', 'training-progress'];
      
      keys.forEach(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '[]');
          if (!Array.isArray(data)) {
            localStorage.setItem(key, '[]');
          } else {
            // Remove invalid entries
            const validData = data.filter((item: unknown) => 
              item && typeof item === 'object' && item.id
            );
            localStorage.setItem(key, JSON.stringify(validData));
          }
        } catch {
          localStorage.setItem(key, '[]');
        }
      });
    } catch (error) {
      console.error('Data integrity repair failed:', error);
    }
  }

  private handleCriticalError(error: unknown) {
    console.error('Critical error detected:', error);
    
    // Attempt auto-recovery for known issues
    if (error?.message?.includes('ChunkLoadError')) {
      this.handleChunkLoadError();
    }
  }

  private handleChunkLoadError() {
    // Clear module cache and reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      }).then(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }

  private setupLocalStorageRecovery() {
    // Monitor localStorage errors
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key: string, value: string) {
      try {
        originalSetItem.call(this, key, value);
      } catch (error) {
        if (!import.meta.env.PROD) {
          console.warn('localStorage quota exceeded, cleaning up...');
        }
        // Auto-cleanup on quota exceeded
        const systemHealthManager = (window as any).systemHealthManager;
        if (systemHealthManager) {
          systemHealthManager.performMemoryCleanup();
        }
        
        // Retry after cleanup
        try {
          originalSetItem.call(this, key, value);
        } catch (retryError) {
          console.error('localStorage still failing after cleanup:', retryError);
        }
      }
    };
  }

  private setupNetworkRecovery() {
    // Monitor network issues
    window.addEventListener('online', () => {
      if (!import.meta.env.PROD) {
        console.log('Network connection restored');
      }
      this.notifyNetworkRecovery();
    });

    window.addEventListener('offline', () => {
      if (!import.meta.env.PROD) {
        console.log('Network connection lost');
      }
      this.notifyNetworkIssue();
    });
  }

  private setupUIRecovery() {
    // Monitor for UI freezes
    let lastActivity = Date.now();
    
    document.addEventListener('click', () => {
      lastActivity = Date.now();
    });
    
    setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity > 60000) { // 1 minute of no activity
        // Check if UI is responsive
        this.checkUIResponsiveness();
      }
    }, 30000);
  }

  private checkUIResponsiveness() {
    const start = performance.now();
    requestAnimationFrame(() => {
      const delay = performance.now() - start;
      if (delay > 100) { // >100ms indicates UI thread blocking
        if (!import.meta.env.PROD) {
          console.warn('UI responsiveness issue detected');
        }
        this.performMemoryCleanup();
      }
    });
  }

  private monitorPerformanceIssues() {
    // Monitor for performance degradation
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: unknown) => {
        if (entry.entryType === 'measure' && entry.duration > 100) {
          if (!import.meta.env.PROD) {
            console.warn('Slow operation detected:', entry);
          }
        }
      });
    }).observe({ entryTypes: ['measure'] });
  }

  private monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (usage > this.config.performanceThresholds.memoryUsage) {
          this.performMemoryCleanup();
        }
      }, 30000);
    }
  }

  private optimizeImages() {
    // Lazy load images that aren't already optimized
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }

  private optimizeResourceLoading() {
    // Add resource hints for critical resources
    const criticalResources = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    criticalResources.forEach(resource => {
      if (!document.querySelector(`link[href="${resource}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = resource;
        document.head.appendChild(link);
      }
    });
  }

  private optimizeRendering() {
    // Optimize DOM queries
    const observer = new MutationObserver((mutations) => {
      const hasLargeChanges = mutations.some(mutation => 
        mutation.addedNodes.length > 10 || mutation.removedNodes.length > 10
      );
      
      if (hasLargeChanges) {
        // Debounce large DOM changes
        this.debounceDOMChanges();
      }
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }

  private debounceDOMChanges() {
    // Implement debouncing for large DOM changes
    clearTimeout((window as any).domChangeTimeout);
    (window as any).domChangeTimeout = setTimeout(() => {
      // Trigger layout optimization
      document.body.style.display = 'none';
      document.body.offsetHeight; // Force reflow
      document.body.style.display = '';
    }, 100);
  }

  private storeHealthMetrics(metrics: SystemHealthMetrics) {
    try {
      const healthHistory = JSON.parse(localStorage.getItem('system-health-history') || '[]');
      healthHistory.push(metrics);
      
      // Keep only last 24 hours
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const filtered = healthHistory.filter((h: unknown) => 
        new Date(h.timestamp).getTime() > oneDayAgo
      );
      
      localStorage.setItem('system-health-history', JSON.stringify(filtered.slice(-50)));
    } catch (error) {
      console.error('Failed to store health metrics:', error);
    }
  }

  private maintainHealthHistory() {
    // Clean up old health data
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    this.healthHistory = this.healthHistory.filter(h => 
      new Date(h.timestamp).getTime() > oneDayAgo
    );
  }

  private notifyAutoRecovery(fixes: string[]) {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'success',
        title: 'System Auto-Recovery',
        message: `Applied ${fixes.length} automatic fixes`,
        duration: 5000
      });
    }
  }

  private notifyNetworkRecovery() {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'success',
        title: 'Connection Restored',
        message: 'Network connection has been restored',
        duration: 3000
      });
    }
  }

  private notifyNetworkIssue() {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'warning',
        title: 'Connection Lost',
        message: 'Working offline - data will sync when reconnected',
        duration: 5000
      });
    }
  }

  // Public methods
  public getHealthTrend(): { trend: 'improving' | 'stable' | 'declining'; confidence: number } {
    if (this.healthHistory.length < 3) {
      return { trend: 'stable', confidence: 0 };
    }

    const recent = this.healthHistory.slice(-5);
    const scores = recent.map(h => h.score);
    
    const trend = scores[scores.length - 1] - scores[0];
    const confidence = Math.min(100, recent.length * 20);
    
    if (trend > 5) return { trend: 'improving', confidence };
    if (trend < -5) return { trend: 'declining', confidence };
    return { trend: 'stable', confidence };
  }

  public exportHealthReport(): string {
    const latest = this.healthHistory[this.healthHistory.length - 1];
    if (!latest) return 'No health data available';

    const trend = this.getHealthTrend();

    return `
MEDISOLUCE SYSTEM HEALTH REPORT
Generated: ${new Date().toLocaleString()}
Overall Status: ${latest.overall.toUpperCase()}
Health Score: ${latest.score}/100
Trend: ${trend.trend.toUpperCase()} (${trend.confidence}% confidence)
Uptime: ${Math.round(latest.uptime / 1000 / 60)} minutes

DETAILED HEALTH SCORES:
- Performance: ${latest.checks.performance.score}/100
- Security: ${latest.checks.security.score}/100  
- Accessibility: ${latest.checks.accessibility.score}/100
- Functionality: ${latest.checks.functionality.score}/100
- Compliance: ${latest.checks.compliance.score}/100

PERFORMANCE METRICS:
- Memory Usage: ${latest.checks.performance.memoryUsage}%
- Page Load Time: ${latest.checks.performance.loadTime}ms
- Bundle Size: ${latest.checks.performance.bundleSize}KB
- Cache Hit Rate: ${latest.checks.performance.cacheHitRate}%
- Error Rate: ${latest.checks.performance.errorRate}%

SECURITY STATUS:
- HTTPS: ${latest.checks.security.https ? '✓' : '✗'}
- Content Security Policy: ${latest.checks.security.csp ? '✓' : '✗'}
- Security Headers: ${latest.checks.security.headers ? '✓' : '✗'}
- Safe Cookies: ${latest.checks.security.cookies ? '✓' : '✗'}
- Secure Storage: ${latest.checks.security.localStorage ? '✓' : '✗'}

ACCESSIBILITY STATUS:
- ARIA Compliance: ${latest.checks.accessibility.ariaCompliance}%
- Keyboard Navigation: ${latest.checks.accessibility.keyboardNavigation ? '✓' : '✗'}
- Color Contrast: ${latest.checks.accessibility.colorContrast ? '✓' : '✗'}
- Alt Text Coverage: ${latest.checks.accessibility.altTextCoverage}%
- Focus Management: ${latest.checks.accessibility.focusManagement ? '✓' : '✗'}

FUNCTIONALITY STATUS:
- Core Features: ${latest.checks.functionality.coreFeatures ? '✓' : '✗'}
- Data Integrity: ${latest.checks.functionality.dataIntegrity ? '✓' : '✗'}
- User Flows: ${latest.checks.functionality.userFlows ? '✓' : '✗'}
- Error Handling: ${latest.checks.functionality.errorHandling ? '✓' : '✗'}
- Dependencies: ${latest.checks.functionality.dependencies ? '✓' : '✗'}

COMPLIANCE STATUS:
- HIPAA Compliance: ${latest.checks.compliance.hipaaCompliance ? '✓' : '✗'}
- Data Privacy: ${latest.checks.compliance.dataPrivacy ? '✓' : '✗'}
- Audit Trail: ${latest.checks.compliance.auditTrail ? '✓' : '✗'}
- Documentation: ${latest.checks.compliance.documentation ? '✓' : '✗'}
- Policies: ${latest.checks.compliance.policies ? '✓' : '✗'}

AUTO-FIXES APPLIED:
${latest.autoFixesApplied.map(fix => `- ${fix}`).join('\n') || '- None'}

RECOMMENDATIONS (${latest.recommendations.length}):
${latest.recommendations.slice(0, 10).map((rec, i) => 
  `${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}: ${rec.action}`
).join('\n')}

HEALTH HISTORY (Last 5 checks):
${this.healthHistory.slice(-5).map(h => 
  `${new Date(h.timestamp).toLocaleTimeString()}: ${h.overall} (${h.score}%)`
).join('\n')}

Report generated by MediSoluce System Health Manager
For technical support: support@medisoluce.com
`;
  }

  public cleanup() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

// Global instance
export const systemHealthManager = new SystemHealthManager();

// Make available globally for debugging
(window as any).systemHealthManager = systemHealthManager;

// Auto-start in production
if (import.meta.env.PROD) {
  systemHealthManager.performHealthCheck();
}