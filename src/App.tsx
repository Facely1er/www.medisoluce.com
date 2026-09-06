import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LocaleProvider } from './components/i18n/LocaleProvider';
import TranslationGuard from './components/i18n/TranslationGuard';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ToastProvider, useToast } from './components/ui/Toast';
import { analytics } from './utils/analytics';
import { isBillingEnabled } from './config/runtimeConfig';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './i18n';
import LoadingSpinner from './components/ui/LoadingSpinner';
import CookieConsent from './components/ui/CookieConsent';

// Route-level code splitting: every page except the home page is its own chunk.
const HIPAACheckPage = React.lazy(() => import('./pages/HIPAACheckPage'));
const DependencyManagerPage = React.lazy(() => import('./pages/DependencyManagerPage'));
const BusinessImpactPage = React.lazy(() => import('./pages/BusinessImpactPage'));
const ContinuityPage = React.lazy(() => import('./pages/ContinuityPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const ThanksPage = React.lazy(() => import('./pages/ThanksPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const DemoPage = React.lazy(() => import('./pages/DemoPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const CookiePolicyPage = React.lazy(() => import('./pages/CookiePolicyPage'));
const ECommercePolicyPage = React.lazy(() => import('./pages/ECommercePolicyPage'));
const TermsCombinedPage = React.lazy(() => import('./pages/TermsCombinedPage'));
const ProductionReadinessPage = React.lazy(() => import('./pages/ProductionReadinessPage'));
const DeploymentPage = React.lazy(() => import('./pages/DeploymentPage'));
const SecurityDashboard = React.lazy(() => import('./components/security/SecurityDashboard'));
const Login = React.lazy(() => import('./components/auth/Login'));
const Register = React.lazy(() => import('./components/auth/Register'));
const ForgotPassword = React.lazy(() => import('./components/auth/ForgotPassword'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const RansomwarePage = React.lazy(() => import('./pages/RansomwarePage'));
const RansomwareResiliencePage = React.lazy(() => import('./pages/RansomwareResiliencePage'));
const RansomwareThreatDashboardPage = React.lazy(() => import('./pages/RansomwareThreatDashboardPage'));
const HealthDashboardPage = React.lazy(() => import('./pages/HealthDashboardPage'));
const TrainingPage = React.lazy(() => import('./pages/TrainingPage'));
const TrainingModulePage = React.lazy(() => import('./pages/training/TrainingModulePage'));
const TrainingMaterialsPage = React.lazy(() => import('./pages/training/TrainingMaterialsPage'));
const Certificate = React.lazy(() => import('./components/training/Certificate'));
const ToolkitPage = React.lazy(() => import('./pages/ToolkitPage'));
const EnhancedAssessmentEngine = React.lazy(() => import('./components/assessment/EnhancedAssessmentEngine'));
const RansomwareAssessment = React.lazy(() => import('./components/assessment/RansomwareAssessment'));
const PricingOverviewPage = React.lazy(() => import('./pages/PricingOverviewPage'));
const HIPAAPricingPage = React.lazy(() => import('./pages/HIPAAPricingPage'));
const RansomwarePricingPage = React.lazy(() => import('./pages/RansomwarePricingPage'));
const ContinuityPricingPage = React.lazy(() => import('./pages/ContinuityPricingPage'));
const CheckoutSuccessPage = React.lazy(() => import('./pages/CheckoutSuccessPage'));
const CheckoutCancelPage = React.lazy(() => import('./pages/CheckoutCancelPage'));
const SegmentAnalysisPage = React.lazy(() => import('./pages/SegmentAnalysisPage'));
const FAQPage = React.lazy(() => import('./pages/FAQPage'));
const HealthDashboard = React.lazy(() => import('./components/ui/HealthDashboard'));

// Lazy load development tools
const PerformanceMonitor = React.lazy(() => import('./components/ui/PerformanceMonitor'));
const ServiceWorkerManager = React.lazy(() => import('./components/ui/ServiceWorkerManager'));
const ProductionReadinessIndicator = React.lazy(() => import('./components/ui/ProductionReadinessIndicator'));
const HealthOptimizer = React.lazy(() => import('./components/health/HealthOptimizer'));
const HealthEnhancementDashboard = React.lazy(() => import('./components/ui/HealthEnhancementDashboard'));

// Register analytics (never throw). Nothing is loaded until VITE_ENABLE_ANALYTICS=true,
// VITE_GA_TRACKING_ID is set, and the visitor grants consent via <CookieConsent />.
try {
  analytics.init(import.meta.env.VITE_GA_TRACKING_ID);
} catch (error) {
  // Silently fail - analytics is optional, app continues normally
  if (!import.meta.env.PROD) {
    console.warn('Analytics initialization failed, but app continues:', error);
  }
}

// Global toast function for components that can't use React hooks
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

// Extend the global Window interface using declaration merging
declare global {
  interface Window {
    setGlobalToast: (fn: (toast: Omit<ToastMessage, 'id'>) => void) => void;
    showToast: (toast: ToastMessage) => void;
  }
}

function setupGlobalToast() {
  let toastFunction: ((toast: Omit<ToastMessage, 'id'>) => void) | null = null;
  
  window.setGlobalToast = (fn: (toast: Omit<ToastMessage, 'id'>) => void) => {
    toastFunction = fn;
  };
  
  window.showToast = (toast: ToastMessage) => {
    if (toastFunction) {
      toastFunction(toast);
    }
  };
}

setupGlobalToast();

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-live="polite">
      <LoadingSpinner size="lg" />
    </div>
  );
}

function AppContent() {
  return (
    <Router>
      <Layout>
        <React.Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* PWA app scope: redirect /app* to current routes until Phase 2 moves app under /app */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="/app/hipaa-check" element={<Navigate to="/hipaa-check" replace />} />
          <Route path="/app/dependency-manager" element={<Navigate to="/dependency-manager" replace />} />
          <Route path="/app/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/hipaa-check" element={<HIPAACheckPage />} />
          <Route path="/dependency-manager" element={<DependencyManagerPage />} />
          <Route path="/business-impact" element={<BusinessImpactPage />} />
          <Route path="/continuity" element={<ContinuityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/thanks" element={<ThanksPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-combined" element={<TermsCombinedPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/ecommerce-policy" element={<ECommercePolicyPage />} />
          <Route path="/health" element={<HealthDashboard />} />
          <Route path="/health-dashboard" element={<HealthDashboardPage />} />
          <Route path="/ransomware" element={<RansomwarePage />} />
          <Route path="/ransomware-resilience" element={<RansomwareResiliencePage />} />
          <Route path="/ransomware-assessment" element={<RansomwareAssessment />} />
          <Route path="/ransomware-threat-dashboard" element={<RansomwareThreatDashboardPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/training/:moduleId/certificate" element={<Certificate />} />
          <Route path="/training/:moduleId/materials" element={<TrainingMaterialsPage />} />
          <Route path="/training/:moduleId/:lessonId" element={<TrainingModulePage />} />
          <Route path="/toolkit" element={<ToolkitPage />} />
          <Route path="/comprehensive-assessment" element={<EnhancedAssessmentEngine />} />
          <Route path="/security" element={<SecurityDashboard />} />
          <Route path="/production-readiness" element={<ProductionReadinessPage />} />
          <Route path="/deployment" element={<DeploymentPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/pricing" element={<PricingOverviewPage />} />
          <Route path="/pricing/hipaa" element={<HIPAAPricingPage />} />
          <Route path="/pricing/ransomware" element={<RansomwarePricingPage />} />
          <Route path="/pricing/continuity" element={<ContinuityPricingPage />} />
          <Route path="/checkout/success" element={isBillingEnabled ? <CheckoutSuccessPage /> : <Navigate to="/pricing" replace />} />
          <Route path="/checkout/cancel" element={isBillingEnabled ? <CheckoutCancelPage /> : <Navigate to="/pricing" replace />} />
          <Route path="/segments" element={<SegmentAnalysisPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </React.Suspense>
      </Layout>
      <CookieConsent />
    </Router>
  );
}

function ToastInitializer() {
  const { showToast } = useToast();
  
  useEffect(() => {
    window.setGlobalToast(showToast);
  }, [showToast]);
  
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <LocaleProvider>
                <TranslationGuard showMissingKeys={!import.meta.env.PROD}>
                  <ToastProvider>
                    <ToastInitializer />
                    <AppContent />
                    <ErrorBoundary>
                      <React.Suspense fallback={null}>
                        {!import.meta.env.PROD && (
                          <PerformanceMonitor showDebugInfo={true} />
                        )}
                        <ServiceWorkerManager />
                        {!import.meta.env.PROD && (
                          <HealthOptimizer showInProduction={false} autoOptimize={true} />
                        )}
                        {!import.meta.env.PROD && (
                          <ProductionReadinessIndicator showInProduction={false} />
                        )}
                        {!import.meta.env.PROD && (
                          <HealthEnhancementDashboard 
                            autoEnhance={true} 
                            showInProduction={false} 
                            position="minimal" 
                          />
                        )}
                      </React.Suspense>
                    </ErrorBoundary>
                  </ToastProvider>
                </TranslationGuard>
              </LocaleProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
