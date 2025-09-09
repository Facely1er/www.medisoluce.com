import React from 'react';
import { Shield, Lock, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';

const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12">
      <SEOHead 
        title="Privacy Policy - MediSoluce"
        description="Privacy Policy for MediSoluce Healthcare Compliance Platform"
        noindex={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-primary-500 mr-3" />
                  Information We Collect
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, 
                    complete assessments, or contact us for support.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Privacy-First Design</h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Most of your data is stored locally on your device using browser storage. This means your 
                      assessment results, system mappings, and preferences remain under your control and are not 
                      transmitted to our servers unless you explicitly choose to sync or share them.
                    </p>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Types of Information</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Assessment Data:</strong> Your responses to compliance assessments and evaluations</li>
                    <li><strong>Contact Information:</strong> Name, email, phone number when you contact us</li>
                    <li><strong>Organization Data:</strong> Organization name and role when provided</li>
                    <li><strong>Usage Information:</strong> How you use our platform (when analytics are enabled)</li>
                    <li><strong>Technical Information:</strong> Device type, browser information, IP address</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  How We Use Your Information
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, 
                    including compliance assessments and recommendations.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Service Delivery</h3>
                      <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                        <li>• Provide assessment results and recommendations</li>
                        <li>• Generate compliance reports</li>
                        <li>• Deliver training content</li>
                        <li>• Enable platform functionality</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Platform Improvement</h3>
                      <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                        <li>• Analyze usage patterns (anonymized)</li>
                        <li>• Improve user experience</li>
                        <li>• Develop new features</li>
                        <li>• Ensure system security</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Information Sharing
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We do not sell, rent, or share your personal information with third parties except 
                    as described in this privacy policy.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Limited Sharing Circumstances</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Service Providers:</strong> Trusted partners who help operate our platform (with strict data protection agreements)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger or acquisition (with continued protection)</li>
                    <li><strong>Consent:</strong> When you explicitly provide consent for specific sharing</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Data Security
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your 
                    personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center">
                      <Shield className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-1">Encryption</h3>
                      <p className="text-primary-700 dark:text-primary-300 text-sm">
                        Data encrypted in transit and at rest
                      </p>
                    </div>
                    <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-lg p-4 text-center">
                      <Lock className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">Access Control</h3>
                      <p className="text-secondary-700 dark:text-secondary-300 text-sm">
                        Role-based access and authentication
                      </p>
                    </div>
                    <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-success-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-success-800 dark:text-success-200 mb-1">Compliance</h3>
                      <p className="text-success-700 dark:text-success-300 text-sm">
                        HIPAA-compliant security practices
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Email:</strong> privacy@medisoluce.com</li>
                    <li><strong>Phone:</strong> +1 (240) 599-0102</li>
                    <li><strong>Website:</strong> <a href="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">Contact Form</a></li>
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

export default PrivacyPage;