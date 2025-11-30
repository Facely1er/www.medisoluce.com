/**
 * Centralized Logging Utility
 * Provides production-safe logging with support for external logging services
 */

interface LogEntry {
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  stack?: string;
  url?: string;
  userAgent?: string;
}

interface LoggingConfig {
  enableConsole: boolean;
  enableExternalLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  maxLogEntries: number;
}

class CentralizedLogger {
  private config: LoggingConfig;
  private logBuffer: LogEntry[] = [];
  private isDevelopment: boolean;
  private errorHandler?: any;

  constructor() {
    this.isDevelopment = !import.meta.env.PROD;
    this.config = {
      enableConsole: true,
      enableExternalLogging: import.meta.env.PROD,
      logLevel: this.isDevelopment ? 'debug' : 'warn',
      maxLogEntries: 100
    };
  }

  /**
   * Initialize logger with error handler
   */
  async initialize(): Promise<void> {
    if (this.config.enableExternalLogging) {
      try {
        const { errorHandler } = await import('./errorHandler');
        this.errorHandler = errorHandler;
      } catch (error) {
        console.warn('Failed to initialize error handler for logging:', error);
      }
    }
  }

  /**
   * Log a message
   */
  log(message: string, ...args: unknown[]): void {
    this.logEntry('log', message, args);
    if (this.shouldLog('log')) {
      if (this.isDevelopment) {
        console.log(message, ...args);
      }
    }
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: unknown[]): void {
    this.logEntry('info', message, args);
    if (this.shouldLog('info')) {
      if (this.isDevelopment) {
        console.info(message, ...args);
      }
    }
  }

  /**
   * Log a warning
   */
  warn(message: string, ...args: unknown[]): void {
    this.logEntry('warn', message, args);
    if (this.shouldLog('warn')) {
      console.warn(message, ...args);
      this.sendToExternalLogging('warn', message, args);
    }
  }

  /**
   * Log an error
   */
  error(message: string, ...args: unknown[]): void {
    this.logEntry('error', message, args);
    // Always log errors
    console.error(message, ...args);
    this.sendToExternalLogging('error', message, args);
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: unknown[]): void {
    this.logEntry('debug', message, args);
    if (this.shouldLog('debug')) {
      if (this.isDevelopment) {
        console.debug(message, ...args);
      }
    }
  }

  /**
   * Check if message should be logged based on log level
   */
  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Create log entry
   */
  private logEntry(level: LogEntry['level'], message: string, args: unknown[]): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: args.length > 0 ? { args } : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };

    // Add stack trace for errors
    if (level === 'error' && args[0] instanceof Error) {
      entry.stack = args[0].stack;
      entry.context = { ...entry.context, error: args[0].message };
    }

    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.config.maxLogEntries) {
      this.logBuffer.shift();
    }
  }

  /**
   * Send log to external logging service
   */
  private async sendToExternalLogging(level: string, message: string, args: unknown[]): Promise<void> {
    if (!this.config.enableExternalLogging) return;

    try {
      // Send to error handler if available
      if (this.errorHandler && (level === 'error' || level === 'warn')) {
        if (level === 'error' && args[0] instanceof Error) {
          this.errorHandler.logError({
            type: 'javascript',
            message: message || args[0].message,
            stack: args[0].stack,
            url: typeof window !== 'undefined' ? window.location.href : undefined
          });
        } else if (level === 'warn') {
          // Log warnings as lower severity errors
          this.errorHandler.logError({
            type: 'javascript',
            message: message,
            url: typeof window !== 'undefined' ? window.location.href : undefined
          });
        }
      }
    } catch (error) {
      // Don't log errors in logging to avoid infinite loops
      if (this.isDevelopment) {
        console.warn('Failed to send log to external service:', error);
      }
    }
  }

  /**
   * Get log buffer
   */
  getLogs(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * Clear log buffer
   */
  clearLogs(): void {
    this.logBuffer = [];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logBuffer.filter(entry => entry.level === level);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create singleton instance
const centralizedLogger = new CentralizedLogger();

// Initialize logger
centralizedLogger.initialize().catch(() => {
  // Silently fail initialization
});

// Export logger with same interface as before
export const logger = {
  log: (message: string, ...args: unknown[]) => centralizedLogger.log(message, ...args),
  warn: (message: string, ...args: unknown[]) => centralizedLogger.warn(message, ...args),
  error: (message: string, ...args: unknown[]) => centralizedLogger.error(message, ...args),
  info: (message: string, ...args: unknown[]) => centralizedLogger.info(message, ...args),
  debug: (message: string, ...args: unknown[]) => centralizedLogger.debug(message, ...args),
  // Additional methods
  getLogs: () => centralizedLogger.getLogs(),
  clearLogs: () => centralizedLogger.clearLogs(),
  getLogsByLevel: (level: LogEntry['level']) => centralizedLogger.getLogsByLevel(level),
  updateConfig: (config: Partial<LoggingConfig>) => centralizedLogger.updateConfig(config)
};