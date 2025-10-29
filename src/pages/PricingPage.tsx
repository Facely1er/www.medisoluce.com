import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ShieldCheck, Lock, FileText, CheckCircle, Star, ArrowRight, Zap, Users, Briefcase, Shield, Wrench, Calculator, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateDynamicPricing, getPricingFactorsFromStorage, type CalculatedPricing } from '../utils/pricingCalculator';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [dynamicPricing, setDynamicPricing] = useState<CalculatedPricing | null>(null);
  const [showStandardPricing, setShowStandardPricing] = useState(false);

  // Calculate dynamic pricing based on user's assessment data
  useEffect(() => {
    const factors = getPricingFactorsFromStorage();
    const calculated = calculateDynamicPricing(factors, 'bundle');
    setDynamicPricing(calculated);
  }, []);

  const stakeholders = [
    { id: 'all', label: 'View All', icon: <Users className="h-4 w-4" />, color: 'gray' },
    { id: 'executive', label: '👔 C-Level Executive', icon: <Briefcase className="h-4 w-4" />, color: 'primary' },
    { id: 'compliance', label: '📋 Compliance Officer', icon: <Shield className="h-4 w-4" />, color: 'primary' },
    { id: 'it', label: '💻 IT Director', icon: <Wrench className="h-4 w-4" />, color: 'accent' },
    { id: 'operations', label: '⚕️ Operations Manager', icon: <FileText className="h-4 w-4" />, color: 'success' },
    { id: 'practice', label: '🏥 Practice Manager', icon: <Users className="h-4 w-4" />, color: 'secondary' }
  ];

  const roleBasedRecommendations = {
    executive: {
      title: 'For C-Level Executives',
      subtitle: 'Financial risk mitigation and business continuity',
      recommended: 'Professional Bundle',
      price: '$299/month',
      savings: 'Protect $10.9M in potential losses',
      features: ['ROI reporting', 'Business impact analysis', 'Board-ready compliance', 'Financial risk mitigation'],
      painPoint: 'Financial liability and operational disruption',
      icon: <Briefcase className="h-12 w-12" />
    },
    compliance: {
      title: 'For Compliance Officers',
      subtitle: 'Audit readiness and regulatory compliance',
      recommended: 'Professional HIPAA Suite',
      price: '$149/month',
      savings: 'Audit-ready in 30 days',
      features: ['HIPAA documentation', 'Training tracking', 'Audit trail', 'Compliance reporting'],
      painPoint: 'Regulatory requirements and audit readiness',
      icon: <Shield className="h-12 w-12" />
    },
    it: {
      title: 'For IT Directors / CISOs',
      subtitle: 'Security and technical resilience',
      recommended: 'Enterprise Bundle',
      price: '$999/month',
      savings: 'Enterprise-grade security',
      features: ['99.9% uptime SLA', 'SOC monitoring', 'Incident response', 'Custom integrations'],
      painPoint: 'Technical infrastructure and security threats',
      icon: <Wrench className="h-12 w-12" />
    },
    operations: {
      title: 'For Operations Managers',
      subtitle: 'Business continuity and patient safety',
      recommended: 'Professional Continuity',
      price: '$149/month',
      savings: 'Reduce downtime impact',
      features: ['Continuity plans', 'Manual procedures', 'Testing schedules', 'Staff training'],
      painPoint: 'Operational disruptions and patient care',
      icon: <FileText className="h-12 w-12" />
    },
    practice: {
      title: 'For Practice Managers',
      subtitle: 'Affordable compliance solution',
      recommended: 'Essential HIPAA',
      price: '$49/month',
      savings: 'No expensive consultants needed',
      features: ['Free assessment', 'Easy-to-use templates', 'Budget-friendly', 'Quick implementation'],
      painPoint: 'Budget constraints and resource limitations',
      icon: <Users className="h-12 w-12" />
    }
  };

  const pricing = {
    hipaa: {
      essential: { monthly: 49, annual: 490 },
      professional: { monthly: 149, annual: 1490 },
      enterprise: { monthly: 499, annual: 4990 }
    },
    ransomware: {
      essential: { monthly: 49, annual: 490 },
      professional: { monthly: 149, annual: 1490 },
      enterprise: { monthly: 499, annual: 4990 }
    },
    continuity: {
      essential: { monthly: 49, annual: 490 },
      professional: { monthly: 149, annual: 1490 },
      enterprise: { monthly: 499, annual: 4990 }
    },
    bundle: {
      essential: { monthly: 99, annual: 990, savings: 48 },
      professional: { monthly: 299, annual: 2990, savings: 148 },
      enterprise: { monthly: 999, annual: 9990, savings: 498 }
    }
  };

  const features = {
    essential: [
      'Full assessment tools',
      'All policy templates',
      'Downloadable resources',
      'PDF export',
      'Email support',
      'Basic reporting'
    ],
    professional: [
      'Everything in Essential',
      'Team collaboration (5 users)',
      'Cloud sync with backup',
      'Custom templates',
      'Advanced reporting',
      'Priority support',
      'Quarterly updates'
    ],
    enterprise: [
      'Everything in Professional',
      'Unlimited users',
      'White-label options',
      'Dedicated consultant',
      'Custom integrations',
      'SLA: 99.9% uptime',
      'Quarterly compliance reviews',
      '24/7 phone support'
    ]
  };

  const ProductCard = ({ 
    icon, 
    title, 
    description, 
    color,
    tier,
    features: productFeatures,
    linkTo 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    tier: 'essential' | 'professional' | 'enterprise';
    features: string[];
    linkTo: string;
  }) => {
    const price = pricing[tier === 'hipaa' ? 'hipaa' : tier === 'ransomware' ? 'ransomware' : 'continuity'][tier];

    return (
      <Card hover className="h-full flex flex-col border-2 border-gray-200 dark:border-gray-700">
        <div className="p-8">
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mr-4`}>
              {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
          
          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${billingCycle === 'monthly' ? price.monthly : price.annual}
              </span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            {billingCycle === 'annual' && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Save {(billingCycle === 'annual' ? 10 : 0).toFixed(0)}%
              </p>
            )}
          </div>

          <ul className="space-y-3 mb-6">
            {productFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <Link to={linkTo} className="mt-auto">
            <Button className="w-full" size="lg">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    );
  };

  const BundleCard = ({ tier, isPopular }: { tier: 'essential' | 'professional' | 'enterprise', isPopular?: boolean }) => {
    // Use dynamic pricing if available and user hasn't opted for standard
    const useStandard = showStandardPricing || !dynamicPricing;
    const price = useStandard 
      ? pricing.bundle[tier] 
      : {
          monthly: dynamicPricing.bundle[tier],
          annual: dynamicPricing.bundle[tier] * 10, // Annual is typically 10x monthly
          savings: dynamicPricing.savings[tier]
        };
    const tierFeatures = features[tier];

    const basePrice = useStandard 
      ? (pricing.hipaa[tier].monthly * 3)
      : (dynamicPricing.essential * 3);

    return (
      <Card hover className={`h-full flex flex-col border-2 ${isPopular ? 'border-primary-500 dark:border-primary-600 shadow-lg' : 'border-gray-200 dark:border-gray-700'}`}>
        {isPopular && (
          <div className="bg-primary-500 text-white text-center py-2">
            <span className="font-semibold">MOST POPULAR</span>
          </div>
        )}
        
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize mb-2">
              Complete Bundle - {tier}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              All three suites in one: HIPAA Compliance, Ransomware Resilience, and Business Continuity
            </p>
            
            <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-4 mb-4">
              <div className="flex items-center text-success-700 dark:text-success-300">
                <Zap className="h-5 w-5 mr-2" />
                <span className="font-semibold">
                  Save ${useStandard ? price.savings : dynamicPricing.savings[tier]}/month ({(((useStandard ? price.savings : dynamicPricing.savings[tier]) / basePrice) * 100).toFixed(0)}% off)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${billingCycle === 'monthly' ? price.monthly : price.annual}
              </span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              vs ${billingCycle === 'monthly' ? basePrice : basePrice * 10} billed separately
            </p>
            {!useStandard && dynamicPricing && (
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                * Personalized pricing based on your assessment
              </p>
            )}
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-900 dark:text-white mb-3">Includes:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">HIPAA Compliance Suite</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Ransomware Resilience Suite</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Business Continuity Suite</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">All {tierFeatures.length} features from above</span>
              </li>
            </ul>
          </div>

          <Link to="/pricing">
            <Button className="w-full" size="lg" variant={isPopular ? 'default' : 'outline'}>
              Get Complete Bundle
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    );
  };

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
              Comprehensive Healthcare Protection
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Choose individual suites or save with our Complete Bundle. Start free.
            </motion.p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-primary-500"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm ${billingCycle === 'annual' ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Annual <span className="text-success-600 dark:text-success-400">(Save 10%)</span>
              </span>
            </div>
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
                        Personalized Pricing Based on Your Assessment
                      </h3>
                      <button
                        onClick={() => setShowStandardPricing(!showStandardPricing)}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {showStandardPricing ? 'Show Personalized' : 'Show Standard'}
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

      {/* Stakeholder Personas Section */}
      <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Choose pricing for your role
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We'll show you the best plan for your specific needs and responsibilities
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {stakeholders.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedPersona === persona.id
                      ? 'border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {persona.icon}
                  <span className="text-sm font-medium">{persona.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Recommendation Section */}
      {selectedPersona !== 'all' && roleBasedRecommendations[selectedPersona as keyof typeof roleBasedRecommendations] && (
        <section className="py-12 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 border-2 border-primary-200 dark:border-primary-800">
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    {roleBasedRecommendations[selectedPersona as keyof typeof roleBasedRecommendations].icon}
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {roleBasedRecommendations[selectedPersona as keyof typeof roleBasedRecommendations].title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {roleBasedRecommendations[selectedPersona as keyof typeof roleBasedRecommendations].subtitle}
                    </p>
                    <div className="flex items-baseline gap-4 mb-4">
                      <div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {roleBasedRecommendations[selectedPersona as keyof typeof roleBasedRecommendations].price}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {roleBasedRecommendations[selectedPersona as keyof typeof roleBasedRecommendations].recommended}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-success-600 dark:text-success-400">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">
                          {roleBasedRecommendations[selectedPersona as keyof typeof roleBasedRecommendations].savings}
                        </span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Solves your pain point: {roleBasedRecommendations[selectedPersona as keyof typeof roleBasedRecommendations].painPoint}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {roleBasedRecommendations[selectedPersona as keyof typeof roleBasedRecommendations].features.map((feature, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Link to="/pricing">
                        <Button size="lg">
                          View Recommended Plan
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="outline" size="lg">
                          Contact Sales
                        </Button>
                      </Link>
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
              Individual Suites
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Focus on your biggest vulnerability first
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* HIPAA Suite */}
            <ProductCard
              icon={<ShieldCheck className="h-6 w-6 text-white" />}
              title="HIPAA Compliance"
              description="Protect patient data and avoid $100K-$1.6M HIPAA fines with comprehensive compliance tools."
              color="bg-primary-500"
              tier="essential"
              features={features.essential}
              linkTo="/hipaa-check"
            />
            
            {/* Ransomware Suite */}
            <ProductCard
              icon={<Lock className="h-6 w-6 text-white" />}
              title="Ransomware Resilience"
              description="Protect against $10.9M ransomware attacks with healthcare-specific defense and response playbooks."
              color="bg-accent-500"
              tier="essential"
              features={features.essential}
              linkTo="/business-impact"
            />
            
            {/* Business Continuity Suite */}
            <ProductCard
              icon={<FileText className="h-6 w-6 text-white" />}
              title="Business Continuity"
              description="Ensure patient care continues with comprehensive operational resilience planning and recovery procedures."
              color="bg-success-500"
              tier="essential"
              features={features.essential}
              linkTo="/continuity"
            />
          </div>

          {/* CTA to see tiers */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Need more features? See Professional and Enterprise tiers below.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                const element = document.getElementById('complete-bundle-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              View All Tiers
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Complete Bundle Section */}
      <section id="complete-bundle-section" className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-4">
              <Star className="h-4 w-4 mr-2" />
              <span className="font-semibold">Best Value</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Bundle
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              All three suites together. Comprehensive protection, maximum savings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <BundleCard tier="essential" />
            <BundleCard tier="professional" isPopular />
            <BundleCard tier="enterprise" />
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Calculate Your Potential Savings
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              See how much you'll save vs. hiring consultants or facing violations
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white dark:bg-gray-800 p-6">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Significant
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  HIPAA violation penalties
                </p>
              </Card>
              <Card className="bg-white dark:bg-gray-800 p-6">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Substantial
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Healthcare data breach costs
                </p>
              </Card>
              <Card className="bg-white dark:bg-gray-800 p-6">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  Extended
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Recovery time after incidents
                </p>
              </Card>
            </div>

            <div className="mt-12">
              <p className="text-primary-100 mb-4">
                Start protecting your organization for as little as $99/month
              </p>
              <Link to="/hipaa-check">
                <Button variant="outline" size="lg" className="!bg-white !text-primary-700 hover:!bg-gray-50">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Comparison Table */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Find Your Perfect Fit
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Quick comparison by stakeholder role and responsibilities
              </p>
            </div>

            <Card className="p-6 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Role</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Primary Need</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Recommended Plan</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Key Features</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Monthly Cost</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Annual Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    {
                      role: 'CEO/CFO',
                      icon: '👔',
                      need: 'Financial risk mitigation',
                      plan: 'Professional Bundle',
                      features: 'ROI reporting, Business impact analysis',
                      monthly: '$299',
                      annual: '$2,990'
                    },
                    {
                      role: 'Compliance Officer',
                      icon: '📋',
                      need: 'Audit readiness',
                      plan: 'Professional HIPAA Suite',
                      features: 'Documentation, Training tracking',
                      monthly: '$149',
                      annual: '$1,490'
                    },
                    {
                      role: 'IT Director / CISO',
                      icon: '💻',
                      need: 'Security & resilience',
                      plan: 'Enterprise Bundle',
                      features: 'SOC monitoring, Incident response',
                      monthly: '$999',
                      annual: '$9,990'
                    },
                    {
                      role: 'Operations Manager',
                      icon: '⚕️',
                      need: 'Business continuity',
                      plan: 'Professional Continuity',
                      features: 'Continuity plans, Testing schedules',
                      monthly: '$149',
                      annual: '$1,490'
                    },
                    {
                      role: 'Practice Manager',
                      icon: '🏥',
                      need: 'Budget-friendly compliance',
                      plan: 'Essential HIPAA',
                      features: 'Assessments, Basic templates',
                      monthly: '$49',
                      annual: '$490'
                    }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{row.icon}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{row.role}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{row.need}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                          {row.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">{row.features}</td>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">{row.monthly}</td>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">{row.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Can I try before I buy?',
                  a: 'Yes! Start with our free HIPAA assessment and explore all features with a 14-day free trial. No credit card required.'
                },
                {
                  q: 'Can I upgrade or downgrade later?',
                  a: 'Absolutely. Change your plan at any time. If you upgrade mid-cycle, we prorate the difference.'
                },
                {
                  q: 'What if I only need one suite?',
                  a: 'Perfect! All suites are available standalone. You can always add more later.'
                },
                {
                  q: 'Do you offer discounts for annual plans?',
                  a: 'Yes! Annual plans save 10% compared to monthly billing.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, ACH, and wire transfers for Enterprise plans.'
                },
                {
                  q: 'Is there a setup fee?',
                  a: 'No setup fees. Only Essential and Professional tiers have a $99 one-time onboarding fee for customization.'
                }
              ].map((faq, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.a}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;

