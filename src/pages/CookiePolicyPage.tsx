import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Cookie, Settings, Eye, Shield, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';

const CookiePolicyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-12">
      <SEOHead 
        title={t('cookies.title')}
        description={t('cookies.description')}
        noindex={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('cookies.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('cookies.last_updated')}: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Eye className="h-6 w-6 text-primary-500 mr-3" />
                  What Are Cookies
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and allowing us to 
                  analyze how our website is used.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  MediSoluce is committed to transparency about how we use cookies and similar technologies on our 
                  healthcare compliance platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Settings className="h-6 w-6 text-primary-500 mr-3" />
                  Types of Cookies We Use
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                      Essential Cookies
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 mb-3">
                      These cookies are necessary for the website to function and cannot be switched off in our systems. 
                      They are usually only set in response to actions made by you.
                    </p>
                    <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
                      <li>Session management and authentication</li>
                      <li>Security and fraud prevention</li>
                      <li>Language and accessibility preferences</li>
                      <li>Assessment progress and form data</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                      Functional Cookies
                    </h3>
                    <p className="text-green-700 dark:text-green-300 mb-3">
                      These cookies enable the website to provide enhanced functionality and personalization. 
                      They may be set by us or by third-party providers.
                    </p>
                    <ul className="list-disc list-inside text-green-700 dark:text-green-300 space-y-1">
                      <li>User interface preferences (theme, layout)</li>
                      <li>Language selection</li>
                      <li>Saved assessment drafts</li>
                      <li>Dashboard customization</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                      Analytics Cookies (Optional)
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 mb-3">
                      These cookies help us understand how visitors interact with our website by collecting and 
                      reporting information anonymously.
                    </p>
                    <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>Google Analytics (when enabled)</li>
                      <li>Performance monitoring</li>
                      <li>Usage statistics</li>
                      <li>Error tracking and debugging</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-primary-500 mr-3" />
                  Your Cookie Choices
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Privacy-First Design
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    MediSoluce follows a privacy-first approach. Most of your data is stored locally on your device 
                    using browser storage, not cookies. This means:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Your assessment results remain on your device</li>
                    <li>No personal data is transmitted to third parties without your consent</li>
                    <li>You can use the platform anonymously without creating an account</li>
                    <li>Data is only shared when you explicitly opt-in</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Managing Your Cookie Preferences
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already 
                  on your computer and you can set most browsers to prevent them from being placed.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Browser Settings</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Most browsers allow you to refuse cookies through their settings. Check your browser's 
                      help section for instructions.
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Platform Settings</h4>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Visit your dashboard to manage data preferences and opt-out of optional tracking features.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Healthcare Data Protection
                </h2>
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-primary-600 dark:text-primary-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-primary-800 dark:text-primary-200 font-semibold mb-2">
                        HIPAA Compliance Notice
                      </h3>
                      <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
                        As a healthcare compliance platform, MediSoluce adheres to HIPAA requirements for 
                        protecting health information. We do not use cookies to store or transmit protected 
                        health information (PHI). Any PHI entered during assessments is stored locally on 
                        your device and is not transmitted via cookies.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Third-Party Services
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We may use third-party services that set their own cookies. These services include:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Google Analytics:</strong> Used to understand website usage (when enabled)</li>
                  <li><strong>Google Fonts:</strong> Used to display fonts consistently across browsers</li>
                  <li><strong>Content Delivery Networks:</strong> Used to improve website performance</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  These third-party services have their own privacy policies and cookie practices, which are 
                  independent of MediSoluce.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Updates to This Policy
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or 
                  for other operational, legal, or regulatory reasons. We will notify you of any material 
                  changes by posting the updated policy on this page with a new "Last Updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about this Cookie Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Email:</strong> privacy@medisoluce.com</li>
                    <li><strong>Phone:</strong> +1 (240) 599-0102</li>
                    <li><strong>Address:</strong>8300 McCullough Lane Suite 203, Gaithersburg, MD 20877</li>
                  </ul>
                </div>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;