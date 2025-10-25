import React, { useState } from 'react';
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
  FileCheck
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RelatedLinks from '../components/ui/RelatedLinks';
import { relatedPages } from '../utils/linkingStrategy';
import useLocalStorage from '../hooks/useLocalStorage';

interface Dependency {
  id: string;
  name: string;
  category: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  dependencies: string[];
  riskLevel: 'High' | 'Medium' | 'Low';
  backupProcedures: string;
  downtime: string;
}

interface FormData {
  name: string;
  category: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  dependencies: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  backupProcedures: string;
  downtime: string;
}

const DependencyManagerPage: React.FC = () => {
  const { t } = useTranslation();
  const [showMapper, setShowMapper] = useState(false);
  const [dependencies, setDependencies] = useLocalStorage<Dependency[]>('system-dependencies', []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    criticality: 'Medium',
    dependencies: '',
    riskLevel: 'Medium',
    backupProcedures: '',
    downtime: ''
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
      downtime: formData.downtime
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
      downtime: ''
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
      downtime: dependency.downtime
    });
    setIsEditing(true);
    setEditingId(dependency.id);
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

  if (showMapper) {
    return (
      <div className="py-12">
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
              <Button variant="outline" onClick={() => setShowMapper(false)}>
                Back to Overview
              </Button>
            </div>

            {/* Add/Edit Form */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-medium mb-6">{isEditing ? 'Edit' : 'Add'} System Dependency</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      System Name
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
                      Category
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
                      Criticality Level
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
                      Risk Level
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
                      Maximum Downtime Tolerance
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
                      Dependencies (comma-separated)
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
                    Backup Procedures
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

            {/* Dependencies List */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">System Dependencies ({dependencies.length})</h2>
              </div>

              {dependencies.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No dependencies mapped yet. Add your first system dependency above.
                </div>
              ) : (
                <div className="space-y-4">
                  {dependencies.map((dep) => (
                    <div key={dep.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {dep.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCriticalityColor(dep.criticality)}`}>
                            {dep.criticality}
                          </span>
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                    </div>
                  ))}
                </div>
              )}
            </Card>
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
                  <a 
                    href="https://toolkit.medisoluce.com/ransomware" 
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium ml-1"
                    data-analytics="dependency-security-link"
                    aria-label="Learn about ransomware protection for your critical healthcare systems"
                  >
                    Explore our ransomware protection strategies
                  </a>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Looking for implementation templates? 
                  <a
                    href="https://toolkit.medisoluce.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium ml-1"
                    data-analytics="dependency-resources-link"
                    aria-label="Download dependency mapping templates and security implementation guides"
                  >
                    Access our resource toolkit
                  </a>
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