// Performance optimization utilities for production deployment

interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCaching: boolean;
  enablePreloading: boolean;
  enableResourceHints: boolean;
  enableMemoryManagement: boolean;
  enableAutomaticOptimization: boolean;
}

class PerformanceOptimizer {
  private config: PerformanceConfig;
  private observerInstances: IntersectionObserver[] = [];
  private preloadedResources = new Set<string>();
  private optimizationHistory: Array<{
    type: string;
    timestamp: string;
    impact: number;
    description: string;
  }> = [];
  private memoryMonitor: NodeJS.Timeout | null = null;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableLazyLoading: true,
      enableImageOptimization: true,
      enableCaching: true,
      enablePreloading: true,
      enableResourceHints: true,
      enableMemoryManagement: true,
      enableAutomaticOptimization: true,
      ...config
    };

    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupResourcePreloading();
    this.setupCacheOptimization();
    this.monitorPerformance();
    this.setupMemoryManagement();
    this.setupAutomaticOptimization();
  }

  private setupLazyLoading() {
    if (!this.config.enableLazyLoading || !('IntersectionObserver' in window)) return;

    // Lazy load images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, { rootMargin: '50px' });

    this.observerInstances.push(imageObserver);

    // Observe images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }

  private setupImageOptimization() {
    if (!this.config.enableImageOptimization) return;

    // Add loading="lazy" to images
    document.querySelectorAll('img').forEach((img) => {
      if (!img.getAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });

    // Optimize image formats (WebP fallback)
    this.setupImageFormatOptimization();
  }

  private setupImageFormatOptimization() {
    // Check WebP support
    const supportsWebP = this.checkWebPSupport();
    
    if (supportsWebP) {
      // Replace image sources with WebP versions if available
      document.querySelectorAll('img').forEach((img) => {
        if (img.src && !img.src.includes('.webp')) {
          const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          
          // Test if WebP version exists
          const testImg = new Image();
          testImg.onload = () => {
            img.src = webpSrc;
          };
          testImg.src = webpSrc;
        }
      });
    }
  }

  private checkWebPSupport(): boolean {
    try {
      // Skip WebP check in test environment
      if (typeof window === 'undefined' || !window.document) {
        return false;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      
      // Check if toDataURL is available (not mocked in tests)
      if (typeof canvas.toDataURL !== 'function') {
        return false;
      }
      
      const dataUrl = canvas.toDataURL('image/webp');
      return dataUrl?.indexOf('data:image/webp') === 0;
    } catch {
      // Canvas or WebP support not available (e.g., in test environment)
      return false;
    }
  }

  private setupResourcePreloading() {
    if (!this.config.enablePreloading) return;

    // Preload critical resources
    const criticalResources = [
      '/src/main.tsx',
      '/src/App.tsx',
      '/src/components/layout/Layout.tsx'
    ];

    criticalResources.forEach((resource) => {
      this.preloadResource(resource, 'modulepreload');
    });

    // Preload critical fonts
    this.preloadFonts();
  }

  private preloadResource(href: string, as: string) {
    if (this.preloadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = href;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    this.preloadedResources.add(href);
  }

  private preloadFonts() {
    const fonts = [
      'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
      'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw0aXpsog.woff2'
    ];

    fonts.forEach((font) => {
      this.preloadResource(font, 'font');
    });
  }

  private setupCacheOptimization() {
    if (!this.config.enableCaching || !('serviceWorker' in navigator)) return;

    // Register service worker for advanced caching
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        if (!import.meta.env.PROD) {
          console.log('SW registered:', registration);
        }
        
        // Update service worker when new version is available
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                this.notifyUpdate();
              }
            });
          }
        });
      })
      .catch((error) => {
        if (!import.meta.env.PROD) {
          console.log('SW registration failed:', error);
        }
      });
  }

  private notifyUpdate() {
    if ((window as any).showToast) {
      (window as any).showToast({
        type: 'info',
        title: 'Update Available',
        message: 'A new version is available. Refresh to update.',
        duration: 10000
      });
    }
  }

  private setupMemoryManagement() {
    if (!this.config.enableMemoryManagement) return;

    this.memoryMonitor = setInterval(() => {
      this.checkMemoryUsage();
      this.cleanupUnusedResources();
    }, 30000); // Check every 30 seconds
  }

  private setupAutomaticOptimization() {
    if (!this.config.enableAutomaticOptimization) return;

    // Auto-optimize images when they're added to DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const images = element.querySelectorAll('img');
            images.forEach(img => this.optimizeImage(img));
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    this.observerInstances.push(observer);
  }

  private checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usagePercentage > 85) {
        this.performEmergencyCleanup();
      } else if (usagePercentage > 70) {
        this.performRoutineCleanup();
      }
    }
  }

  private cleanupUnusedResources() {
    // Remove unused event listeners
    this.cleanupEventListeners();
    
    // Clear old cached data
    this.clearOldCacheData();
    
    // Cleanup DOM observers for removed elements
    this.cleanupObservers();
  }

  private optimizeImage(img: HTMLImageElement) {
    // Add loading="lazy" if not already set
    if (!img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }

    // Add intersection observer for additional optimization
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          // Additional optimizations when image comes into view
          this.applyImageOptimizations(image);
          observer.unobserve(image);
        }
      });
    });

    observer.observe(img);
    this.observerInstances.push(observer);
  }

  private applyImageOptimizations(img: HTMLImageElement) {
    // Apply responsive image optimizations
    if (!img.sizes && img.width) {
      img.sizes = `(max-width: ${img.width}px) 100vw, ${img.width}px`;
    }
  }

  private performEmergencyCleanup() {
    if (!import.meta.env.PROD) {
      console.warn('Emergency memory cleanup triggered');
    }
    
    // Aggressive cleanup
    this.clearAllCaches();
    this.removeUnusedObservers();
    this.compactLocalStorage();
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    this.logOptimization('Emergency memory cleanup');
  }

  private performRoutineCleanup() {
    // Gentle cleanup
    this.clearOldCacheData();
    this.cleanupEventListeners();
    this.optimizeExistingImages();
    
    this.logOptimization('Routine performance cleanup');
  }

  private clearAllCaches() {
    // Clear browser caches if possible
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('temp') || cacheName.includes('old')) {
            caches.delete(cacheName);
          }
        });
      });
    }
  }

  private removeUnusedObservers() {
    this.observerInstances = this.observerInstances.filter(observer => {
      try {
        // Check if observer is still needed
        const isActive = observer instanceof IntersectionObserver;
        if (!isActive) {
          observer.disconnect();
          return false;
        }
        return true;
      } catch {
        observer.disconnect();
        return false;
      }
    });
  }

  private compactLocalStorage() {
    try {
      const keysToCompact = ['error-logs', 'performance-metrics', 'health-history'];
      
      keysToCompact.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data) && data.length > 50) {
          const compacted = data.slice(-25);
          localStorage.setItem(key, JSON.stringify(compacted));
        }
      });
    } catch (error) {
      console.error('localStorage compaction failed:', error);
    }
  }

  private clearOldCacheData() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    ['performance-metrics', 'error-logs', 'page-views'].forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = data.filter((item: { timestamp?: string; date?: string }) => {
          const timestamp = item.timestamp || item.date;
          return timestamp && new Date(timestamp).getTime() > oneDayAgo;
        });
        localStorage.setItem(key, JSON.stringify(filtered));
      } catch (error) {
        if (!import.meta.env.PROD) {
          console.warn(`Failed to cleanup ${key}:`, error);
        }
      }
    });
  }

  private cleanupEventListeners() {
    // Remove event listeners from removed DOM elements
    // This is handled automatically by the browser, but we can help
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      if (!element.isConnected) {
        // Element is detached, clean up may be needed
        element.removeEventListener?.('click', () => {});
      }
    });
  }

  private cleanupObservers() {
    this.observerInstances = this.observerInstances.filter(observer => {
      try {
        // Keep active observers
        return true;
      } catch {
        observer.disconnect();
        return false;
      }
    });
  }

  private optimizeExistingImages() {
    document.querySelectorAll('img').forEach(img => {
      if (!img.getAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  private logOptimization(action: string) {
    const optimization = {
      action,
      timestamp: new Date().toISOString(),
      memoryBefore: this.getMemoryUsage(),
      memoryAfter: 0 // Will be updated after cleanup
    };

    setTimeout(() => {
      optimization.memoryAfter = this.getMemoryUsage();
      this.optimizationHistory.push(optimization);
      
      // Keep only last 20 optimizations
      if (this.optimizationHistory.length > 20) {
        this.optimizationHistory.splice(0, this.optimizationHistory.length - 20);
      }
    }, 1000);
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      return Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
    }
    return 0;
  }

  private monitorPerformance() {
    // Monitor Core Web Vitals
    this.observePerformanceMetrics();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor bundle size
    this.analyzeBundlePerformance();
  }

  private observePerformanceMetrics() {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          this.reportMetric('LCP', entry.startTime);
        }
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'first-input' && 'processingStart' in entry && 'startTime' in entry) {
          const fid = (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime;
          this.reportMetric('FID', fid);
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsScore = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'layout-shift' && 'hadRecentInput' in entry && 'value' in entry && !entry.hadRecentInput) {
          clsScore += (entry as PerformanceEntry & { hadRecentInput: boolean; value: number }).value;
          this.reportMetric('CLS', clsScore);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as Performance & { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        const usage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        };
        
        // Alert if memory usage is high
        const usagePercentage = (usage.used / usage.limit) * 100;
        if (usagePercentage > 80) {
          console.warn('High memory usage detected:', usage);
          this.reportMetric('MemoryUsage', usagePercentage);
        }
      }, 30000); // Check every 30 seconds
    }
  }

  private analyzeBundlePerformance() {
    // Monitor resource loading performance
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource' && 'duration' in entry && entry.duration > 1000) {
          // Report slow resources
          this.reportMetric('SlowResource', entry.duration);
        }
      });
    }).observe({ entryTypes: ['resource'] });
  }

  private reportMetric(name: string, value: number) {
    // Store performance metrics locally
    const metrics = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
    metrics.push({
      name,
      value,
      timestamp: new Date().toISOString(),
      url: window.location.pathname
    });
    
    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
    
    localStorage.setItem('performance-metrics', JSON.stringify(metrics));

    // Report to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as Window & { gtag: (command: string, eventName: string, parameters: Record<string, unknown>) => void }).gtag('event', 'web_vitals', {
        metric_name: name,
        metric_value: Math.round(value),
        page_path: window.location.pathname
      });
    }
  }

  // Public methods
  public getOptimizationReport(): {
    optimizations: Array<{
      action: string;
      timestamp: string;
      memoryBefore: number;
      memoryAfter: number;
    }>;
    currentMemoryUsage: number;
    preloadedResources: number;
    activeObservers: number;
    cacheStatus: {
      quota: number;
      usage: number;
    };
  } {
    return {
      optimizations: this.optimizationHistory,
      currentMemoryUsage: this.getMemoryUsage(),
      preloadedResources: this.preloadedResources.size,
      activeObservers: this.observerInstances.length,
      cacheStatus: this.getCacheStatus()
    };
  }

  private getCacheStatus(): { quota: number; usage: number } {
    try {
      const storageEstimate = navigator.storage?.estimate?.();
      return storageEstimate || { quota: 0, usage: 0 };
    } catch {
      return { quota: 0, usage: 0 };
    }
  }

  public forceOptimization() {
    this.performEmergencyCleanup();
    this.optimizeExistingImages();
    this.clearOldCacheData();
  }

  // Cleanup method
  public cleanup() {
    if (this.memoryMonitor) {
      clearInterval(this.memoryMonitor);
      this.memoryMonitor = null;
    }
    
    this.observerInstances.forEach(observer => observer.disconnect());
    this.observerInstances = [];
  }

  // Get performance summary
  public getPerformanceSummary() {
    const metrics = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const recentMetrics = metrics.filter((m: unknown) => 
      new Date(m.timestamp).getTime() > oneHourAgo
    );

    return {
      totalMetrics: metrics.length,
      recentMetrics: recentMetrics.length,
      averageLCP: this.calculateAverage(recentMetrics, 'LCP'),
      averageFID: this.calculateAverage(recentMetrics, 'FID'),
      averageCLS: this.calculateAverage(recentMetrics, 'CLS'),
      memoryUsage: this.getLatestMetric(recentMetrics, 'MemoryUsage'),
      slowResources: recentMetrics.filter((m: unknown) => m.name === 'SlowResource').length
    };
  }

  private calculateAverage(metrics: unknown[], metricName: string): number {
    const filtered = metrics.filter(m => m.name === metricName);
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, m) => acc + m.value, 0);
    return Math.round(sum / filtered.length);
  }

  private getLatestMetric(metrics: unknown[], metricName: string): number {
    const filtered = metrics.filter(m => m.name === metricName);
    return filtered.length > 0 ? filtered[filtered.length - 1].value : 0;
  }
}

export const performanceOptimizer = new PerformanceOptimizer();

// Auto-initialize in production
if (import.meta.env.PROD) {
  performanceOptimizer;
}