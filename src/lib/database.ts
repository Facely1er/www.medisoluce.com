// Database configuration and table definitions for MediSoluce Healthcare Compliance Platform
// This file provides type-safe access to the prefixed database schema

import { supabase, secureDB } from './supabase';

// =============================================
// TABLE NAMES WITH SCHEMA PREFIX
// =============================================

export const TABLES = {
  // User management
  USER_PROFILES: 'user_profiles',
  USER_PREFERENCES: 'user_preferences',
  
  // Compliance assessments
  HIPAA_ASSESSMENTS: 'hipaa_assessments',
  ASSESSMENT_RESPONSES: 'assessment_responses',
  COMPLIANCE_FINDINGS: 'compliance_findings',
  
  // Security and audit
  SECURITY_EVENTS: 'security_events',
  SECURITY_THREATS: 'security_threats',
  
  // System health and monitoring
  HEALTH_CHECKS: 'health_checks',
  PERFORMANCE_METRICS: 'performance_metrics',
  
  // Training and education
  TRAINING_MODULES: 'training_modules',
  USER_TRAINING_PROGRESS: 'user_training_progress',
  
  // Audit and compliance tracking
  AUDIT_LOGS: 'audit_logs',
  COMPLIANCE_REPORTS: 'compliance_reports',
  
  // Migration tracking
  MIGRATIONS: 'migrations'
} as const;

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  organization?: string;
  role?: string;
  department?: string;
  industry?: string;
  phone_number?: string;
  certifications?: string[];
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
  preferences: Record<string, unknown>;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'fr' | 'es';
  timezone: string;
  report_format: 'detailed' | 'summary';
  auto_save: boolean;
  assessment_reminders: boolean;
  email_notifications: boolean;
  show_guidance_by_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface HipaaAssessment {
  id: string;
  user_id: string;
  assessment_name: string;
  assessment_type: 'initial' | 'periodic' | 'incident_response' | 'training';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  score?: number;
  max_score: number;
  completion_percentage: number;
  started_at: string;
  completed_at?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  question_id: string;
  question_text: string;
  response_value?: string;
  response_type: 'text' | 'number' | 'boolean' | 'multiple_choice' | 'rating';
  score?: number;
  max_score?: number;
  is_required: boolean;
  answered_at: string;
  created_at: string;
}

export interface ComplianceFinding {
  id: string;
  assessment_id: string;
  finding_type: 'gap' | 'violation' | 'recommendation' | 'best_practice';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation?: string;
  priority: number;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  due_date?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: 'authentication' | 'data_access' | 'suspicious_input' | 'failed_auth' | 'csp_violation' | 'privacy_violation' | 'malware_detected' | 'injection_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SecurityThreat {
  id: string;
  threat_type: 'malware' | 'phishing' | 'injection' | 'data_breach' | 'unauthorized_access' | 'privacy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'active' | 'investigating' | 'mitigated' | 'resolved';
  source?: string;
  affected_systems?: string[];
  mitigation_actions?: string[];
  created_at: string;
  resolved_at?: string;
  updated_at: string;
}

export interface HealthCheck {
  id: string;
  check_name: string;
  check_type: 'performance' | 'security' | 'compliance' | 'accessibility' | 'connectivity';
  status: 'pass' | 'warning' | 'fail' | 'unknown';
  value?: number;
  threshold?: number;
  unit?: string;
  description?: string;
  auto_implementable: boolean;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  user_id?: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  page_url?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description?: string;
  module_type: 'hipaa' | 'security' | 'compliance' | 'general';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration?: number;
  is_required: boolean;
  is_active: boolean;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserTrainingProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress_percentage: number;
  score?: number;
  started_at?: string;
  completed_at?: string;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ComplianceReport {
  id: string;
  user_id: string;
  report_type: 'hipaa_assessment' | 'security_audit' | 'training_completion' | 'system_health' | 'compliance_summary';
  report_name: string;
  report_data: Record<string, unknown>;
  file_path?: string;
  generated_at: string;
  expires_at?: string;
  is_public: boolean;
  created_at: string;
}

// =============================================
// DATABASE OPERATIONS
// =============================================

export class DatabaseService {
  // User Profile Operations
  static async createUserProfile(data: Partial<UserProfile>) {
    return secureDB.insertSecureData(TABLES.USER_PROFILES, data, ['phone_number', 'certifications']);
  }

  static async getUserProfile(userId: string) {
    return secureDB.selectSecureData(TABLES.USER_PROFILES, {
      select: '*',
      column: 'user_id',
      value: userId
    }, ['phone_number', 'certifications']);
  }

  static async updateUserProfile(userId: string, data: Partial<UserProfile>) {
    return secureDB.updateSecureData(TABLES.USER_PROFILES, data, {
      column: 'user_id',
      value: userId
    }, ['phone_number', 'certifications']);
  }

  // User Preferences Operations
  static async createUserPreferences(data: Partial<UserPreferences>) {
    return secureDB.insertSecureData(TABLES.USER_PREFERENCES, data, []);
  }

  static async getUserPreferences(userId: string) {
    return secureDB.selectSecureData(TABLES.USER_PREFERENCES, {
      select: '*',
      column: 'user_id',
      value: userId
    }, []);
  }

