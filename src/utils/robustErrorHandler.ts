import React from 'react';

// Robust error handling system with auto-recovery

interface ErrorRecoveryConfig {
  maxRetries: number;
  retryDelay: number;
  enableAutoRecovery: boolean;
  enableCircuitBreaker: boolean;
  enableGracefulDegradation: boolean;
}

interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  state: 'closed' | 'open' | 'half-open';
  threshold: number;
  timeout: number;
}

class RobustErrorHandler {
  private config: ErrorRecoveryConfig;
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private retryQueues = new Map<string, Array<() => Promise<unknown>>>();
  private gracefulModes = new Set<string>();

  constructor(config: Partial<ErrorRecoveryConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      enableAutoRecovery: true,
      enableCircuitBreaker: true,
      enableGracefulDegradation: true,
      ...config
    };

    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    this.setupGlobalErrorHandling();
    this.setupNetworkErrorRecovery();
    this.setupMemoryErrorRecovery();
    this.setupComponentErrorRecovery();
  }

  private setupGlobalErrorHandling() {
    // Enhanced global error handling with recovery
    window.addEventListener('error', (event) => {
      this.handleError('javascript', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('promise', event.reason, {
        type: 'unhandledrejection'
      });
    });
  }

  private setupNetworkErrorRecovery() {
    // Enhanced fetch with retry logic and circuit breaker
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input.toString();
      
      if (this.config.enableCircuitBreaker && this.isCircuitOpen(url)) {
        throw new Error(`Circuit breaker open for ${url}`);
      }

      return this.retryWithBackoff(async () => {
        try {
          const response = await originalFetch(input, init);
          
          if (!response.ok) {
            this.recordFailure(url);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          this.recordSuccess(url);
          return response;
        } catch (error) {
          this.recordFailure(url);
          throw error;
        }
      }, url);
    };
  }

  private setupMemoryErrorRecovery() {
    // Monitor and recover from memory errors
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (usagePercentage > 90) {
          console.warn('🚨 Critical memory usage detected, initiating recovery...');
          this.recoverFromMemoryError();
        }
      }
    };

    setInterval(checkMemory, 30000); // Check every 30 seconds
  }

  private setupComponentErrorRecovery() {
    // Enhanced component error recovery
    const originalCreateElement = React.createElement;
    
    // Wrap React.createElement to catch component errors
    (React as typeof React & { createElement: typeof React.createElement }).createElement = (type: React.ElementType, props: React.PropsWithChildren<Record<string, unknown>>, ...children: React.ReactNode[]) => {
      try {
        return originalCreateElement(type, props, ...children);
      } catch (error) {
        console.error('Component creation error:', error);
        this.handleComponentError(type, error);
        
        // Return fallback component
        return originalCreateElement('div', 
          { className: 'error-fallback p-4 bg-red-50 border border-red-200 rounded' },
          'Component temporarily unavailable'
        );
      }
    };
  }

  private async handleError(type: string, error: Error | unknown, context: Record<string, unknown> = {}) {
    console.error(`[${type.toUpperCase()}] Error:`, error);

    // Store error for analysis
    this.storeError(type, error, context);

    // Attempt auto-recovery based on error type
    if (this.config.enableAutoRecovery) {
      await this.attemptRecovery(type, error, context);
    }

    // Enable graceful degradation if needed
    if (this.config.enableGracefulDegradation) {
      this.enableGracefulMode(type);
    }
  }

  private async attemptRecovery(type: string, error: Error | unknown, context: Record<string, unknown>): Promise<boolean> {
    if (!import.meta.env.PROD) {
      console.log(`🔄 Attempting recovery for ${type} error...`);
    }

    switch (type) {
      case 'javascript':
        return this.recoverFromJavaScriptError(error, context);
      case 'promise':
        return this.recoverFromPromiseError(error, context);
      case 'network':
        return this.recoverFromNetworkError(error, context);
      case 'memory':
        return this.recoverFromMemoryError();
      default:
        return this.genericErrorRecovery(error, context);
    }
  }

  private async recoverFromJavaScriptError(error: Error | unknown, context: Record<string, unknown>): Promise<boolean> {
    try {
      // Specific recovery strategies
      if (error.message?.includes('Cannot read property')) {
        // Null/undefined access error - reload component
        this.reloadCurrentComponent();
        return true;
      }
      
      if (error.message?.includes('ChunkLoadError')) {
        // Module loading error - force reload
        setTimeout(() => window.location.reload(), 1000);
        return true;
      }
      
      if (error.message?.includes('Script error')) {
        // External script error - disable non-essential scripts
        this.disableNonEssentialScripts();
        return true;
      }
      
      return false;
    } catch (recoveryError) {
      console.error('JavaScript error recovery failed:', recoveryError);
      return false;
    }
  }

  private async recoverFromPromiseError(error: Error | unknown, context: Record<string, unknown>): Promise<boolean> {
    try {
      if (error.message?.includes('fetch')) {
        // Network-related promise rejection
        if (!import.meta.env.PROD) {
          console.log('📡 Detected network error, switching to offline mode...');
        }
        this.enableOfflineMode();
        return true;
      }
      
      if (error.message?.includes('quota')) {
        // Storage quota exceeded
        if (!import.meta.env.PROD) {
          console.log('💾 Storage quota exceeded, cleaning up...');
        }
        this.cleanupStorage();
        return true;
      }
      
      return false;
    } catch (recoveryError) {
      console.error('Promise error recovery failed:', recoveryError);
      return false;
    }
  }

  private async recoverFromNetworkError(error: unknown, context: unknown): Promise<boolean> {
    try {
      // Enable offline capabilities
      this.enableOfflineMode();
      
      // Show user-friendly message
      if (typeof window !== 'undefined' && (window as any).showToast) {
        // Only show notifications in development mode
        if (!import.meta.env.PROD) {
          (window as any).showToast({
            type: 'warning',
            title: 'Working Offline',
            message: 'Network unavailable - using cached data',
            duration: 5000
          });
        }
      }
      
      return true;
    } catch (recoveryError) {
      console.error('Network error recovery failed:', recoveryError);
      return false;
    }
  }

  private recoverFromMemoryError(): boolean {
    try {
      if (!import.meta.env.PROD) {
        console.log('🧹 Initiating emergency memory cleanup...');
      }
      
      // Aggressive cleanup
      this.cleanupStorage();
      this.clearImageCache();
      this.reduceComponentComplexity();
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      return true;
    } catch (error) {
      console.error('Memory recovery failed:', error);
      return false;
    }
  }

  private async genericErrorRecovery(error: unknown, context: unknown): Promise<boolean> {
    try {
      // Generic recovery strategies
      this.cleanupStorage();
      this.resetUserInterface();
      
      return true;
    } catch (recoveryError) {
      console.error('Generic error recovery failed:', recoveryError);
      return false;
    }
  }

  // Circuit breaker implementation
  private isCircuitOpen(key: string): boolean {
    const breaker = this.circuitBreakers.get(key);
    if (!breaker) return false;
    
    if (breaker.state === 'open') {
      if (Date.now() - breaker.lastFailure > breaker.timeout) {
        breaker.state = 'half-open';
        return false;
      }
      return true;
    }
    
    return false;
  }

  private recordFailure(key: string): void {
    let breaker = this.circuitBreakers.get(key);
    
    if (!breaker) {
      breaker = {
        failures: 0,
        lastFailure: 0,
        state: 'closed',
        threshold: 5,
        timeout: 60000 // 1 minute
      };
      this.circuitBreakers.set(key, breaker);
    }
    
    breaker.failures++;
    breaker.lastFailure = Date.now();
    
    if (breaker.failures >= breaker.threshold) {
      breaker.state = 'open';
      if (!import.meta.env.PROD) {
        console.warn(`🔴 Circuit breaker opened for ${key}`);
      }
    }
  }

  private recordSuccess(key: string): void {
    const breaker = this.circuitBreakers.get(key);
    if (breaker) {
      breaker.failures = 0;
      breaker.state = 'closed';
    }
  }

  // Retry with exponential backoff
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    key: string
  ): Promise<T> {
    let lastError: unknown;
    
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === this.config.maxRetries) {
          throw error;
        }
        
        const delay = this.config.retryDelay * Math.pow(2, attempt);
        if (!import.meta.env.PROD) {
          console.log(`🔄 Retry ${attempt + 1}/${this.config.maxRetries} after ${delay}ms for ${key}`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  // Recovery implementations
  private reloadCurrentComponent(): void {
    // Force re-render of current component
    const event = new CustomEvent('forceRerender');
    document.dispatchEvent(event);
  }

  private disableNonEssentialScripts(): void {
    document.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src') || '';
      if (src.includes('analytics') || src.includes('tracking')) {
        // script.remove(); // Commented out to prevent conflicts with React DOM management
      }
    });
  }

  private enableOfflineMode(): void {
    this.gracefulModes.add('offline');
    
    // Show offline indicator
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'fixed top-0 left-0 right-0 bg-warning-500 text-white text-center py-2 z-50';
    indicator.textContent = '📡 Working offline - some features may be limited';
    
    if (!document.getElementById('offline-indicator')) {
      document.body.appendChild(indicator);
    }
  }

  private cleanupStorage(): void {
    try {
      // Emergency storage cleanup
      const keysToClean = ['error-logs', 'performance-metrics', 'temp-', 'cache-'];
      
      Object.keys(localStorage).forEach(key => {
        if (keysToClean.some(pattern => key.includes(pattern))) {
          const data = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(data) && data.length > 10) {
            localStorage.setItem(key, JSON.stringify(data.slice(-5)));
          }
        }
      });
    } catch (error) {
      console.error('Storage cleanup failed:', error);
    }
  }

  private clearImageCache(): void {
    // Clear image cache by removing cached images
    document.querySelectorAll('img[src*="blob:"]').forEach(img => {
      URL.revokeObjectURL(img.src);
    });
  }

  private reduceComponentComplexity(): void {
    // Disable non-essential animations
    document.body.style.setProperty('--animation-duration', '0s');
    
    // Hide non-essential elements
    document.querySelectorAll('.non-essential, .enhancement, .decoration').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
  }

  private resetUserInterface(): void {
    // Reset UI to known good state
    document.querySelectorAll('.modal, .dropdown, .popup').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Reset forms
    document.querySelectorAll('form').forEach(form => {
      if (form.hasAttribute('data-auto-reset')) {
        form.reset();
      }
    });
  }

  private handleComponentError(componentType: unknown, error: unknown): void {
    console.error(`Component error in ${componentType}:`, error);
    
    // Store component error for analysis
    const componentErrors = JSON.parse(localStorage.getItem('component-errors') || '[]');
    componentErrors.push({
      timestamp: new Date().toISOString(),
      component: componentType.name || 'Unknown',
      error: error.message,
      stack: error.stack
    });
    
    localStorage.setItem('component-errors', JSON.stringify(componentErrors.slice(-50)));
  }

  private storeError(type: string, error: unknown, context: unknown): void {
    const errorLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      message: (error as Error).message || String(error),
      stack: (error as Error).stack,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      recovered: false
    };

    const errors = JSON.parse(localStorage.getItem('robust-error-logs') || '[]');
    errors.push(errorLog);
    localStorage.setItem('robust-error-logs', JSON.stringify(errors.slice(-100)));
  }

  // Public methods
  public async recoverFromError(errorId: string): Promise<boolean> {
    const errors = JSON.parse(localStorage.getItem('robust-error-logs') || '[]');
    const error = errors.find((e: any) => e.id === errorId);
    
    if (!error) return false;
    
    try {
      const recovered = await this.attemptRecovery(error.type, error, error.context);
      
      if (recovered) {
        error.recovered = true;
        localStorage.setItem('robust-error-logs', JSON.stringify(errors));
      }
      
      return recovered;
    } catch (recoveryError) {
      console.error('Recovery attempt failed:', recoveryError);
      return false;
    }
  }

  public getErrorRecoveryStats(): any {
    const errors = JSON.parse(localStorage.getItem('robust-error-logs') || '[]');
    const recoveredErrors = errors.filter((e: any) => e.recovered);
    
    return {
      totalErrors: errors.length,
      recoveredErrors: recoveredErrors.length,
      recoveryRate: errors.length > 0 ? Math.round((recoveredErrors.length / errors.length) * 100) : 0,
      circuitBreakers: Array.from(this.circuitBreakers.entries()).map(([key, state]) => ({
        key,
        state: state.state,
        failures: state.failures
      })),
      gracefulModes: Array.from(this.gracefulModes)
    };
  }

  public enableGracefulMode(mode: string): void {
    this.gracefulModes.add(mode);
    if (!import.meta.env.PROD) {
      console.log(`🛡️ Graceful mode enabled: ${mode}`);
    }
    
    // Apply graceful degradation strategies
    switch (mode) {
      case 'offline':
        this.enableOfflineMode();
        break;
      case 'low-memory':
        this.enableLowMemoryMode();
        break;
      case 'slow-network':
        this.enableSlowNetworkMode();
        break;
    }
  }

  private enableLowMemoryMode(): void {
    // Reduce memory usage
    document.body.classList.add('low-memory-mode');
    
    // Disable animations
    const style = document.createElement('style');
    style.textContent = `
      .low-memory-mode * {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `;
    document.head.appendChild(style);
  }

  private enableSlowNetworkMode(): void {
    // Optimize for slow networks
    document.body.classList.add('slow-network-mode');
    
    // Disable non-essential requests
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      (img as HTMLImageElement).loading = 'eager';
    });
  }

  public exportRecoveryReport(): string {
    const stats = this.getErrorRecoveryStats();
    const errors = JSON.parse(localStorage.getItem('robust-error-logs') || '[]');
    
    return `
MEDISOLUCE ERROR RECOVERY REPORT
Generated: ${new Date().toLocaleString()}

RECOVERY STATISTICS:
- Total Errors: ${stats.totalErrors}
- Recovered Errors: ${stats.recoveredErrors}
- Recovery Rate: ${stats.recoveryRate}%
- Active Graceful Modes: ${stats.gracefulModes.join(', ') || 'None'}

CIRCUIT BREAKER STATUS:
${stats.circuitBreakers.map((cb: any) => 
  `- ${cb.key}: ${cb.state.toUpperCase()} (${cb.failures} failures)`
).join('\n') || 'None active'}

RECENT ERRORS:
${errors.slice(-5).map((error: any) => 
  `- ${error.type}: ${error.message} (${error.recovered ? 'Recovered' : 'Unrecovered'})`
).join('\n') || 'None'}

ERROR PATTERNS:
${this.analyzeErrorPatterns(errors)}

RECOMMENDATIONS:
${this.generateRecoveryRecommendations(stats, errors).join('\n')}

Report generated by MediSoluce Robust Error Handler
`;
  }

  private analyzeErrorPatterns(errors: any[]): string {
    const patterns: Record<string, number> = {};
    
    errors.forEach(error => {
      const pattern = error.type + ':' + (error.message.split(' ')[0] || 'unknown');
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    });
    
    return Object.entries(patterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([pattern, count]) => `- ${pattern}: ${count} occurrences`)
      .join('\n') || 'No patterns detected';
  }

  private generateRecoveryRecommendations(stats: any, errors: any[]): string[] {
    const recommendations: string[] = [];
    
    if (stats.recoveryRate < 50) {
      recommendations.push('Improve error recovery mechanisms - low recovery rate');
    }
    
    if (stats.circuitBreakers.some((cb: any) => cb.state === 'open')) {
      recommendations.push('Investigate services with open circuit breakers');
    }
    
    if (errors.filter((e: any) => e.type === 'memory').length > 5) {
      recommendations.push('Implement better memory management strategies');
    }
    
    if (stats.gracefulModes.length > 0) {
      recommendations.push('Review and optimize graceful degradation modes');
    }
    
    return recommendations;
  }

  public cleanup(): void {
    this.healingInProgress = false;
    this.circuitBreakers.clear();
    this.retryQueues.clear();
    this.gracefulModes.clear();
  }
}

export const robustErrorHandler = new RobustErrorHandler();

// Auto-initialize in production
if (import.meta.env.PROD) {
  robustErrorHandler.initialize();
}