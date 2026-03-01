import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';
import ReactMarkdown from 'react-markdown';

const PrivacyPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        setLoading(true);
        const response = await fetch('/policies/privacy-policy.md');
        if (!response.ok) {
          throw new Error('Failed to load privacy policy');
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load privacy policy');
        console.error('Error loading privacy policy:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, []);

  return (
    <div className="py-12">
      <SEOHead 
        title="Privacy Policy - ERMITS"
        description="Master Privacy Policy for ERMITS LLC products and services"
        noindex={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              MediSoluce is <strong>privacy-first by design</strong>: we avoid data collection wherever possible. Your assessments and data stay in your browser unless you opt in to cloud sync. No tracking; no selling of your data.
            </p>
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
                  Error loading privacy policy: {error}
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

export default PrivacyPage;
