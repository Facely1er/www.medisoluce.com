import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Lock, CheckCircle, ArrowRight, AlertTriangle, Shield, Zap, Download, Clock, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateDynamicPricing, getPricingFactorsFromStorage, type CalculatedPricing } from '../utils/pricingCalculator';

const RansomwarePricingPage: React.FC = () => {
  const [dynamicPricing, setDynamicPricing] = useState<CalculatedPricing | null>(null);

  useEffect(() => {
    const factors = getPricingFactorsFromStorage();
    const calculated = calculateDynamicPricing(factors, 'ransomware');
    setDynamicPricing(calculated);
  }, []);

  const tiers = [
    {
      name: 'Essential',
      price: 49,
      description: 'Healthcare ransomware defense and response fundamentals',
      features: [
        'Ransomware Response Playbook',
        'Business Impact Calculator',
        'Incident Response Procedures',
        'Threat Containment Checklist',
        'Manual Procedures Guide',
        'Security Hardening Tools',
        'Backup Verification Templates',
        'Email support',
        'PDF export of playbooks'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: 149,
      description: 'Advanced threat protection for growing healthcare organizations',
      features: [
        'Everything in Essential',
        'Advanced Threat Hunting Tools',
        'Forensic Analysis Templates',
        'Custom Playbook Builder',
        'Team Coordination Tools',
        '24/7 Incident Response Hotline',
        'Monthly Threat Intelligence Updates',
        'Priority email + chat support',
        'Advanced Recovery Calculators'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 499,
      description: 'Enterprise-grade ransomware resilience with dedicated support',
      features: [
        'Everything in Professional',
        '24/7 SOC Monitoring Dashboard',
        'Custom Incident Response Team',
        'Forensic Analysis Services',
        'Ransomware Simulation Testing',
        'Annual Penetration Testing',
        'Custom Security Hardening',
        'Breach Notification Automation',
        'Dedicated Security Consultant'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const stats = [
    { value: 'Proven', label: 'Healthcare-Specific Response Procedures', icon: AlertTriangle },
    { value: 'Multiple', label: 'Threat Containment Methods Available', icon: Shield },
    { value: 'Rapid', label: 'Threat Response Capabilities', icon: Clock }
  ];

  const benefits = [
    {
      icon: Lock,
      title: 'Healthcare-Specific Playbooks',
      description: 'Response procedures designed specifically for clinical environments and patient safety'
    },
    {
      icon: Zap,
      title: 'Immediate Threat Containment',
      description: 'Isolate attacks quickly to minimize impact on patient care and operations'
    },
    {
      icon: Shield,
      title: 'Prevention Controls',
      description: 'Built-in security hardening checklists to reduce ransomware risk'
    },
    {
      icon: Download,
      title: 'Recovery Tools',
      description: 'Calculators and templates to estimate recovery time and business impact'
    }
  ];

  const threatScenarios = [
    {
      icon: '🏥',
      title: 'EHR System Down',
      description: 'Maintain patient care with manual procedures while systems recover'
    },
    {
      icon: '⚕️',
      title: 'Life Support Systems',
      description: 'Protect critical medical devices and ensure continuous patient monitoring'
    },
    {
      icon: '🔒',
      title: 'Network Isolation',
      description: 'Quickly isolate infections while preserving clinical operations'
    },
    {
      icon: '📞',
      title: 'Communication',
      description: 'Coordinate response across IT, clinical, and administrative teams'
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Ransomware Resilience Suite - MediSoluce"
        description="Protect against ransomware attacks with healthcare-specific defense and response playbooks. Start free assessment."
        keywords="ransomware protection, healthcare security, ransomware response playbook, cyber defense"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-accent-100 dark:bg-accent-900/20 flex items-center justify-center">
                <Lock className="h-10 w-10 text-accent-500" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Ransomware Resilience Suite
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Protect patient care and operations from ransomware attacks with 
              healthcare-specific defense, response, and recovery procedures.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/business-impact">
                <Button size="lg" className="mr-4 mb-4">
                  Start Impact Calculator
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
                    <div className="w-12 h-12 rounded-lg bg-accent-100 dark:bg-accent-900/20 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-accent-500" />
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

      {/* Threat Scenarios */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Healthcare-Specific Ransomware Defense
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Prepared for the unique challenges of clinical environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {threatScenarios.map((scenario, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="p-6 h-full">
                  <div className="flex items-start">
                    <div className="text-4xl mr-4">{scenario.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {scenario.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Ransomware Defense
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive tools to protect and recover from attacks
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
                      <div className="w-12 h-12 rounded-lg bg-accent-100 dark:bg-accent-900/20 flex items-center justify-center">
                        <benefit.icon className="h-6 w-6 text-accent-500" />
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
        <section className="py-8 bg-accent-50 dark:bg-accent-900/20 border-t border-b border-accent-200 dark:border-accent-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 bg-white dark:bg-gray-800 border border-accent-200 dark:border-accent-800">
                <div className="flex items-start gap-3">
                  <Calculator className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Personalized Pricing Available
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Our pricing has been customized based on your organization's ransomware risk level.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Ransomware Defense Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start with free resources, upgrade as you need advanced protection
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
                <Card className={`h-full flex flex-col border-2 ${tier.popular ? 'border-accent-500 dark:border-accent-600 shadow-lg' : 'border-gray-200 dark:border-gray-700'}`}>
                  {tier.popular && (
                    <div className="bg-accent-500 text-white text-center py-2">
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

      {/* ROI Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-red-50 to-accent-50 dark:from-red-900/20 dark:to-accent-900/20 border border-red-200 dark:border-red-800">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                The Cost of Not Being Ready
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Healthcare Ransomware Attack Impact
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Significant financial and operational costs from breaches</li>
                    <li>• Extended recovery time impacting patient care</li>
                    <li>• Business interruption and revenue loss</li>
                    <li>• Attacks can disrupt patient care and clinical operations</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-500" />
                    Protect Your Organization
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Healthcare-specific response playbooks</li>
                    <li>• Immediate threat containment procedures</li>
                    <li>• Manual procedures to maintain patient care</li>
                    <li>• Recovery planning and testing tools</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Defend Against Ransomware?
            </h2>
            <p className="text-xl text-accent-100 mb-8">
              Start with our free business impact calculator. See what an attack would cost your organization.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/business-impact">
                <Button size="lg" className="!bg-white !text-accent-700 hover:!bg-gray-50">
                  Run Impact Calculator
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

export default RansomwarePricingPage;

