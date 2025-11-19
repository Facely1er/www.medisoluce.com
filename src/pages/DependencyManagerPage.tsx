import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Server, 
  Monitor, 
  HardDrive, 
  Laptop, 
  Smartphone, 
  ArrowRight, 
  Edit,
  Trash2,
  BarChart2,
  FileCheck,
  Upload,
  Network,
  List,
  HelpCircle,
  Search,
  Filter,
  X,
  AlertTriangle,
  TrendingUp,
  Building2,
  Shield,
  CheckSquare,
  Square
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RelatedLinks from '../components/ui/RelatedLinks';
import { relatedPages } from '../utils/linkingStrategy';
import useLocalStorage from '../hooks/useLocalStorage';
import OnboardingGuide from '../components/dependency/OnboardingGuide';
import DependencyGraph from '../components/dependency/DependencyGraph';
import DependencyHelpTooltip from '../components/dependency/DependencyHelpTooltip';
import ExportManager from '../components/export/ExportManager';

interface Dependency {
  id: string;
  name: string;
  category: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  dependencies: string[];
  riskLevel: 'High' | 'Medium' | 'Low';
  backupProcedures: string;
  downtime: string;
  vendor?: string;
  vendorContact?: string;
  complianceStatus?: 'Compliant' | 'Non-Compliant' | 'Under Review' | 'Not Assessed';
  lastAssessed?: string;
  notes?: string;
}

