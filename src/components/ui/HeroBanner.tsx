import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, FileCheck, Download } from 'lucide-react';
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
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10 dark:from-blue-600/5 dark:via-indigo-600/5 dark:to-purple-600/5 animate-pulse"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-400/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200/20 dark:bg-indigo-400/10 rounded-full animate-float-reverse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-200/20 dark:bg-purple-400/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-200/20 dark:bg-pink-400/10 rounded-full animate-float-reverse" style={{ animationDelay: '1s' }}></div>
          
          {/* Additional floating elements */}
          <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-lg rotate-45 animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-300/20 to-pink-300/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-lg rotate-12 animate-float-reverse" style={{ animationDelay: '5s' }}></div>
        </div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <svg
            className="h-full w-full"
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="animatedGrid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 15 L 60 15 M 15 0 L 15 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-blue-300 dark:text-blue-700"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#animatedGrid)" />
          </svg>
        </div>
        
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40"></div>
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
              className={`text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white leading-tight ${titleSubtitle ? '' : 'mt-0'} whitespace-pre-line`}
            >
              {title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              {Array.isArray(subtitle) ? (
                <div className="relative p-8 rounded-2xl bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
                  <TextCarousel 
                    texts={subtitle}
                    className="text-xl md:text-2xl text-gray-800 dark:text-gray-100 max-w-4xl mx-auto font-medium leading-relaxed"
                    interval={5000}
                  />
                  {/* Decorative elements around the carousel */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-primary-300 dark:border-primary-600 rounded-full opacity-50 animate-pulse-glow"></div>
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 border-2 border-secondary-300 dark:border-secondary-600 rounded-full opacity-50 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
                  
                  {/* Shimmer effect overlay */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              ) : (
                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-4xl mx-auto font-medium leading-relaxed">
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
                      icon={<ShieldCheck className="h-5 w-5" />}
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