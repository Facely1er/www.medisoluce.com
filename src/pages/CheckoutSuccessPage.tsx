import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { track } from '@vercel/analytics';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { CheckCircle, ArrowRight, Download, Settings, HelpCircle } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { safeExecuteSilent } from '../utils/serviceFallback';

const CheckoutSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Track checkout success with analytics (with fallbacks)
  useEffect(() => {
    // Track page view with existing analytics
    safeExecuteSilent(
      () => Promise.resolve(analytics.trackPageView('/checkout/success', 'Checkout Success')),
      undefined
    ).catch(() => {
      // Silently fail - analytics is optional
    });

    // Track checkout success event with existing analytics
    safeExecuteSilent(
      () => Promise.resolve(
        analytics.trackEvent({
          event: 'checkout_success',
          category: 'E-commerce',
          action: 'Checkout Complete',
          label: sessionId || 'unknown',
          value: 1
        })
      ),
      undefined
    ).catch(() => {
      // Silently fail - analytics is optional
    });

    // Track with Vercel Analytics (with fallback)
    safeExecuteSilent(
      () => Promise.resolve(
        track('checkout_success', {
          session_id: sessionId || 'unknown',
          timestamp: new Date().toISOString()
        })
      ),
      undefined
    ).catch(() => {
      // Silently fail - Vercel Analytics is optional
      if (!import.meta.env.PROD) {
        console.warn('Vercel Analytics tracking failed, but app continues normally');
      }
    });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <SEOHead 
        title="Checkout Successful - MediSoluce"
        description="Your payment was successful. Welcome to MediSoluce!"
        keywords="checkout success, payment successful, subscription activated"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-success-600 dark:text-success-400" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('checkout.success.title', 'Payment Successful!')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('checkout.success.message', 'Thank you for your purchase. Your subscription has been activated and you now have full access to all features.')}
            </p>

            {/* Information */}
            <div className="mb-8 space-y-4">
              <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('checkout.success.activated', 'Subscription Activated')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('checkout.success.activated_desc', 'Your subscription is now active. You can start using all the features immediately.')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-left">
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('checkout.success.next_steps', 'What\'s Next?')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('checkout.success.next_steps_desc', 'Access your dashboard to manage your subscription, view your assessments, and explore all available tools.')}
                    </p>
                  </div>
                </div>
              </div>

              {sessionId && (
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {t('checkout.success.session_id', 'Session ID')}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-mono break-all">
                        {sessionId}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-left">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('checkout.success.need_help', 'Need Help?')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('checkout.success.need_help_desc', 'If you have any questions or need assistance getting started, our support team is here to help.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  {t('checkout.success.go_to_dashboard', 'Go to Dashboard')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('checkout.success.manage_subscription', 'Manage Subscription')}
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('checkout.success.get_started', 'Get started with:')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/hipaa-check" 
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  {t('checkout.success.run_assessment', 'Run HIPAA Assessment')}
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  to="/toolkit" 
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  {t('checkout.success.explore_toolkit', 'Explore Toolkit')}
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  to="/training" 
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  {t('checkout.success.start_training', 'Start Training')}
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;

