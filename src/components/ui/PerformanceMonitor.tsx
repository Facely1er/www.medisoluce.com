import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';
import Card from './Card';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}
import { useHealthMonitoring, usePerformanceMonitoring } from '../../hooks/useHealthMonitoring';

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  showDebugInfo?: boolean;
  enhanced?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  showDebugInfo = false,
  enhanced = false
}) => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isVisible, setIsVisible] = useState(false);
  const performanceMetrics = usePerformanceMonitoring();
  const { healthData } = useHealthMonitoring({ autoRefresh: enhanced });

  useEffect(() => {
    if (!import.meta.env.PROD && showDebugInfo) {
      setIsVisible(true);
    }

    const collectMetrics = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const newMetrics: Partial<PerformanceMetrics> = {
            loadTime: navigation.loadEventEnd - navigation.fetchStart,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0
          };

          // Collect Web Vitals
          try {
            // FCP
            const fcpEntry = performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              newMetrics.firstContentfulPaint = fcpEntry.startTime;
            }

            // LCP
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              if (lastEntry) {
                newMetrics.largestContentfulPaint = lastEntry.startTime;
                setMetrics(prev => ({ ...prev, largestContentfulPaint: lastEntry.startTime }));
              }
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // FID
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach((entry: any) => {
                if (entry.entryType === 'first-input') {
                  const fid = entry.processingStart - entry.startTime;
                  newMetrics.firstInputDelay = fid;
                  setMetrics(prev => ({ ...prev, firstInputDelay: fid }));
                }
              });
            }).observe({ entryTypes: ['first-input'] });

            // CLS
            let clsScore = 0;
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach((entry: any) => {
                if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                  clsScore += entry.value;
                  newMetrics.cumulativeLayoutShift = clsScore;
                  setMetrics(prev => ({ ...prev, cumulativeLayoutShift: clsScore }));
                }
              });
            }).observe({ entryTypes: ['layout-shift'] });

          } catch (error) {
            !import.meta.env.PROD && console.warn('Error collecting Web Vitals:', error);
          }

          setMetrics(newMetrics);
          
          if (onMetricsUpdate && Object.keys(newMetrics).length > 0) {
            onMetricsUpdate(newMetrics as PerformanceMetrics);
          }
        }
      }
    };

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    return () => {
      window.removeEventListener('load', collectMetrics);
    };
  }, [onMetricsUpdate, showDebugInfo]);

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-success-500';
    if (value <= thresholds[1]) return 'text-warning-500';
    return 'text-accent-500';
  };

  const formatTime = (time: number) => {
    if (time < 1000) return `${Math.round(time)}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  if (!isVisible || !showDebugInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="p-4 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            <Activity className="h-4 w-4 mr-2 text-primary-500" />
            Performance Metrics
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Load Time:</span>
            <span className={getScoreColor(metrics.loadTime || 0, [2000, 4000])}>
              {formatTime(metrics.loadTime || 0)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">FCP:</span>
            <span className={getScoreColor(metrics.firstContentfulPaint || 0, [1800, 3000])}>
              {formatTime(metrics.firstContentfulPaint || 0)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">LCP:</span>
            <span className={getScoreColor(metrics.largestContentfulPaint || 0, [2500, 4000])}>
              {formatTime(metrics.largestContentfulPaint || 0)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">FID:</span>
            <span className={getScoreColor(metrics.firstInputDelay || 0, [100, 300])}>
              {formatTime(metrics.firstInputDelay || 0)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">CLS:</span>
            <span className={getScoreColor((metrics.cumulativeLayoutShift || 0) * 1000, [100, 250])}>
              {(metrics.cumulativeLayoutShift || 0).toFixed(3)}
            </span>
          </div>
        </div>
        
        {enhanced && healthData && (
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Overall Health:</span>
                <span className={
                  healthData.overall.score >= 80 ? 'text-success-500' :
                  healthData.overall.score >= 60 ? 'text-warning-500' : 'text-accent-500'
                }>
                  {healthData.overall.score}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auto-Optimizations:</span>
                <span className="text-primary-500">
                  {healthData.autoHealingActions.filter((a: any) => a.success).length}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Development Mode Only
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PerformanceMonitor;