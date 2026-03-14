import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, Shield, Server, BarChart, LifeBuoy, AlertTriangle, BookOpen, Download, User, FileText } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems, className = '' }) => {
  const location = useLocation();
  
  // Enhanced page mappings with icons and better relationships
  const pageMapping: Record<string, { label: string; parent?: string; icon?: React.ReactNode }> = {
    '/': { label: 'Home', icon: <Home className="h-4 w-4" /> },
    '/hipaa-check': { 
      label: 'HIPAA Assessment', 
      parent: '/dashboard',
      icon: <Shield className="h-4 w-4" />
    },
    '/dependency-manager': { 
      label: 'Dependency Manager', 
      parent: '/dashboard',
      icon: <Server className="h-4 w-4" />
    },
    '/business-impact': { 
      label: 'Business Impact Analysis', 
      parent: '/dependency-manager',
      icon: <BarChart className="h-4 w-4" />
    },
    '/continuity': { 
      label: 'Business Continuity', 
      parent: '/business-impact',
      icon: <LifeBuoy className="h-4 w-4" />
    },
    '/ransomware': { 
      label: 'Ransomware Protection', 
      parent: '/dashboard',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    '/training': { 
      label: 'Training Center', 
      parent: '/dashboard',
      icon: <BookOpen className="h-4 w-4" />
    },
    '/comprehensive-assessment': { 
      label: 'Comprehensive Assessment', 
      parent: '/dashboard',
      icon: <Shield className="h-4 w-4" />
    },
    '/ransomware-assessment': { 
      label: 'Ransomware Assessment', 
      parent: '/comprehensive-assessment',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    '/toolkit': { 
      label: 'Resource Toolkit',
      icon: <Download className="h-4 w-4" />
    },
    '/dashboard': { 
      label: 'Dashboard',
      icon: <User className="h-4 w-4" />
    },
    '/contact': { 
      label: 'Contact Us',
      icon: <FileText className="h-4 w-4" />
    },
    '/thanks': { 
      label: 'Thank You', 
      parent: '/contact',
      icon: <FileText className="h-4 w-4" />
    },
    '/privacy': { 
      label: 'Privacy Policy',
      icon: <Shield className="h-4 w-4" />
    },
    '/terms': { 
      label: 'Terms of Service',
      icon: <FileText className="h-4 w-4" />
    },
    '/login': { 
      label: 'Sign In',
      icon: <User className="h-4 w-4" />
    },
    '/register': { 
      label: 'Create Account', 
      parent: '/login',
      icon: <User className="h-4 w-4" />
    },
    '/forgot-password': { 
      label: 'Reset Password', 
      parent: '/login',
      icon: <User className="h-4 w-4" />
    },
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) {
      return [
        { 
          label: 'Home', 
          path: '/', 
          icon: <Home className="h-4 w-4" /> 
        }, 
        ...customItems
      ];
    }

    const currentPath = location.pathname;
    const items: BreadcrumbItem[] = [];

    // Always start with home
    items.push({
      label: 'Home',
      path: '/',
      icon: <Home className="h-4 w-4" />
    });

    const currentPage = pageMapping[currentPath];
    if (!currentPage || currentPath === '/') return items;

    // Build breadcrumb trail recursively
    const buildTrail = (path: string, visited = new Set<string>()): BreadcrumbItem[] => {
      if (visited.has(path) || !pageMapping[path]) return [];
      visited.add(path);
      
      const page = pageMapping[path];
      const trail: BreadcrumbItem[] = [];
      
      if (page.parent && page.parent !== '/') {
        trail.push(...buildTrail(page.parent, visited));
      }
      
      trail.push({
        label: page.label,
        path: path,
        icon: page.icon
      });
      
      return trail;
    };

    const trail = buildTrail(currentPath);
    // Remove the first item if it's Home (to avoid duplication)
    if (trail[0]?.path === '/') {
      trail.shift();
    }
    
    items.push(...trail);
    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs for home page or if only one item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`mb-6 ${className}`}
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
        <ol className="flex items-center flex-wrap gap-1 sm:gap-2 text-sm text-gray-600 dark:text-gray-300">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <li 
                key={`${item.path}-${index}`} 
                className="flex items-center min-w-0"
              >
                {index > 0 && (
                  <ChevronRight 
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400 dark:text-gray-500 flex-shrink-0" 
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span 
                    className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5 truncate"
                    aria-current="page"
                  >
                    {item.icon && (
                      <span className="flex-shrink-0 text-primary-600 dark:text-primary-400">
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-none"
                    aria-label={`Navigate to ${item.label}`}
                    data-analytics="breadcrumb-link"
                    data-link-destination={item.path}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;