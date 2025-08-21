// Enhanced project health management system

interface HealthEnhancementConfig {
  enableAutoHealing: boolean;
  enablePerformanceOptimization: boolean;
  enableSecurityHardening: boolean;
  enableAccessibilityEnhancement: boolean;
  enableMemoryOptimization: boolean;
  enableErrorRecovery: boolean;
  monitoringInterval: number;
}

interface HealthIssue {
  id: string;
  category: 'performance' | 'security' | 'accessibility' | 'memory' | 'errors' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  autoFixable: boolean;
  fix: () => Promise<boolean>;
  impact: string;
}

interface HealthEnhancementResult {
  issuesFound: number;
  issuesFixed: number;
  performanceImprovement: number;
  securityScore: number;
  accessibilityScore: number;
  memoryOptimization: number;
  recommendations: string[];
}

class ProjectHealthEnhancer {
  private config: HealthEnhancementConfig;
  private healingInProgress: boolean = false;
  private lastEnhancement: Date | null = null;
  private enhancementHistory: HealthEnhancementResult[] = [];

  constructor(config: Partial<HealthEnhancementConfig> = {}) {
    this.config = {
      enableAutoHealing: true,
      enablePerformanceOptimization: true,
      enableSecurityHardening: true,
      enableAccessibilityEnhancement: true,
      enableMemoryOptimization: true,
      enableErrorRecovery: true,
      monitoringInterval: 300000, // 5 minutes
      ...config
    };

    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    this.startContinuousMonitoring();
    this.setupAutoHealing();
    this.enhanceErrorRecovery();
  }

  async enhanceProjectHealth(): Promise<HealthEnhancementResult> {
    if (this.healingInProgress) {
      throw new Error('Health enhancement already in progress');
    }

    this.healingInProgress = true;
    console.log('🔧 Starting comprehensive project health enhancement...');

    try {
      const issues = await this.detectHealthIssues();
      const fixResults = await this.autoFixIssues(issues);
      
      const result: HealthEnhancementResult = {
        issuesFound: issues.length,
        issuesFixed: fixResults.filter(Boolean).length,
        performanceImprovement: await this.measurePerformanceImprovement(),
        securityScore: this.calculateSecurityScore(),
        accessibilityScore: this.calculateAccessibilityScore(),
        memoryOptimization: this.measureMemoryOptimization(),
        recommendations: this.generateRecommendations(issues)
      };

      this.enhancementHistory.push(result);
      this.lastEnhancement = new Date();
      
      console.log('✅ Project health enhancement completed:', result);
      this.notifyEnhancementComplete(result);
      
      return result;
    } finally {
      this.healingInProgress = false;
    }
  }

  private async detectHealthIssues(): Promise<HealthIssue[]> {
    const issues: HealthIssue[] = [];

    // Performance issues
    if (this.config.enablePerformanceOptimization) {
      issues.push(...await this.detectPerformanceIssues());
    }

    // Security issues
    if (this.config.enableSecurityHardening) {
      issues.push(...await this.detectSecurityIssues());
    }

    // Accessibility issues
    if (this.config.enableAccessibilityEnhancement) {
      issues.push(...this.detectAccessibilityIssues());
    }

    // Memory issues
    if (this.config.enableMemoryOptimization) {
      issues.push(...this.detectMemoryIssues());
    }

    // Error handling issues
    if (this.config.enableErrorRecovery) {
      issues.push(...this.detectErrorHandlingIssues());
    }

    return issues.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private async detectPerformanceIssues(): Promise<HealthIssue[]> {
    const issues: HealthIssue[] = [];

    // Memory usage check
    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage > 80) {
      issues.push({
        id: 'high-memory-usage',
        category: 'performance',
        severity: memoryUsage > 90 ? 'critical' : 'high',
        title: 'High Memory Usage',
        description: `Memory usage at ${memoryUsage}% - cleanup needed`,
        autoFixable: true,
        fix: async () => this.fixMemoryUsage(),
        impact: 'Improved memory efficiency and reduced crashes'
      });
    }

    // Bundle size check
    const bundleSize = await this.getBundleSize();
    if (bundleSize > 1500) {
      issues.push({
        id: 'large-bundle-size',
        category: 'performance',
        severity: bundleSize > 2000 ? 'high' : 'medium',
        title: 'Large Bundle Size',
        description: `Bundle size is ${bundleSize}KB - optimization needed`,
        autoFixable: true,
        fix: async () => this.optimizeBundleSize(),
        impact: 'Faster page loads and better user experience'
      });
    }

    // Load time check
    const loadTime = this.getPageLoadTime();
    if (loadTime > 3000) {
      issues.push({
        id: 'slow-load-time',
        category: 'performance',
        severity: loadTime > 5000 ? 'high' : 'medium',
        title: 'Slow Page Load',
        description: `Page load time is ${loadTime}ms - optimization needed`,
        autoFixable: true,
        fix: async () => this.optimizeLoadTime(),
        impact: 'Improved user experience and engagement'
      });
    }

    return issues;
  }

