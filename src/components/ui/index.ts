// UI Components Index
// Centralized exports for all UI components

// Core Components
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';
export { default as FormField } from './FormField';
export { ToastProvider } from './Toast';

// Loading States
export { LoadingSpinner, Skeleton, LoadingState } from './LoadingStates';

// Error Handling
export { default as ErrorBoundary, useErrorHandler, withErrorBoundary } from './ErrorBoundary';

// Layout Components
export { default as SEOHead } from './SEOHead';
export { default as HeroBanner } from './HeroBanner';
export { default as TextCarousel } from './TextCarousel';
export { default as ServiceWorkerManager } from './ServiceWorkerManager';
export { default as HealthEnhancementDashboard } from './HealthEnhancementDashboard';

// Component Types
export type { ButtonProps } from './Button';
export type { CardProps } from './Card';
export type { ModalProps } from './Modal';
export type { FormFieldProps } from './FormField';
export type { ToastType, ToastContextType } from './Toast';

// Re-export commonly used icons for consistency
export {
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Download,
  RefreshCw,
  Search,
  Menu,
  Sun,
  Moon,
  ShieldCheck,
  Server,
  FileText,
  LifeBuoy,
  User,
  AlertTriangle,
  Home,
  Globe,
  Activity,
  Zap,
  Shield,
  Eye,
  Bug,
  Clock,
  Wrench,
  Play,
  Pause
} from 'lucide-react';
