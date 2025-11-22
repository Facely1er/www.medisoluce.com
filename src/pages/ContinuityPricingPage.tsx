import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FileText, CheckCircle, ArrowRight, Server, Users, Clock, Shield, Activity, Calculator, Building2, Zap, Network, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateDynamicPricing, getPricingFactorsFromStorage, type CalculatedPricing } from '../utils/pricingCalculator';
import { useAuth } from '../context/AuthContext';
import { useTrial } from '../hooks/useTrial';
import TrialActivationModal from '../components/trial/TrialActivationModal';
import TrialBanner from '../components/trial/TrialBanner';
import { useToast } from '../components/ui/Toast';

const ContinuityPricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dynamicPricing, setDynamicPricing] = useState<CalculatedPricing | null>(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'essential' | 'professional' | 'enterprise' | null>(null);
  
  const userId = user?.id || '';
  const userEmail = user?.email || '';
  const { activeTrial, isEligible } = useTrial(userId, 'continuity');

  useEffect(() => {
    const factors = getPricingFactorsFromStorage();
    const calculated = calculateDynamicPricing(factors, 'continuity');
    setDynamicPricing(calculated);
  }, []);

  const tiers = [
    {
      name: 'Essential',
      price: 49,
      description: 'Basic continuity planning for small practices',
      features: [
        'Continuity Plan Templates',
        'Technology Dependency Mapping',
        'EHR Downtime Procedures',
        'Vendor Risk Assessment Template',
        'Backup Strategy Guide',
        'RTO/RPO Calculator',
        'Basic Recovery Procedures',
        'Email support',
        'PDF export of plans'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: 149,
      description: 'Advanced planning for growing healthcare organizations',
      features: [
        'Everything in Essential',
        'Advanced Dependency Mapping',
        'Custom Continuity Plans',
        'Automated Testing Schedules',
        'Team Workflow Management',
        'Custom Recovery Procedures',
        'Advanced Impact Analysis',
        'Priority email + chat support',
        'Plan version control'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 499,
      description: 'Enterprise-grade continuity planning with dedicated support',
      features: [
        'Everything in Professional',
        'Unlimited Plans & Locations',
        'Custom Scenario Planning',
        'Automated Plan Testing',
        'Dedicated BC Consultant',
        'Disaster Recovery SLA',
        'Custom Integrations',
        '24/7 support',
        'Annual Tabletop Exercises'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const stats = [
    { value: 'Critical', label: 'EHR Availability Requirements', icon: Clock },
    { value: 'Significant', label: 'Operational Disruption Impact', icon: Activity },
    { value: 'Essential', label: 'Continuity Planning for Patient Care', icon: Shield }
  ];

  const benefits = [
    {
      icon: Server,
      title: 'Technology Dependency Mapping',
      description: 'Map critical systems and their interdependencies to identify vulnerabilities'
    },
    {
      icon: FileText,
      title: 'Comprehensive Plan Templates',
      description: 'Ready-to-use continuity plans for various scenarios and threats'
    },
    {
      icon: Users,
      title: 'Staff Training & Testing',
      description: 'Ensure your team knows what to do when systems fail'
    },
    {
      icon: Shield,
      title: 'Patient Care Continuity',
      description: 'Maintain patient safety during disruptions with manual procedures'
    }
  ];

  const scenarios = [
    {
      icon: Building2,
      title: 'EHR System Failure',
      description: 'Continue patient care with manual documentation and paper charts',
      iconColor: 'text-purple-500'
    },
    {
      icon: Zap,
      title: 'Power Outage',
      description: 'Emergency power procedures to maintain critical operations',
      iconColor: 'text-yellow-500'
    },
    {
      icon: Network,
      title: 'Network Disruption',
      description: 'Isolated network segmentation while maintaining patient access',
      iconColor: 'text-blue-500'
    },
    {
      icon: Wrench,
      title: 'Vendor System Down',
      description: 'Alternative workflows when critical vendors are unavailable',
      iconColor: 'text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Business Continuity Suite - MediSoluce"
        description="Ensure patient care continues during disruptions with comprehensive operational resilience planning and recovery procedures."
        keywords="business continuity, healthcare disaster recovery, operational resilience, EHR downtime procedures"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-success-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                <FileText className="h-10 w-10 text-success-500" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Business Continuity Suite
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Ensure patient care continues during system failures, disasters, 
              and disruptions with comprehensive continuity planning tools.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/continuity">
                <Button size="lg" className="mr-4 mb-4">
                  Create Continuity Plan
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
                    <div className="w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-success-500" />
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

      {/* Scenarios Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Prepared for Any Disruption
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Continuity plans for the most common healthcare operational scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {scenarios.map((scenario, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="p-6 h-full">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <scenario.icon className={`h-6 w-6 ${scenario.iconColor}`} />
                      </div>
                    </div>
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
              Everything You Need for Continuity Planning
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive tools to ensure operations continue during disruptions
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
                      <div className="w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                        <benefit.icon className="h-6 w-6 text-success-500" />
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
        <section className="py-8 bg-success-50 dark:bg-success-900/20 border-t border-b border-success-200 dark:border-success-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 bg-white dark:bg-gray-800 border border-success-200 dark:border-success-800">
                <div className="flex items-start gap-3">
                  <Calculator className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Personalized Pricing Available
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Our pricing has been customized based on your organization's continuity planning needs.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Trial Status Banner */}
      {activeTrial && (
        <section className="py-8 bg-gray-50 dark:bg-gray-900 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <TrialBanner
                trial={activeTrial}
                onDismiss={() => {
                  localStorage.setItem(`trial-banner-dismissed-${activeTrial.productId}`, 'true');
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Continuity Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From basic templates to enterprise-grade planning
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => {
              const tierKey = tier.name.toLowerCase() as 'essential' | 'professional' | 'enterprise';
              const hasActiveTrial = activeTrial?.tier === tierKey;
              const canStartTrial = tier.cta === 'Start Free Trial' && isEligible('continuity') && !hasActiveTrial;
              
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`h-full flex flex-col border-2 ${tier.popular ? 'border-success-500 dark:border-success-600 shadow-lg' : 'border-gray-200 dark:border-gray-700'}`}>
                    {tier.popular && (
                      <div className="bg-success-500 text-white text-center py-2">
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
                        {tier.cta === 'Start Free Trial' && (
                          <p className="text-sm text-success-600 dark:text-success-400 mt-2">
                            {tierKey === 'professional' ? '30-day free trial' : '14-day free trial'}
                          </p>
                        )}
                      </div>

                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {hasActiveTrial ? (
                        <Button className="w-full" size="lg" variant="outline" disabled>
                          Trial Active
                        </Button>
                      ) : canStartTrial ? (
                        <Button 
                          className="w-full" 
                          size="lg" 
                          variant={tier.popular ? 'default' : 'outline'}
                          onClick={() => {
                            if (user) {
                              setSelectedTier(tierKey);
                              setShowTrialModal(true);
                            } else {
                              showToast({
                                type: 'info',
                                title: 'Sign In Required',
                                message: 'Please sign in or create an account to start your free trial.'
                              });
                              navigate('/login');
                            }
                          }}
                        >
                          {tier.cta}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : tier.cta === 'Start Free Trial' && !isEligible('continuity') ? (
                        <Button 
                          className="w-full" 
                          size="lg" 
                          variant="outline"
                          onClick={() => {
                            showToast({
                              type: 'info',
                              title: 'Trial Already Used',
                              message: 'You have already used your free trial. Upgrade to continue.'
                            });
                          }}
                        >
                          Upgrade to Continue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          size="lg" 
                          variant={tier.popular ? 'default' : 'outline'}
                          onClick={() => {
                            if (tier.cta === 'Get Started') {
                              navigate('/continuity');
                            } else if (tier.cta === 'Contact Sales') {
                              navigate('/contact');
                            }
                          }}
                        >
                          {tier.cta}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trial Activation Modal */}
      {user && selectedTier && (
        <TrialActivationModal
          isOpen={showTrialModal}
          onClose={() => {
            setShowTrialModal(false);
            setSelectedTier(null);
          }}
          productId="continuity"
          productName="Business Continuity"
          tier={selectedTier}
          userId={userId}
          userEmail={userEmail}
          onTrialStarted={(trialId) => {
            showToast({
              type: 'success',
              title: 'Trial Started!',
              message: 'Your free trial has begun. Enjoy full access!'
            });
            navigate('/dashboard');
          }}
        />
      )}

      {/* Key Benefits */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-success-50 to-primary-50 dark:from-success-900/20 dark:to-primary-900/20 border border-success-200 dark:border-success-800">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Why Healthcare Organizations Need Continuity Planning
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-success-500" />
                    Reduce Downtime Impact
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Maintain patient care during system outages</li>
                    <li>• Reduce revenue loss from operational disruptions</li>
                    <li>• Meet regulatory requirements for contingency planning</li>
                    <li>• Protect patient safety and organizational reputation</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-success-500" />
                    Comprehensive Protection
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Technology dependency mapping</li>
                    <li>• Scenario-specific continuity plans</li>
                    <li>• Staff training and testing programs</li>
                    <li>• Automated monitoring and alerts</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-success-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Ensure Business Continuity?
            </h2>
            <p className="text-xl text-success-100 mb-8">
              Start building your continuity plans today. Start with a free template.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/continuity">
                <Button size="lg" className="!bg-white !text-success-700 hover:!bg-gray-50">
                  Create Continuity Plan
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

export default ContinuityPricingPage;

