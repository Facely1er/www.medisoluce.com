import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Shield, BookOpen, Download, BarChart, LifeBuoy, AlertTriangle, Server, FileCheck, CheckCircle, Users, FileText, MessageSquare } from 'lucide-react';
import Card from './Card';
import { RelatedLink } from '../../utils/linkingStrategy';

interface RelatedLinksProps {
  links: RelatedLink[];
  title?: string;
  variant?: 'sidebar' | 'footer' | 'inline' | 'grid';
  className?: string;
  showCategory?: boolean;
  maxLinks?: number;
}

const RelatedLinks: React.FC<RelatedLinksProps> = ({
  links,
  title = 'Related Resources',
  variant = 'sidebar',
  className = '',
  showCategory = false,
  maxLinks = 6
}) => {
  if (!links || links.length === 0) return null;

  const displayLinks = links.slice(0, maxLinks);

  const getIconComponent = (iconName: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'BookOpen': <BookOpen className="h-4 w-4" />,
      'Download': <Download className="h-4 w-4" />,
      'Shield': <Shield className="h-4 w-4" />,
      'BarChart': <BarChart className="h-4 w-4" />,
      'LifeBuoy': <LifeBuoy className="h-4 w-4" />,
      'AlertTriangle': <AlertTriangle className="h-4 w-4" />,
      'Server': <Server className="h-4 w-4" />,
      'FileCheck': <FileCheck className="h-4 w-4" />,
      'ShieldCheck': <Shield className="h-4 w-4" />,
      'Users': <Users className="h-4 w-4" />,
      'FileText': <FileText className="h-4 w-4" />,
      'CheckCircle': <CheckCircle className="h-4 w-4" />,
      'MessageSquare': <MessageSquare className="h-4 w-4" />
    };
    
    return iconMap[iconName] || <ExternalLink className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      'Assessment': 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
      'Education': 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400',
      'Resources': 'bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400',
      'Technical': 'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400',
      'Planning': 'bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400',
      'Security': 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      'Support': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
    };
    
    return colorMap[category] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
  };

  if (variant === 'grid') {
    return (
      <div className={`${className}`}>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200"
              data-analytics="related-link"
              data-link-destination={link.path}
              data-link-source={window.location.pathname}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-primary-500 group-hover:text-primary-600 transition-colors">
                  {link.icon && getIconComponent(link.icon)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {link.title}
                    </h4>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all ml-2" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {link.description}
                  </p>
                  {showCategory && link.category && (
                    <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(link.category)}`}>
                      {link.category}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all"
              data-analytics="inline-related-link"
              data-link-destination={link.path}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className="text-primary-500 group-hover:text-primary-600 transition-colors">
                  {link.icon && getIconComponent(link.icon)}
                </div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {link.title}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                {link.description}
              </p>
              {showCategory && link.category && (
                <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(link.category)}`}>
                  {link.category}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <ExternalLink className="h-5 w-5 mr-2 text-primary-500" />
          {title}
        </h3>
        <div className="space-y-3">
          {displayLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="group flex items-start space-x-3 p-3 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
              data-analytics="footer-related-link"
              data-link-destination={link.path}
            >
              <div className="flex-shrink-0 mt-0.5 text-primary-500 group-hover:text-primary-600 transition-colors">
                {link.icon && getIconComponent(link.icon)}
              </div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {link.title}
                  </h4>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all ml-2" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                  {link.description}
                </p>
                {showCategory && link.category && (
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(link.category)}`}>
                    {link.category}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Default sidebar variant
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
        <ExternalLink className="h-5 w-5 mr-2 text-primary-500" />
        {title}
      </h3>
      <div className="space-y-3">
        {displayLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="group block p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            data-analytics="sidebar-related-link"
            data-link-destination={link.path}
            aria-label={`Navigate to ${link.title}: ${link.description}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5 text-primary-500 group-hover:text-primary-600 transition-colors">
                {link.icon && getIconComponent(link.icon)}
              </div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {link.title}
                  </h4>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                  {link.description}
                </p>
                {showCategory && link.category && (
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(link.category)}`}>
                    {link.category}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default RelatedLinks;