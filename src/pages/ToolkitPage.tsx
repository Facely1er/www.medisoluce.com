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
  onView?: (resource: DownloadResource) => void;
}

const ToolkitPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
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
      author: 'MediSoluce Team'
    },
    {
      id: '13',
      title: 'CISA/NIST Ransomware Readiness Guide for Healthcare',
      description: 'Comprehensive implementation guide based on CISA/NIST Cybersecurity Framework 2.0 specifically tailored for healthcare organizations.',
      fileType: 'md',
      downloadLink: '/downloads/cisa-nist-ransomware-readiness-guide.md',
      category: 'Ransomware',
      tags: ['cisa', 'nist', 'framework', 'ransomware', 'healthcare'],
      isPopular: true,
      lastUpdated: '2024-01-16',
      author: 'MediSoluce Team'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handlePreview = (resource: DownloadResource) => {
    setPreviewTitle(resource.title);
    setPreviewContent(`# ${resource.title}\n\n${resource.description}\n\n**Category:** ${resource.category}\n\n**Tags:** ${resource.tags.join(', ')}\n\n**Last Updated:** ${resource.lastUpdated}\n\n**Author:** ${resource.author}`);
    setShowPreviewModal(true);
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
              <Download className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Resource Toolkit
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Download comprehensive templates, policies, and implementation guides tailored for healthcare organizations. 
              All resources are designed by compliance experts and regularly updated.
            </p>
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
                  variant={selectedCategory === null ? "primary" : "secondary"}
                  onClick={() => setSelectedCategory(null)}
                  size="sm"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "primary" : "secondary"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                      <FileText className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  {resource.isPopular && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{resource.fileType.toUpperCase()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>{resource.category}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
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

          {/* Custom Resource Request */}
          <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Need a Custom Resource?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Can't find what you're looking for? We can create custom templates and guides tailored to your specific needs.
              </p>
              <Button onClick={() => window.location.href = '/contact'}>
                Request Custom Resource
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={previewTitle}
        size="lg"
      >
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>
            {previewContent}
          </ReactMarkdown>
        </div>
      </Modal>
    </div>
  );
};

export default ToolkitPage;
