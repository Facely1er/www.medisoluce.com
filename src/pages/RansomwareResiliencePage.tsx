import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ShieldCheck, Download, Calculator, CheckCircle } from 'lucide-react';

const RansomwareResiliencePage: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      value: t('ransomware_resilience.stat_1_value'),
      description: t('ransomware_resilience.stat_1_description'),
      note: t('ransomware_resilience.stat_1_note'),
    },
    {
      value: t('ransomware_resilience.stat_2_value'),
      description: t('ransomware_resilience.stat_2_description'),
      note: t('ransomware_resilience.stat_2_note'),
    },
    {
      value: t('ransomware_resilience.stat_3_value'),
      description: t('ransomware_resilience.stat_3_description'),
      note: t('ransomware_resilience.stat_3_note'),
    },
  ];

  const features = [
    {
      title: t('ransomware_resilience.feature_hipaa_title'),
      description: t('ransomware_resilience.feature_hipaa_desc'),
    },
    {
      title: t('ransomware_resilience.feature_playbooks_title'),
      description: t('ransomware_resilience.feature_playbooks_desc'),
    },
    {
      title: t('ransomware_resilience.feature_continuity_title'),
      description: t('ransomware_resilience.feature_continuity_desc'),
    },
  ];

  const controls = [
    t('ransomware_resilience.feature_control_1'),
    t('ransomware_resilience.feature_control_2'),
    t('ransomware_resilience.feature_control_3'),
    t('ransomware_resilience.feature_control_4'),
  ];

  const pricingData = [
    {
      description: t('ransomware_resilience.pricing_hipaa_desc'),
      marketRate: t('ransomware_resilience.pricing_hipaa_market'),
      mediSoluce: t('ransomware_resilience.pricing_hipaa_medisoluce'),
      savings: t('ransomware_resilience.pricing_hipaa_savings'),
    },
    {
      description: t('ransomware_resilience.pricing_ransomware_desc'),
      marketRate: t('ransomware_resilience.pricing_ransomware_market'),
      mediSoluce: t('ransomware_resilience.pricing_ransomware_medisoluce'),
      savings: t('ransomware_resilience.pricing_ransomware_savings'),
    },
    {
      description: t('ransomware_resilience.pricing_toolkit_desc'),
      marketRate: t('ransomware_resilience.pricing_toolkit_market'),
      mediSoluce: t('ransomware_resilience.pricing_toolkit_medisoluce'),
      savings: t('ransomware_resilience.pricing_toolkit_savings'),
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title={t('ransomware_resilience.hero_title')}
        description={t('ransomware_resilience.hero_subtitle')}
        keywords="healthcare ransomware, HIPAA readiness, ransomware playbooks, business continuity, patient safety"
      />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center"
          >
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-4">
              {t('ransomware_resilience.hero_title')}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('ransomware_resilience.hero_headline')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              {t('ransomware_resilience.hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/business-impact">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="px-8 py-4 text-lg flex items-center gap-2"
                >
                  <Calculator size={20} />
                  {t('ransomware_resilience.cta_run_calculator')}
                </Button>
              </Link>
              <Link to="/toolkit">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg flex items-center gap-2 bg-white dark:bg-gray-800"
                >
                  <Download size={20} />
                  {t('ransomware_resilience.cta_download_onepager')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {t('ransomware_resilience.stats_section_title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8"
              >
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-3">
                  {stat.value}
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  {stat.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {stat.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full p-6 bg-white dark:bg-gray-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Built-In Controls Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <Card hover className="p-8 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('ransomware_resilience.feature_controls_title')}
                </h3>
              </div>
              <ul className="space-y-3">
                {controls.map((control, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{control}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Pricing Table */}
            <Card className="p-8 bg-gradient-to-br from-success-50 to-primary-50 dark:from-gray-800 dark:to-gray-700">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('ransomware_resilience.pricing_section_title')}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-600">
                      <th className="text-left py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Description
                      </th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Market Rate (Annual)
                      </th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        MediSoluce
                      </th>
                      <th className="text-right py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                        Savings to Care
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {pricingData.map((row, index) => (
                      <tr key={index}>
                        <td className="py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {row.description}
                        </td>
                        <td className="py-4 text-sm text-right text-gray-600 dark:text-gray-400">
                          {row.marketRate}
                        </td>
                        <td className="py-4 text-sm text-right text-primary-600 dark:text-primary-400 font-semibold">
                          {row.mediSoluce}
                        </td>
                        <td className="py-4 text-sm text-right text-green-600 dark:text-green-400 font-semibold">
                          {row.savings}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 italic">
                {t('ransomware_resilience.pricing_note')}
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to strengthen your ransomware resilience?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Get started with our comprehensive assessment and tools today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hipaa-check">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="!bg-white !text-primary-700 !border-white hover:!bg-gray-50 px-8 py-4"
                >
                  Start Free Assessment
                </Button>
              </Link>
              <Link to="/business-impact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="!bg-white/10 !border-white !text-white hover:!bg-white/20 px-8 py-4"
                >
                  Run Impact Calculator
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RansomwareResiliencePage;

