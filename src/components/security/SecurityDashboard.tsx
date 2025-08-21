 import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  Zap,
  Eye,
  Lock,
  Bug,
  Target,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { securityManager } from '../../utils/securityUtils';
import { advancedSecurityScanner } from '../../utils/advancedSecurityScanner';

const SecurityDashboard: React.FC = () => {
  const [securityData, setSecurityData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [threatHistory, setThreatHistory] = useState<any[]>([]);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  useEffect(() => {
    performSecurityScan();
    
    if (isMonitoring) {
      const interval = setInterval(performSecurityScan, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const performSecurityScan = async () => {
    setIsScanning(true);
    try {
      const [advancedScan, securityReport, threatScan] = await Promise.all([
        advancedSecurityScanner.performSecurityScan(),
        securityManager.generateAdvancedSecurityReport(),
        securityManager.performAdvancedSecurityScan()
      ]);

      setSecurityData({
        advancedScan,
        securityReport,
        threatScan
      });
      setThreatHistory(securityManager.getThreatHistory());
      setLastScan(new Date());
    } catch (error) {
      console.error('Security scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const exportSecurityReport = () => {
    const scanReport = advancedSecurityScanner.exportScanReport();
    const blob = new Blob([scanReport], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medisoluce-security-dashboard-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 75) return 'text-primary-500';
    if (score >= 50) return 'text-warning-500';
    return 'text-accent-500';
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };

  if (!securityData) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Loading Security Dashboard...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                  Advanced Security Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive security monitoring and threat detection
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  icon={isMonitoring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                >
                  {isMonitoring ? 'Pause' : 'Monitor'}
                </Button>
                <Button
                  variant="outline"
                  onClick={performSecurityScan}
                  disabled={isScanning}
                  icon={<RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />}
                >
                  Refresh
                </Button>
                <Button
                  onClick={exportSecurityReport}
                  icon={<Download className="h-4 w-4" />}
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* Overall Security Status */}
            <div className="mt-6">
              <Card className={`p-6 text-center ${getThreatLevelColor(securityData.threatScan?.threatLevel || 'low')}`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    securityData.securityReport?.metrics?.overallScore >= 90 ? 'bg-success-500' :
                    securityData.securityReport?.metrics?.overallScore >= 75 ? 'bg-primary-500' :
                    securityData.securityReport?.metrics?.overallScore >= 50 ? 'bg-warning-500' : 'bg-accent-500'
                  }`}>
                    <span className="text-2xl font-bold text-white">
                      {securityData.securityReport?.metrics?.overallScore || 0}%
                    </span>
                  </div>
                </div>
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Security Status: {securityData.threatScan?.threatLevel?.charAt(0).toUpperCase() + securityData.threatScan?.threatLevel?.slice(1) || 'Good'}
                  </h2>
                  <p className={`text-lg font-medium ${
                    securityData.securityReport?.metrics?.overallScore >= 85 ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'
                  }`}>
                    {securityData.securityReport?.metrics?.overallScore >= 85 ? '🛡️ Security Excellent' : '⚠️ Security Needs Attention'}
                  </p>
                </>
              </Card>
            </div>
          </div>

          {/* Security Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Vulnerability Score
                  </h3>
                  <p className={`text-2xl font-bold ${getScoreColor(securityData.securityReport?.metrics?.vulnerabilityScore || 0)}`}>
                    {securityData.securityReport?.metrics?.vulnerabilityScore || 0}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-primary-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Threat Detection
                  </h3>
                  <p className={`text-2xl font-bold ${getScoreColor(securityData.securityReport?.metrics?.threatDetectionScore || 0)}`}>
                    {securityData.securityReport?.metrics?.threatDetectionScore || 0}%
                  </p>
                </div>
                <Eye className="h-8 w-8 text-primary-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Access Control
                  </h3>
                  <p className={`text-2xl font-bold ${getScoreColor(securityData.securityReport?.metrics?.accessControlScore || 0)}`}>
                    {securityData.securityReport?.metrics?.accessControlScore || 0}%
                  </p>
                </div>
                <Lock className="h-8 w-8 text-primary-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Data Protection
                  </h3>
                  <p className={`text-2xl font-bold ${getScoreColor(securityData.securityReport?.metrics?.dataProtectionScore || 0)}`}>
                    {securityData.securityReport?.metrics?.dataProtectionScore || 0}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-primary-500" />
              </div>
            </Card>
          </div>

          {/* Recent Threats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Threats Detected
              </h3>
              <div className="space-y-4">
                {threatHistory.slice(0, 5).map((threat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getThreatLevelColor(threat.severity)}`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {threat.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {threat.description}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getThreatLevelColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Security Recommendations
              </h3>
              <div className="space-y-3">
                {securityData.securityReport?.recommendations?.slice(0, 5).map((rec: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full mt-1 ${
                      rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20' :
                      rec.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      'bg-green-100 dark:bg-green-900/20'
                    }`}>
                      <Target className={`h-3 w-3 ${
                        rec.priority === 'high' ? 'text-red-500' :
                        rec.priority === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rec.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Last Scan Info */}
          {lastScan && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Last security scan: {lastScan.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;