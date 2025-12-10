import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { AlertCircle, ArrowLeft, ShoppingCart, HelpCircle } from 'lucide-react';

const CheckoutCancelPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <SEOHead 
        title="Checkout Cancelled - MediSoluce"
        description="Your checkout was cancelled. No charges were made."
        keywords="checkout cancelled, payment cancelled"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 md:p-12 text-center">
            {/* Cancel Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-warning-600 dark:text-warning-400" />
              </div>
            </div>

            {/* Cancel Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('checkout.cancel.title', 'Checkout Cancelled')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('checkout.cancel.message', 'Your checkout was cancelled. No charges were made to your account.')}
            </p>

            {/* Information */}
            <div className="mb-8 space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
                <div className="flex items-start gap-3">
                  <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('checkout.cancel.no_charge', 'No Charges Made')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('checkout.cancel.no_charge_desc', 'Your payment information was not processed and no charges were made.')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-left">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('checkout.cancel.questions', 'Have Questions?')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('checkout.cancel.questions_desc', 'If you experienced any issues or have questions about our plans, we\'re here to help.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button size="lg" className="w-full sm:w-auto">
                  {t('checkout.cancel.back_to_pricing', 'Back to Pricing')}
                  <ArrowLeft className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('checkout.cancel.contact_support', 'Contact Support')}
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('checkout.cancel.maybe_interested', 'You might also be interested in:')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/hipaa-check" 
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  {t('checkout.cancel.free_assessment', 'Free HIPAA Assessment')}
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  to="/faq" 
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  {t('checkout.cancel.faq', 'FAQ')}
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  to="/toolkit" 
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  {t('checkout.cancel.toolkit', 'Resource Toolkit')}
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;

