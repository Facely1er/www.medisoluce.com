import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';
import ReactMarkdown from 'react-markdown';

const CookiePolicyPage: React.FC = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        setLoading(true);
        const response = await fetch('/policies/cookie-policy.md');
        if (!response.ok) {
          throw new Error('Failed to load cookie policy');
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cookie policy');
        console.error('Error loading cookie policy:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, []);

  return (
    <div className="py-12">
      <SEOHead 
        title={t('cookies.title')}
        description={t('cookies.description')}
        noindex={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Settings className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('cookies.title')}
            </h1>
          </div>

          <Card className="p-8">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-800 dark:text-red-200">
                  Error loading cookie policy: {error}
                </p>
              </div>
            )}

            {!loading && !error && (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;