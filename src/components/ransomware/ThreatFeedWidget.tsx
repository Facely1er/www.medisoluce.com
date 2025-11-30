import React from 'react';
import { AlertTriangle, Clock, ExternalLink, Shield } from 'lucide-react';
import Card from '../ui/Card';
import { RSSItem } from '../../services/rssFeedService';

interface ThreatFeedWidgetProps {
  threats: RSSItem[];
  maxItems?: number;
  title?: string;
}

const ThreatFeedWidget: React.FC<ThreatFeedWidgetProps> = ({ 
  threats, 
  maxItems = 10,
  title = 'Latest Threat Intelligence' 
}) => {
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

  const getSeverityIcon = (severity?: string) => {
    if (severity === 'critical' || severity === 'high') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Shield className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const displayThreats = threats.slice(0, maxItems);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {threats.length} total
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayThreats.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No threats available</p>
          </div>
        ) : (
          displayThreats.map((threat) => (
            <a
              key={threat.id}
              href={threat.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-4 border-l-4 rounded-lg transition-all hover:shadow-md ${getSeverityColor(threat.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2 flex-1">
                  <div className={`${threat.severity === 'critical' || threat.severity === 'high' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {getSeverityIcon(threat.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {threat.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {threat.description.substring(0, 150)}...
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(threat.pubDate)}</span>
                      </span>
                      {threat.severity && (
                        <span className={`px-2 py-1 rounded ${
                          threat.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          threat.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                          threat.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {threat.severity.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
              </div>
              
              {threat.categories && threat.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {threat.categories.slice(0, 3).map((category, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))
        )}
      </div>

      {threats.length > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View all threats ({threats.length})
          </button>
        </div>
      )}
    </Card>
  );
};

export default ThreatFeedWidget;

