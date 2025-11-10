import React, { useState, useRef } from 'react';
import { Search, Download, FileText, Eye, Star, Tag } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  
  const categories = [
    'HIPAA Compliance',
    'Technology Dependency',
    'Business Impact',
    'Continuity Planning',
    'Ransomware',
    'Training',
  ];
  
  // Resources array - all counts are calculated dynamically from this data
  // Note: downloadCount values are sample data for demonstration purposes
  // In production, these should be tracked separately and updated dynamically
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
      downloadCount: 1247 // Sample data - should be tracked separately in production
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

  const generatePDF = async (content: string, title: string) => {
    setIsGeneratingPDF(true);
    try {
      // Create a temporary hidden container for rendering
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.backgroundColor = '#ffffff';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.color = '#1f2937';
      tempDiv.className = 'prose prose-lg max-w-none';
      document.body.appendChild(tempDiv);

      // Use ReactMarkdown to render content
      // We'll render it using ReactDOM
      const ReactDOM = await import('react-dom/client');
      const root = ReactDOM.createRoot(tempDiv);
      
      root.render(
        React.createElement(ReactMarkdown, {
          className: 'prose prose-lg max-w-none',
          children: content
        })
      );

      // Wait for React to render
      await new Promise(resolve => setTimeout(resolve, 800));

      // Capture the rendered content with html2canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        windowWidth: 800,
        height: tempDiv.scrollHeight
      });

      // Clean up
      root.unmount();
      document.body.removeChild(tempDiv);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 40) / imgHeight);
      const imgScaledWidth = imgWidth * ratio;
      const imgScaledHeight = imgHeight * ratio;

      // Calculate if we need multiple pages
      const pageHeight = pdfHeight - 50; // Leave margins (20 top + 30 bottom)
      const imgHeightPerPage = pageHeight;
      const totalPages = Math.ceil(imgScaledHeight / imgHeightPerPage);

      // Add first page with title
      pdf.setFontSize(20);
      pdf.text(title, pdfWidth / 2, 15, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(`Generated by MediSoluce - ${new Date().toLocaleDateString()}`, pdfWidth / 2, 20, { align: 'center' });
      
      // Add content image - split across pages if needed
      if (totalPages === 1) {
        // Single page
        pdf.addImage(imgData, 'PNG', 10, 25, imgScaledWidth, imgScaledHeight);
      } else {
        // Multiple pages - split the image
        // Calculate how many pixels of canvas height fit per page
        const canvasHeightPerPage = canvas.height / totalPages;
        let sourceY = 0;
        
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          // Calculate the height for this page
          const remainingHeight = canvas.height - sourceY;
          const pageCanvasHeight = Math.min(canvasHeightPerPage, remainingHeight);
          
          // Create a canvas for this page
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = pageCanvasHeight;
          const pageCtx = pageCanvas.getContext('2d');
          
          if (pageCtx) {
            pageCtx.drawImage(
              canvas,
              0, sourceY, canvas.width, pageCanvasHeight,
              0, 0, pageCanvas.width, pageCanvas.height
            );
            
            const pageImgData = pageCanvas.toDataURL('image/png');
            const pageImgHeight = (pageCanvasHeight / canvas.height) * imgScaledHeight;
            
            pdf.addImage(pageImgData, 'PNG', 10, i === 0 ? 25 : 10, imgScaledWidth, pageImgHeight);
          }
          
          sourceY += pageCanvasHeight;
        }
      }

      // Save PDF
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownload = async (resource: DownloadResource) => {
    // For markdown files, generate PDF
    if (resource.fileType === 'md') {
      try {
        // Load the markdown content
        const response = await fetch(resource.downloadLink);
        if (response.ok) {
          const content = await response.text();
          await generatePDF(content, resource.title);
        } else {
          // Fallback to original download
          const link = document.createElement('a');
          link.href = resource.downloadLink;
          link.download = `${resource.title}.${resource.fileType}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Error loading content for PDF:', error);
        // Fallback to original download
        const link = document.createElement('a');
        link.href = resource.downloadLink;
        link.download = `${resource.title}.${resource.fileType}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      // For non-markdown files, use original download
      const link = document.createElement('a');
      link.href = resource.downloadLink;
      link.download = `${resource.title}.${resource.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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

          {/* Statistics - All counts are calculated dynamically from the resources array */}
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Set(resources.map(r => r.category)).size}
                  </p>
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
                    {resources.length}
                  </span>
                </Button>
                {categories.map((category) => {
                  // Calculate count dynamically from actual resources in this category
                  const count = resources.filter(r => r.category === category).length;
                  // Only show category if it has resources
                  if (count === 0) return null;
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
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? 'Generating PDF...' : resource.fileType === 'md' ? 'Download PDF' : 'Download'}
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
        size="xl"
      >
        {previewLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto -mx-6 px-6">
            <ReactMarkdown 
              className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-heading prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6 prose-h1:border-b prose-h1:border-gray-200 prose-h1:dark:border-gray-700 prose-h1:pb-3
                prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-8 prose-h2:font-semibold
                prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-6 prose-h3:font-semibold
                prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-p:text-gray-700 prose-p:dark:text-gray-300
                prose-strong:font-bold prose-strong:text-gray-900 prose-strong:dark:text-white
                prose-ul:my-4 prose-ul:space-y-2 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-4 prose-ol:space-y-2 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-base prose-li:leading-relaxed prose-li:text-gray-700 prose-li:dark:text-gray-300
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4 prose-blockquote:bg-gray-50 prose-blockquote:dark:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:rounded-r
                prose-table:w-full prose-table:my-6 prose-table:border-collapse
                prose-th:border prose-th:border-gray-300 prose-th:dark:border-gray-600 prose-th:px-4 prose-th:py-3 prose-th:bg-gray-100 prose-th:dark:bg-gray-700 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 prose-th:dark:text-white
                prose-td:border prose-td:border-gray-300 prose-td:dark:border-gray-600 prose-td:px-4 prose-td:py-3 prose-td:text-gray-700 prose-td:dark:text-gray-300
                prose-code:text-sm prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
                prose-pre:bg-gray-900 prose-pre:dark:bg-gray-950 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                prose-hr:my-8 prose-hr:border-gray-300 prose-hr:dark:border-gray-600
                prose-a:text-primary-600 prose-a:dark:text-primary-400 prose-a:no-underline prose-a:hover:underline
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-4"
            >
              {previewContent}
            </ReactMarkdown>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ToolkitPage;
