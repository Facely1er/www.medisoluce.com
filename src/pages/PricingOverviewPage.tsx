import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ShieldCheck, Lock, FileText, CheckCircle, Star, ArrowRight, Users, Briefcase, Shield, Wrench, Calculator, AlertCircle } from 'lucide-react';
import { calculateDynamicPricing, getPricingFactorsFromStorage, type CalculatedPricing } from '../utils/pricingCalculator';

const PricingOverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const [dynamicPricing, setDynamicPricing] = useState<CalculatedPricing | null>(null);
  const [showStandardPricing, setShowStandardPricing] = useState(false);

  // Calculate dynamic pricing based on user's assessment data
  useEffect(() => {
    const factors = getPricingFactorsFromStorage();
    const calculated = calculateDynamicPricing(factors, 'bundle');
    setDynamicPricing(calculated);
  }, []);

  const roleBasedRecommendations = {
    executive: {
      title: t('pricing.overview.role_recommendations.executive.title'),
      subtitle: t('pricing.overview.role_recommendations.executive.subtitle'),
      recommended: t('pricing.overview.role_recommendations.executive.recommended'),
      price: t('pricing.overview.role_recommendations.executive.price'),
      savings: t('pricing.overview.role_recommendations.executive.savings'),
      features: t('pricing.overview.role_recommendations.executive.features', { returnObjects: true }) as string[],
      painPoint: t('pricing.overview.role_recommendations.executive.pain_point'),
      icon: <Briefcase className="h-12 w-12" />
    },
    compliance: {
      title: t('pricing.overview.role_recommendations.compliance.title'),
      subtitle: t('pricing.overview.role_recommendations.compliance.subtitle'),
      recommended: t('pricing.overview.role_recommendations.compliance.recommended'),
      price: t('pricing.overview.role_recommendations.compliance.price'),
      savings: t('pricing.overview.role_recommendations.compliance.savings'),
      features: t('pricing.overview.role_recommendations.compliance.features', { returnObjects: true }) as string[],
      painPoint: t('pricing.overview.role_recommendations.compliance.pain_point'),
      icon: <Shield className="h-12 w-12" />
    },
    it: {
      title: t('pricing.overview.role_recommendations.it.title'),
      subtitle: t('pricing.overview.role_recommendations.it.subtitle'),
      recommended: t('pricing.overview.role_recommendations.it.recommended'),
      price: t('pricing.overview.role_recommendations.it.price'),
      savings: t('pricing.overview.role_recommendations.it.savings'),
      features: t('pricing.overview.role_recommendations.it.features', { returnObjects: true }) as string[],
      painPoint: t('pricing.overview.role_recommendations.it.pain_point'),
      icon: <Wrench className="h-12 w-12" />
    },
    operations: {
      title: t('pricing.overview.role_recommendations.operations.title'),
      subtitle: t('pricing.overview.role_recommendations.operations.subtitle'),
      recommended: t('pricing.overview.role_recommendations.operations.recommended'),
      price: t('pricing.overview.role_recommendations.operations.price'),
      savings: t('pricing.overview.role_recommendations.operations.savings'),
      features: t('pricing.overview.role_recommendations.operations.features', { returnObjects: true }) as string[],
      painPoint: t('pricing.overview.role_recommendations.operations.pain_point'),
      icon: <FileText className="h-12 w-12" />
    },
    practice: {
      title: t('pricing.overview.role_recommendations.practice.title'),
      subtitle: t('pricing.overview.role_recommendations.practice.subtitle'),
      recommended: t('pricing.overview.role_recommendations.practice.recommended'),
      price: t('pricing.overview.role_recommendations.practice.price'),
      savings: t('pricing.overview.role_recommendations.practice.savings'),
      features: t('pricing.overview.role_recommendations.practice.features', { returnObjects: true }) as string[],
      painPoint: t('pricing.overview.role_recommendations.practice.pain_point'),
      icon: <Users className="h-12 w-12" />
    }
  };

  const suites = [
    {
      name: t('pricing.overview.suites.hipaa.name'),
      description: t('pricing.overview.suites.hipaa.description'),
      icon: <ShieldCheck className="h-8 w-8 text-primary-500" />,
      link: '/pricing/hipaa',
      color: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
      startingPrice: t('pricing.overview.starting_price', { price: 49 })
    },
    {
      name: t('pricing.overview.suites.ransomware.name'),
      description: t('pricing.overview.suites.ransomware.description'),
      icon: <Lock className="h-8 w-8 text-accent-500" />,
      link: '/pricing/ransomware',
      color: 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800',
      startingPrice: t('pricing.overview.starting_price', { price: 49 })
    },
    {
      name: t('pricing.overview.suites.continuity.name'),
      description: t('pricing.overview.suites.continuity.description'),
      icon: <FileText className="h-8 w-8 text-success-500" />,
      link: '/pricing/continuity',
      color: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
      startingPrice: t('pricing.overview.starting_price', { price: 49 })
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead 
        title="Pricing - MediSoluce Healthcare Compliance"
        description="Choose from our HIPAA Compliance, Ransomware Resilience, or Business Continuity suites. Save with our Complete Bundle packages."
        keywords="healthcare compliance pricing, HIPAA assessment pricing, ransomware protection pricing, business continuity pricing"
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
              {t('pricing.overview.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              {t('pricing.overview.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Banner */}
      {dynamicPricing && dynamicPricing.recommendations.length > 0 && (
        <section className="py-8 bg-accent-50 dark:bg-accent-900/20 border-b border-accent-200 dark:border-accent-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <Card className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-2 border-primary-200 dark:border-primary-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                      <Calculator className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {t('pricing.overview.personalized_pricing_title')}
                      </h3>
                      <button
                        onClick={() => setShowStandardPricing(!showStandardPricing)}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {showStandardPricing ? t('pricing.overview.show_personalized') : t('pricing.overview.show_standard')}
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {dynamicPricing.rationale}
                    </p>
                    <div className="space-y-2">
                      {dynamicPricing.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-accent-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Individual Suites Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pricing.overview.individual_suites_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('pricing.overview.individual_suites_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {suites.map((suite, index) => (
              <Card key={index} hover className={`h-full flex flex-col border-2 ${suite.color}`}>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                      {suite.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{suite.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{suite.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {suite.startingPrice}
                      </span>
                    </div>
                  </div>

                  <Link to={suite.link} className="mt-auto">
                    <Button className="w-full" size="lg">
                      {t('pricing.overview.view_pricing', { name: suite.name })}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-4">
              <Star className="h-4 w-4 mr-2" />
              <span className="font-semibold">{t('pricing.overview.best_value')}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pricing.overview.complete_bundle_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('pricing.overview.complete_bundle_subtitle')}
            </p>
            <Link to="/pricing/bundles">
              <Button size="lg">
                {t('pricing.overview.view_bundle_pricing')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Role-Based Recommendations */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pricing.overview.find_plan_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('pricing.overview.find_plan_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(roleBasedRecommendations).map(([key, rec]) => (
              <Card key={key} hover className="p-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mr-4">
                    {rec.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {rec.subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {rec.price}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {rec.recommended}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('pricing.overview.solves', { painPoint: rec.painPoint })}
                  </p>
                  <div className="flex items-center gap-2 text-success-600 dark:text-success-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{rec.savings}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {rec.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                      {feature}
                    </span>
                  ))}
                  {rec.features.length > 2 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('pricing.overview.more_features', { count: rec.features.length - 2 })}
                    </span>
                  )}
                </div>

                <Link to="/pricing/bundles">
                  <Button variant="outline" size="sm" className="w-full">
                    {t('pricing.overview.view_recommended_plan')}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              {t('pricing.overview.ready_title')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('pricing.overview.ready_subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hipaa-check">
                <Button variant="outline" size="lg" className="!bg-white !text-primary-700 hover:!bg-gray-50">
                  {t('pricing.overview.start_free_assessment')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing/calculator">
                <Button variant="outline" size="lg" className="!bg-transparent !text-white !border-white hover:!bg-white hover:!text-primary-700">
                  {t('pricing.overview.calculate_savings')}
                  <Calculator className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingOverviewPage;