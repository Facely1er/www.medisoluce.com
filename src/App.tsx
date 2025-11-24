import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import HIPAACheckPage from './pages/HIPAACheckPage';
import DependencyManagerPage from './pages/DependencyManagerPage';
import BusinessImpactPage from './pages/BusinessImpactPage';
import ContinuityPage from './pages/ContinuityPage';
import ContactPage from './pages/ContactPage';
import ThanksPage from './pages/ThanksPage';
import DashboardPage from './pages/DashboardPage';
import DemoPage from './pages/DemoPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import ECommercePolicyPage from './pages/ECommercePolicyPage';
import TermsCombinedPage from './pages/TermsCombinedPage';
import ProductionReadinessPage from './pages/ProductionReadinessPage';
import DeploymentPage from './pages/DeploymentPage';
import SecurityDashboard from './components/security/SecurityDashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ProfilePage from './pages/ProfilePage';
import RansomwarePage from './pages/RansomwarePage';
import RansomwareResiliencePage from './pages/RansomwareResiliencePage';
import RansomwareThreatDashboardPage from './pages/RansomwareThreatDashboardPage';
import HealthDashboardPage from './pages/HealthDashboardPage';
import TrainingPage from './pages/TrainingPage';
import ToolkitPage from './pages/ToolkitPage';
import EnhancedAssessmentEngine from './components/assessment/EnhancedAssessmentEngine';
import RansomwareAssessment from './components/assessment/RansomwareAssessment';
import PricingOverviewPage from './pages/PricingOverviewPage';
import HIPAAPricingPage from './pages/HIPAAPricingPage';
import RansomwarePricingPage from './pages/RansomwarePricingPage';
import ContinuityPricingPage from './pages/ContinuityPricingPage';
import SegmentAnalysisPage from './pages/SegmentAnalysisPage';
import FAQPage from './pages/FAQPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LocaleProvider } from './components/i18n/LocaleProvider';
import TranslationGuard from './components/i18n/TranslationGuard';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ToastProvider, useToast } from './components/ui/Toast';
import { analytics } from './utils/analytics';
import './i18n';
import HealthDashboard from './components/ui/HealthDashboard';

// Lazy load development tools
const PerformanceMonitor = React.lazy(() => import('./components/ui/PerformanceMonitor'));
const ServiceWorkerManager = React.lazy(() => import('./components/ui/ServiceWorkerManager'));
const ProductionReadinessIndicator = React.lazy(() => import('./components/ui/ProductionReadinessIndicator'));
const HealthOptimizer = React.lazy(() => import('./components/health/HealthOptimizer'));
const HealthEnhancementDashboard = React.lazy(() => import('./components/ui/HealthEnhancementDashboard'));

// Initialize analytics with fallback (never throw)
try {
  analytics.init(import.meta.env.VITE_GA_TRACKING_ID);
} catch (error) {
  // Silently fail - analytics is optional, app continues normally
  if (!import.meta.env.PROD) {
    console.warn('Analytics initialization failed, but app continues:', error);
  }
}

// Global toast function for components that can't use React hooks
interface ToastMessage {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface GlobalWindow extends Window {
  setGlobalToast: (fn: (toast: ToastMessage) => void) => void;
  showToast: (toast: ToastMessage) => void;
}

function setupGlobalToast() {
  let toastFunction: ((toast: ToastMessage) => void) | null = null;
  
  (window as GlobalWindow).setGlobalToast = (fn: (toast: ToastMessage) => void) => {
    toastFunction = fn;
  };
  
  (window as GlobalWindow).showToast = (toast: ToastMessage) => {
    if (toastFunction) {
      toastFunction(toast);
    }
  };
}

setupGlobalToast();

function AppContent() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
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
          <Route path="/dashboard" element={<DashboardPage />} />
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
          <Route path="/toolkit" element={<ToolkitPage />} />
          <Route path="/comprehensive-assessment" element={<EnhancedAssessmentEngine />} />
          <Route path="/security" element={<SecurityDashboard />} />
          <Route path="/production-readiness" element={<ProductionReadinessPage />} />
          <Route path="/deployment" element={<DeploymentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/pricing" element={<PricingOverviewPage />} />
          <Route path="/pricing/hipaa" element={<HIPAAPricingPage />} />
          <Route path="/pricing/ransomware" element={<RansomwarePricingPage />} />
          <Route path="/pricing/continuity" element={<ContinuityPricingPage />} />
          <Route path="/segments" element={<SegmentAnalysisPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function ToastInitializer() {
  const { showToast } = useToast();
  
  useEffect(() => {
    (window as GlobalWindow).setGlobalToast(showToast);
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