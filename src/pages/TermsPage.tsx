import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, Shield, Lock, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';

const TermsPage: React.FC = () => {
  return (
    <div className="py-12">
      <SEOHead 
        title="Terms of Service - MediSoluce"
        description="Terms of Service for MediSoluce Healthcare Compliance Platform"
        noindex={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
                       <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Acceptance of Terms
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  By accessing and using the MediSoluce platform, you accept and agree to be bound 
                  by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Use License
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Permission is granted to temporarily use the MediSoluce platform for personal, 
                  non-commercial transitory viewing only.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Disclaimer
                </h2>
                <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-warning-600 dark:text-warning-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-warning-800 dark:text-warning-200 font-medium mb-2">
                        Important Legal Notice
                      </h3>
                      <p className="text-warning-700 dark:text-warning-300 text-sm">
                        The information and tools provided by MediSoluce are for informational purposes only 
                        and do not constitute legal advice. Users should consult with qualified legal and 
                        compliance professionals for specific regulatory guidance.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Limitations
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  In no event shall MediSoluce or its suppliers be liable for any damages arising 
                  out of the use or inability to use the platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us through 
                  our contact page or email us at legal@medisoluce.com.
                </p>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;