// Analytics utilities for tracking user interactions
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    // Sentry for error tracking
    Sentry?: {
      captureException: (error: Error, context?: Record<string, unknown>) => void;
      setUser: (user: { id?: string; email?: string; username?: string }) => void;
    };
  }
}

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class Analytics {
  private isEnabled: boolean = false;
  private isProduction: boolean = false;

  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.isEnabled = this.isProduction && typeof window !== 'undefined';
    
    // Enhanced error tracking for production
    if (this.isProduction) {
      this.initErrorTracking();
      this.initPerformanceMonitoring();
    }
  }

  // Initialize performance monitoring
  private initPerformanceMonitoring() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor Core Web Vitals
      this.observeWebVitals();
      
      // Monitor resource loading
      this.observeResourceTiming();
    }
  }

  private observeWebVitals() {
    try {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            this.trackPerformance('largest_contentful_paint', entry.startTime);
          }
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input' && 'processingStart' in entry && 'startTime' in entry) {
            this.trackPerformance('first_input_delay', (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime);
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift' && 'hadRecentInput' in entry && 'value' in entry) {
            this.trackPerformance('cumulative_layout_shift', (entry as PerformanceEntry & { hadRecentInput: boolean; value: number }).value);
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      this.log('Error setting up performance monitoring:', error);
    }
  }

  private observeResourceTiming() {
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // Track slow resources
          if (entry.entryType === 'resource' && 'duration' in entry && entry.duration > 1000) { // Resources taking >1s
            this.trackPerformance('slow_resource', entry.duration);
          }
        });
      }).observe({ entryTypes: ['resource'] });
    } catch (error) {
      this.log('Error setting up resource monitoring:', error);
    }
  }
  // Initialize error tracking (Sentry or similar)
  private initErrorTracking() {
    if (typeof window !== 'undefined') {
      // Enhanced error tracking with more context
      window.addEventListener('error', (event) => {
        this.trackError('JavaScript Error', {
          message: event.error?.message || 'Unknown error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        this.trackError('Unhandled Promise Rejection', {
          message: event.reason?.message || 'Unknown rejection',
          reason: String(event.reason),
          stack: event.reason?.stack
        });
      });
      
      // Monitor for CSP violations
      window.addEventListener('securitypolicyviolation', (event) => {
        this.trackError('CSP Violation', {
          message: `CSP violation: ${event.violatedDirective}`,
          blockedUri: event.blockedURI,
          violatedDirective: event.violatedDirective,
          originalPolicy: event.originalPolicy
        });
      });
    }
  }

  // Initialize analytics (Google Analytics, etc.) with fallback
  init(trackingId?: string) {
    if (!this.isEnabled || !trackingId) return;

    const initAnalytics = () => {
      try {
        // Google Analytics 4 initialization with timeout
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        script.async = true;
        
        // Add error handler for script loading
        script.onerror = () => {
          this.handleAnalyticsFailure(new Error('Failed to load Google Analytics script'));
        };
        
        // Add timeout for script loading
        const timeoutId = setTimeout(() => {
          if (!window.gtag) {
            this.handleAnalyticsFailure(new Error('Google Analytics script load timeout'));
          }
        }, 10000); // 10 second timeout

        script.onload = () => {
          clearTimeout(timeoutId);
        };

        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(...args: unknown[]) {
          try {
            window.dataLayer.push(args);
          } catch (error) {
            // Silently fail - don't break app if dataLayer fails
            if (!this.isProduction) {
              console.warn('Analytics dataLayer error:', error);
            }
          }
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', trackingId, {
          page_title: document.title,
          page_location: window.location.href
        });
        
        this.log('Analytics initialized with tracking ID:', trackingId);
        
        // Mark service as available
        import('./serviceFallback')
          .then(({ serviceFallback }) => {
            serviceFallback.markServiceAvailable('analytics');
          })
          .catch(() => {
            // Fallback manager not available - continue anyway
          });
      } catch (error) {
        this.handleAnalyticsFailure(error as Error);
      }
    };

    // Use service fallback
    import('./serviceFallback')
      .then(({ safeExecuteSilent }) => {
        safeExecuteSilent(initAnalytics, undefined);
      })
      .catch(() => {
        // Fallback manager not available - try direct call
        initAnalytics();
      });
  }

  /**
   * Handle analytics initialization failure gracefully
   */
  private handleAnalyticsFailure(error: Error): void {
    // Mark service as unavailable
    import('./serviceFallback')
      .then(({ serviceFallback }) => {
        serviceFallback.markServiceUnavailable('analytics', error);
      })
      .catch(() => {
        // Fallback manager not available - continue anyway
      });

    // Log to console as fallback
    if (!this.isProduction) {
      console.warn('Failed to initialize analytics:', error);
      console.info('Analytics will be disabled - app continues normally');
    } else {
      // In production, silently disable analytics
      this.isEnabled = false;
    }
  }

  // Track page views with fallback
  trackPageView(path: string, title?: string) {
    if (!this.isEnabled) return;

    const track = () => {
      try {
        if (window.gtag) {
          window.gtag('event', 'page_view', {
            page_path: path,
            page_title: title || document.title,
            page_location: window.location.href
          });
        }
      } catch (error) {
        // Silently fail - don't break app if analytics fails
        if (!this.isProduction) {
          this.log('Error tracking page view:', error);
        }
      }
    };

    // Use service fallback
    import('./serviceFallback')
      .then(({ safeExecuteSilent }) => {
        safeExecuteSilent(track, undefined);
      })
      .catch(() => {
        // Fallback manager not available - try direct call
        track();
      });
  }

  // Track custom events with fallback
  trackEvent({ event, category, action, label, value }: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const track = () => {
      try {
        if (window.gtag) {
          window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
            custom_parameter_event: event
          });
        }

        // Also log to console in development
        if (!this.isProduction) {
          if (!import.meta.env.PROD) {
            console.log('Analytics event:', { event, category, action, label, value });
          }
        }
      } catch (error) {
        // Silently fail - don't break app if analytics fails
        if (!this.isProduction) {
          this.log('Error tracking event:', error);
        }
      }
    };

    // Use service fallback
    import('./serviceFallback')
      .then(({ safeExecuteSilent }) => {
        safeExecuteSilent(track, undefined);
      })
      .catch(() => {
        // Fallback manager not available - try direct call
        track();
      });
  }

  // Track assessment completions
  trackAssessmentComplete(assessmentType: string, score: number) {
    this.trackEvent({
      event: 'assessment_complete',
      category: 'Assessment',
      action: 'Complete',
      label: assessmentType,
      value: score
    });
  }

  // Track form submissions
  trackFormSubmit(formName: string) {
    this.trackEvent({
      event: 'form_submit',
      category: 'Form',
      action: 'Submit',
      label: formName
    });
  }

  // Track downloads
  trackDownload(resourceName: string, fileType: string) {
    this.trackEvent({
      event: 'download',
      category: 'Resource',
      action: 'Download',
      label: `${resourceName} (${fileType})`
    });
  }

  // Track language changes
  trackLanguageChange(newLanguage: string) {
    this.trackEvent({
      event: 'language_change',
      category: 'User Preference',
      action: 'Language Change',
      label: newLanguage
    });
  }

  // Track errors
  trackError(errorType: string, errorData: string | { message: string; [key: string]: unknown }) {
    if (!this.isEnabled) return;
    
    const _errorMessage = typeof errorData === 'string' ? errorData : errorData.message;
    const _errorContext = typeof errorData === 'object' ? errorData : {};
    
    try {
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: `${errorType}: ${errorMessage}`,
          fatal: false,
          ...errorContext
        });
      }
    } catch (error) {
      console.error('Error tracking error:', error);
    }
  }

  // Performance tracking
  trackPerformance(metricName: string, value: number) {
    this.trackEvent({
      event: 'performance',
      category: 'Performance',
      action: 'Metric',
      label: metricName,
      value: Math.round(value)
    });
  }

  // Private logging method
  private log(...args: unknown[]) {
    if (!this.isProduction) {
      if (!import.meta.env.PROD) {
        console.log($1);
      }
    }
  }
}

// Global analytics instance
export const analytics = new Analytics();