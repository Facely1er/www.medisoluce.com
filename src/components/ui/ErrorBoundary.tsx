import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (!import.meta.env.PROD) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to analytics or error reporting service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-accent-600 dark:text-accent-400" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Something went wrong
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {this.props.showDetails && this.state.error && !import.meta.env.PROD && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <Bug className="h-4 w-4 mr-2" />
                    Error Details
                  </h3>
                  <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                    {this.state.error.message}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  className="w-full"
                  icon={<RefreshCw className="h-4 w-4" />}
                >
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="w-full"
                  icon={<Home className="h-4 w-4" />}
                >
                  Go to Homepage
                </Button>
              </div>

              {/* Support Information */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  If this problem persists, please contact our support team.
                </p>
                <a
                  href="mailto:support@medisoluce.com"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                >
                  support@medisoluce.com
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based Error Boundary for functional components
interface UseErrorHandlerReturn {
  error: Error | null;
  resetError: () => void;
  ErrorBoundary: React.ComponentType<{ children: ReactNode }>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const ErrorBoundaryWrapper = React.useCallback(({ children }: { children: ReactNode }) => {
    return (
      <ErrorBoundary
        onError={(error) => setError(error)}
        fallback={
          error ? (
            <div className="p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-accent-600 dark:text-accent-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-accent-800 dark:text-accent-200">
                    An error occurred
                  </h3>
                  <p className="text-sm text-accent-700 dark:text-accent-300 mt-1">
                    {error.message}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetError}
                  className="ml-auto"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ) : null
        }
      >
        {children}
      </ErrorBoundary>
    );
  }, [error, resetError]);

  return { error, resetError, ErrorBoundary: ErrorBoundaryWrapper };
};

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<Props>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;