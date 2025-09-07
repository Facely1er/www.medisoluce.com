import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  Download,
  RefreshCw,
  Activity,
  Zap
} from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { securityManager } from '../../utils/securityUtils';

interface SecurityStatusIndicatorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showInProduction?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const SecurityStatusIndicator: React.FC<SecurityStatusIndicatorProps> = ({
  position = 'top-left',
  showInProduction = true,
  autoRefresh = true,
  refreshInterval = 300000 // 5 minutes
}) => {
  const [securityData, setSecurityData] = useState<{
    status: string;
    score: number;
    vulnerabilities: Array<{ id: string; severity: string; description: string }>;
    threats: Array<{ id: string; type: string; severity: string }>;
    compliance: Record<string, boolean>;
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [, setThreatHistory] = useState<Array<{ id: string; type: string; severity: string; timestamp: Date }>>([]);
  
  const shouldShow = !import.meta.env.PROD || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    performSecurityCheck();

    if (autoRefresh) {
      const interval = setInterval(performSecurityCheck, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [shouldShow, autoRefresh, refreshInterval]);

  const performSecurityCheck = async () => {
    setIsLoading(true);
    try {
      const securityReport = securityManager.generateSecurityReport();
      const securityMetrics = securityManager.getSecurityMetrics();
      const vulnerabilities = await securityManager.scanForVulnerabilities();
      const advancedReport = securityManager.generateAdvancedSecurityReport();
      const threatScan = await securityManager.performAdvancedSecurityScan();
      
      setSecurityData({
        ...securityReport,
        metrics: securityMetrics,
        vulnerabilities,
        advanced: advancedReport,
        threatScan
      });
      setThreatHistory(securityManager.getThreatHistory());
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Security check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionClasses = () => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4', 
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };
    return positions[position];
  };

  const getSecurityStatusIcon = (score: number) => {
    if (score >= 90) return <Shield className="h-5 w-5 text-success-500" />;
    if (score >= 75) return <CheckCircle className="h-5 w-5 text-primary-500" />;
    if (score >= 50) return <AlertTriangle className="h-5 w-5 text-warning-500" />;
    return <XCircle className="h-5 w-5 text-accent-500" />;
  };

  const getSecurityStatusColor = (score: number) => {
    if (score >= 90) return 'border-success-200 bg-success-50 dark:bg-success-900/20';
    if (score >= 75) return 'border-primary-200 bg-primary-50 dark:bg-primary-900/20';
    if (score >= 50) return 'border-warning-200 bg-warning-50 dark:bg-warning-900/20';
    return 'border-accent-200 bg-accent-50 dark:bg-accent-900/20';
  };

  const exportSecurityReport = () => {
    const report = securityManager.generateAdvancedSecurityReport();
    const content = `
MEDISOLUCE ADVANCED SECURITY REPORT
Generated: ${new Date().toLocaleString()}

SECURITY OVERVIEW:
Overall Score: ${report.metrics.overallScore}%
Threat Level: ${report.metrics.threatLevel.toUpperCase()}
Active Threats: ${report.threats.active.length}
Mitigated Threats: ${report.threats.mitigated.length}

THREAT BREAKDOWN BY TYPE:
${Object.entries(report.threatsByType).map(([type, count]) => 
  `- ${type.replace('_', ' ').toUpperCase()}: ${count}`
).join('\n') || 'No threats detected'}

THREAT BREAKDOWN BY SEVERITY:
${Object.entries(report.threatsBySeverity).map(([severity, count]) => 
  `- ${severity.toUpperCase()}: ${count}`
).join('\n') || 'No threats detected'}

ACTIVE PROTECTIONS:
${report.protections.map(protection => `- ${protection}`).join('\n')}

COMPLIANCE STATUS:
- HIPAA Compliance: ${report.complianceStatus.hipaa ? 'COMPLIANT' : 'NON-COMPLIANT'}
- Data Encryption: ${report.complianceStatus.encryption}% coverage
- Audit Trail: ${report.complianceStatus.auditTrail ? 'ACTIVE' : 'INACTIVE'}
- Data Protection: ${report.complianceStatus.dataProtection.coverage}% encrypted

CRITICAL THREATS:
${report.threats.active.filter((t: { severity: string }) => t.severity === 'critical').map((threat: { description: string; source: string }) => 
  `- ${threat.description} (${threat.source})`
).join('\n') || 'None'}

RECOMMENDATIONS:
${report.recommendations.map((rec: string) => `- ${rec}`).join('\n')}

Generated by MediSoluce Advanced Security System
`;
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medisoluce-security-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!shouldShow || !securityData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`fixed ${getPositionClasses()} z-40 w-72`}
    >
      <Card className={`border-2 ${getSecurityStatusColor(securityData.metrics?.securityScore || 0)}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                Security Status
              </span>
              {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {getSecurityStatusIcon(securityData.advanced?.metrics?.overallScore || 85)}
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {securityData.advanced?.metrics?.threatLevel || 'Good'}
              </span>
            </div>
            <div className="text-2xl font-bold text-primary-500">
              {securityData.advanced?.metrics?.overallScore || 85}%
            </div>
          </div>

          {/* Enhanced Security Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Security Score:</span>
              <span className={securityData.advanced?.metrics?.overallScore >= 80 ? 'text-success-500' : 'text-warning-500'}>
                {securityData.advanced?.metrics?.overallScore || 85}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">HTTPS:</span>
              <span className={securityData.https ? 'text-success-500' : 'text-accent-500'}>
                {securityData.https ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">CSP:</span>
              <span className={securityData.csp?.enabled ? 'text-success-500' : 'text-warning-500'}>
                {securityData.csp?.enabled ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">PHI Protection:</span>
              <span className={securityData.advanced?.metrics?.phiProtectionLevel >= 80 ? 'text-success-500' : 'text-warning-500'}>
                {securityData.advanced?.metrics?.phiProtectionLevel || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Active Threats:</span>
              <span className={securityData.advanced?.threats?.active?.length === 0 ? 'text-success-500' : 'text-accent-500'}>
                {securityData.advanced?.threats?.active?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Vulnerabilities:</span>
              <span className={securityData.vulnerabilities?.length === 0 ? 'text-success-500' : 'text-warning-500'}>
                {securityData.vulnerabilities?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Encryption:</span>
              <span className={securityData.metrics?.encryptionCoverage >= 80 ? 'text-success-500' : 'text-warning-500'}>
                {securityData.metrics?.encryptionCoverage || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">HIPAA Status:</span>
              <span className={securityData.advanced?.complianceStatus?.hipaa ? 'text-success-500' : 'text-accent-500'}>
                {securityData.advanced?.complianceStatus?.hipaa ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Protections:</span>
              <span className="text-primary-500">
                {securityData.advanced?.protections?.length || 0}
              </span>
            </div>
          </div>

          {/* Threat Alerts */}
          {securityData.advanced?.threats?.active?.length > 0 && (
            <div className="mt-3 p-2 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded">
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4 text-accent-500" />
                <span className="text-xs font-medium text-accent-700 dark:text-accent-300">
                  {securityData.advanced.threats.active.length} active threat{securityData.advanced.threats.active.length !== 1 ? 's' : ''} detected
                </span>
              </div>
            </div>
          )}

          {lastUpdate && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last check: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Active Threats */}
              {securityData.advanced?.threats?.active && securityData.advanced.threats.active.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-accent-500" />
                    Active Threats ({securityData.advanced.threats.active.length})
                  </h4>
                  <div className="space-y-2">
                    {securityData.advanced.threats.active.slice(0, 3).map((threat: { id: string; type: string; severity: string; description: string }, index: number) => (
                      <div key={index} className={`text-xs p-2 rounded border ${
                        threat.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                        threat.severity === 'high' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
                        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {threat.type.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            threat.severity === 'critical' ? 'bg-red-200 text-red-800' :
                            threat.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {threat.severity}
                          </span>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 mb-1">
                          {threat.description}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Source: {threat.source}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {new Date(threat.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                    {securityData.advanced.threats.active.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        +{securityData.advanced.threats.active.length - 3} more threats
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mitigated Threats */}
              {securityData.advanced?.threats?.mitigated && securityData.advanced.threats.mitigated.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-success-500" />
                    Mitigated Threats ({securityData.advanced.threats.mitigated.length})
                  </h4>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {securityData.advanced.threats.mitigated.slice(0, 3).map((threat: { id: string; type: string; severity: string; description: string }, index: number) => (
                      <div key={index} className="text-xs p-2 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-success-800 dark:text-success-200">
                            {threat.type.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <CheckCircle className="h-3 w-3 text-success-500" />
                        </div>
                        <div className="text-success-700 dark:text-success-300">
                          {threat.mitigation || 'Automatically resolved'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Protections */}
              {securityData.advanced?.protections && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-primary-500" />
                    Active Protections ({securityData.advanced.protections.length})
                  </h4>
                  <div className="space-y-1">
                    {securityData.advanced.protections.map((protection: string, index: number) => (
                      <div key={index} className="text-xs flex items-center">
                        <CheckCircle className="h-3 w-3 text-success-500 mr-1" />
                        <span className="text-gray-700 dark:text-gray-300">{protection}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Metrics */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Activity className="h-4 w-4 mr-1 text-primary-500" />
                  Security Metrics
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Threat Level:</span>
                    <span className={`capitalize font-medium ${
                      securityData.advanced?.metrics?.threatLevel === 'critical' ? 'text-red-500' :
                      securityData.advanced?.metrics?.threatLevel === 'high' ? 'text-orange-500' :
                      securityData.advanced?.metrics?.threatLevel === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {securityData.advanced?.metrics?.threatLevel || 'Low'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Encryption Coverage:</span>
                    <span className={securityData.advanced?.complianceStatus?.dataProtection?.coverage >= 80 ? 'text-success-500' : 'text-warning-500'}>
                      {securityData.advanced?.complianceStatus?.dataProtection?.coverage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>HIPAA Compliance:</span>
                    <span className={securityData.advanced?.complianceStatus?.hipaa ? 'text-success-500' : 'text-accent-500'}>
                      {securityData.advanced?.complianceStatus?.hipaa ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit Trail:</span>
                    <span className={securityData.advanced?.complianceStatus?.auditTrail ? 'text-success-500' : 'text-warning-500'}>
                      {securityData.advanced?.complianceStatus?.auditTrail ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advanced Recommendations */}
              {securityData.advanced?.recommendations && securityData.advanced.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Security Recommendations
                  </h4>
                  <div className="space-y-1">
                    {securityData.advanced.recommendations.slice(0, 3).map((rec: string, index: number) => (
                      <div key={index} className="text-xs text-primary-600 dark:text-primary-400 flex items-start">
                        <span className="mr-1">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Threat Statistics */}
              {securityData.threatScan && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1 text-primary-500" />
                    Threat Analysis
                  </h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Threat Level:</span>
                      <span className={`font-medium capitalize ${
                        securityData.threatScan.threatLevel === 'critical' ? 'text-red-500' :
                        securityData.threatScan.threatLevel === 'high' ? 'text-orange-500' :
                        securityData.threatScan.threatLevel === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {securityData.threatScan.threatLevel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-Mitigated:</span>
                      <span className="text-success-500">
                        {securityData.threatScan.mitigatedThreats}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Scanned:</span>
                      <span className="text-primary-500">
                        {securityData.threatScan.threats.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={performSecurityCheck}
                  disabled={isLoading}
                  icon={<RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />}
                >
                  Refresh
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const scan = await securityManager.performAdvancedSecurityScan();
                    setSecurityData(prev => ({ ...prev, threatScan: scan }));
                  }}
                  icon={<Zap className="h-3 w-3" />}
                >
                  Scan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportSecurityReport}
                  icon={<Download className="h-3 w-3" />}
                >
                  Export
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default SecurityStatusIndicator;