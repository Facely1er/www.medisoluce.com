import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { analytics } from '../../utils/analytics';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Enhanced user interaction tracking for security
    const trackUserInteraction = (eventType: string, target?: string) => {
      const interactions = JSON.parse(localStorage.getItem('user-interactions') || '[]');
      interactions.push({
        type: eventType,
        timestamp: new Date().toISOString(),
        page: location.pathname,
        target: target || 'unknown',
        userAgent: navigator.userAgent.substring(0, 100) // Truncate for storage efficiency
      });
      localStorage.setItem('user-interactions', JSON.stringify(interactions.slice(-50)));
    };
    
    // Track navigation
    trackUserInteraction('navigation', location.pathname);
    
    // Track clicks for security monitoring
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      trackUserInteraction('click', target.tagName.toLowerCase());
    };
    
    // Track form submissions for security monitoring
    const handleSubmit = (e: SubmitEvent) => {
      const target = e.target as HTMLFormElement;
      trackUserInteraction('form_submit', target.action || 'unknown');
    };
    
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    
    // Cleanup listeners
    const cleanup = () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
    };
    
    // Track performance metrics
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0];
        
        // Track page load time
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        if (pageLoadTime > 0) {
          analytics.trackPerformance('page_load_time', pageLoadTime);
        }
        
        // Track time to interactive
        const timeToInteractive = navigation.domInteractive - navigation.fetchStart;
        if (timeToInteractive > 0) {
          analytics.trackPerformance('time_to_interactive', timeToInteractive);
        }
      }
    }
    
    // Track page view for error context
    const pageViews = JSON.parse(localStorage.getItem('page-views') || '[]');
    pageViews.push({
      page: location.pathname,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent.substring(0, 100),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: (navigator as { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown'
    });
    localStorage.setItem('page-views', JSON.stringify(pageViews.slice(-100)));
    
    return cleanup;
  }, [location.pathname]);

  // Add structured data for better SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MediSoluce",
      "description": "Healthcare compliance platform for HIPAA compliance and business continuity",
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ERMITS",
        "url": window.location.origin
      }
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [location.pathname]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-x-hidden max-w-full">
      <Header />
      <motion.main 
        className="flex-grow overflow-x-hidden max-w-full pt-14 md:pt-16"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;