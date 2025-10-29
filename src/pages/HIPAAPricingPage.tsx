import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ShieldCheck, CheckCircle, ArrowRight, AlertTriangle, FileText, Users, Lock, Download, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateDynamicPricing, getPricingFactorsFromStorage, type CalculatedPricing } from '../utils/pricingCalculator';

const HIPAAPricingPage: React.FC = () => {
  const [dynamicPricing, setDynamicPricing] = useState<CalculatedPricing | null>(null);

  useEffect(() => {
    const factors = getPricingFactorsFromStorage();
    const calculated = calculateDynamicPricing(factors, 'hipaa');
    setDynamicPricing(calculated);
  }, []);

  const tiers = [
    {
      name: 'Essential',
      price: 49,
      description: 'Perfect for small practices getting started with HIPAA compliance',
      features: [
        'Full 10-question HIPAA assessment',
        'HIPAA Privacy Policy template',
        'Breach Response Checklist',
        'Business Associate Agreement (BAA)',
        'Training Record Forms',
        'Risk Assessment Tool',
        'PDF export of reports',
        'Email support',
        'Basic compliance scoring'
      ],
      cta: 'Start Free Assessment',
      popular: false
    },
    {
      name: 'Professional',
      price: 149,
      description: 'For growing practices that need team collaboration',
      features: [
        'Everything in Essential',
        'Team collaboration (5 users)',
        'Cloud sync with backup',
        'Advanced risk assessment tools',
        'Custom policy templates',
        'Compliance certification tracking',
        'Advanced reporting & analytics',
        'Priority email + chat support',
        'Quarterly compliance updates'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 499,
      description: 'For large organizations requiring comprehensive HIPAA compliance',
      features: [
        'Everything in Professional',
        'Unlimited users',
        'White-label options',
        'Dedicated HIPAA compliance consultant',
        'Custom compliance audits',
        'Quarterly compliance reviews',
        'SLA: 99.9% uptime',
        'Custom EHR integrations',
        '24/7 phone support'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const stats = [
    { value: 'Up to $1.9M', label: 'Maximum Annual HIPAA Penalties', icon: AlertTriangle },
    { value: 'Multiple', label: 'Required Safeguards for HIPAA Compliance', icon: ShieldCheck },
    { value: 'Ongoing', label: 'Compliance & Training Required', icon: CheckCircle }
  ];

  const benefits = [
    {
      icon: FileText,
      title: 'Comprehensive Assessment',
      description: '10-question HIPAA compliance evaluation covering Privacy, Security, and Breach Notification Rules'
    },
    {
      icon: Lock,
      title: 'Protect Patient Data',
      description: 'Reduce risk of breaches and HIPAA violations with proven security controls'
    },
    {
      icon: Users,
      title: 'Staff Training',
      description: 'Ensure your team understands HIPAA requirements with built-in training modules'
    },
    {
      icon: Download,
      title: 'Ready-to-Use Templates',
      description: 'Download HIPAA-compliant policies, procedures, and documentation templates'
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="HIPAA Compliance Suite - MediSoluce"
        description="Protect patient data and avoid HIPAA penalties with comprehensive compliance tools. Start free assessment."
        keywords="HIPAA compliance, patient data protection, HIPAA assessment, healthcare privacy"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <ShieldCheck className="h-10 w-10 text-primary-500" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              HIPAA Compliance Suite
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Protect patient data with comprehensive compliance assessment, 
              policy templates, and implementation guidance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/hipaa-check">
                <Button size="lg" className="mr-4 mb-4">
                  Start Free Assessment
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for HIPAA Compliance
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive tools to protect patient data and meet regulatory requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="p-6 h-full">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                        <benefit.icon className="h-6 w-6 text-primary-500" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Banner */}
      {dynamicPricing && dynamicPricing.recommendations.length > 0 && (
        <section className="py-8 bg-primary-50 dark:bg-primary-900/20 border-t border-b border-primary-200 dark:border-primary-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-800">
                <div className="flex items-start gap-3">
                  <Calculator className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Personalized Pricing Available
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Our pricing has been customized based on your organization's risk profile and assessment results.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your HIPAA Compliance Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start with the free assessment, then upgrade to the plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full flex flex-col border-2 ${tier.popular ? 'border-primary-500 dark:border-primary-600 shadow-lg' : 'border-gray-200 dark:border-gray-700'}`}>
                  {tier.popular && (
                    <div className="bg-primary-500 text-white text-center py-2">
                      <span className="font-semibold">RECOMMENDED</span>
                    </div>
                  )}
                  
                  <div className="p-8 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {tier.description}
                    </p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          ${tier.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 ml-2">
                          /month
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full" size="lg" variant={tier.popular ? 'default' : 'outline'}>
                      {tier.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Protect Patient Data?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Start your free HIPAA assessment today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/hipaa-check">
                <Button size="lg" className="!bg-white !text-primary-700 hover:!bg-gray-50">
                  Start Free Assessment
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="!bg-white/10 !border-white !text-white hover:!bg-white/20">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HIPAAPricingPage;

