// Health check utilities for production monitoring

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    serviceWorker: boolean;
    networkConnectivity: boolean;
    criticalAssets: boolean;
  };
  performance: {
    memoryUsage?: number;
    loadTime: number;
    errorRate: number;
  };
  version: string;
  environment: string;
}

class HealthChecker {
  private checkInterval: number = 60000; // 1 minute
  private errorThreshold: number = 0.05; // 5% error rate threshold
  private intervalId: NodeJS.Timeout | null = null;

  async performHealthCheck(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString();
    const checks = await this.runSystemChecks();
    const performance = await this.getPerformanceMetrics();
    
    const overallStatus = this.calculateOverallStatus(checks, performance);

    return {
      status: overallStatus,
      timestamp,
      checks,
      performance,
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env.MODE || 'development'
    };
  }

  private async runSystemChecks() {
    const checks = {
      localStorage: await this.checkLocalStorage(),
      sessionStorage: await this.checkSessionStorage(),
      indexedDB: await this.checkIndexedDB(),
      serviceWorker: await this.checkServiceWorker(),
      networkConnectivity: await this.checkNetworkConnectivity(),
      criticalAssets: await this.checkCriticalAssets()
    };

    return checks;
  }

  private async checkLocalStorage(): Promise<boolean> {
    try {
      const testKey = '__health_check_test__';
      localStorage.setItem(testKey, 'test');
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return retrieved === 'test';
    } catch {
      return false;
    }
  }

  private async checkSessionStorage(): Promise<boolean> {
    try {
      const testKey = '__health_check_test__';
      sessionStorage.setItem(testKey, 'test');
      const retrieved = sessionStorage.getItem(testKey);
      sessionStorage.removeItem(testKey);
      return retrieved === 'test';
    } catch {
      return false;
    }
  }

  private async checkIndexedDB(): Promise<boolean> {
    try {
      if (!('indexedDB' in window)) return false;
      
      return new Promise((resolve) => {
        const deleteReq = indexedDB.deleteDatabase('__health_check_test__');
        deleteReq.onsuccess = () => {
          const openReq = indexedDB.open('__health_check_test__', 1);
          openReq.onsuccess = () => {
            openReq.result.close();
            indexedDB.deleteDatabase('__health_check_test__');
            resolve(true);
          };
          openReq.onerror = () => resolve(false);
        };
        deleteReq.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }

  private async checkServiceWorker(): Promise<boolean> {
    try {
      if (!('serviceWorker' in navigator)) return false;
      const registrations = await navigator.serviceWorker.getRegistrations();
      return registrations.length > 0;
    } catch {
      return false;
    }
  }

  private async checkNetworkConnectivity(): Promise<boolean> {
    try {
      // Try to fetch a small resource with a short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkCriticalAssets(): Promise<boolean> {
    try {
      // Check if critical assets are accessible by testing the app entry point
      const response = await fetch('/', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  private async checkAssetAvailability(): Promise<boolean> {
    try {
      // Check a few critical static assets
      const criticalAssets = ['/vite.svg', '/medisoluce.png'];
      const promises = criticalAssets.map(async (asset) => {
        try {
          const response = await fetch(asset, { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          return response.ok;
        } catch {
          return false;
        }
      });
      
      // Initialize comprehensive health monitoring
      const { comprehensiveHealthManager } = await import('./comprehensiveHealthManager');
      
      // Start enhanced health monitoring
      comprehensiveHealthManager.getHealthReport().then((health) => {
        if (health.overall.status === 'critical' || health.overall.status === 'poor') {
          console.error('Critical system health issues detected:', health);
        }
      });
      
      const results = await Promise.all(promises);
      return results.some(result => result); // At least one asset should be available
    } catch {
      return false;
    }
  }

  private async getPerformanceMetrics() {
    const errorLogs = JSON.parse(localStorage.getItem('error-logs') || '[]');
    const recentErrors = errorLogs.filter((log: any) => {
      const logTime = new Date(log.timestamp).getTime();
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      return logTime > oneHourAgo;
    });

    const metrics = {
      loadTime: 0,
      errorRate: 0,
      memoryUsage: undefined as number | undefined
    };

    // Get page load time
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      }
    }

    // Calculate error rate (errors per page view in last hour)
    const pageViews = this.getRecentPageViews();
    metrics.errorRate = pageViews > 0 ? recentErrors.length / pageViews : 0;

    // Get memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = memory.usedJSHeapSize;
    }

    return metrics;
  }

  private getRecentPageViews(): number {
    // Estimate based on analytics data or use a reasonable default
    const analytics = JSON.parse(localStorage.getItem('page-views') || '[]');
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return analytics.filter((view: any) => new Date(view.timestamp).getTime() > oneHourAgo).length || 1;
  }

  private calculateOverallStatus(checks: any, performance: any): 'healthy' | 'degraded' | 'unhealthy' {
    const failedChecks = Object.values(checks).filter(check => !check).length;
    const criticalFailures = !checks.localStorage || !checks.networkConnectivity;
    
    if (criticalFailures || failedChecks > 3) {
      return 'unhealthy';
    }
    
    if (failedChecks > 1 || performance.errorRate > this.errorThreshold || performance.loadTime > 5000) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  startPeriodicChecks(callback?: (result: HealthCheckResult) => void) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
      const result = await this.performHealthCheck();
      
      if (callback) {
        callback(result);
      }

      // Log to console in development
      if (!import.meta.env.PROD) {
        !import.meta.env.PROD && console.log('Health Check:', result);
      }

      // Store health check results
      const healthHistory = JSON.parse(localStorage.getItem('health-history') || '[]');
      healthHistory.push(result);
      
      // Keep only last 24 hours of data
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const filtered = healthHistory.filter((h: any) => new Date(h.timestamp).getTime() > oneDayAgo);
      
      localStorage.setItem('health-history', JSON.stringify(filtered));
    }, this.checkInterval);
  }

  stopPeriodicChecks() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Export health data for debugging
  exportHealthData() {
    const healthHistory = JSON.parse(localStorage.getItem('health-history') || '[]');
    const errorLogs = JSON.parse(localStorage.getItem('error-logs') || '[]');
    
    const exportData = {
      healthChecks: healthHistory,
      errorLogs: errorLogs,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      version: import.meta.env.VITE_APP_VERSION,
      environment: import.meta.env.MODE
    };

    const content = JSON.stringify(exportData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medisoluce-health-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const healthChecker = new HealthChecker();

// Auto-start health checks in production
if (import.meta.env.PROD) {
  healthChecker.startPeriodicChecks();
}