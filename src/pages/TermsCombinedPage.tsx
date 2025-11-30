import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Lock, CreditCard, Cookie } from 'lucide-react';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';

/**
 * Combined Terms Page
 * This page links to all policies and can be used as the single URL
 * for Stripe Checkout's terms parameter
 */
const TermsCombinedPage: React.FC = () => {
  return (
    <div className="py-12">
      <SEOHead 
        title="Terms and Policies - ERMITS"
        description="Complete terms, privacy, and e-commerce policies for ERMITS LLC services"
        noindex={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Terms and Policies
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                By using ERMITS services, you agree to the following policies and terms.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Required Policies
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Please review and acknowledge the following policies before completing your purchase:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Link
                    to="/terms"
                    className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                  >
                    <FileText className="h-6 w-6 text-primary-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Terms of Service
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Master Terms of Service
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/privacy"
                    className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                  >
                    <Lock className="h-6 w-6 text-primary-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Privacy Policy
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        How we handle your data
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/ecommerce-policy"
                    className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                  >
                    <CreditCard className="h-6 w-6 text-primary-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        E-Commerce Policy
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Subscription, Payment, Refund & Cancellation
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/cookie-policy"
                    className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                  >
                    <Cookie className="h-6 w-6 text-primary-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Cookie Policy
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Cookie usage and preferences
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Important Notice
                </h3>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  By completing a purchase or subscription, you acknowledge that you have read, 
                  understood, and agree to be bound by all of the above policies. If you do not 
                  agree to these terms, please do not proceed with your purchase.
                </p>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Questions about our policies? Contact us at{' '}
                  <a 
                    href="mailto:contact@ermits.com" 
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    contact@ermits.com
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsCombinedPage;

