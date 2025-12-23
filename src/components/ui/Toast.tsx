import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastIcons = {
  success: <CheckCircle className="h-5 w-5 text-success-500" />,
  error: <XCircle className="h-5 w-5 text-accent-500" />,
  warning: <AlertCircle className="h-5 w-5 text-warning-500" />,
  info: <Info className="h-5 w-5 text-primary-500" />
};

const toastStyles = {
  success: 'border-success-200 bg-success-50 dark:bg-success-900/20',
  error: 'border-accent-200 bg-accent-50 dark:bg-accent-900/20',
  warning: 'border-warning-200 bg-warning-50 dark:bg-warning-900/20',
  info: 'border-primary-200 bg-primary-50 dark:bg-primary-900/20'
};

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`max-w-sm w-full border rounded-lg shadow-lg ${toastStyles[toast.type]} p-4`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {toastIcons[toast.type]}
        </div>
        <div className="ml-3 flex-grow">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const hideToast = useCallback((id: string) => {
    // Clear timeout if it exists
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
    
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    setToasts(prev => {
      // Prevent duplicate toasts with same title and message
      const isDuplicate = prev.some(
        t => t.title === toast.title && t.message === toast.message
      );
      if (isDuplicate) {
        return prev;
      }
      
      // Use a more unique ID to prevent collisions
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { ...toast, id };
      
      // Auto remove after duration (default 5 seconds)
      const duration = toast.duration || 5000;
      const timeoutId = setTimeout(() => {
        hideToast(id);
      }, duration);
      
      // Store timeout ID for cleanup
      timeoutRefs.current.set(id, timeoutId);
      
      return [...prev, newToast];
    });
  }, [hideToast]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeoutRefs.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={hideToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};