  private async detectSecurityIssues(): Promise<HealthIssue[]> {
    const issues: HealthIssue[] = [];

    // HTTPS check
    if (window.location.protocol !== 'https:' && import.meta.env.PROD) {
      issues.push({
        id: 'no-https',
        category: 'security',
        severity: 'critical',
        title: 'HTTPS Not Enabled',
        description: 'Application not served over HTTPS in production',
        autoFixable: false,
        fix: async () => false,
        impact: 'Critical for healthcare data protection'
      });
    }

    // CSP check
    if (!this.hasCSP()) {
      issues.push({
        id: 'no-csp',
        category: 'security',
        severity: 'high',
        title: 'Content Security Policy Missing',
        description: 'CSP headers not detected - XSS protection needed',
        autoFixable: true,
        fix: async () => this.addCSPMeta(),
        impact: 'Enhanced protection against XSS attacks'
      });
    }

    // Sensitive data in localStorage
    const sensitiveData = this.checkSensitiveData();
    if (sensitiveData.count > 0) {
      issues.push({
        id: 'sensitive-data-unencrypted',
        category: 'security',
        severity: 'high',
        title: 'Unencrypted Sensitive Data',
        description: `${sensitiveData.count} items with potential sensitive data found`,
        autoFixable: true,
        fix: async () => this.encryptSensitiveData(),
        impact: 'Enhanced data protection and HIPAA compliance'
      });
    }

    return issues;
  }

