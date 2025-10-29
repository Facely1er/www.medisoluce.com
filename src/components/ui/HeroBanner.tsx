import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, FileCheck, Calculator, Download } from 'lucide-react';
import TextCarousel from './TextCarousel';

interface HeroBannerProps {
  title: string;
  titleSubtitle?: string;
  subtitle: string | string[];
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  showFeatures?: boolean;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  titleSubtitle,
  subtitle,
  ctaText,
  ctaLink = '/',
  secondaryCtaText,
  secondaryCtaLink = '/',
  showFeatures = true,
}) => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary-500" />,
      title: t('home.hero_features.hipaa_title'),
      description: t('home.hero_features.hipaa_desc'),
    },
    {
      icon: <Database className="h-5 w-5 text-secondary-500" />,
      title: t('home.hero_features.dependency_title'),
      description: t('home.hero_features.dependency_desc'),
    },
    {
      icon: <FileCheck className="h-5 w-5 text-accent-500" />,
      title: t('home.hero_features.continuity_title'),
      description: t('home.hero_features.continuity_desc'),
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 10 L 40 10 M 10 0 L 10 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-300 dark:text-gray-700"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {titleSubtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2"
              >
                {titleSubtitle}
              </motion.p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white leading-tight ${titleSubtitle ? '' : 'mt-0'}`}
            >
              {title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              {Array.isArray(subtitle) ? (
                <TextCarousel 
                  texts={subtitle}
                  className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                />
              ) : (
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {(ctaText || secondaryCtaText) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              >
                {ctaText && (
                  <Link to={ctaLink}>
                    <Button
                      size="lg"
                      icon={<Calculator className="h-5 w-5" />}
                      iconPosition="left"
                    >
                      {ctaText}
                    </Button>
                  </Link>
                )}
                {secondaryCtaText && (
                  <Link to={secondaryCtaLink}>
                    <Button
                      variant="outline"
                      size="lg"
                      icon={<Download className="h-5 w-5" />}
                      iconPosition="left"
                    >
                      {secondaryCtaText}
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </motion.div>

          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;