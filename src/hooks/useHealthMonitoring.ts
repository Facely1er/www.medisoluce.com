import { useState, useEffect, useCallback } from 'react';
import { comprehensiveHealthManager } from '../utils/comprehensiveHealthManager';

interface UseHealthMonitoringOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableAutoOptimization?: boolean;
  healthThreshold?: number;
}

interface HealthMonitoringResult {
  healthData: any;
  isLoading: boolean;
  isOptimizing: boolean;
  lastUpdate: Date | null;
  error: string | null;
  refresh: () => Promise<void>;
  optimize: () => Promise<void>;
  exportReport: () => void;
  getHealthTrend: () => any;
}

export const useHealthMonitoring = (options: UseHealthMonitoringOptions = {}): HealthMonitoringResult => {
  const {
    autoRefresh = true,
    refreshInterval = 60000,
    enableAutoOptimization = false,
    healthThreshold = 70
  } = options;

  const [healthData, setHealthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const health = await comprehensiveHealthManager.getHealthReport();
      setHealthData(health);
      setLastUpdate(new Date());
      
      // Auto-optimize if enabled and health is below threshold
      if (enableAutoOptimization && health.overall.score < healthThreshold && !isOptimizing) {
        await optimize();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Health monitoring error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [enableAutoOptimization, healthThreshold, isOptimizing]);

  const optimize = useCallback(async () => {
    setIsOptimizing(true);
    setError(null);
    
    try {
      await comprehensiveHealthManager.performEmergencyOptimization();
      
      // Refresh health data after optimization
      setTimeout(async () => {
        await refresh();
      }, 2000);
      
      // Show success notification
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast({
          type: 'success',
          title: 'Optimization Complete',
          message: 'System health has been optimized',
          duration: 5000
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Optimization failed';
      setError(errorMessage);
      
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast({
          type: 'error',
          title: 'Optimization Failed',
          message: errorMessage,
          duration: 5000
        });
      }
    } finally {
      setIsOptimizing(false);
    }
  }, [refresh]);

  const exportReport = useCallback(() => {
    try {
      const report = comprehensiveHealthManager.exportComprehensiveReport();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medisoluce-health-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast({
          type: 'success',
          title: 'Report Exported',
          message: 'Health report has been downloaded',
          duration: 3000
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);
    }
  }, []);

  const getHealthTrend = useCallback(() => {
    try {
      const history = JSON.parse(localStorage.getItem('comprehensive-health-reports') || '[]');
      if (history.length < 2) {
        return { trend: 'stable', confidence: 0, data: [] };
      }

      const recent = history.slice(-10);
      const scores = recent.map((h: any) => h.overall.score);
      const trend = scores[scores.length - 1] - scores[0];
      
      return {
        trend: trend > 5 ? 'improving' : trend < -5 ? 'declining' : 'stable',
        confidence: Math.min(100, recent.length * 10),
        data: recent.map((h: any, index: number) => ({
          time: new Date(h.overall.timestamp || Date.now()).toLocaleTimeString(),
          score: h.overall.score,
          index
        }))
      };
    } catch {
      return { trend: 'stable', confidence: 0, data: [] };
    }
  }, [healthData]);

  // Auto-refresh effect
  useEffect(() => {
    refresh();

    if (autoRefresh) {
      const interval = setInterval(refresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refresh]);

  // Health monitoring alerts
  useEffect(() => {
    if (healthData && healthData.overall.status === 'critical') {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast({
          type: 'error',
          title: 'Critical Health Issues',
          message: 'System requires immediate attention',
          duration: 10000
        });
      }
    } else if (healthData && healthData.overall.status === 'poor') {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast({
          type: 'warning',
          title: 'Health Degradation',
          message: 'System optimization recommended',
          duration: 5000
        });
      }
    }
  }, [healthData]);

  return {
    healthData,
    isLoading,
    isOptimizing,
    lastUpdate,
    error,
    refresh,
    optimize,
    exportReport,
    getHealthTrend
  };
};

// Specialized hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({});

  useEffect(() => {
    const collectMetrics = () => {
      const metrics: any = {};

      // Memory usage
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        metrics.memoryUsage = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
        metrics.memoryUsed = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
        metrics.memoryLimit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024); // MB
      }

      // Page load performance
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
        metrics.domReady = Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart);
        metrics.firstByte = Math.round(navigation.responseStart - navigation.fetchStart);
      }

      // Resource loading
      const resources = performance.getEntriesByType('resource');
      metrics.resourceCount = resources.length;
      metrics.averageResourceTime = resources.length > 0 ? 
        Math.round(resources.reduce((sum: number, resource: any) => sum + resource.duration, 0) / resources.length) : 0;

      setPerformanceMetrics(metrics);
    };

    collectMetrics();
    const interval = setInterval(collectMetrics, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return performanceMetrics;
};

// Hook for accessibility monitoring
export const useAccessibilityMonitoring = () => {
  const [accessibilityScore, setAccessibilityScore] = useState(100);

  useEffect(() => {
    const checkAccessibility = () => {
      let score = 100;

      // Check for missing alt text
      const images = document.querySelectorAll('img');
      const imagesWithAlt = document.querySelectorAll('img[alt]');
      if (images.length > 0) {
        const altTextCoverage = (imagesWithAlt.length / images.length) * 100;
        if (altTextCoverage < 100) score -= (100 - altTextCoverage) * 0.2;
      }

      // Check for ARIA labels
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby]');
      if (interactiveElements.length > 0) {
        const ariaCoverage = (elementsWithAria.length / interactiveElements.length) * 100;
        if (ariaCoverage < 80) score -= (80 - ariaCoverage) * 0.3;
      }

      // Check for heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const h1Count = document.querySelectorAll('h1').length;
      if (h1Count !== 1) score -= 10;

      setAccessibilityScore(Math.max(0, Math.round(score)));
    };

    checkAccessibility();
    
    // Re-check when DOM changes
    const observer = new MutationObserver(checkAccessibility);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return accessibilityScore;
};

export default useHealthMonitoring;