const DependencyManagerPage: React.FC = () => {
  const { t } = useTranslation();
  const [showMapper, setShowMapper] = useState(false);
  const [dependencies, setDependencies] = useLocalStorage<Dependency[]>('system-dependencies', []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');
  const [selectedDependencyId, setSelectedDependencyId] = useState<string | undefined>();
  const [showOnboarding, setShowOnboarding] = useLocalStorage<boolean>('show-dependency-onboarding', true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCriticality, setFilterCriticality] = useState<string>('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');
  const [selectedDependencies, setSelectedDependencies] = useState<Set<string>>(new Set());
  const [showValidation, setShowValidation] = useState(true);
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    criticality: 'Critical' | 'High' | 'Medium' | 'Low';
    dependencies: string;
    riskLevel: 'High' | 'Medium' | 'Low';
    backupProcedures: string;
    downtime: string;
    vendor: string;
    vendorContact: string;
    complianceStatus: 'Compliant' | 'Non-Compliant' | 'Under Review' | 'Not Assessed';
    notes: string;
  }>({
    name: '',
    category: '',
    criticality: 'Medium',
    dependencies: '',
    riskLevel: 'Medium',
    backupProcedures: '',
    downtime: '',
    vendor: '',
    vendorContact: '',
    complianceStatus: 'Not Assessed',
    notes: ''
  });

  const systemCategories = [
    {
      name: t('dependency.system_categories.ehr'),
      icon: <Database className="h-7 w-7 text-primary-500" />,
      examples: t('dependency.system_categories.examples.ehr').split(', '),
      value: 'ehr'
    },
    {
      name: t('dependency.system_categories.clinical'),
      icon: <Monitor className="h-7 w-7 text-primary-500" />,
      examples: t('dependency.system_categories.examples.clinical').split(', '),
      value: 'clinical'
    },
    {
      name: t('dependency.system_categories.infrastructure'),
      icon: <Server className="h-7 w-7 text-primary-500" />,
      examples: t('dependency.system_categories.examples.infrastructure').split(', '),
      value: 'infrastructure'
    },
    {
      name: t('dependency.system_categories.medical_devices'),
      icon: <HardDrive className="h-7 w-7 text-primary-500" />,
      examples: t('dependency.system_categories.examples.medical_devices').split(', '),
      value: 'medical_devices'
    },
    {
      name: t('dependency.system_categories.client_devices'),
      icon: <Laptop className="h-7 w-7 text-primary-500" />,
      examples: t('dependency.system_categories.examples.client_devices').split(', '),
      value: 'client_devices'
    },
    {
      name: t('dependency.system_categories.mobile'),
      icon: <Smartphone className="h-7 w-7 text-primary-500" />,
      examples: t('dependency.system_categories.examples.mobile').split(', '),
      value: 'mobile'
    },
  ];

  // Dependency validation
  const validateDependencies = useMemo(() => {
    const issues: Array<{ type: 'circular' | 'missing' | 'warning'; message: string; dependencyId: string }> = [];
    
    dependencies.forEach(dep => {
      // Check for circular dependencies
      const checkCircular = (currentId: string, visited: Set<string>, path: string[]): boolean => {
        if (visited.has(currentId)) {
          if (path.includes(currentId)) {
            return true; // Circular dependency found
          }
          return false;
        }
        visited.add(currentId);
        path.push(currentId);
        
        const currentDep = dependencies.find(d => d.id === currentId);
        if (currentDep) {
          currentDep.dependencies.forEach(depName => {
            const targetDep = dependencies.find(d => d.name === depName);
            if (targetDep && checkCircular(targetDep.id, visited, [...path])) {
              issues.push({
                type: 'circular',
                message: `Circular dependency detected: ${path.join(' → ')} → ${targetDep.name}`,
                dependencyId: currentId
              });
            }
          });
        }
        return false;
      };
      
      checkCircular(dep.id, new Set(), []);
      
      // Check for missing dependencies
      dep.dependencies.forEach(depName => {
        const targetDep = dependencies.find(d => d.name === depName);
        if (!targetDep) {
          issues.push({
            type: 'missing',
            message: `Missing dependency: "${depName}" is not mapped as a system`,
            dependencyId: dep.id
          });
        }
      });
      
      // Warnings
      if (dep.criticality === 'Critical' && dep.riskLevel === 'High') {
        issues.push({
          type: 'warning',
          message: 'Critical system with high risk level requires immediate attention',
          dependencyId: dep.id
        });
      }
      
      if (dep.criticality === 'Critical' && !dep.backupProcedures) {
        issues.push({
          type: 'warning',
          message: 'Critical system missing backup procedures',
          dependencyId: dep.id
        });
      }
    });
    
    return issues;
  }, [dependencies]);

  // Filtered dependencies based on search and filters
  const filteredDependencies = useMemo(() => {
    return dependencies.filter(dep => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          dep.name.toLowerCase().includes(query) ||
          dep.category.toLowerCase().includes(query) ||
          dep.dependencies.some(d => d.toLowerCase().includes(query)) ||
          dep.backupProcedures.toLowerCase().includes(query) ||
          (dep.vendor && dep.vendor.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (filterCategory !== 'all' && dep.category !== filterCategory) return false;
      
      // Criticality filter
      if (filterCriticality !== 'all' && dep.criticality !== filterCriticality) return false;
      
      // Risk level filter
      if (filterRiskLevel !== 'all' && dep.riskLevel !== filterRiskLevel) return false;
      
      return true;
    });
  }, [dependencies, searchQuery, filterCategory, filterCriticality, filterRiskLevel]);

  // Risk analysis statistics
  const riskStats = useMemo(() => {
    const total = dependencies.length;
    const critical = dependencies.filter(d => d.criticality === 'Critical').length;
    const highRisk = dependencies.filter(d => d.riskLevel === 'High').length;
    const criticalHighRisk = dependencies.filter(d => d.criticality === 'Critical' && d.riskLevel === 'High').length;
    const missingBackups = dependencies.filter(d => d.criticality === 'Critical' && !d.backupProcedures).length;
    const nonCompliant = dependencies.filter(d => d.complianceStatus === 'Non-Compliant').length;
    const validationIssues = validateDependencies.length;
    
    return {
      total,
      critical,
      highRisk,
      criticalHighRisk,
      missingBackups,
      nonCompliant,
      validationIssues,
      complianceRate: total > 0 ? ((total - nonCompliant) / total * 100).toFixed(1) : '0'
    };
  }, [dependencies, validateDependencies]);

  // System templates for common healthcare systems
  const systemTemplates = [
    {
      name: 'Epic EHR',
      category: 'ehr',
      criticality: 'Critical' as const,
      riskLevel: 'Medium' as const,
      dependencies: 'Network, Database Server, Power Supply',
      downtime: '15 minutes',
      backupProcedures: 'Daily incremental backups, weekly full backups. RTO: 15 minutes, RPO: 1 hour.',
      vendor: 'Epic Systems',
      complianceStatus: 'Compliant' as const
    },
    {
      name: 'PACS Server',
      category: 'clinical',
      criticality: 'Critical' as const,
      riskLevel: 'Medium' as const,
      dependencies: 'Network, Storage Array, DICOM Gateway',
      downtime: '30 minutes',
      backupProcedures: 'Real-time replication to secondary site. RTO: 30 minutes, RPO: 0 (real-time).',
      vendor: 'Vendor Name',
      complianceStatus: 'Compliant' as const
    },
    {
      name: 'Network Infrastructure',
      category: 'infrastructure',
      criticality: 'Critical' as const,
      riskLevel: 'Low' as const,
      dependencies: 'Power Supply, Internet Service Provider',
      downtime: '0 minutes',
      backupProcedures: 'Redundant network paths, UPS backup power. RTO: 0 minutes.',
      vendor: 'Network Vendor',
      complianceStatus: 'Compliant' as const
    },
    {
      name: 'Pharmacy Management System',
      category: 'clinical',
      criticality: 'High' as const,
      riskLevel: 'Medium' as const,
      dependencies: 'EHR System, Network, Database Server',
      downtime: '1 hour',
      backupProcedures: 'Daily backups with 4-hour RPO. RTO: 1 hour.',
      vendor: 'Pharmacy Vendor',
      complianceStatus: 'Compliant' as const
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDependency: Dependency = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      criticality: formData.criticality,
      dependencies: formData.dependencies.split(',').map(d => d.trim()).filter(d => d),
      riskLevel: formData.riskLevel,
      backupProcedures: formData.backupProcedures,
      downtime: formData.downtime,
      vendor: formData.vendor || undefined,
      vendorContact: formData.vendorContact || undefined,
      complianceStatus: formData.complianceStatus,
      lastAssessed: formData.complianceStatus !== 'Not Assessed' ? new Date().toISOString().split('T')[0] : undefined,
      notes: formData.notes || undefined
    };

    if (editingId) {
      setDependencies(deps => deps.map(dep => dep.id === editingId ? newDependency : dep));
    } else {
      setDependencies(deps => [...deps, newDependency]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      criticality: 'Medium',
      dependencies: '',
      riskLevel: 'Medium',
      backupProcedures: '',
      downtime: '',
      vendor: '',
      vendorContact: '',
      complianceStatus: 'Not Assessed',
      notes: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (dependency: Dependency) => {
    setFormData({
      name: dependency.name,
      category: dependency.category,
      criticality: dependency.criticality,
      dependencies: dependency.dependencies.join(', '),
      riskLevel: dependency.riskLevel,
      backupProcedures: dependency.backupProcedures,
      downtime: dependency.downtime,
      vendor: dependency.vendor || '',
      vendorContact: dependency.vendorContact || '',
      complianceStatus: dependency.complianceStatus || 'Not Assessed',
      notes: dependency.notes || ''
    });
    setIsEditing(true);
    setEditingId(dependency.id);
  };

  const handleUseTemplate = (template: typeof systemTemplates[0]) => {
    setFormData({
      name: template.name,
      category: template.category,
      criticality: template.criticality,
      dependencies: template.dependencies,
      riskLevel: template.riskLevel,
      backupProcedures: template.backupProcedures,
      downtime: template.downtime,
      vendor: template.vendor || '',
      vendorContact: '',
      complianceStatus: template.complianceStatus,
      notes: ''
    });
  };

  const handleBulkDelete = () => {
    if (selectedDependencies.size > 0 && window.confirm(`Delete ${selectedDependencies.size} selected dependencies?`)) {
      setDependencies(deps => deps.filter(dep => !selectedDependencies.has(dep.id)));
      setSelectedDependencies(new Set());
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedDependencies(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedDependencies.size === filteredDependencies.length) {
      setSelectedDependencies(new Set());
    } else {
      setSelectedDependencies(new Set(filteredDependencies.map(d => d.id)));
    }
  };

  const handleDelete = (id: string) => {
    setDependencies(deps => deps.filter(dep => dep.id !== id));
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const handleExport = () => {
    const data = dependencies.map(dep => ({
      name: dep.name,
      category: dep.category,
      criticality: dep.criticality,
      dependencies: dep.dependencies.join(', '),
      riskLevel: dep.riskLevel,
      downtime: dep.downtime,
      backupProcedures: dep.backupProcedures,
      vendor: dep.vendor || '',
      vendorContact: dep.vendorContact || '',
      complianceStatus: dep.complianceStatus || 'Not Assessed',
      lastAssessed: dep.lastAssessed || '',
      notes: dep.notes || ''
    }));
    return data;
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);
        
        if (Array.isArray(imported)) {
          const formatted = imported.map((item, index) => ({
            id: Date.now().toString() + index,
            name: item.name || '',
            category: item.category || '',
            criticality: item.criticality || 'Medium',
            dependencies: typeof item.dependencies === 'string' 
              ? item.dependencies.split(',').map((d: string) => d.trim()).filter((d: string) => d)
              : item.dependencies || [],
            riskLevel: item.riskLevel || 'Medium',
            backupProcedures: item.backupProcedures || '',
            downtime: item.downtime || '',
            vendor: item.vendor || '',
            vendorContact: item.vendorContact || '',
            complianceStatus: item.complianceStatus || 'Not Assessed',
            lastAssessed: item.lastAssessed || '',
            notes: item.notes || ''
          }));
          setDependencies(prev => [...prev, ...formatted]);
        }
      } catch (error) {
        console.error('Error importing dependencies:', error);
        alert('Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleBusinessImpactIntegration = () => {
    // Store selected dependencies for Business Impact Analysis
    const criticalDependencies = dependencies.filter(d => 
      d.criticality === 'Critical' || d.criticality === 'High'
    );
    localStorage.setItem('business-impact-dependencies', JSON.stringify(criticalDependencies));
    window.location.href = '/business-impact';
  };

  if (showMapper) {
    return (
      <div className="py-12">
        {showOnboarding && (
          <OnboardingGuide 
            onComplete={() => setShowOnboarding(false)}
            onSkip={() => setShowOnboarding(false)}
            forceShow={showOnboarding}
          />
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  Technology Dependency Mapper
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Map and manage your critical healthcare technology dependencies
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowOnboarding(true)}
                  icon={<HelpCircle className="h-4 w-4" />}
                >
                  Help
                </Button>
                <Button variant="outline" onClick={() => setShowMapper(false)}>
                  Back to Overview
                </Button>
              </div>
            </div>

            {/* Risk Analysis Dashboard */}
            {dependencies.length > 0 && (
              <Card className="p-6 mb-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                    Risk Analysis Dashboard
                  </h3>
                  {validateDependencies.length > 0 && (
                    <button
                      onClick={() => setShowValidation(!showValidation)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {showValidation ? 'Hide' : 'Show'} Validation Issues ({validateDependencies.length})
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{riskStats.total}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Systems</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{riskStats.critical}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{riskStats.highRisk}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">High Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-700">{riskStats.criticalHighRisk}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Critical + High Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{riskStats.missingBackups}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Missing Backups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{riskStats.complianceRate}%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Compliance Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600">{riskStats.validationIssues}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Issues Found</div>
                  </div>
                </div>
                {showValidation && validateDependencies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      {validateDependencies.slice(0, 5).map((issue, idx) => (
                        <div key={idx} className={`flex items-start space-x-2 text-sm p-2 rounded ${
                          issue.type === 'circular' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
                          issue.type === 'missing' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' :
                          'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                        }`}>
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{issue.message}</span>
                        </div>
                      ))}
                      {validateDependencies.length > 5 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                          + {validateDependencies.length - 5} more issues
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Search and Filter Bar */}
            <Card className="p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search dependencies by name, category, vendor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Categories</option>
                    {systemCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.name}</option>
                    ))}
                  </select>
                  <select
                    value={filterCriticality}
                    onChange={(e) => setFilterCriticality(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Criticality</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select
                    value={filterRiskLevel}
                    onChange={(e) => setFilterRiskLevel(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Action Bar */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  icon={<List className="h-4 w-4" />}
                >
                  List View
                </Button>
                <Button
                  variant={viewMode === 'graph' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('graph')}
                  icon={<Network className="h-4 w-4" />}
                >
                  Graph View
                </Button>
                {selectedDependencies.size > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDelete}
                      icon={<Trash2 className="h-4 w-4" />}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete ({selectedDependencies.size})
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Upload className="h-4 w-4" />}
                  >
                    Import
                  </Button>
                </label>
                {dependencies.length > 0 && (
                  <ExportManager
                    data={handleExport()}
                    filename="dependency-map"
                    title="Dependency Map"
                  />
                )}
                {dependencies.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBusinessImpactIntegration}
                    icon={<BarChart2 className="h-4 w-4" />}
                  >
                    Analyze Impact
                  </Button>
                )}
              </div>
            </div>

            {/* System Templates */}
            {!isEditing && (
              <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Quick Start Templates</h3>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Click to use as starting point</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {systemTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleUseTemplate(template)}
                      className="text-left p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-xs"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{template.name}</div>
                      <div className="text-gray-600 dark:text-gray-400 capitalize">{template.category.replace('_', ' ')}</div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Add/Edit Form */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-medium mb-6">{isEditing ? 'Edit' : 'Add'} System Dependency</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>System Name</span>
                        <DependencyHelpTooltip field="name" />
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Electronic Health Record"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>Category</span>
                        <DependencyHelpTooltip field="category" />
                      </span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {systemCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>Criticality Level</span>
                        <DependencyHelpTooltip field="criticality" />
                      </span>
                    </label>
                    <select
                      value={formData.criticality}
                      onChange={(e) => setFormData({...formData, criticality: e.target.value as 'Critical' | 'High' | 'Medium' | 'Low'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>Risk Level</span>
                        <DependencyHelpTooltip field="riskLevel" />
                      </span>
                    </label>
                    <select
                      value={formData.riskLevel}
                      onChange={(e) => setFormData({...formData, riskLevel: e.target.value as 'High' | 'Medium' | 'Low'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>Maximum Downtime Tolerance</span>
                        <DependencyHelpTooltip field="downtime" />
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.downtime}
                      onChange={(e) => setFormData({...formData, downtime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 15 minutes, 2 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>Dependencies (comma-separated)</span>
                        <DependencyHelpTooltip field="dependencies" />
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.dependencies}
                      onChange={(e) => setFormData({...formData, dependencies: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Network, Database, Power"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center space-x-2">
                      <span>Backup Procedures</span>
                      <DependencyHelpTooltip field="backupProcedures" />
                    </span>
                  </label>
                  <textarea
                    value={formData.backupProcedures}
                    onChange={(e) => setFormData({...formData, backupProcedures: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe backup and recovery procedures..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditing ? 'Update' : 'Add'} Dependency
                  </Button>
                </div>
              </form>
            </Card>

            {/* Dependencies View */}
            {viewMode === 'graph' ? (
              <DependencyGraph
                dependencies={filteredDependencies}
                selectedId={selectedDependencyId}
                onSelect={setSelectedDependencyId}
              />
            ) : (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-medium">System Dependencies</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Showing {filteredDependencies.length} of {dependencies.length} systems
                      {(searchQuery || filterCategory !== 'all' || filterCriticality !== 'all' || filterRiskLevel !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setFilterCategory('all');
                            setFilterCriticality('all');
                            setFilterRiskLevel('all');
                          }}
                          className="ml-2 text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </p>
                  </div>
                  {filteredDependencies.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAll}
                      icon={selectedDependencies.size === filteredDependencies.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    >
                      {selectedDependencies.size === filteredDependencies.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  )}
                </div>

                {filteredDependencies.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    {dependencies.length === 0 ? (
                      <>
                        <p>No dependencies mapped yet. Add your first system dependency above.</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setShowOnboarding(true)}
                          icon={<HelpCircle className="h-4 w-4" />}
                        >
                          Show Tutorial
                        </Button>
                      </>
                    ) : (
                      <p>No dependencies match your search or filter criteria.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDependencies.map((dep) => {
                      const isSelected = selectedDependencies.has(dep.id);
                      const depIssues = validateDependencies.filter(issue => issue.dependencyId === dep.id);
                      return (
                    <div key={dep.id} className={`border rounded-lg p-4 transition-colors ${
                      isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' :
                      depIssues.length > 0 ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10' :
                      'border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleToggleSelect(dep.id)}
                            className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {isSelected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                          </button>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {dep.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCriticalityColor(dep.criticality)}`}>
                            {dep.criticality}
                          </span>
                          {dep.complianceStatus && dep.complianceStatus !== 'Not Assessed' && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              dep.complianceStatus === 'Compliant' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                              dep.complianceStatus === 'Non-Compliant' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                            }`}>
                              <Shield className="h-3 w-3 inline mr-1" />
                              {dep.complianceStatus}
                            </span>
                          )}
                          {depIssues.length > 0 && (
                            <span title={`${depIssues.length} validation issue(s)`}>
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(dep)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(dep.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">
                            {dep.category.replace('_', ' ')}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Risk Level:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{dep.riskLevel}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Max Downtime:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{dep.downtime || 'Not specified'}</span>
                        </div>
                        {dep.vendor && (
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                              <Building2 className="h-3 w-3 mr-1" />
                              Vendor:
                            </span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{dep.vendor}</span>
                          </div>
                        )}
                        {dep.lastAssessed && (
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Last Assessed:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{dep.lastAssessed}</span>
                          </div>
                        )}
                      </div>
                      
                      {dep.dependencies.length > 0 && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Dependencies: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dep.dependencies.map((dependency, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                {dependency}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {dep.backupProcedures && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Backup Procedures: </span>
                          <span className="text-gray-600 dark:text-gray-400">{dep.backupProcedures}</span>
                        </div>
                      )}
                      {dep.notes && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Notes: </span>
                          <span className="text-gray-600 dark:text-gray-400">{dep.notes}</span>
                        </div>
                      )}
                      {depIssues.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">
                              Validation Issues ({depIssues.length})
                            </span>
                          </div>
                          <div className="space-y-1">
                            {depIssues.map((issue, idx) => (
                              <div key={idx} className="text-xs text-yellow-700 dark:text-yellow-300">
                                • {issue.message}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    );
                    })}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('dependency.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('dependency.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => setShowMapper(true)}>
                {t('dependency.get_started')}
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/demo'}>
                {t('dependency.watch_demo')}
              </Button>
            </div>

            {/* Stats */}
            {dependencies.length > 0 && (
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-primary-600">{dependencies.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Systems Mapped</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-accent-600">
                    {dependencies.filter(d => d.criticality === 'Critical').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Critical Systems</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-warning-600">
                    {dependencies.filter(d => d.riskLevel === 'High').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">High Risk</div>
                </Card>
              </div>
            )}
            
            {/* Strategic Next Steps */}
            <div className="mt-12">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-6">
                Recommended Next Steps
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link 
                  to="/business-impact"
                  className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                  data-analytics="dependency-next-step"
                  data-destination="business-impact"
                  aria-label="Analyze how system failures would impact your healthcare operations"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <BarChart2 className="h-5 w-5 text-accent-500" />
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      Business Impact Analysis
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Evaluate the operational and financial impact of system disruptions on patient care
                  </p>
                </Link>
                
                <Link 
                  to="/continuity"
                  className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                  data-analytics="dependency-next-step"
                  data-destination="continuity"
                  aria-label="Develop comprehensive business continuity and recovery plans"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <FileCheck className="h-5 w-5 text-success-500" />
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      Continuity Planning
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Develop comprehensive recovery strategies for critical system outages
                  </p>
                </Link>
              </div>
              
              {/* Additional Context Links */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Need help securing your mapped systems?
                  <Link
                    to="/ransomware"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium ml-1"
                    data-analytics="dependency-security-link"
                    aria-label="Learn about data protection and ransomware defense for your critical healthcare systems"
                  >
                    Explore our data protection and ransomware defense strategies
                  </Link>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Looking for implementation templates?
                  <Link
                    to="/toolkit"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium ml-1"
                    data-analytics="dependency-resources-link"
                    aria-label="Download dependency mapping templates and security implementation guides"
                  >
                    Access our resource toolkit
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 dark:text-white mb-4">
              {t('dependency.map_ecosystem')}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              {t('dependency.map_subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemCategories.map((category) => (
                <Card key={category.name} hover className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                      {category.icon}
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {category.examples.slice(0, 4).map((example) => (
                      <div key={example} className="flex items-center">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">
                          {example}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    {dependencies.filter(d => d.category === category.value).length} systems mapped
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                  {t('dependency.ready_map')}
                </h2>
                <p className="text-primary-100 mb-8">
                  {t('dependency.ready_map_subtitle')}
                </p>
                <Button 
                  variant="outline" 
                  className="!bg-white !text-primary-600 !border-white hover:!bg-primary-50 hover:!text-primary-700 hover:!border-primary-50"
                  onClick={() => setShowMapper(true)}
                >
                  {t('dependency.start_free')}
                </Button>
              </div>
              
              <div className="lg:pl-8">
                <RelatedLinks 
                  links={relatedPages['/dependency-manager'] || []}
                  title="Related Tools"
                  variant="footer"
                  className="!bg-white/10 !backdrop-blur"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DependencyManagerPage;