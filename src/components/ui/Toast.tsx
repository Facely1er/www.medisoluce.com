import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration (default 5 seconds)
    const duration = toast.duration || 5000;
    setTimeout(() => {
      hideToast(id);
    }, duration);
  }, [hideToast]);

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