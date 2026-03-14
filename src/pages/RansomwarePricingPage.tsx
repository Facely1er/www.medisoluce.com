import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Lock, CheckCircle, ArrowRight, AlertTriangle, Shield, Zap, Download, Clock, Calculator, FileText, Heart, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateDynamicPricing, getPricingFactorsFromStorage, type CalculatedPricing } from '../utils/pricingCalculator';
import { useAuth } from '../context/AuthContext';
import { useTrial } from '../hooks/useTrial';
import TrialActivationModal from '../components/trial/TrialActivationModal';
import TrialBanner from '../components/trial/TrialBanner';
import { useToast } from '../components/ui/Toast';

const RansomwarePricingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dynamicPricing, setDynamicPricing] = useState<CalculatedPricing | null>(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'essential' | 'professional' | 'enterprise' | null>(null);
  
  const userId = user?.id || '';
  const userEmail = user?.email || '';
  const { activeTrial, isEligible } = useTrial(userId, 'ransomware');

  useEffect(() => {
    const factors = getPricingFactorsFromStorage();
    const calculated = calculateDynamicPricing(factors, 'ransomware');
    setDynamicPricing(calculated);
  }, []);

  const tiers = [
    {
      name: t('pricing.ransomware.tiers.essential.name'),
      price: 49,
      description: t('pricing.ransomware.tiers.essential.description'),
      features: t('pricing.ransomware.tiers.essential.features', { returnObjects: true }) as string[],
      cta: t('pricing.ransomware.tiers.essential.cta'),
      popular: false
    },
    {
      name: t('pricing.ransomware.tiers.professional.name'),
      price: 149,
      description: t('pricing.ransomware.tiers.professional.description'),
      features: t('pricing.ransomware.tiers.professional.features', { returnObjects: true }) as string[],
      cta: t('pricing.ransomware.tiers.professional.cta'),
      popular: true
    },
    {
      name: t('pricing.ransomware.tiers.enterprise.name'),
      price: 499,
      description: t('pricing.ransomware.tiers.enterprise.description'),
      features: t('pricing.ransomware.tiers.enterprise.features', { returnObjects: true }) as string[],
      cta: t('pricing.ransomware.tiers.enterprise.cta'),
      popular: false
    }
  ];

  const stats = [
    { value: t('pricing.ransomware.stats.procedures.value'), label: t('pricing.ransomware.stats.procedures.label'), icon: AlertTriangle },
    { value: t('pricing.ransomware.stats.containment.value'), label: t('pricing.ransomware.stats.containment.label'), icon: Shield },
    { value: t('pricing.ransomware.stats.response.value'), label: t('pricing.ransomware.stats.response.label'), icon: Clock }
  ];

  const benefits = [
    {
      icon: Lock,
      title: t('pricing.ransomware.benefits.playbooks.title'),
      description: t('pricing.ransomware.benefits.playbooks.description')
    },
    {
      icon: Zap,
      title: t('pricing.ransomware.benefits.containment.title'),
      description: t('pricing.ransomware.benefits.containment.description')
    },
    {
      icon: Shield,
      title: t('pricing.ransomware.benefits.prevention.title'),
      description: t('pricing.ransomware.benefits.prevention.description')
    },
    {
      icon: Download,
      title: t('pricing.ransomware.benefits.recovery.title'),
      description: t('pricing.ransomware.benefits.recovery.description')
    }
  ];

  const threatScenarios = [
    {
      icon: FileText,
      title: t('pricing.ransomware.scenarios.ehr_down.title'),
      description: t('pricing.ransomware.scenarios.ehr_down.description'),
      iconColor: 'text-purple-500'
    },
    {
      icon: Heart,
      title: t('pricing.ransomware.scenarios.life_support.title'),
      description: t('pricing.ransomware.scenarios.life_support.description'),
      iconColor: 'text-blue-500'
    },
    {
      icon: Lock,
      title: t('pricing.ransomware.scenarios.isolation.title'),
      description: t('pricing.ransomware.scenarios.isolation.description'),
      iconColor: 'text-orange-500'
    },
    {
      icon: Phone,
      title: t('pricing.ransomware.scenarios.communication.title'),
      description: t('pricing.ransomware.scenarios.communication.description'),
      iconColor: 'text-pink-500'
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
              {t('pricing.ransomware.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              {t('pricing.ransomware.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/business-impact">
                <Button size="lg" className="mr-4 mb-4">
                  {t('pricing.ransomware.start_calculator')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  {t('pricing.ransomware.view_pricing')}
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
              {t('pricing.ransomware.defense_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('pricing.ransomware.defense_subtitle')}
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
              {t('pricing.ransomware.everything_you_need_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('pricing.ransomware.everything_you_need_subtitle')}
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
                      {t('pricing.ransomware.personalized_pricing_available')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('pricing.ransomware.personalized_pricing_description')}
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
              {t('pricing_common.choose_plan', { product: t('pricing.ransomware.title') })}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('pricing.ransomware.choose_plan_subtitle')}
            </p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('pricing.ransomware.limits_disclaimer')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => {
              const tierKey = tier.name.toLowerCase() as 'essential' | 'professional' | 'enterprise';
              const hasActiveTrial = activeTrial?.tier === tierKey;
              const canStartTrial = tier.cta === 'Start Free Trial' && isEligible('ransomware') && !hasActiveTrial;
              
              return (
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
                        <span className="font-semibold">{t('pricing_common.recommended')}</span>
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
                            {t('pricing_common.per_month')}
                          </span>
                        </div>
                        {tier.cta === t('pricing.ransomware.tiers.professional.cta') && (
                          <p className="text-sm text-accent-600 dark:text-accent-400 mt-2">
                            {tierKey === 'professional' ? t('pricing_common.trial_30_days') : t('pricing_common.trial_14_days')}
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
                          {t('pricing_common.trial_active')}
                        </Button>
                      ) : canStartTrial ? (
                        <Button 
                          className="w-full" 
                          size="lg" 
                          variant={tier.popular ? 'primary' : 'outline'}
                          onClick={() => {
                            if (user) {
                              setSelectedTier(tierKey);
                              setShowTrialModal(true);
                            } else {
                              showToast({
                                type: 'info',
                                title: t('pricing_common.sign_in_required'),
                                message: t('pricing_common.sign_in_required_message')
                              });
                              navigate('/login');
                            }
                          }}
                        >
                          {tier.cta}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : tier.cta === t('pricing.ransomware.tiers.professional.cta') && !isEligible('ransomware') ? (
                        <Button 
                          className="w-full" 
                          size="lg" 
                          variant="outline"
                          onClick={() => {
                            showToast({
                              type: 'info',
                              title: t('pricing_common.trial_already_used'),
                              message: t('pricing_common.trial_already_used_message')
                            });
                          }}
                        >
                          {t('pricing_common.upgrade_to_continue')}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          size="lg" 
                          variant={tier.popular ? 'primary' : 'outline'}
                          onClick={() => {
                            if (tier.cta === t('pricing.ransomware.tiers.essential.cta')) {
                              navigate('/ransomware');
                            } else if (tier.cta === t('pricing.ransomware.tiers.enterprise.cta')) {
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
          productId="ransomware"
          productName="Ransomware Protection"
          tier={selectedTier}
          userId={userId}
          userEmail={userEmail}
          onTrialStarted={(_trialId) => {
            showToast({
              type: 'success',
              title: t('pricing_common.trial_started_success'),
              message: t('pricing_common.trial_started_success_message')
            });
            navigate('/dashboard');
          }}
        />
      )}

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
              {t('pricing_common.ready_ransomware')}
            </h2>
            <p className="text-xl text-accent-100 mb-8">
              {t('pricing_common.ready_ransomware_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/business-impact">
                <Button size="lg" className="!bg-white !text-accent-700 hover:!bg-gray-50">
                  {t('pricing.ransomware.run_calculator')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="!bg-white/10 !border-white !text-white hover:!bg-white/20">
                  {t('pricing_common.contact_sales')}
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

