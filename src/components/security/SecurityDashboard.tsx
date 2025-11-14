import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Eye,
  Lock,
  Target,
  RefreshCw,
  Download,
  Play,
  Pause,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { securityManager } from '../../utils/securityUtils';
import { advancedSecurityScanner } from '../../utils/advancedSecurityScanner';

interface ScanResult {
  score: number;
  status: string;
  issues: Array<{ severity: string; message: string }>;
  vulnerabilities: unknown[];
  complianceIssues: Array<{ regulation: string; status: string }>;
  recommendations: Array<{ title: string; description?: string; action?: string; priority: string }>;
}

interface SecurityReport {
  https: boolean;
  csp?: { enabled: boolean };
  headers?: Record<string, boolean>;
  cookies?: { secureCount: number; insecureCount: number };
  localStorage: boolean;
  metrics?: {
    overallScore: number;
    encryptionCoverage: number;
    securityTrend: { direction: string; confidence: number };
  };
  threats?: {
    active: Array<{ type: string; description: string; severity: string }>;
    mitigated: unknown[];
  };
}

interface ThreatScan {
  threatLevel: string;
  overallScore: number;
}

interface SecurityDashboardData {
  scanResult: ScanResult;
  securityReport: SecurityReport;
  threatScan: ThreatScan;
}

interface ThreatHistoryItem {
  timestamp: string;
  type: string;
  severity: string;
  description: string;
}

const SecurityDashboard: React.FC = () => {
  const [securityData, setSecurityData] = useState<SecurityDashboardData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [_threatHistory, _setThreatHistory] = useState<ThreatHistoryItem[]>([]);
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
      // Get data from all security utilities
      const [scanResult, securityReport, threatHistoryData] = await Promise.all([
        advancedSecurityScanner.performSecurityScan(),
        securityManager.generateAdvancedSecurityReport(),
        Promise.resolve(securityManager.getThreatHistory())
      ]);

      setSecurityData({
        scanResult: scanResult as ScanResult,
        securityReport: securityReport as SecurityReport,
        threatScan: {
          threatLevel: (securityReport as SecurityReport)?.metrics?.securityTrend?.direction || 'low',
          overallScore: (securityReport as SecurityReport)?.metrics?.overallScore || 85
        }
      });
      _setThreatHistory(threatHistoryData as ThreatHistoryItem[]);
      setLastScan(new Date());
    } catch (error) {
      console.error('Security scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const exportSecurityReport = () => {
    if (!securityData) return;
    
    const report = advancedSecurityScanner.exportScanReport();
    const blob = new Blob([report], { type: 'text/plain' });
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

  const overallScore = securityData.threatScan?.overallScore || 85;
  const threatLevel = securityData.threatScan?.threatLevel || 'low';
  const vulnerabilities = securityData.scanResult?.vulnerabilities || [];
  const complianceIssues = securityData.scanResult?.complianceIssues || [];
  const recommendations = securityData.scanResult?.recommendations || [];
  const metrics = securityData.securityReport?.metrics || {};
  const activeThreats = securityData.securityReport?.threats?.active || [];
  const mitigatedThreats = securityData.securityReport?.threats?.mitigated || [];

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
              <Card className={`p-6 text-center ${getThreatLevelColor(threatLevel)}`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    overallScore >= 90 ? 'bg-success-500' :
                    overallScore >= 75 ? 'bg-primary-500' :
                    overallScore >= 50 ? 'bg-warning-500' : 'bg-accent-500'
                  }`}>
                    <span className="text-2xl font-bold text-white">
                      {overallScore}%
                    </span>
                  </div>
                </div>
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Security Status: {threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)}
                  </h2>
                  <p className={`text-lg font-medium ${
                    overallScore >= 85 ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'
                  }`}>
                    {overallScore >= 85 ? '🛡️ Security Excellent' : '⚠️ Security Needs Attention'}
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
                    Overall Score
                  </h3>
                  <p className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-primary-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Threats Detected
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeThreats.length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-primary-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Threats Mitigated
                  </h3>
                  <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                    {mitigatedThreats.length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Vulnerabilities
                  </h3>
                  <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                    {vulnerabilities.length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-accent-500" />
              </div>
            </Card>
          </div>

          {/* Compliance Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Lock className="h-8 w-8 text-primary-500" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  complianceIssues.filter((c) => c.regulation === 'HIPAA' && c.status === 'compliant').length > 0
                    ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                    : 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
                }`}>
                  {complianceIssues.filter((c) => c.regulation === 'HIPAA').length} Issues
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                HIPAA Compliance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {complianceIssues.filter((c) => c.regulation === 'HIPAA' && c.status === 'compliant').length > 0 
                  ? 'Compliant' 
                  : 'Needs Review'}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-primary-500" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  metrics.encryptionCoverage >= 80
                    ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                    : 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
                }`}>
                  {metrics.encryptionCoverage || 75}%
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Encryption Coverage
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {metrics.encryptionCoverage || 75}% of data encrypted
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-primary-500" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  recommendations.length === 0
                    ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                    : 'bg-accent-100 text-accent-700 dark:bg-accent-900/20 dark:text-accent-400'
                }`}>
                  {recommendations.length}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Recommendations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {recommendations.length > 0 ? `${recommendations.length} actions recommended` : 'All clear'}
              </p>
            </Card>
          </div>

          {/* Recent Threats & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-accent-500" />
                Recent Threats
              </h3>
              <div className="space-y-4">
                {activeThreats.slice(0, 5).length > 0 ? (
                  activeThreats.slice(0, 5).map((threat, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getThreatLevelColor(threat.severity)}`}>
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {threat.type || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {threat.description || 'No description'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getThreatLevelColor(threat.severity)}`}>
                        {threat.severity}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success-500" />
                    <p>No active threats detected</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary-500" />
                Security Recommendations
              </h3>
              <div className="space-y-3">
                {recommendations.slice(0, 5).length > 0 ? (
                  recommendations.slice(0, 5).map((rec, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={`p-1 rounded-full mt-1 ${
                        rec.priority === 'high' || rec.priority === 'immediate' ? 'bg-red-100 dark:bg-red-900/20' :
                        rec.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        'bg-green-100 dark:bg-green-900/20'
                      }`}>
                        <Target className={`h-3 w-3 ${
                          rec.priority === 'high' || rec.priority === 'immediate' ? 'text-red-500' :
                          rec.priority === 'medium' ? 'text-yellow-500' :
                          'text-green-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {rec.title || 'Security recommendation'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {rec.description || rec.action || 'Review and implement'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 text-success-500" />
                    <p>All security measures up to date</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Security Trend */}
          {metrics.securityTrend && (
            <Card className="mt-8 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Security Trend
                  </h3>
                  <p className={`text-sm ${
                    metrics.securityTrend.direction === 'improving' ? 'text-success-600 dark:text-success-400' :
                    metrics.securityTrend.direction === 'stable' ? 'text-primary-600 dark:text-primary-400' :
                    'text-warning-600 dark:text-warning-400'
                  }`}>
                    {metrics.securityTrend.direction === 'improving' && '⬆️ Improving'}
                    {metrics.securityTrend.direction === 'stable' && '➡️ Stable'}
                    {metrics.securityTrend.direction === 'declining' && '⬇️ Needs Attention'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {overallScore}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Confidence: {metrics.securityTrend.confidence || 0}%
                  </p>
                </div>
              </div>
            </Card>
          )}

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
