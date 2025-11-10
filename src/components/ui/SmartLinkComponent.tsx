import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getOptimizedAnchorText } from '../../utils/linkingStrategy';

interface SmartLinkProps {
  to: string;
  children?: React.ReactNode;
  anchorText?: string;
  context?: 'navigation' | 'content' | 'cta' | 'footer';
  priority?: 'high' | 'medium' | 'low';
  className?: string;
  external?: boolean;
  nofollow?: boolean;
  trackClick?: boolean;
  openInNewTab?: boolean;
  ariaLabel?: string;
}

const SmartLink: React.FC<SmartLinkProps> = ({
  to,
  children,
  anchorText,
  context = 'content',
  priority = 'medium',
  className = '',
  external = false,
  nofollow = false,
  trackClick = true,
  openInNewTab = false,
  ariaLabel
}) => {
  // Auto-detect external links
  const isExternal = external || to.startsWith('http') || to.startsWith('//');
  
  // Generate optimized anchor text if not provided
  const displayText = children || anchorText || getOptimizedAnchorText(to, context);
  
  // Build link attributes
  const buildAttributes = () => {
    const attrs: Record<string, string> = {};
    
    // Analytics tracking
    if (trackClick) {
      attrs['data-analytics'] = isExternal ? 'external-link' : 'internal-link';
      attrs['data-link-destination'] = to;
      attrs['data-link-context'] = context;
      attrs['data-link-priority'] = priority;
    }
    
    // External link handling
    if (isExternal || openInNewTab) {
      attrs.target = '_blank';
      attrs.rel = 'noopener noreferrer';
      
      if (nofollow) {
        attrs.rel += ' nofollow';
      }
    }
    
    // Accessibility
    if (ariaLabel) {
      attrs['aria-label'] = ariaLabel;
    }
    
    return attrs;
  };

  const attributes = buildAttributes();
  
  // Base styling with hover effects
  const baseClasses = `transition-colors duration-200 ${className}`;
  
  if (isExternal) {
    return (
      <a
        href={to}
        className={`${baseClasses} inline-flex items-center`}
        {...attributes}
      >
        {displayText}
        <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={baseClasses}
      {...attributes}
    >
      {displayText}
    </Link>
  );
};

export default SmartLink;