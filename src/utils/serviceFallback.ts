/**
 * Service Fallback Utility
 * Provides graceful degradation when external services fail
 */

interface ServiceStatus {
  name: string;
  available: boolean;
  lastError?: Error;
  lastCheck?: Date;
  retryCount: number;
  maxRetries: number;
}

class ServiceFallbackManager {
  private services: Map<string, ServiceStatus> = new Map();
  private defaultMaxRetries = 3;
  private retryDelay = 5000; // 5 seconds

  /**
   * Register a service
   */
  registerService(name: string, maxRetries: number = this.defaultMaxRetries): void {
    this.services.set(name, {
      name,
      available: true,
      retryCount: 0,
      maxRetries
    });
  }

  /**
   * Check if service is available
   */
  isServiceAvailable(name: string): boolean {
    const service = this.services.get(name);
    return service?.available ?? true; // Default to available if not registered
  }

  /**
   * Mark service as unavailable
   */
  markServiceUnavailable(name: string, error?: Error): void {
    const service = this.services.get(name);
    if (service) {
      service.available = false;
      service.lastError = error;
      service.lastCheck = new Date();
      service.retryCount++;

      // Schedule retry if under max retries
      if (service.retryCount < service.maxRetries) {
        setTimeout(() => {
          this.retryService(name);
        }, this.retryDelay * service.retryCount); // Exponential backoff
      }
    }
  }

  /**
   * Mark service as available
   */
  markServiceAvailable(name: string): void {
    const service = this.services.get(name);
    if (service) {
      service.available = true;
      service.retryCount = 0;
      service.lastError = undefined;
      service.lastCheck = new Date();
    }
  }

  /**
   * Retry service check
   */
  private async retryService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service) return;

    // Simple health check - just mark as available for now
    // Services will be marked unavailable again if they fail
    this.markServiceAvailable(name);
  }

  /**
   * Execute with fallback
   */
  async executeWithFallback<T>(
    serviceName: string,
    primaryFn: () => Promise<T>,
    fallbackFn: () => T | Promise<T>,
    markUnavailableOnError: boolean = true
  ): Promise<T> {
    if (!this.isServiceAvailable(serviceName)) {
      return fallbackFn();
    }

    try {
      const result = await this.withTimeout(primaryFn(), 5000); // 5 second timeout
      this.markServiceAvailable(serviceName);
      return result;
    } catch (error) {
      if (markUnavailableOnError) {
        this.markServiceUnavailable(serviceName, error as Error);
      }
      return fallbackFn();
    }
  }

  /**
   * Execute with timeout
   */
  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }

  /**
   * Get service status
   */
  getServiceStatus(name: string): ServiceStatus | undefined {
    return this.services.get(name);
  }

  /**
   * Get all service statuses
   */
  getAllServiceStatuses(): ServiceStatus[] {
    return Array.from(this.services.values());
  }
}

// Create singleton instance
export const serviceFallback = new ServiceFallbackManager();

// Register default services
serviceFallback.registerService('sentry', 3);
serviceFallback.registerService('analytics', 3);
serviceFallback.registerService('csp-reporting', 3);
serviceFallback.registerService('health-check', 5);

/**
 * Safe execute with fallback wrapper
 */
export async function safeExecute<T>(
  serviceName: string,
  primaryFn: () => Promise<T>,
  fallbackFn: () => T | Promise<T> = () => undefined as T,
  markUnavailable: boolean = true
): Promise<T> {
  return serviceFallback.executeWithFallback(serviceName, primaryFn, fallbackFn, markUnavailable);
}

/**
 * Safe execute without throwing
 */
export async function safeExecuteSilent<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
    ]);
  } catch {
    return fallback;
  }
}

