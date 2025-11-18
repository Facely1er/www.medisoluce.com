import React, { useState } from 'react';
import { Search, Download, FileText, Eye, Star, Tag } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import ReactMarkdown from 'react-markdown';

export interface DownloadResource {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'zip' | 'md' | 'csv';
  downloadLink: string;
  category: string;
  tags: string[];
  isPopular: boolean;
  lastUpdated?: string;
  author?: string;
  fileSize?: string;
  downloadCount?: number;
  onView?: (resource: DownloadResource) => void;
}

const ToolkitPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  
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
      downloadLink: '/downloads/hipaa-privacy-policy-template.md',
      category: 'HIPAA Compliance',
      tags: ['policy', 'hipaa', 'privacy'],
      isPopular: true,
      lastUpdated: '2024-01-15',
      author: 'MediSoluce Team',
      fileSize: '8.2 KB',
      downloadCount: 1247
    },
    {
      id: '2',
      title: 'Breach Response Checklist',
      description: 'Step-by-step checklist for responding to a data breach in compliance with HIPAA requirements.',
      fileType: 'md',
      downloadLink: '/downloads/breach-response-checklist.md',
      category: 'HIPAA Compliance',
      tags: ['breach', 'incident response', 'hipaa'],
      isPopular: true,
      lastUpdated: '2024-01-10',
      author: 'MediSoluce Team',
      fileSize: '12.8 KB',
      downloadCount: 982
    },
    {
      id: '3',
      title: 'Business Associate Agreement Template',
      description: 'Standard BAA template for agreements with vendors who handle PHI on your behalf.',
      fileType: 'md',
      downloadLink: '/downloads/business-associate-agreement-template.md',
      category: 'HIPAA Compliance',
      tags: ['baa', 'vendor', 'agreement'],
      isPopular: false,
      lastUpdated: '2024-01-08',
      author: 'MediSoluce Team',
      fileSize: '15.4 KB',
      downloadCount: 756
    },
    {
      id: '4',
      title: 'Staff Training Record Form',
      description: 'Form to track HIPAA compliance training for employees and maintain training records.',
      fileType: 'md',
      downloadLink: '/downloads/staff-training-record-form.md',
      category: 'Training',
      tags: ['training', 'documentation', 'compliance'],
      isPopular: false,
      lastUpdated: '2024-01-05',
      author: 'MediSoluce Team',
      fileSize: '10.7 KB',
      downloadCount: 634
    },
    {
      id: '5',
      title: 'Technology Dependency Mapping Template',
      description: 'Template for mapping and documenting critical technology dependencies in healthcare.',
      fileType: 'csv',
      downloadLink: '/downloads/technology-dependency-mapping-template.csv',
      category: 'Technology Dependency',
      tags: ['mapping', 'inventory', 'dependencies'],
      isPopular: true,
      lastUpdated: '2024-01-12',
      author: 'MediSoluce Team',
      fileSize: '5.3 KB',
      downloadCount: 891
    },
    {
      id: '6',
      title: 'BIA Worksheet for Healthcare',
      description: 'Business Impact Analysis worksheet specifically designed for healthcare organizations.',
      fileType: 'md',
      downloadLink: '/downloads/bia-worksheet-healthcare.md',
      category: 'Business Impact',
      tags: ['bia', 'impact', 'analysis'],
      isPopular: false,
      lastUpdated: '2024-01-07',
      author: 'MediSoluce Team',
      fileSize: '9.6 KB',
      downloadCount: 543
    },
    {
      id: '7',
      title: 'Continuity Plan Template for Healthcare',
      description: 'Comprehensive business continuity plan template focused on healthcare operations.',
      fileType: 'md',
      downloadLink: '/downloads/continuity-plan-template-healthcare.md',
      category: 'Continuity Planning',
      tags: ['continuity', 'plan', 'disaster recovery'],
      isPopular: false,
      lastUpdated: '2024-01-09',
      author: 'MediSoluce Team',
      fileSize: '14.2 KB',
      downloadCount: 678
    },
    {
      id: '8',
      title: 'Ransomware Response Playbook',
      description: 'Detailed playbook for preparing for and responding to ransomware attacks in healthcare.',
      fileType: 'md',
      downloadLink: '/downloads/ransomware-response-playbook.md',
      category: 'Ransomware',
      tags: ['ransomware', 'incident response', 'security'],
      isPopular: true,
      lastUpdated: '2024-01-11',
      author: 'MediSoluce Team',
      fileSize: '22.5 KB',
      downloadCount: 1156
    },
    {
      id: '9',
      title: 'HIPAA Security Risk Assessment Tool',
      description: 'Comprehensive tool for conducting HIPAA security risk assessments.',
      fileType: 'csv',
      downloadLink: '/downloads/hipaa-security-risk-assessment-tool.csv',
      category: 'HIPAA Compliance',
      tags: ['risk assessment', 'security', 'hipaa'],
      isPopular: true,
      lastUpdated: '2024-01-13',
      author: 'MediSoluce Team',
      fileSize: '7.1 KB',
      downloadCount: 1094
    },
    {
      id: '10',
      title: 'EHR Downtime Procedures',
      description: 'Step-by-step procedures for managing EHR downtime scenarios.',
      fileType: 'md',
      downloadLink: '/downloads/ehr-downtime-procedures.md',
      category: 'Technology Dependency',
      tags: ['ehr', 'downtime', 'procedures'],
      isPopular: false,
      lastUpdated: '2024-01-06',
      author: 'MediSoluce Team',
      fileSize: '11.9 KB',
      downloadCount: 445
    },
    {
      id: '11',
      title: 'Patient Data Backup Strategy Guide',
      description: 'Comprehensive guide for implementing patient data backup strategies.',
      fileType: 'md',
      downloadLink: '/downloads/patient-data-backup-strategy-guide.md',
      category: 'Business Impact',
      tags: ['backup', 'data protection', 'strategy'],
      isPopular: false,
      lastUpdated: '2024-01-14',
      author: 'MediSoluce Team',
      fileSize: '16.8 KB',
      downloadCount: 522
    },
    {
      id: '12',
      title: 'Vendor Risk Assessment Template',
      description: 'Template for assessing vendor risks in healthcare technology partnerships.',
      fileType: 'csv',
      downloadLink: '/downloads/vendor-risk-assessment-template.csv',
      category: 'Technology Dependency',
      tags: ['vendor', 'risk', 'assessment'],
      isPopular: false,
      lastUpdated: '2024-01-04',
      author: 'MediSoluce Team',
      fileSize: '6.5 KB',
      downloadCount: 389
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handlePreview = async (resource: DownloadResource) => {
    setPreviewTitle(resource.title);
    setPreviewLoading(true);
    setShowPreviewModal(true);
    
    // Load actual content from the file if it's a markdown file
    if (resource.fileType === 'md') {
      try {
        const response = await fetch(resource.downloadLink);
        if (response.ok) {
          const content = await response.text();
          setPreviewContent(content);
        } else {
          setPreviewContent(`# ${resource.title}\n\n${resource.description}\n\n**Category:** ${resource.category}\n\n**Tags:** ${resource.tags.join(', ')}\n\n**Last Updated:** ${resource.lastUpdated}\n\n**Author:** ${resource.author}\n\n*Unable to load preview content.*`);
        }
      } catch {
        setPreviewContent(`# ${resource.title}\n\n${resource.description}\n\n**Category:** ${resource.category}\n\n**Tags:** ${resource.tags.join(', ')}\n\n**Last Updated:** ${resource.lastUpdated}\n\n**Author:** ${resource.author}\n\n*Error loading preview content.*`);
      } finally {
        setPreviewLoading(false);
      }
    } else {
      // For non-markdown files, show metadata
      setPreviewContent(`# ${resource.title}\n\n${resource.description}\n\n**Category:** ${resource.category}\n\n**Tags:** ${resource.tags.join(', ')}\n\n**Last Updated:** ${resource.lastUpdated}\n\n**Author:** ${resource.author}\n\n**File Type:** ${resource.fileType.toUpperCase()}\n\n*Preview not available for ${resource.fileType.toUpperCase()} files. Please download to view the content.*`);
      setPreviewLoading(false);
    }
  };

  const handleDownload = (resource: DownloadResource) => {
    const link = document.createElement('a');
    link.href = resource.downloadLink;
    link.download = `${resource.title}.${resource.fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <Download className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  Resource Toolkit
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {resources.length} resources available
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Download comprehensive templates, policies, and implementation guides tailored for healthcare organizations. 
              All resources are designed by compliance experts and regularly updated.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Resources</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{resources.length}</p>
                </div>
                <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Popular Resources</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {resources.filter(r => r.isPopular).length}
                  </p>
                </div>
                <Star className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {resources.reduce((sum, r) => sum + (r.downloadCount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <Download className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                </div>
                <Tag className="h-10 w-10 text-orange-600 dark:text-orange-400" />
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-5 w-5" />}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  size="sm"
                >
                  All Categories
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                    {searchQuery === '' ? resources.length : resources.filter(resource =>
                      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length}
                  </span>
                </Button>
                {categories.map((category) => {
                  // Count resources in this category that also match the current search query
                  const count = resources.filter(resource => {
                    const matchesCategory = resource.category === category;
                    const matchesSearch = searchQuery === '' ||
                      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                    return matchesCategory && matchesSearch;
                  }).length;
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      size="sm"
                    >
                      {category}
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                        {count}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Count */}
          {(searchQuery || selectedCategory) && (
            <div className="mb-4 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg inline-flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">{filteredResources.length}</span>
              <span className="mx-2">
                {filteredResources.length === 1 ? 'resource' : 'resources'} found
              </span>
              {(searchQuery || selectedCategory) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="ml-3 text-xs"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No resources found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredResources.map((resource) => (
              <Card key={resource.id} className="p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary-500 dark:border-l-primary-400">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg">
                      <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {resource.title}
                        </h3>
                        {resource.isPopular && (
                          <Star className="h-5 w-5 text-yellow-500 fill-current flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.slice(0, 2).map((tag, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      +{resource.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{resource.fileType.toUpperCase()}</span>
                    </span>
                    {resource.fileSize && (
                      <span>{resource.fileSize}</span>
                    )}
                  </div>
                  {resource.downloadCount && resource.downloadCount > 0 && (
                    <span className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{resource.downloadCount.toLocaleString()}</span>
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleDownload(resource)}
                    className="flex-1"
                    icon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePreview(resource)}
                    icon={<Eye className="h-4 w-4" />}
                  >
                    Preview
                  </Button>
                </div>
              </Card>
              ))}
            </div>
          )}

          {/* Custom Resource Request */}
          <Card className="mt-16 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border-2 border-primary-200 dark:border-primary-800">
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                Need a Custom Resource?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? We can create custom templates and guides tailored to your specific needs. 
                Our compliance experts will work with you to develop the exact resources your organization requires.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => window.location.href = '/contact'}
                  size="lg"
                  className="shadow-lg"
                >
                  Request Custom Resource
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/contact'}
                  size="lg"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewContent('');
          setPreviewLoading(false);
        }}
        title={previewTitle}
        size="lg"
      >
        {previewLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto">
            <ReactMarkdown className="prose dark:prose-invert max-w-none">
              {previewContent}
            </ReactMarkdown>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ToolkitPage;
