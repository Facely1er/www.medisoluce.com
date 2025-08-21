import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Download } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { errorHandler } from '../../utils/errorHandler';
import Button from './Button';
import Card from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private readonly maxRetries = 3;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorId: Date.now().toString()
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log detailed error information
    console.group('🚨 React Error Boundary Triggered');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Stack:', error.stack);
    console.groupEnd();
    
    // Track error in analytics
    analytics.trackError('React Error Boundary', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });
    
    // Log to error handler
    errorHandler.logError({
      type: 'javascript',
      message: `React Error: ${error.message}`,
      stack: error.stack
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Store error details for debugging
    this.storeErrorDetails(error, errorInfo);
  }

  private storeErrorDetails(error: Error, errorInfo: ErrorInfo) {
    try {
      const errorDetails = {
        id: this.state.errorId,
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        errorInfo: {
          componentStack: errorInfo.componentStack
        },
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          retryCount: this.retryCount
        }
      };

      const errorLog = JSON.parse(localStorage.getItem('react-errors') || '[]');
      errorLog.push(errorDetails);
      
      // Keep only last 10 errors
      if (errorLog.length > 10) {
        errorLog.splice(0, errorLog.length - 10);
      }
      
      localStorage.setItem('react-errors', JSON.stringify(errorLog));
    } catch (storageError) {
      console.error('Failed to store error details:', storageError);
    }
  }

  private handleRetry = () => {
    this.retryCount++;
    
    if (this.retryCount <= this.maxRetries) {
      console.log(`Retrying... (${this.retryCount}/${this.maxRetries})`);
      
      // Reset error state
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined
      });
    } else {
      // Max retries reached, show permanent error
      this.setState({
        hasError: true,
        error: new Error('Maximum retry attempts reached')
      });
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private exportErrorDetails = () => {
    const errorLog = localStorage.getItem('react-errors') || '[]';
    const blob = new Blob([errorLog], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medisoluce-error-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  private getErrorSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    if (!this.state.error) return 'low';
    
    const error = this.state.error;
    
    // Critical errors
    if (error.message.includes('ChunkLoadError') || 
        error.message.includes('Loading chunk') ||
        error.message.includes('Network Error')) {
      return 'critical';
    }
    
    // High severity
    if (error.message.includes('TypeError') ||
        error.message.includes('ReferenceError') ||
        error.message.includes('Cannot read') ||
        error.message.includes('Cannot access')) {
      return 'high';
    }
    
    // Medium severity
    if (error.message.includes('Warning') ||
        error.message.includes('Deprecated')) {
      return 'medium';
    }
    
    return 'low';
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  }

  private getUserFriendlyMessage(error: Error): string {
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'The application failed to load some resources. This may be due to a network issue or an app update.';
    }
    
    if (error.message.includes('Network Error')) {
      return 'A network error occurred. Please check your internet connection and try again.';
    }
    
    if (error.message.includes('Cannot read')) {
      return 'The application encountered an unexpected data issue. This may be temporary.';
    }
    
    return 'An unexpected error occurred. Our team has been notified and is working on a fix.';
  }

  public render() {
    if (this.state.hasError) {
      const severity = this.getErrorSeverity();
      const userMessage = this.getUserFriendlyMessage(this.state.error!);
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-lg w-full">
            <Card className={`p-8 border-2 ${this.getSeverityColor(severity)}`}>
              <div className="text-center">
                <AlertTriangle className="h-16 w-16 text-accent-500 mx-auto mb-4" />
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {severity === 'critical' ? 'Critical Application Error' : 'Something went wrong'}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {userMessage}
                </p>

                {/* Error details for development */}
                {!import.meta.env.PROD && this.state.error && (
                  <details className="mb-6 text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Technical Details (Development Only)
                    </summary>
                    <div className="space-y-2">
                      <div>
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      <div>
                        <strong>Type:</strong> {this.state.error.name}
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="text-xs mt-1 overflow-auto max-h-32">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                      <div>
                        <strong>Error ID:</strong> {this.state.errorId}
                      </div>
                      <div>
                        <strong>Retry Count:</strong> {this.retryCount}/{this.maxRetries}
                      </div>
                    </div>
                  </details>
                )}

                {/* Action buttons */}
                <div className="space-y-3">
                  {this.retryCount < this.maxRetries ? (
                    <Button 
                      onClick={this.handleRetry}
                      icon={<RefreshCw className="h-4 w-4" />}
                      fullWidth
                    >
                      Retry ({this.maxRetries - this.retryCount} attempts remaining)
                    </Button>
                  ) : (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                      <p className="text-red-800 dark:text-red-200 text-sm">
                        Maximum retry attempts reached. Please refresh the page or contact support.
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      onClick={this.handleRefresh}
                      icon={<RefreshCw className="h-4 w-4" />}
                    >
                      Refresh Page
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={this.handleGoHome}
                      icon={<Home className="h-4 w-4" />}
                    >
                      Go Home
                    </Button>
                  </div>

                  {/* Development only export */}
                  {!import.meta.env.PROD && (
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={this.exportErrorDetails}
                      icon={<Download className="h-4 w-4" />}
                      fullWidth
                    >
                      Export Error Details
                    </Button>
                  )}
                </div>

                {/* Help text */}
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <p>If this problem persists, please contact support at:</p>
                  <a 
                    href="mailto:support@medisoluce.com" 
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    support@medisoluce.com
                  </a>
                </div>

                {/* Privacy notice */}
                <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                  <p>Error details are stored locally on your device for debugging purposes.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;