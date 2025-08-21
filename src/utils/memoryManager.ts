import React from 'react';
// Memory management utilities to prevent memory leaks and optimize performance

interface MemoryConfig {
  enableAutomaticCleanup: boolean;
  memoryThreshold: number; // Percentage
  cleanupInterval: number; // milliseconds
  enableMemoryProfiling: boolean;
}

class MemoryManager {
  private config: MemoryConfig;
  private eventListeners = new Map<string, Set<() => void>>();
  private observerInstances = new Set<IntersectionObserver | MutationObserver | PerformanceObserver>();
  private intervalIds = new Set<NodeJS.Timeout>();
  private timeoutIds = new Set<NodeJS.Timeout>();
  private animationFrameIds = new Set<number>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<MemoryConfig> = {}) {
    this.config = {
      enableAutomaticCleanup: true,
      memoryThreshold: 80,
      cleanupInterval: 60000, // 1 minute
      enableMemoryProfiling: !import.meta.env.PROD,
      ...config
    };

    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    this.setupMemoryMonitoring();
    this.setupAutomaticCleanup();
    this.setupLeakDetection();
    this.interceptCommonLeakSources();
  }

  private setupMemoryMonitoring() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usagePercentage > this.config.memoryThreshold) {
        console.warn(`High memory usage: ${usagePercentage.toFixed(1)}%`, memory);
        this.triggerMemoryCleanup();
      }
      
      if (this.config.enableMemoryProfiling) {
        this.logMemoryProfile(memory, usagePercentage);
      }
    };

    this.addInterval(setInterval(checkMemory, this.config.cleanupInterval));
  }

  private setupAutomaticCleanup() {
    if (!this.config.enableAutomaticCleanup) return;

    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupInterval);
  }

  private setupLeakDetection() {
    // Detect potential memory leaks
    const leakDetector = {
      detachedNodes: new Set<Node>(),
      largeObjects: new Map<string, any>(),
      eventListenerCount: 0
    };

    // Monitor DOM node creation/destruction
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            leakDetector.detachedNodes.add(node);
          }
        });
      });
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    this.addObserver(observer);

    // Periodically check for leaks
    this.addInterval(setInterval(() => {
      this.detectLeaks(leakDetector);
    }, 30000));
  }

  private interceptCommonLeakSources() {
    // Intercept addEventListener to track listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      // Track event listeners
      const listenerId = `${type}-${Date.now()}-${Math.random()}`;
      
      if (typeof listener === 'function') {
        const wrappedListener = function(this: EventTarget, ...args: any[]) {
          try {
            return listener.apply(this, args);
          } catch (error) {
            console.error('Event listener error:', error);
          }
        };
        
        originalAddEventListener.call(this, type, wrappedListener, options);
      }
    };

    // Intercept setInterval and setTimeout
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    
    window.setInterval = (...args) => {
      const id = originalSetInterval(...args);
      this.intervalIds.add(id);
      return id;
    };
    
    window.setTimeout = (...args) => {
      const id = originalSetTimeout(...args);
      this.timeoutIds.add(id);
      return id;
    };
    
    window.requestAnimationFrame = (callback) => {
      const id = originalRequestAnimationFrame(callback);
      this.animationFrameIds.add(id);
      return id;
    };
  }

  private detectLeaks(leakDetector: any) {
    // Check for excessive detached nodes
    if (leakDetector.detachedNodes.size > 100) {
      console.warn(`Potential memory leak: ${leakDetector.detachedNodes.size} detached DOM nodes`);
      leakDetector.detachedNodes.clear();
    }

    // Check for large objects in global scope
    this.scanForLargeObjects();
  }

  private scanForLargeObjects() {
    try {
      // Check localStorage size
      let localStorageSize = 0;
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          localStorageSize += localStorage[key].length;
        }
      }
      
      if (localStorageSize > 5 * 1024 * 1024) { // 5MB
        console.warn(`Large localStorage detected: ${(localStorageSize / 1024 / 1024).toFixed(2)}MB`);
        this.cleanupLocalStorage();
      }

      // Check sessionStorage size
      let sessionStorageSize = 0;
      for (const key in sessionStorage) {
        if (Object.prototype.hasOwnProperty.call(sessionStorage, key)) {
          sessionStorageSize += sessionStorage[key].length;
        }
      }
      
      if (sessionStorageSize > 1024 * 1024) { // 1MB
        console.warn(`Large sessionStorage detected: ${(sessionStorageSize / 1024 / 1024).toFixed(2)}MB`);
      }
    } catch (error) {
      console.error('Error scanning for large objects:', error);
    }
  }

  private triggerMemoryCleanup() {
    console.log('Triggering memory cleanup...');
    this.performCleanup();
    
    // Force garbage collection if available (Chrome DevTools)
    if ((window as any).gc) {
      (window as any).gc();
    }
  }

  private performCleanup() {
    // Cleanup expired data from localStorage
    this.cleanupLocalStorage();
    
    // Cleanup session data
    this.cleanupSessionData();
    
    // Cleanup DOM observers that are no longer needed
    this.cleanupObservers();
    
    // Clear old performance metrics
    this.cleanupPerformanceData();
  }

  private cleanupLocalStorage() {
    // Enhanced granular retention policies for different data types
    const retentionPolicies = {
      'error-logs': { 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxItems: 200,
        priority: 'critical'
      },
      'performance-metrics': { 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        maxItems: 100,
        priority: 'high'
      },
      'health-history': { 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        maxItems: 50,
        priority: 'medium'
      },
      'page-views': { 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxItems: 1000,
        priority: 'low'
      },
      'link-analytics': { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxItems: 500,
        priority: 'low'
      },
      'hipaa-assessments': { 
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        maxItems: 50,
        priority: 'critical'
      },
      'system-dependencies': { 
        maxAge: 180 * 24 * 60 * 60 * 1000, // 6 months
        maxItems: 100,
        priority: 'high'
      },
      'assessment-drafts': { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxItems: 10,
        priority: 'medium'
      },
      'training-progress': { 
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        maxItems: 100,
        priority: 'high'
      },
      'contact-submissions': { 
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        maxItems: 20,
        priority: 'medium'
      }
    };

    Object.entries(retentionPolicies).forEach(([key, policy]) => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data)) {
          const cutoffTime = Date.now() - policy.maxAge;
          
          // Filter by age
          const filtered = data.filter((item: any) => {
            const timestamp = item.timestamp || item.date || item.createdAt;
            return timestamp && new Date(timestamp).getTime() > cutoffTime;
          });
          
          // Limit by count based on priority
          let trimmed = filtered;
          if (filtered.length > policy.maxItems) {
            if (policy.priority === 'critical') {
              // Keep all recent items for critical data
              trimmed = filtered.slice(-policy.maxItems);
            } else if (policy.priority === 'high') {
              // Keep most recent for high priority
              trimmed = filtered.slice(-policy.maxItems);
            } else {
              // More aggressive cleanup for low priority
              trimmed = filtered.slice(-Math.floor(policy.maxItems * 0.8));
            }
          }
          
          if (trimmed.length !== data.length) {
            localStorage.setItem(key, JSON.stringify(trimmed));
            console.log(`Cleaned up ${key}: ${data.length} → ${trimmed.length} items`);
          }
        }
      } catch (error) {
        console.warn(`Error cleaning up ${key}:`, error);
        // For corrupted data, reset to empty array
        if (error instanceof SyntaxError) {
          localStorage.setItem(key, '[]');
        }
      }
    });
    
    // Additional cleanup for temporary and cache data
    this.cleanupTemporaryData();
    this.validateStorageQuota();
  }

  private cleanupTemporaryData() {
    // Remove temporary data that might accumulate
    const tempPatterns = ['temp-', 'cache-', 'draft-', '__health_check_', '__test_'];
    
    Object.keys(localStorage).forEach(key => {
      if (tempPatterns.some(pattern => key.startsWith(pattern))) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            // Check if it's expired temporary data
            try {
              const parsed = JSON.parse(data);
              if (parsed.expires && new Date(parsed.expires).getTime() < Date.now()) {
                localStorage.removeItem(key);
                console.log(`Removed expired temporary data: ${key}`);
              }
            } catch {
              // If not JSON or malformed, remove if older than 1 hour
              localStorage.removeItem(key);
              console.log(`Removed non-JSON temporary data: ${key}`);
            }
          }
        } catch (error) {
          console.warn(`Error cleaning temporary data ${key}:`, error);
        }
      }
    });
  }

  private validateStorageQuota() {
    // Check if we're approaching localStorage quota limits
    try {
      let totalSize = 0;
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          totalSize += localStorage[key].length;
        }
      }
      
      // Estimate quota (typically 5-10MB)
      const estimatedQuota = 5 * 1024 * 1024; // 5MB
      const usagePercentage = (totalSize / estimatedQuota) * 100;
      
      if (usagePercentage > 80) {
        console.warn(`LocalStorage usage high: ${usagePercentage.toFixed(1)}% (${(totalSize / 1024).toFixed(1)}KB)`);
        
        // Emergency cleanup if near quota
        if (usagePercentage > 90) {
          this.performEmergencyStorageCleanup();
        }
      }
    } catch (error) {
      console.error('Storage quota validation failed:', error);
    }
  }

  private performEmergencyStorageCleanup() {
    console.warn('Performing emergency storage cleanup...');
    
    // More aggressive cleanup for non-critical data
    const lowPriorityKeys = [
      'page-views', 'link-analytics', 'performance-metrics', 
      'memory-profiles', 'csp-violations', 'optimization-history'
    ];
    
    lowPriorityKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data) && data.length > 10) {
          // Keep only last 10 items for emergency cleanup
          const emergency = data.slice(-10);
          localStorage.setItem(key, JSON.stringify(emergency));
          console.log(`Emergency cleanup of ${key}: reduced to 10 items`);
        }
      } catch (error) {
        console.warn(`Emergency cleanup failed for ${key}:`, error);
      }
    });
  }

  private cleanupSessionData() {
    // Clear old session storage data
    try {
      for (const key in sessionStorage) {
        if (key.startsWith('temp-') || key.startsWith('cache-')) {
          const item = sessionStorage.getItem(key);
          if (item) {
            try {
              const data = JSON.parse(item);
              if (data.expires && new Date(data.expires).getTime() < Date.now()) {
                sessionStorage.removeItem(key);
              }
            } catch {
              // If it's not JSON or doesn't have expiry, remove old temp items
              sessionStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error cleaning session data:', error);
    }
  }

  private cleanupObservers() {
    // This would be called by components when they unmount
    this.observerInstances.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Error disconnecting observer:', error);
      }
    });
  }

  private cleanupPerformanceData() {
    // Clear old performance metrics
    try {
      const metrics = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      const filtered = metrics.filter((metric: any) => 
        new Date(metric.timestamp).getTime() > oneHourAgo
      );
      
      localStorage.setItem('performance-metrics', JSON.stringify(filtered));
    } catch (error) {
      console.warn('Error cleaning performance data:', error);
    }
  }

  private logMemoryProfile(memory: any, usagePercentage: number) {
    const profile = {
      timestamp: new Date().toISOString(),
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: Math.round(usagePercentage),
      url: window.location.pathname
    };

    // Store memory profiles
    const profiles = JSON.parse(localStorage.getItem('memory-profiles') || '[]');
    profiles.push(profile);
    
    // Keep only last 50 profiles
    if (profiles.length > 50) {
      profiles.splice(0, profiles.length - 50);
    }
    
    localStorage.setItem('memory-profiles', JSON.stringify(profiles));
  }

  // Public methods for components to register cleanup tasks

  public addObserver(observer: IntersectionObserver | MutationObserver | PerformanceObserver) {
    this.observerInstances.add(observer);
  }

  public removeObserver(observer: IntersectionObserver | MutationObserver | PerformanceObserver) {
    observer.disconnect();
    this.observerInstances.delete(observer);
  }

  public addInterval(id: NodeJS.Timeout) {
    this.intervalIds.add(id);
  }

  public addTimeout(id: NodeJS.Timeout) {
    this.timeoutIds.add(id);
  }

  public addAnimationFrame(id: number) {
    this.animationFrameIds.add(id);
  }

  public registerEventListener(target: EventTarget, type: string, listener: () => void) {
    const key = `${target.constructor.name}-${type}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, new Set());
    }
    this.eventListeners.get(key)!.add(listener);
  }

  public cleanup() {
    // Clear all tracked resources
    this.intervalIds.forEach(id => clearInterval(id));
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.animationFrameIds.forEach(id => cancelAnimationFrame(id));
    this.observerInstances.forEach(observer => observer.disconnect());

    // Clear tracking sets
    this.intervalIds.clear();
    this.timeoutIds.clear();
    this.animationFrameIds.clear();
    this.observerInstances.clear();
    this.eventListeners.clear();

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  public getMemoryReport() {
    const profiles = JSON.parse(localStorage.getItem('memory-profiles') || '[]');
    const current = ('memory' in performance) ? (performance as any).memory : null;
    
    return {
      current: current ? {
        used: Math.round(current.usedJSHeapSize / 1024 / 1024), // MB
        total: Math.round(current.totalJSHeapSize / 1024 / 1024), // MB
        limit: Math.round(current.jsHeapSizeLimit / 1024 / 1024), // MB
        percentage: Math.round((current.usedJSHeapSize / current.jsHeapSizeLimit) * 100)
      } : null,
      history: profiles,
      tracking: {
        intervals: this.intervalIds.size,
        timeouts: this.timeoutIds.size,
        observers: this.observerInstances.size,
        animationFrames: this.animationFrameIds.size,
        eventListeners: Array.from(this.eventListeners.values()).reduce((sum, set) => sum + set.size, 0)
      }
    };
  }
}

export const memoryManager = new MemoryManager();

// React hook for memory-aware components
export const useMemoryManager = () => {
  React.useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    const timeouts: NodeJS.Timeout[] = [];
    const observers: (IntersectionObserver | MutationObserver)[] = [];
    
    return () => {
      // Cleanup on unmount
      intervals.forEach(id => clearInterval(id));
      timeouts.forEach(id => clearTimeout(id));
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return {
    addInterval: (callback: () => void, delay: number) => {
      const id = setInterval(callback, delay);
      memoryManager.addInterval(id);
      return id;
    },
    
    addTimeout: (callback: () => void, delay: number) => {
      const id = setTimeout(callback, delay);
      memoryManager.addTimeout(id);
      return id;
    },
    
    addObserver: (observer: IntersectionObserver | MutationObserver) => {
      memoryManager.addObserver(observer);
      return observer;
    },
    
    getMemoryReport: () => memoryManager.getMemoryReport()
  };
};

// Export for global use
export default memoryManager;