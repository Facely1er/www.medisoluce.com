import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, Info, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useLocalStorage from '../../hooks/useLocalStorage';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate smart notifications based on user data
  useEffect(() => {
    const assessments = JSON.parse(localStorage.getItem('hipaa-assessments') || '[]');
    const dependencies = JSON.parse(localStorage.getItem('system-dependencies') || '[]');
    const training = JSON.parse(localStorage.getItem('training-progress') || '[]');
    
    const newNotifications: Notification[] = [];
    const now = new Date();
    
    // Assessment reminders
    if (assessments.length > 0) {
      const lastAssessment = assessments[assessments.length - 1];
      const assessmentDate = new Date(lastAssessment.date);
      const daysSinceAssessment = Math.floor((now.getTime() - assessmentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceAssessment > 180) { // 6 months
        newNotifications.push({
          id: 'assessment-reminder',
          type: 'reminder',
          title: 'Assessment Due',
          message: 'Your last HIPAA assessment was over 6 months ago. Consider running a new assessment.',
          timestamp: now.toISOString(),
          read: false,
          actionUrl: '/hipaa-check',
          actionText: 'Start Assessment'
        });
      }
    } else {
      newNotifications.push({
        id: 'first-assessment',
        type: 'info',
        title: 'Welcome to MediSoluce',
        message: 'Get started by completing your first HIPAA compliance assessment.',
        timestamp: now.toISOString(),
        read: false,
        actionUrl: '/hipaa-check',
        actionText: 'Start Now'
      });
    }
    
    // High-risk system alerts
    const highRiskSystems = dependencies.filter((d: any) => d.riskLevel === 'High').length;
    if (highRiskSystems > 0) {
      newNotifications.push({
        id: 'high-risk-systems',
        type: 'warning',
        title: `${highRiskSystems} High-Risk Systems Detected`,
        message: 'You have systems with high risk levels that need attention.',
        timestamp: now.toISOString(),
        read: false,
        actionUrl: '/dependency-manager',
        actionText: 'Review Systems'
      });
    }
    
    // Training reminders
    if (training.length === 0) {
      newNotifications.push({
        id: 'training-start',
        type: 'info',
        title: 'Start Training',
        message: 'Complete compliance training to strengthen your knowledge.',
        timestamp: now.toISOString(),
        read: false,
        actionUrl: '/training',
        actionText: 'Browse Modules'
      });
    }
    
    // Only add new notifications that don't already exist
    const existingIds = notifications.map(n => n.id);
    const filteredNew = newNotifications.filter(n => !existingIds.includes(n.id));
    
    if (filteredNew.length > 0) {
      setNotifications([...notifications, ...filteredNew]);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'reminder': return <Calendar className="h-5 w-5 text-primary-500" />;
      default: return <Info className="h-5 w-5 text-primary-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                        !notification.read ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {new Date(notification.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {notification.actionUrl && (
                            <div className="mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  markAsRead(notification.id);
                                  window.location.href = notification.actionUrl!;
                                }}
                              >
                                {notification.actionText}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;