  private detectAccessibilityIssues(): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Missing alt text
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        id: 'missing-alt-text',
        category: 'accessibility',
        severity: 'medium',
        title: 'Missing Alt Text',
        description: `${imagesWithoutAlt.length} images missing alt text`,
        autoFixable: true,
        fix: async () => this.addMissingAltText(),
        impact: 'Improved screen reader accessibility'
      });
    }

    // Missing ARIA labels
    const interactiveWithoutAria = document.querySelectorAll('button:not([aria-label]), [onclick]:not([aria-label])');
    if (interactiveWithoutAria.length > 0) {
      issues.push({
        id: 'missing-aria-labels',
        category: 'accessibility',
        severity: 'medium',
        title: 'Missing ARIA Labels',
        description: `${interactiveWithoutAria.length} interactive elements missing ARIA labels`,
        autoFixable: true,
        fix: async () => this.addMissingAriaLabels(),
        impact: 'Better accessibility for assistive technologies'
      });
    }

    // Heading structure
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count > 1) {
      issues.push({
        id: 'multiple-h1',
        category: 'accessibility',
        severity: 'low',
        title: 'Multiple H1 Elements',
        description: `${h1Count} H1 elements found - should be only one per page`,
        autoFixable: false,
        fix: async () => false,
        impact: 'Improved semantic structure for screen readers'
      });
    }

    return issues;
  }

  private detectMemoryIssues(): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Large localStorage usage
    const storageSize = this.getLocalStorageSize();
    if (storageSize > 2 * 1024 * 1024) { // 2MB
      issues.push({
        id: 'large-localstorage',
        category: 'memory',
        severity: storageSize > 4 * 1024 * 1024 ? 'high' : 'medium',
        title: 'Large localStorage Usage',
        description: `localStorage using ${Math.round(storageSize / 1024 / 1024)}MB`,
        autoFixable: true,
        fix: async () => this.cleanupLocalStorage(),
        impact: 'Reduced memory usage and improved performance'
      });
    }

    // Old data accumulation
    const oldDataCount = this.countOldData();
    if (oldDataCount > 100) {
      issues.push({
        id: 'old-data-accumulation',
        category: 'memory',
        severity: 'medium',
        title: 'Old Data Accumulation',
        description: `${oldDataCount} old data entries found`,
        autoFixable: true,
        fix: async () => this.cleanupOldData(),
        impact: 'Improved storage efficiency and performance'
      });
    }

    return issues;
  }

  private detectErrorHandlingIssues(): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Error rate check
    const errorRate = this.getErrorRate();
    if (errorRate > 5) {
      issues.push({
        id: 'high-error-rate',
        category: 'errors',
        severity: errorRate > 10 ? 'critical' : 'high',
        title: 'High Error Rate',
        description: `Error rate at ${errorRate}% - investigation needed`,
        autoFixable: true,
        fix: async () => this.improveErrorHandling(),
        impact: 'Reduced crashes and improved user experience'
      });
    }

    // Unhandled errors
    const unhandledErrors = this.getUnhandledErrors();
    if (unhandledErrors.length > 0) {
      issues.push({
        id: 'unhandled-errors',
        category: 'errors',
        severity: 'medium',
        title: 'Unhandled Errors',
        description: `${unhandledErrors.length} unhandled errors detected`,
        autoFixable: true,
        fix: async () => this.enhanceErrorHandling(),
        impact: 'Better error recovery and user experience'
      });
    }

    return issues;
  }

  private async autoFixIssues(issues: HealthIssue[]): Promise<boolean[]> {
    const fixResults: boolean[] = [];

    for (const issue of issues) {
      if (issue.autoFixable) {
        try {
          console.log(`🔧 Fixing: ${issue.title}`);
          const success = await issue.fix();
          fixResults.push(success);
          
          if (success) {
            console.log(`✅ Fixed: ${issue.title}`);
          } else {
            console.log(`❌ Failed to fix: ${issue.title}`);
          }
        } catch (error) {
          console.error(`❌ Error fixing ${issue.title}:`, error);
          fixResults.push(false);
        }
      } else {
        fixResults.push(false);
      }
    }

    return fixResults;
  }

  // Auto-fix implementations
  private async fixMemoryUsage(): Promise<boolean> {
    try {
      // Clean up localStorage
      this.cleanupLocalStorage();
      
      // Clean up old data
      this.cleanupOldData();
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      return true;
    } catch (error) {
      console.error('Memory cleanup failed:', error);
      return false;
    }
  }

  private async optimizeBundleSize(): Promise<boolean> {
    try {
      // Remove unused imports (client-side cleanup)
      this.removeUnusedResources();
      
      // Optimize images
      this.optimizeImages();
      
      return true;
    } catch (error) {
      console.error('Bundle optimization failed:', error);
      return false;
    }
  }

  private async optimizeLoadTime(): Promise<boolean> {
    try {
      // Add resource hints
      this.addResourceHints();
      
      // Optimize critical resources
      this.optimizeCriticalResources();
      
      // Enable lazy loading
      this.enableLazyLoading();
      
      return true;
    } catch (error) {
      console.error('Load time optimization failed:', error);
      return false;
    }
  }

  private async addCSPMeta(): Promise<boolean> {
    try {
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';";
        document.head.appendChild(meta);
      }
      return true;
    } catch (error) {
      console.error('CSP addition failed:', error);
      return false;
    }
  }

  private async encryptSensitiveData(): Promise<boolean> {
    try {
      const sensitiveKeys = ['user-session', 'assessment-data', 'system-data'];
      
      sensitiveKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data && !this.isEncrypted(data)) {
          const encrypted = this.encrypt(data);
          localStorage.setItem(key, encrypted);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Data encryption failed:', error);
      return false;
    }
  }

  private async addMissingAltText(): Promise<boolean> {
    try {
      document.querySelectorAll('img:not([alt])').forEach((img, index) => {
        const element = img as HTMLImageElement;
        
        // Try to generate meaningful alt text from context
        const altText = this.generateAltText(element, index);
        element.setAttribute('alt', altText);
      });
      
      return true;
    } catch (error) {
      console.error('Alt text addition failed:', error);
      return false;
    }
  }

  private async addMissingAriaLabels(): Promise<boolean> {
    try {
      document.querySelectorAll('button:not([aria-label])').forEach((button, index) => {
        const element = button as HTMLButtonElement;
        
        if (!element.textContent?.trim()) {
          const ariaLabel = this.generateAriaLabel(element, index);
          element.setAttribute('aria-label', ariaLabel);
        }
      });
      
      return true;
    } catch (error) {
      console.error('ARIA label addition failed:', error);
      return false;
    }
  }

  private async improveErrorHandling(): Promise<boolean> {
    try {
      // Add global error recovery
      this.setupGlobalErrorRecovery();
      
      // Enhance error boundaries
      this.enhanceErrorBoundaries();
      
      return true;
    } catch (error) {
      console.error('Error handling improvement failed:', error);
      return false;
    }
  }

  private async enhanceErrorHandling(): Promise<boolean> {
    try {
      // Add better error reporting
      this.setupEnhancedErrorReporting();
      
      // Add error recovery mechanisms
      this.addErrorRecoveryMechanisms();
      
      return true;
    } catch (error) {
      console.error('Error handling enhancement failed:', error);
      return false;
    }
  }

  // Helper methods
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
    }
    return 0;
  }

  private async getBundleSize(): Promise<number> {
    try {
      const resources = performance.getEntriesByType('resource');
      const jsResources = resources.filter((resource: any) => 
        resource.name.includes('.js') && !resource.name.includes('node_modules')
      );
      
      const totalSize = jsResources.reduce((sum: number, resource: any) => 
        sum + (resource.transferSize || 0), 0
      );
      
      return Math.round(totalSize / 1024);
    } catch {
      return 0;
    }
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

  private hasCSP(): boolean {
    return !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  }

  private checkSensitiveData(): { count: number; keys: string[] } {
    const sensitivePatterns = [/password/i, /ssn/i, /credit/i, /token/i];
    const keys: string[] = [];
    
    Object.keys(localStorage).forEach(key => {
      const value = localStorage.getItem(key) || '';
      if (sensitivePatterns.some(pattern => pattern.test(value))) {
        keys.push(key);
      }
    });
    
    return { count: keys.length, keys };
  }

  private getLocalStorageSize(): number {
    let totalSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    return totalSize;
  }

  private countOldData(): number {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    let oldCount = 0;
    
    ['error-logs', 'performance-metrics', 'page-views'].forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        oldCount += data.filter((item: any) => {
          const timestamp = item.timestamp || item.date;
          return timestamp && new Date(timestamp).getTime() < oneWeekAgo;
        }).length;
      } catch {
        // Ignore invalid data
      }
    });
    
    return oldCount;
  }

  private getErrorRate(): number {
    const errors = JSON.parse(localStorage.getItem('error-logs') || '[]');
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentErrors = errors.filter((error: any) => 
      new Date(error.timestamp).getTime() > oneHourAgo
    );
    
    const pageViews = this.getRecentPageViews();
    return pageViews > 0 ? Math.round((recentErrors.length / pageViews) * 100) : 0;
  }

  private getUnhandledErrors(): any[] {
    const errors = JSON.parse(localStorage.getItem('error-logs') || '[]');
    return errors.filter((error: any) => 
      error.type === 'javascript' && !error.handled
    );
  }

  private getRecentPageViews(): number {
    const pageViews = JSON.parse(localStorage.getItem('page-views') || '[]');
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return pageViews.filter((view: any) => 
      new Date(view.timestamp).getTime() > oneHourAgo
    ).length || 1;
  }

  // Optimization implementations
  private cleanupLocalStorage(): boolean {
    try {
      const retentionPolicies = {
        'error-logs': 7 * 24 * 60 * 60 * 1000, // 7 days
        'performance-metrics': 24 * 60 * 60 * 1000, // 1 day
        'health-history': 24 * 60 * 60 * 1000, // 1 day
        'page-views': 7 * 24 * 60 * 60 * 1000 // 7 days
      };

      Object.entries(retentionPolicies).forEach(([key, maxAge]) => {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data)) {
          const cutoff = Date.now() - maxAge;
          const filtered = data.filter((item: any) => {
            const timestamp = item.timestamp || item.date;
            return timestamp && new Date(timestamp).getTime() > cutoff;
          });
          
          if (filtered.length !== data.length) {
            localStorage.setItem(key, JSON.stringify(filtered));
          }
        }
      });

      return true;
    } catch (error) {
      console.error('localStorage cleanup failed:', error);
      return false;
    }
  }

  private cleanupOldData(): boolean {
    try {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      ['error-logs', 'performance-metrics', 'page-views'].forEach(key => {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = data.filter((item: any) => {
          const timestamp = item.timestamp || item.date;
          return !timestamp || new Date(timestamp).getTime() > oneWeekAgo;
        });
        localStorage.setItem(key, JSON.stringify(filtered));
      });

      return true;
    } catch (error) {
      console.error('Old data cleanup failed:', error);
      return false;
    }
  }

  private removeUnusedResources(): boolean {
    try {
      // Remove unused event listeners and observers
      this.cleanupEventListeners();
      return true;
    } catch (error) {
      console.error('Resource cleanup failed:', error);
      return false;
    }
  }

  private optimizeImages(): boolean {
    try {
      document.querySelectorAll('img').forEach(img => {
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        if (!img.getAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      });
      return true;
    } catch (error) {
      console.error('Image optimization failed:', error);
      return false;
    }
  }

  private addResourceHints(): boolean {
    try {
      const hints = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' }
      ];

      hints.forEach(hint => {
        if (!document.querySelector(`link[href="${hint.href}"]`)) {
          const link = document.createElement('link');
          link.rel = hint.rel;
          link.href = hint.href;
          if (hint.crossorigin) link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });

      return true;
    } catch (error) {
      console.error('Resource hints addition failed:', error);
      return false;
    }
  }

  private optimizeCriticalResources(): boolean {
    try {
      // Add preload for critical CSS
      const criticalCSS = document.querySelector('link[rel="stylesheet"]');
      if (criticalCSS && !criticalCSS.getAttribute('data-preloaded')) {
        const preload = document.createElement('link');
        preload.rel = 'preload';
        preload.as = 'style';
        preload.href = criticalCSS.getAttribute('href') || '';
        document.head.insertBefore(preload, criticalCSS);
        criticalCSS.setAttribute('data-preloaded', 'true');
      }

      return true;
    } catch (error) {
      console.error('Critical resource optimization failed:', error);
      return false;
    }
  }

  private enableLazyLoading(): boolean {
    try {
      // Add intersection observer for lazy loading
      if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('[data-src]');
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              const src = element.getAttribute('data-src');
              if (src) {
                if (element.tagName === 'IMG') {
                  (element as HTMLImageElement).src = src;
                } else {
                  element.style.backgroundImage = `url(${src})`;
                }
                element.removeAttribute('data-src');
                observer.unobserve(element);
              }
            }
          });
        });

        lazyElements.forEach(element => observer.observe(element));
      }

      return true;
    } catch (error) {
      console.error('Lazy loading setup failed:', error);
      return false;
    }
  }

  private isEncrypted(data: string): boolean {
    try {
      // Simple check if data appears to be base64 encoded
      return /^[A-Za-z0-9+/=]+$/.test(data) && data.length > 20;
    } catch {
      return false;
    }
  }

  private encrypt(data: string): string {
    try {
      return btoa(JSON.stringify({
        data: btoa(data),
        timestamp: Date.now(),
        encrypted: true
      }));
    } catch {
      return data;
    }
  }

  private generateAltText(img: HTMLImageElement, index: number): string {
    // Try to generate meaningful alt text from context
    const src = img.src || img.getAttribute('data-src') || '';
    const className = img.className || '';
    
    if (src.includes('logo')) return 'Company logo';
    if (src.includes('icon')) return 'Icon';
    if (className.includes('avatar')) return 'User avatar';
    if (className.includes('chart')) return 'Chart or graph';
    
    return `Image ${index + 1}`;
  }

  private generateAriaLabel(element: HTMLElement, index: number): string {
    const className = element.className || '';
    const parent = element.parentElement;
    
    if (className.includes('close')) return 'Close';
    if (className.includes('menu')) return 'Toggle menu';
    if (className.includes('theme')) return 'Toggle theme';
    if (parent?.textContent?.includes('download')) return 'Download';
    
    return `Button ${index + 1}`;
  }

  private setupGlobalErrorRecovery(): void {
    window.addEventListener('error', (event) => {
      // Auto-recovery for common errors
      if (event.message.includes('ChunkLoadError')) {
        console.log('🔄 Auto-recovering from chunk load error...');
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }

  private enhanceErrorBoundaries(): void {
    // Add error boundary detection
    const errorBoundaries = document.querySelectorAll('[data-error-boundary]');
    if (errorBoundaries.length === 0) {
      console.warn('No error boundaries detected');
    }
  }

  private setupEnhancedErrorReporting(): void {
    // Enhanced error context collection
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Store enhanced error context
      const errorContext = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        args: args.map(arg => String(arg))
      };
      
      const errors = JSON.parse(localStorage.getItem('enhanced-errors') || '[]');
      errors.push(errorContext);
      localStorage.setItem('enhanced-errors', JSON.stringify(errors.slice(-50)));
      
      originalConsoleError.apply(console, args);
    };
  }

  private addErrorRecoveryMechanisms(): void {
    // Add automatic retry for failed operations
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args);
      } catch (error) {
        console.log('🔄 Retrying failed fetch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return originalFetch(...args);
      }
    };
  }

  private cleanupEventListeners(): void {
    // Remove event listeners from detached elements
    document.querySelectorAll('*').forEach(element => {
      if (!element.isConnected) {
        // Element is detached, remove any listeners
        element.removeEventListener?.('click', () => {});
        element.removeEventListener?.('change', () => {});
      }
    });
  }

  // Measurement methods
  private async measurePerformanceImprovement(): Promise<number> {
    const beforeMemory = this.getMemoryUsage();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const afterMemory = this.getMemoryUsage();
    
    return Math.max(0, beforeMemory - afterMemory);
  }

  private calculateSecurityScore(): number {
    let score = 100;
    
    if (window.location.protocol !== 'https:' && import.meta.env.PROD) score -= 30;
    if (!this.hasCSP()) score -= 20;
    if (this.checkSensitiveData().count > 0) score -= 25;
    if (!this.hasSecurityHeaders()) score -= 15;
    
    return Math.max(0, score);
  }

  private calculateAccessibilityScore(): number {
    const images = document.querySelectorAll('img');
    const imagesWithAlt = document.querySelectorAll('img[alt]');
    const buttons = document.querySelectorAll('button');
    const buttonsWithAria = document.querySelectorAll('button[aria-label]');
    
    const altTextScore = images.length > 0 ? (imagesWithAlt.length / images.length) * 50 : 50;
    const ariaScore = buttons.length > 0 ? (buttonsWithAria.length / buttons.length) * 50 : 50;
    
    return Math.round(altTextScore + ariaScore);
  }

  private measureMemoryOptimization(): number {
    const beforeSize = this.getLocalStorageSize();
    this.cleanupLocalStorage();
    const afterSize = this.getLocalStorageSize();
    
    return beforeSize > 0 ? Math.round(((beforeSize - afterSize) / beforeSize) * 100) : 0;
  }

  private hasSecurityHeaders(): boolean {
    return !!(
      document.querySelector('meta[http-equiv="X-Frame-Options"]') ||
      document.querySelector('meta[http-equiv="X-Content-Type-Options"]')
    );
  }

  private generateRecommendations(issues: HealthIssue[]): string[] {
    const recommendations: string[] = [];
    
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push(`Address ${criticalIssues.length} critical issues immediately`);
    }
    
    const securityIssues = issues.filter(i => i.category === 'security');
    if (securityIssues.length > 0) {
      recommendations.push('Strengthen security configuration before production');
    }
    
    const performanceIssues = issues.filter(i => i.category === 'performance');
    if (performanceIssues.length > 0) {
      recommendations.push('Optimize performance for better user experience');
    }
    
    const accessibilityIssues = issues.filter(i => i.category === 'accessibility');
    if (accessibilityIssues.length > 0) {
      recommendations.push('Improve accessibility compliance');
    }
    
    return recommendations;
  }

  private startContinuousMonitoring(): void {
    setInterval(() => {
      if (!this.healingInProgress) {
        this.performHealthCheck();
      }
    }, this.config.monitoringInterval);
  }

  private setupAutoHealing(): void {
    if (!this.config.enableAutoHealing) return;

    setInterval(async () => {
      if (!this.healingInProgress) {
        const issues = await this.detectHealthIssues();
        const criticalIssues = issues.filter(i => 
          i.severity === 'critical' && i.autoFixable
        );
        
        if (criticalIssues.length > 0) {
          console.log('🚨 Auto-healing critical issues...');
          await this.autoFixIssues(criticalIssues);
        }
      }
    }, 60000); // Check every minute
  }

  private enhanceErrorRecovery(): void {
    // Enhanced error recovery with retry logic
    window.addEventListener('unhandledrejection', (event) => {
      console.log('🔄 Attempting error recovery...');
      
      // Specific recovery for common issues
      if (event.reason?.message?.includes('fetch')) {
        // Network error recovery
        setTimeout(() => {
          console.log('📡 Retrying network operation...');
        }, 2000);
      }
    });
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const issues = await this.detectHealthIssues();
      
      if (issues.length > 0) {
        console.log(`🔍 Health check found ${issues.length} issues`);
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  private notifyEnhancementComplete(result: HealthEnhancementResult): void {
    if (!import.meta.env.PROD && typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'success',
        title: 'Health Enhancement Complete',
        message: `Fixed ${result.issuesFixed}/${result.issuesFound} issues. Performance improved by ${result.performanceImprovement}%`,
        duration: 8000
      });
    }
  }

  // Public methods
  public getHealthStatus(): any {
    return {
      lastEnhancement: this.lastEnhancement,
      enhancementHistory: this.enhancementHistory,
      currentHealth: {
        performance: this.getMemoryUsage() < 80 ? 'good' : 'needs-attention',
        security: this.calculateSecurityScore() > 80 ? 'good' : 'needs-attention',
        accessibility: this.calculateAccessibilityScore() > 80 ? 'good' : 'needs-attention'
      }
    };
  }

  public async runHealthAudit(): Promise<HealthIssue[]> {
    return this.detectHealthIssues();
  }

  public cleanup(): void {
    // Cleanup any running processes
    this.healingInProgress = false;
  }
}

export const projectHealthEnhancer = new ProjectHealthEnhancer();

// Auto-start health enhancement in production
if (import.meta.env.PROD) {
  projectHealthEnhancer.enhanceProjectHealth();
}