  static async updateUserPreferences(userId: string, data: Partial<UserPreferences>) {
    return secureDB.updateSecureData(TABLES.USER_PREFERENCES, data, {
      column: 'user_id',
      value: userId
    }, []);
  }

  // HIPAA Assessment Operations
  static async createAssessment(data: Partial<HipaaAssessment>) {
    return secureDB.insertSecureData(TABLES.HIPAA_ASSESSMENTS, data, []);
  }

  static async getAssessments(userId: string) {
    return secureDB.selectSecureData(TABLES.HIPAA_ASSESSMENTS, {
      select: '*',
      column: 'user_id',
      value: userId
    }, []);
  }

  static async updateAssessment(assessmentId: string, data: Partial<HipaaAssessment>) {
    return secureDB.updateSecureData(TABLES.HIPAA_ASSESSMENTS, data, {
      column: 'id',
      value: assessmentId
    }, []);
  }

  // Assessment Response Operations
  static async createAssessmentResponse(data: Partial<AssessmentResponse>) {
    return secureDB.insertSecureData(TABLES.ASSESSMENT_RESPONSES, data, []);
  }

  static async getAssessmentResponses(assessmentId: string) {
    return secureDB.selectSecureData(TABLES.ASSESSMENT_RESPONSES, {
      select: '*',
      column: 'assessment_id',
      value: assessmentId
    }, []);
  }

  // Security Event Operations
  static async logSecurityEvent(data: Partial<SecurityEvent>) {
    return secureDB.insertSecureData(TABLES.SECURITY_EVENTS, data, []);
  }

  static async getSecurityEvents(userId?: string) {
    if (userId) {
      return secureDB.selectSecureData(TABLES.SECURITY_EVENTS, {
        select: '*',
        column: 'user_id',
        value: userId
      }, []);
    } else {
      // Get all security events (admin function)
      const { data, error } = await supabase.from(secureDB.getTableName(TABLES.SECURITY_EVENTS)).select('*');
      return { data, error };
    }
  }

  // Health Check Operations
  static async createHealthCheck(data: Partial<HealthCheck>) {
    return secureDB.insertSecureData(TABLES.HEALTH_CHECKS, data, []);
  }

  static async getHealthChecks() {
    const { data, error } = await supabase.from(secureDB.getTableName(TABLES.HEALTH_CHECKS)).select('*');
    return { data, error };
  }

  // Performance Metric Operations
  static async createPerformanceMetric(data: Partial<PerformanceMetric>) {
    return secureDB.insertSecureData(TABLES.PERFORMANCE_METRICS, data, []);
  }

  static async getPerformanceMetrics(userId?: string) {
    if (userId) {
      return secureDB.selectSecureData(TABLES.PERFORMANCE_METRICS, {
        select: '*',
        column: 'user_id',
        value: userId
      }, []);
    } else {
      const { data, error } = await supabase.from(secureDB.getTableName(TABLES.PERFORMANCE_METRICS)).select('*');
      return { data, error };
    }
  }

  // Training Module Operations
  static async getTrainingModules() {
    const { data, error } = await supabase.from(secureDB.getTableName(TABLES.TRAINING_MODULES)).select('*');
    return { data, error };
  }

  static async createTrainingModule(data: Partial<TrainingModule>) {
    return secureDB.insertSecureData(TABLES.TRAINING_MODULES, data, []);
  }

  // User Training Progress Operations
  static async createTrainingProgress(data: Partial<UserTrainingProgress>) {
    return secureDB.insertSecureData(TABLES.USER_TRAINING_PROGRESS, data, []);
  }

  static async getTrainingProgress(userId: string) {
    return secureDB.selectSecureData(TABLES.USER_TRAINING_PROGRESS, {
      select: '*',
      column: 'user_id',
      value: userId
    }, []);
  }

  static async updateTrainingProgress(progressId: string, data: Partial<UserTrainingProgress>) {
    return secureDB.updateSecureData(TABLES.USER_TRAINING_PROGRESS, data, {
      column: 'id',
      value: progressId
    }, []);
  }

  // Audit Log Operations
  static async createAuditLog(data: Partial<AuditLog>) {
    return secureDB.insertSecureData(TABLES.AUDIT_LOGS, data, []);
  }

  static async getAuditLogs(userId: string) {
    return secureDB.selectSecureData(TABLES.AUDIT_LOGS, {
      select: '*',
      column: 'user_id',
      value: userId
    }, []);
  }

  // Compliance Report Operations
  static async createComplianceReport(data: Partial<ComplianceReport>) {
    return secureDB.insertSecureData(TABLES.COMPLIANCE_REPORTS, data, []);
  }

  static async getComplianceReports(userId: string) {
    return secureDB.selectSecureData(TABLES.COMPLIANCE_REPORTS, {
      select: '*',
      column: 'user_id',
      value: userId
    }, []);
  }

  // Dashboard Data Operations
  static async getDashboardData(userId: string) {
    const { data, error } = await supabase.from(secureDB.getTableName('user_dashboard')).select('*').eq('user_id', userId);
    return { data, error };
  }

  static async getComplianceSummary(organization?: string) {
    let query = supabase.from(secureDB.getTableName('compliance_summary')).select('*');
    
    if (organization) {
      query = query.eq('organization', organization);
    }
    
    const { data, error } = await query;
    return { data, error };
  }
}

// =============================================
// EXPORTS
// =============================================

export { secureDB };
export default DatabaseService;