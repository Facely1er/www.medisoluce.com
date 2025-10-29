import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/ui/SEOHead';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChevronDown, ChevronUp, HelpCircle, CreditCard, Shield, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: 'General Questions',
      icon: <HelpCircle className="h-6 w-6" />,
      color: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
      items: [
        {
          q: 'What is MediSoluce?',
          a: 'MediSoluce is a comprehensive healthcare compliance platform that helps healthcare organizations protect patient data, prevent ransomware attacks, and ensure business continuity. We provide HIPAA compliance tools, ransomware resilience planning, and business continuity management in one integrated solution.'
        },
        {
          q: 'Who should use MediSoluce?',
          a: 'MediSoluce is designed for healthcare organizations of all sizes, including hospitals, clinics, private practices, dental offices, mental health providers, and any entity that handles protected health information (PHI). Our tools are valuable for C-level executives, compliance officers, IT directors, operations managers, and practice managers.'
        },
        {
          q: 'How is MediSoluce different from other compliance tools?',
          a: 'Unlike generic compliance tools, MediSoluce is specifically designed for healthcare organizations. We understand the unique challenges of HIPAA compliance, healthcare-specific ransomware threats, and the critical need for business continuity in patient care. Our platform combines all three areas into one integrated solution with healthcare-specific templates, workflows, and expertise.'
        },
        {
          q: 'Do I need technical expertise to use MediSoluce?',
          a: 'No technical expertise is required. Our platform is designed to be user-friendly with intuitive interfaces, step-by-step guidance, and comprehensive templates. We provide training resources and support to help you get started, regardless of your technical background.'
        }
      ]
    },
    {
      title: 'Pricing & Billing',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800',
      items: [
        {
          q: 'Can I try before I buy?',
          a: 'Yes! Start with our free HIPAA assessment and explore all features with a 14-day free trial. No credit card required. You can test all our tools and see how they work with your organization before making any commitment.'
        },
        {
          q: 'Can I upgrade or downgrade later?',
          a: 'Absolutely. Change your plan at any time. If you upgrade mid-cycle, we prorate the difference. If you downgrade, the change takes effect at your next billing cycle. Our flexible pricing ensures you only pay for what you need.'
        },
        {
          q: 'What if I only need one suite?',
          a: 'Perfect! All suites are available standalone. You can start with just HIPAA Compliance, Ransomware Resilience, or Business Continuity. You can always add more suites later as your needs grow.'
        },
        {
          q: 'Do you offer discounts for annual plans?',
          a: 'Yes! Annual plans save 10% compared to monthly billing. This represents significant savings, especially for larger organizations. We also offer volume discounts for Enterprise customers with multiple locations.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), ACH bank transfers, and wire transfers for Enterprise plans. All payments are processed securely through our PCI-compliant payment processor.'
        },
        {
          q: 'Is there a setup fee?',
          a: 'No setup fees for most plans. Only Essential and Professional tiers have a $99 one-time onboarding fee for customization and setup assistance. Enterprise plans include free setup and onboarding as part of the service.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'We offer a 30-day money-back guarantee for all new subscriptions. If you\'re not satisfied with our service within the first 30 days, we\'ll provide a full refund, no questions asked.'
        }
      ]
    },
    {
      title: 'Security & Compliance',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
      items: [
        {
          q: 'Is MediSoluce HIPAA compliant?',
          a: 'Yes, MediSoluce is fully HIPAA compliant. We are a Business Associate and have signed BAAs with all our customers. Our platform is designed to help you achieve and maintain HIPAA compliance, and we undergo regular security audits and assessments.'
        },
        {
          q: 'How do you protect our data?',
          a: 'We use enterprise-grade security measures including end-to-end encryption, secure data centers with SOC 2 Type II compliance, regular security audits, and strict access controls. All data is encrypted both in transit and at rest, and we maintain comprehensive backup and disaster recovery procedures.'
        },
        {
          q: 'Where is our data stored?',
          a: 'Your data is stored in secure, HIPAA-compliant data centers located in the United States. We use multiple geographically distributed data centers to ensure redundancy and availability. All data centers are SOC 2 Type II certified and maintain strict physical and logical security controls.'
        },
        {
          q: 'Do you conduct security audits?',
          a: 'Yes, we undergo regular third-party security audits and penetration testing. We maintain SOC 2 Type II certification and are regularly audited for HIPAA compliance. We also conduct internal security assessments and have a dedicated security team monitoring our systems 24/7.'
        },
        {
          q: 'Can we export our data?',
          a: 'Absolutely. You can export all your data at any time in various formats including PDF, Excel, and CSV. We believe in data portability and never lock you into our platform. You own your data and can take it with you if you ever decide to switch providers.'
        }
      ]
    },
    {
      title: 'Support & Training',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800',
      items: [
        {
          q: 'What kind of support do you provide?',
          a: 'We provide comprehensive support including email support for all plans, priority support for Professional and Enterprise plans, and 24/7 phone support for Enterprise customers. We also offer live chat support during business hours and have an extensive knowledge base with tutorials and guides.'
        },
        {
          q: 'Do you provide training?',
          a: 'Yes! We provide comprehensive training including video tutorials, live webinars, documentation, and one-on-one training sessions for Enterprise customers. Our training covers everything from basic platform usage to advanced compliance strategies.'
        },
        {
          q: 'How quickly do you respond to support requests?',
          a: 'Response times vary by plan: Essential plans receive responses within 24 hours, Professional plans within 8 hours, and Enterprise plans within 2 hours. Critical issues are escalated immediately regardless of plan level.'
        },
        {
          q: 'Do you offer implementation assistance?',
          a: 'Yes! Professional and Enterprise plans include implementation assistance to help you get started quickly. Our team will work with you to customize the platform for your organization and provide guidance on best practices for healthcare compliance.'
        },
        {
          q: 'Is there a learning curve?',
          a: 'Our platform is designed to be intuitive and user-friendly. Most users are productive within the first week. We provide comprehensive onboarding materials, video tutorials, and support to help you get up to speed quickly. Our goal is to make compliance as simple as possible.'
        }
      ]
    },
    {
      title: 'Technical & Integration',
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
      items: [
        {
          q: 'Do you integrate with our existing systems?',
          a: 'Yes! We offer integrations with popular EHR systems, practice management software, and other healthcare tools. Our API allows for custom integrations, and our Enterprise plans include dedicated integration support. We work with most major healthcare software providers.'
        },
        {
          q: 'What browsers do you support?',
          a: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience. Our platform is also mobile-responsive and works on tablets and smartphones.'
        },
        {
          q: 'Is there a mobile app?',
          a: 'Our platform is fully responsive and works great on mobile devices through your web browser. We\'re also developing native mobile apps for iOS and Android that will be available soon. The mobile experience includes all core features for on-the-go compliance management.'
        },
        {
          q: 'How often do you update the platform?',
          a: 'We release regular updates with new features, security improvements, and compliance updates. Updates are typically released monthly, with major feature releases quarterly. All updates are included in your subscription at no additional cost.'
        },
        {
          q: 'What happens if the platform goes down?',
          a: 'We maintain 99.9% uptime SLA for Professional and Enterprise plans. In the rare event of downtime, we have comprehensive backup and disaster recovery procedures. We also provide status updates and notifications to keep you informed of any issues.'
        },
        {
          q: 'Can we customize the platform?',
          a: 'Yes! Professional and Enterprise plans include customization options including custom fields, workflows, and reporting. Enterprise customers can also request custom features and integrations. We work with you to tailor the platform to your specific needs.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead 
        title="FAQ - MediSoluce Healthcare Compliance"
        description="Frequently asked questions about MediSoluce healthcare compliance platform, pricing, security, and support."
        keywords="healthcare compliance FAQ, HIPAA compliance questions, MediSoluce support, pricing questions"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Find answers to common questions about MediSoluce and healthcare compliance
            </motion.p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16">
                <div className="flex items-center mb-8">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mr-4`}>
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => {
                    const globalIndex = categoryIndex * 100 + itemIndex;
                    const isOpen = openItems.includes(globalIndex);
                    
                    return (
                      <Card key={itemIndex} className={`border-2 transition-all ${isOpen ? 'border-primary-200 dark:border-primary-800' : 'border-gray-200 dark:border-gray-700'}`}>
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                            {item.q}
                          </h3>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-6"
                          >
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {item.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Our support team is here to help you succeed
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="outline" size="lg" className="!bg-white !text-primary-700 hover:!bg-gray-50">
                  Contact Support
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="!bg-transparent !text-white !border-white hover:!bg-white hover:!text-primary-700">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;