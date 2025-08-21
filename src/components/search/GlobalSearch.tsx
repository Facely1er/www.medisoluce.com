import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Users, Server, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { validateSecureHealthcareInput } from '../../utils/validation';
import { securityUtils } from '../../utils/securityUtils';
import useLocalStorage from '../../hooks/useLocalStorage';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'assessment' | 'dependency' | 'training' | 'resource';
  url: string;
  icon: React.ReactNode;
  relevance: number;
}

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const [assessments] = useLocalStorage('hipaa-assessments', []);
  const [dependencies] = useLocalStorage('system-dependencies', []);
  const [trainingProgress] = useLocalStorage('training-progress', []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    // Validate search query for security
    const searchValidation = validateSecureHealthcareInput(query, 'general');
    
    if (!searchValidation.isValid) {
      setResults([]);
      
      // Log suspicious search attempts
      securityUtils.logSecurityEvent('suspicious_search_query', {
        query: query.substring(0, 100),
        errors: searchValidation.errors,
        securityAlerts: searchValidation.securityAlerts
      }, searchValidation.securityAlerts.length > 0 ? 'high' : 'medium');
      
      return;
    }
    
    // Use sanitized query for search
    const sanitizedQuery = searchValidation.sanitized.toLowerCase();

    const searchResults: SearchResult[] = [];

    // Search assessments
    assessments.forEach((assessment: any) => {
      if (assessment.title?.toLowerCase().includes(sanitizedQuery)) {
        searchResults.push({
          id: assessment.id,
          title: assessment.title || 'HIPAA Assessment',
          description: `Compliance score: ${assessment.result?.percentage || 0}%`,
          type: 'assessment',
          url: '/hipaa-check',
          icon: <FileText className="h-4 w-4" />,
          relevance: 1
        });
      }
    });

    // Search dependencies
    dependencies.forEach((dependency: any) => {
      if (dependency.name.toLowerCase().includes(sanitizedQuery)) {
        searchResults.push({
          id: dependency.id,
          title: dependency.name,
          description: `${dependency.criticality} priority system`,
          type: 'dependency',
          url: '/dependency-manager',
          icon: <Server className="h-4 w-4" />,
          relevance: 1
        });
      }
    });

    // Search training modules
    const trainingModules = [
      { id: 'hipaa-essentials', title: 'HIPAA Essentials', description: 'Core HIPAA compliance training' },
      { id: 'security-awareness', title: 'Security Awareness', description: 'Cybersecurity best practices' },
      { id: 'incident-response', title: 'Incident Response', description: 'Security incident handling' },
      { id: 'compliance-updates', title: 'Compliance Updates', description: 'Latest regulatory changes' }
    ];

    trainingModules.forEach(module => {
      if (module.title.toLowerCase().includes(sanitizedQuery) || 
          module.description.toLowerCase().includes(sanitizedQuery)) {
        const progress = trainingProgress.find((p: any) => p.moduleId === module.id);
        searchResults.push({
          id: module.id,
          title: module.title,
          description: progress ? `Completed with ${progress.score}%` : 'Not started',
          type: 'training',
          url: '/training',
          icon: <Users className="h-4 w-4" />,
          relevance: 1
        });
      }
    });

    // Search static resources
    const resources = [
      { title: 'HIPAA Compliance', description: 'Assess HIPAA compliance', url: '/hipaa-check' },
      { title: 'Dependency Management', description: 'Map technology dependencies', url: '/dependency-manager' },
      { title: 'Business Impact', description: 'Analyze business impact', url: '/business-impact' },
      { title: 'Continuity Planning', description: 'Plan business continuity', url: '/continuity' },
      { title: 'Ransomware Protection', description: 'Protect against ransomware', url: '/ransomware' },
      { title: 'Training Platform', description: 'Access training modules', url: '/training' },
      { title: 'Resource Toolkit', description: 'Download compliance resources', url: '/toolkit' }
    ];

    resources.forEach(resource => {
      if (resource.title.toLowerCase().includes(sanitizedQuery) ||
          resource.description.toLowerCase().includes(sanitizedQuery)) {
        searchResults.push({
          id: resource.url,
          title: resource.title,
          description: resource.description,
          type: 'resource',
          url: resource.url,
          icon: <AlertTriangle className="h-4 w-4" />,
          relevance: 0.8
        });
      }
    });

    // Sort by relevance and limit results
    const sortedResults = searchResults
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);

    setResults(sortedResults);
  }, [query, assessments, dependencies, trainingProgress]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const typeColors = {
    assessment: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20',
    dependency: 'text-secondary-500 bg-secondary-50 dark:bg-secondary-900/20',
    training: 'text-accent-500 bg-accent-50 dark:bg-accent-900/20',
    resource: 'text-success-500 bg-success-50 dark:bg-success-900/20'
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search assessments, systems, training..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
          >
            {results.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={result.url}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${typeColors[result.type]}`}>
                        {result.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {result.description}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {result.type}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
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

export default GlobalSearch;