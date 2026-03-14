import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ThanksPage: React.FC = () => {
  const { t } = useTranslation();

  const nextSteps = [
    {
      title: t('thanks.check_email'),
      description: t('thanks.check_email_desc'),
    },
    {
      title: t('thanks.explore_resources'),
      description: t('thanks.explore_resources_desc'),
      link: '/toolkit',
    },
    {
      title: t('thanks.schedule_demo'),
      description: t('thanks.schedule_demo_desc'),
      link: '/contact',
    },
  ];

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('thanks.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              {t('thanks.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid gap-6"
          >
            {nextSteps.map((step, index) => (
              <Card key={step.title} className="p-6 text-left">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {step.description}
                </p>
                {step.link && (
                  <Link to={step.link}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ArrowRight className="h-4 w-4" />}
                      iconPosition="right"
                    >
                      {index === 1 ? t('thanks.view_resources') : t('thanks.schedule_now')}
                    </Button>
                  </Link>
                )}
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <Link to="/">
              <Button variant="outline">
                {t('thanks.return_homepage')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ThanksPage;