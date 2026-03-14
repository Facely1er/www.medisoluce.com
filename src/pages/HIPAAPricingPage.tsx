import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ShieldCheck, CheckCircle, ArrowRight, AlertTriangle, FileText, Users, Lock, Download, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateDynamicPricing, getPricingFactorsFromStorage, type CalculatedPricing } from '../utils/pricingCalculator';
import { useAuth } from '../context/AuthContext';
import { useTrial } from '../hooks/useTrial';
import TrialActivationModal from '../components/trial/TrialActivationModal';
import TrialBanner from '../components/trial/TrialBanner';
import { useToast } from '../components/ui/Toast';

const HIPAAPricingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dynamicPricing, setDynamicPricing] = useState<CalculatedPricing | null>(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'essential' | 'professional' | 'enterprise' | null>(null);
  
  const userId = user?.id || '';
  const userEmail = user?.email || '';
  const { activeTrial, isEligible } = useTrial(userId, 'hipaa');

  useEffect(() => {
    const factors = getPricingFactorsFromStorage();
    const calculated = calculateDynamicPricing(factors, 'hipaa');
    setDynamicPricing(calculated);
  }, []);

  const tiers = [
    {
      name: t('pricing.hipaa.tiers.essential.name'),
      price: 49,
      description: t('pricing.hipaa.tiers.essential.description'),
      features: t('pricing.hipaa.tiers.essential.features', { returnObjects: true }) as string[],
      cta: t('pricing.hipaa.tiers.essential.cta'),
      popular: false
    },
    {
      name: t('pricing.hipaa.tiers.professional.name'),
      price: 149,
      description: t('pricing.hipaa.tiers.professional.description'),
      features: t('pricing.hipaa.tiers.professional.features', { returnObjects: true }) as string[],
      cta: t('pricing.hipaa.tiers.professional.cta'),
      popular: true
    },
    {
      name: t('pricing.hipaa.tiers.enterprise.name'),
      price: 499,
      description: t('pricing.hipaa.tiers.enterprise.description'),
      features: t('pricing.hipaa.tiers.enterprise.features', { returnObjects: true }) as string[],
      cta: t('pricing.hipaa.tiers.enterprise.cta'),
      popular: false
    }
  ];

  const stats = [
    { value: t('pricing.hipaa.stats.max_penalties.value'), label: t('pricing.hipaa.stats.max_penalties.label'), icon: AlertTriangle },
    { value: t('pricing.hipaa.stats.safeguards.value'), label: t('pricing.hipaa.stats.safeguards.label'), icon: ShieldCheck },
    { value: t('pricing.hipaa.stats.training.value'), label: t('pricing.hipaa.stats.training.label'), icon: CheckCircle }
  ];

  const benefits = [
    {
      icon: FileText,
      title: t('pricing.hipaa.benefits.assessment.title'),
      description: t('pricing.hipaa.benefits.assessment.description')
    },
    {
      icon: Lock,
      title: t('pricing.hipaa.benefits.protect_data.title'),
      description: t('pricing.hipaa.benefits.protect_data.description')
    },
    {
      icon: Users,
      title: t('pricing.hipaa.benefits.staff_training.title'),
      description: t('pricing.hipaa.benefits.staff_training.description')
    },
    {
      icon: Download,
      title: t('pricing.hipaa.benefits.templates.title'),
      description: t('pricing.hipaa.benefits.templates.description')
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
              {t('pricing.hipaa.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              {t('pricing.hipaa.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/hipaa-check">
                <Button size="lg" className="mr-4 mb-4">
                  {t('pricing.hipaa.start_free_assessment')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  {t('pricing.hipaa.view_pricing')}
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
              {t('pricing.hipaa.everything_you_need_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('pricing.hipaa.everything_you_need_subtitle')}
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
                      {t('pricing.hipaa.personalized_pricing_available')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('pricing.hipaa.personalized_pricing_description')}
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
        <section className="py-8 bg-white dark:bg-gray-800 border-b">
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
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pricing_common.choose_plan', { product: t('pricing.hipaa.title') })}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('pricing_common.choose_plan_subtitle')}
            </p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('pricing.hipaa.limits_disclaimer')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => {
              const tierKey = tier.name.toLowerCase() as 'essential' | 'professional' | 'enterprise';
              const hasActiveTrial = activeTrial?.tier === tierKey;
              const canStartTrial = tier.cta === 'Start Free Trial' && isEligible('hipaa') && !hasActiveTrial;
              
              return (
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
                        {tier.cta === t('pricing.hipaa.tiers.professional.cta') && (
                          <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
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
                      ) : tier.cta === t('pricing.hipaa.tiers.professional.cta') && !isEligible('hipaa') ? (
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
                            if (tier.cta === t('pricing.hipaa.tiers.essential.cta')) {
                              navigate('/hipaa-check');
                            } else if (tier.cta === t('pricing.hipaa.tiers.enterprise.cta')) {
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
          productId="hipaa"
          productName="HIPAA Compliance"
          tier={selectedTier}
          userId={userId}
          userEmail={userEmail}
          onTrialStarted={() => {
            showToast({
              type: 'success',
              title: t('pricing_common.trial_started_success'),
              message: t('pricing_common.trial_started_success_message')
            });
            navigate('/dashboard');
          }}
        />
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              {t('pricing_common.ready_to_protect')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('pricing_common.ready_to_protect_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/hipaa-check">
                <Button size="lg" className="!bg-white !text-primary-700 hover:!bg-gray-50">
                  {t('pricing_common.start_free_assessment')}
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

export default HIPAAPricingPage;

