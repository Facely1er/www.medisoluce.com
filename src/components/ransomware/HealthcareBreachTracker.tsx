import React from 'react';
import { Building2, AlertTriangle, Calendar, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';
import { RSSItem } from '../../services/rssFeedService';

interface HealthcareBreachTrackerProps {
  breaches: RSSItem[];
  maxItems?: number;
}

const HealthcareBreachTracker: React.FC<HealthcareBreachTrackerProps> = ({ 
  breaches,
  maxItems = 5
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const displayBreaches = breaches.slice(0, maxItems);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Building2 className="h-6 w-6 text-accent-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Healthcare Breach Tracker
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Industry-specific incidents
            </p>
          </div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {breaches.length} breaches
        </span>
      </div>

      {displayBreaches.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No recent healthcare breaches reported</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayBreaches.map((breach) => (
            <a
              key={breach.id}
              href={breach.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-4 border-l-4 rounded-lg transition-all hover:shadow-md ${getSeverityColor(breach.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building2 className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {breach.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {breach.description.substring(0, 200)}...
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(breach.pubDate)}</span>
                    </span>
                    {breach.severity && (
                      <span className={`px-2 py-1 rounded capitalize ${
                        breach.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        breach.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {breach.severity}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0" />
              </div>

              {breach.categories && breach.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {breach.categories.map((category, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}

          {breaches.length > maxItems && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline w-full text-center">
                View all healthcare breaches ({breaches.length})
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default HealthcareBreachTracker;

