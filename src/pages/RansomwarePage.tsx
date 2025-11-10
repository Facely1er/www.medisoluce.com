import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, X, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import DownloadCard from '../components/toolkit/DownloadCard';
import Modal from '../components/ui/Modal';
import ReactMarkdown from 'react-markdown';

export interface DownloadResource {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'zip';
  downloadLink: string;
  category: string;
  // Add tags property to DownloadResource interface
  tags: string[];
  isPopular: boolean;
  // Add onView property to DownloadResource interface
  onView?: (resource: DownloadResource) => void;
}

const ToolkitPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  
  const categories = [
    'HIPAA Compliance',
    'Technology Dependency',
    'Business Impact',
    'Continuity Planning',
    'Ransomware',
    'Training',
  ];
  
  const resources: DownloadResource[] = [
    {
      id: '1',
      title: 'HIPAA Privacy Policy Template',
      description: 'Comprehensive template for creating a HIPAA-compliant privacy policy for your organization.',
      fileType: 'md',
      downloadLink: '/downloads/hipaa-privacy-policy-template.docx',
      category: 'HIPAA Compliance',
      tags: ['policy', 'hipaa', 'privacy'],
      isPopular: true,
    },
    {
      id: '2',
      title: 'Breach Response Checklist',
      description: 'Step-by-step checklist for responding to a data breach in compliance with HIPAA requirements.',
      fileType: 'md',
      downloadLink: '/downloads/breach-response-checklist.pdf',
      category: 'HIPAA Compliance',
      tags: ['breach', 'incident response', 'hipaa'],
      isPopular: true,
    },
    {
      id: '3',
      title: 'Business Associate Agreement Template',
      description: 'Standard BAA template for agreements with vendors who handle PHI on your behalf.',
      fileType: 'md',
      downloadLink: '/downloads/business-associate-agreement-template.docx',
      category: 'HIPAA Compliance',
      tags: ['baa', 'vendor', 'agreement'],
      isPopular: false,
    },
    {
      id: '4',
      title: 'Staff Training Record Form',
      description: 'Form to track HIPAA compliance training for employees and maintain training records.',
      fileType: 'md',
      downloadLink: '/downloads/staff-training-record-form.pdf',
      category: 'Training',
      tags: ['training', 'documentation', 'compliance'],
      isPopular: false,
    },
    {
      id: '5',
      title: 'Technology Dependency Mapping Template',
      description: 'Template for mapping and documenting critical technology dependencies in healthcare.',
      fileType: 'xlsx',
      downloadLink: '/downloads/technology-dependency-mapping-template.xlsx',
      category: 'Technology Dependency',
      tags: ['mapping', 'inventory', 'dependencies'],
      isPopular: true,
    },
    {
      id: '6',
      title: 'BIA Worksheet for Healthcare',
      description: 'Business Impact Analysis worksheet specifically designed for healthcare organizations.',
      fileType: 'md',
      downloadLink: '/downloads/bia-worksheet-healthcare.docx',
      category: 'Business Impact',
      tags: ['bia', 'impact', 'analysis'],
      isPopular: false,
    },
    {
      id: '7',
      title: 'Continuity Plan Template for Healthcare',
      description: 'Comprehensive business continuity plan template focused on healthcare operations.',
      fileType: 'md',
      downloadLink: '/downloads/continuity-plan-template-healthcare.docx',
      category: 'Continuity Planning',
      tags: ['continuity', 'plan', 'disaster recovery'],
      isPopular: false,
    },
    {
      id: '8',
      title: 'Ransomware Response Playbook',
      description: 'Detailed playbook for preparing for and responding to ransomware attacks in healthcare.',
      fileType: 'md',
      downloadLink: '/downloads/ransomware-response-playbook.pdf',
      category: 'Ransomware',
      tags: ['ransomware', 'incident response', 'security'],
      isPopular: true,
    },
    {
      id: '9',
      title: 'HIPAA Security Risk Assessment Tool',
      description: 'Interactive tool to conduct a HIPAA security risk assessment for your organization.',
      fileType: 'xlsx',
      downloadLink: '/downloads/hipaa-security-risk-assessment-tool.xlsx',
      category: 'HIPAA Compliance',
      tags: ['risk assessment', 'security', 'hipaa'],
      isPopular: false,
    },
    {
      id: '10',
      title: 'Patient Data Backup Strategy Guide',
      description: 'Guide to creating a robust backup strategy for patient data and critical systems.',
      fileType: 'md',
      downloadLink: '/downloads/patient-data-backup-strategy-guide.pdf',
      category: 'Continuity Planning',
      tags: ['backup', 'data protection', 'recovery'],
      isPopular: false,
    },
    {
      id: '11',
      title: 'EHR Downtime Procedures',
      description: 'Procedures for maintaining patient care operations during EHR system downtime.',
      fileType: 'md',
      downloadLink: '/downloads/ehr-downtime-procedures.docx',
      category: 'Continuity Planning',
      tags: ['downtime', 'ehr', 'procedures'],
      isPopular: true,
    },
    {
      id: '12',
      title: 'Vendor Risk Assessment Template',
      description: 'Template for assessing security and compliance risks of healthcare technology vendors.',
      fileType: 'xlsx',
      downloadLink: '/downloads/vendor-risk-assessment-template.xlsx',
      category: 'HIPAA Compliance',
      tags: ['vendor', 'risk assessment', 'compliance'],
      isPopular: false,
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Helper function to convert download link to markdown file path
  // This function handles all resources with .docx and .pdf extensions by converting them to .md
  // Examples:
  // - /downloads/bia-worksheet-healthcare.docx -> /downloads/bia-worksheet-healthcare.md
  // - /downloads/continuity-plan-template-healthcare.docx -> /downloads/continuity-plan-template-healthcare.md
  // - /downloads/ransomware-response-playbook.pdf -> /downloads/ransomware-response-playbook.md
  // - /downloads/patient-data-backup-strategy-guide.pdf -> /downloads/patient-data-backup-strategy-guide.md
  // - /downloads/ehr-downtime-procedures.docx -> /downloads/ehr-downtime-procedures.md
  const getMarkdownPath = (downloadLink: string): string => {
    // Convert .docx, .pdf to .md for markdown files
    const basePath = downloadLink.replace(/\.(docx|pdf)$/, '.md');
    // If it's already .md or doesn't have an extension, use as is
    return basePath.endsWith('.md') ? basePath : `${basePath}.md`;
  };

  // Async function to load document content from file
  const loadDocumentContent = async (downloadLink: string): Promise<string> => {
    try {
      // Convert download link to markdown file path
      const markdownPath = getMarkdownPath(downloadLink);
      
      // Fetch the markdown file from public directory
      const response = await fetch(markdownPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load document: ${response.statusText}`);
      }
      
      const content = await response.text();
      return content;
    } catch (error) {
      console.error('Error loading document content:', error);
      throw error;
    }
  };

  // Updated handleView to be async and load content dynamically
  const handleView = async (resource: Omit<DownloadResource, 'onView'>) => {
    setPreviewTitle(resource.title);
    setShowPreviewModal(true);
    setIsLoadingContent(true);
    setContentError(null);
    setPreviewContent('');

    try {
      const content = await loadDocumentContent(resource.downloadLink);
      setPreviewContent(content);
    } catch (error) {
      setContentError(error instanceof Error ? error.message : 'Failed to load document content');
      setPreviewContent(`# Error Loading Document

Unable to load the document content. Please try downloading the file directly.

Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Legacy inline content removed - content is now loaded dynamically from files

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Download className="h-16 w-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            {t('toolkit.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('toolkit.subtitle')}
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('toolkit.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === category ? null : category);
                  }}
                >
                  {category}
                </button>
              ))}
              
              {selectedCategory && (
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  onClick={() => setSelectedCategory(null)}
                >
                  {t('toolkit.clear_filter')}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DownloadCard
                  title={resource.title}
                  description={resource.description}
                  fileType={resource.fileType}
                  downloadLink={resource.downloadLink}
                  category={resource.category}
                  isPopular={resource.isPopular}
                  tags={resource.tags} // Pass tags property
                  onView={handleView}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('toolkit.no_resources')}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
              >
                {t('toolkit.clear_filters')}
              </Button>
            </div>
          )}
        </div>
        
        {/* Custom Resource Request */}
        <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('toolkit.custom_resource')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('toolkit.custom_resource_desc')}
            </p>
            <Button onClick={() => window.location.href = '/contact'}>
              {t('toolkit.request_custom')}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewContent('');
          setContentError(null);
        }}
        title={previewTitle}
        size="lg"
      >
        {isLoadingContent ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading document...</p>
            </div>
          </div>
        ) : contentError ? (
          <div className="py-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-800 dark:text-red-200 font-medium mb-2">Error Loading Document</p>
              <p className="text-red-700 dark:text-red-300 text-sm">{contentError}</p>
            </div>
            <ReactMarkdown className="prose dark:prose-invert max-w-none">
              {previewContent}
            </ReactMarkdown>
          </div>
        ) : (
          <ReactMarkdown className="prose dark:prose-invert max-w-none">
            {previewContent}
          </ReactMarkdown>
        )}
      </Modal>
    </div>
  );
};

export default ToolkitPage;