/**
 * MediSoluce Backend API Service
 * 
 * This module provides comprehensive API services for the MediSoluce platform
 * including authentication, data management, and compliance operations.
 */

import { createClient } from '@supabase/supabase-js';
import { securityUtils } from '../utils/securityUtils';

// =============================================
// CONFIGURATION
// =============================================

const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://snrpdosiuwmdaegxkqux.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucnBkb3NpdXdtZGFlZ3hrcXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTA5MTYsImV4cCI6MjA3NDc4NjkxNn0.tl_ipfmxSwMNLBQ-QeqQPyp_w6xvocTtXqaFGHHFwe0'
};

// =============================================
// TYPES AND INTERFACES
// =============================================

interface APIResponse<T = unknown> {
  data: T | null;
  error: Error | null;
  success: boolean;
  status: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface FilterParams {
  [key: string]: unknown;
}

// =============================================
// MAIN API SERVICE CLASS
// =============================================

class MediSoluceAPIService {
  private supabase: any;
  private schemaPrefix: string = 'medisoluce';

  constructor() {
    this.supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    this.setupErrorHandling();
  }

  /**
   * Setup error handling
   */
  private setupErrorHandling(): void {
    // Global error handler for API calls
    this.supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Handle auth state changes
        securityUtils.logSecurityEvent('auth_state_change', {
          event,
          userId: session?.user?.id
        }, 'low');
      }
    });
  }

  /**
   * Get full table name with schema prefix
   */
  private getTableName(table: string): string {
    return `${this.schemaPrefix}.${table}`;
  }

  /**
   * Handle API errors
   */
  private handleError(error: any, context: string): APIResponse {
    const errorMessage = error?.message || 'Unknown error occurred';
    
    // Log security event for errors
    securityUtils.logSecurityEvent('api_error', {
      context,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, 'medium');

    return {
      data: null,
      error: new Error(errorMessage),
      success: false,
      status: error?.status || 500
    };
  }

  /**
   * Create success response
   */
  private createSuccessResponse<T>(data: T, status: number = 200): APIResponse<T> {
    return {
      data,
      error: null,
      success: true,
      status
    };
  }

  // =============================================
  // AUTHENTICATION METHODS
  // =============================================

  /**
   * Sign up new user
   */
  async signUp(email: string, password: string): Promise<APIResponse> {
    try {
      securityUtils.logSecurityEvent('signup_attempt', {
        email,
        timestamp: new Date().toISOString()
      }, 'low');

      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        securityUtils.logSecurityEvent('signup_failed', {
          email,
          error: error.message
        }, 'medium');
        return this.handleError(error, 'signup');
      }

      securityUtils.logSecurityEvent('signup_success', {
        email,
        userId: data.user?.id
      }, 'low');

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'signup');
    }
  }

  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<APIResponse> {
    try {
      securityUtils.logSecurityEvent('signin_attempt', {
        email,
        timestamp: new Date().toISOString()
      }, 'low');

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        securityUtils.logSecurityEvent('signin_failed', {
          email,
          error: error.message
        }, 'medium');
        return this.handleError(error, 'signin');
      }

      securityUtils.logSecurityEvent('signin_success', {
        email,
        userId: data.user?.id
      }, 'low');

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'signin');
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<APIResponse> {
    try {
      const session = await this.supabase.auth.getSession();
      const userId = session.data.session?.user?.id;

      const { error } = await this.supabase.auth.signOut();

      if (error) {
        securityUtils.logSecurityEvent('signout_failed', {
          userId,
          error: error.message
        }, 'low');
        return this.handleError(error, 'signout');
      }

      securityUtils.logSecurityEvent('signout_success', {
        userId
      }, 'low');

      return this.createSuccessResponse({ success: true });

    } catch (error) {
      return this.handleError(error, 'signout');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<APIResponse> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();

      if (error) {
        return this.handleError(error, 'getCurrentUser');
      }

      return this.createSuccessResponse(user);

    } catch (error) {
      return this.handleError(error, 'getCurrentUser');
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<APIResponse> {
    try {
      securityUtils.logSecurityEvent('password_reset_request', {
        email,
        timestamp: new Date().toISOString()
      }, 'low');

      const { error } = await this.supabase.auth.resetPasswordForEmail(email);

      if (error) {
        securityUtils.logSecurityEvent('password_reset_failed', {
          email,
          error: error.message
        }, 'medium');
        return this.handleError(error, 'resetPassword');
      }

      return this.createSuccessResponse({ success: true });

    } catch (error) {
      return this.handleError(error, 'resetPassword');
    }
  }

  // =============================================
  // USER PROFILE METHODS
  // =============================================

  /**
   * Create user profile
   */
  async createUserProfile(profileData: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('user_profiles'))
        .insert(profileData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'createUserProfile');
      }

      securityUtils.logSecurityEvent('profile_created', {
        userId: profileData.user_id,
        profileId: data.id
      }, 'low');

      return this.createSuccessResponse(data, 201);

    } catch (error) {
      return this.handleError(error, 'createUserProfile');
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('user_profiles'))
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return this.handleError(error, 'getUserProfile');
      }

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'getUserProfile');
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('user_profiles'))
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'updateUserProfile');
      }

      securityUtils.logSecurityEvent('profile_updated', {
        userId,
        updates: Object.keys(updates)
      }, 'low');

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'updateUserProfile');
    }
  }

  // =============================================
  // ASSESSMENT METHODS
  // =============================================

  /**
   * Create HIPAA assessment
   */
  async createAssessment(assessmentData: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('hipaa_assessments'))
        .insert(assessmentData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'createAssessment');
      }

      securityUtils.logSecurityEvent('assessment_created', {
        userId: assessmentData.user_id,
        assessmentId: data.id,
        assessmentType: assessmentData.assessment_type
      }, 'low');

      return this.createSuccessResponse(data, 201);

    } catch (error) {
      return this.handleError(error, 'createAssessment');
    }
  }

  /**
   * Get user assessments
   */
  async getUserAssessments(userId: string, params?: PaginationParams): Promise<APIResponse> {
    try {
      let query = this.supabase
        .from(this.getTableName('hipaa_assessments'))
        .select('*')
        .eq('user_id', userId);

      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params.sortOrder === 'asc' });
      }

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      if (params?.page && params?.limit) {
        query = query.range(
          (params.page - 1) * params.limit,
          params.page * params.limit - 1
        );
      }

      const { data, error } = await query;

      if (error) {
        return this.handleError(error, 'getUserAssessments');
      }

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'getUserAssessments');
    }
  }

  /**
   * Update assessment
   */
  async updateAssessment(assessmentId: string, updates: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('hipaa_assessments'))
        .update(updates)
        .eq('id', assessmentId)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'updateAssessment');
      }

      securityUtils.logSecurityEvent('assessment_updated', {
        assessmentId,
        updates: Object.keys(updates)
      }, 'low');

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'updateAssessment');
    }
  }

  /**
   * Create assessment response
   */
  async createAssessmentResponse(responseData: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('assessment_responses'))
        .insert(responseData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'createAssessmentResponse');
      }

      return this.createSuccessResponse(data, 201);

    } catch (error) {
      return this.handleError(error, 'createAssessmentResponse');
    }
  }

  /**
   * Get assessment responses
   */
  async getAssessmentResponses(assessmentId: string): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('assessment_responses'))
        .select('*')
        .eq('assessment_id', assessmentId);

      if (error) {
        return this.handleError(error, 'getAssessmentResponses');
      }

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'getAssessmentResponses');
    }
  }

  // =============================================
  // COMPLIANCE METHODS
  // =============================================

  /**
   * Create compliance finding
   */
  async createComplianceFinding(findingData: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('compliance_findings'))
        .insert(findingData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'createComplianceFinding');
      }

      securityUtils.logSecurityEvent('compliance_finding_created', {
        assessmentId: findingData.assessment_id,
        findingId: data.id,
        severity: findingData.severity
      }, 'medium');

      return this.createSuccessResponse(data, 201);

    } catch (error) {
      return this.handleError(error, 'createComplianceFinding');
    }
  }

  /**
   * Get compliance findings
   */
  async getComplianceFindings(assessmentId: string): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('compliance_findings'))
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('severity', { ascending: false });

      if (error) {
        return this.handleError(error, 'getComplianceFindings');
      }

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'getComplianceFindings');
    }
  }

  // =============================================
  // SECURITY METHODS
  // =============================================

  /**
   * Log security event
   */
  async logSecurityEvent(eventData: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('security_events'))
        .insert(eventData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'logSecurityEvent');
      }

      return this.createSuccessResponse(data, 201);

    } catch (error) {
      return this.handleError(error, 'logSecurityEvent');
    }
  }

  /**
   * Get security events
   */
  async getSecurityEvents(userId?: string, params?: PaginationParams): Promise<APIResponse> {
    try {
      let query = this.supabase
        .from(this.getTableName('security_events'))
        .select('*');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params.sortOrder === 'asc' });
      }

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error } = await query;

      if (error) {
        return this.handleError(error, 'getSecurityEvents');
      }

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'getSecurityEvents');
    }
  }

  // =============================================
  // TRAINING METHODS
  // =============================================

  /**
   * Get training modules
   */
  async getTrainingModules(): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('training_modules'))
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (error) {
        return this.handleError(error, 'getTrainingModules');
      }

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'getTrainingModules');
    }
  }

  /**
   * Create training progress
   */
  async createTrainingProgress(progressData: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('user_training_progress'))
        .insert(progressData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'createTrainingProgress');
      }

      return this.createSuccessResponse(data, 201);

    } catch (error) {
      return this.handleError(error, 'createTrainingProgress');
    }
  }

  /**
   * Get user training progress
   */
  async getUserTrainingProgress(userId: string): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('user_training_progress'))
        .select(`
          *,
          training_modules (
            title,
            description,
            module_type,
            difficulty_level,
            estimated_duration
          )
        `)
        .eq('user_id', userId);

      if (error) {
        return this.handleError(error, 'getUserTrainingProgress');
      }

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'getUserTrainingProgress');
    }
  }

  // =============================================
  // AUDIT METHODS
  // =============================================

  /**
   * Create audit log
   */
  async createAuditLog(logData: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('audit_logs'))
        .insert(logData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'createAuditLog');
      }

      return this.createSuccessResponse(data, 201);

    } catch (error) {
      return this.handleError(error, 'createAuditLog');
    }
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(userId: string, params?: PaginationParams): Promise<APIResponse> {
    try {
      let query = this.supabase
        .from(this.getTableName('audit_logs'))
        .select('*')
        .eq('user_id', userId);

      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params.sortOrder === 'asc' });
      }

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error } = await query;

      if (error) {
        return this.handleError(error, 'getAuditLogs');
      }

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'getAuditLogs');
    }
  }

  // =============================================
  // HEALTH CHECK METHODS
  // =============================================

  /**
   * Get health checks
   */
  async getHealthChecks(): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('health_checks'))
        .select('*')
        .order('check_type');

      if (error) {
        return this.handleError(error, 'getHealthChecks');
      }

      return this.createSuccessResponse(data);

    } catch (error) {
      return this.handleError(error, 'getHealthChecks');
    }
  }

  /**
   * Create performance metric
   */
  async createPerformanceMetric(metricData: any): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('performance_metrics'))
        .insert(metricData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, 'createPerformanceMetric');
      }

      return this.createSuccessResponse(data, 201);

    } catch (error) {
      return this.handleError(error, 'createPerformanceMetric');
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  /**
   * Test database connection
   */
  async testConnection(): Promise<APIResponse> {
    try {
      const { data, error } = await this.supabase
        .from(this.getTableName('health_checks'))
        .select('id')
        .limit(1);

      if (error) {
        return this.handleError(error, 'testConnection');
      }

      return this.createSuccessResponse({ 
        connected: true, 
        timestamp: new Date().toISOString() 
      });

    } catch (error) {
      return this.handleError(error, 'testConnection');
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<APIResponse> {
    try {
      const tables = [
        'user_profiles',
        'hipaa_assessments',
        'assessment_responses',
        'compliance_findings',
        'security_events',
        'training_modules',
        'user_training_progress',
        'audit_logs'
      ];

      const stats: any = {};

      for (const table of tables) {
        const { count, error } = await this.supabase
          .from(this.getTableName(table))
          .select('*', { count: 'exact', head: true });

        if (!error) {
          stats[table] = count;
        }
      }

      return this.createSuccessResponse(stats);

    } catch (error) {
      return this.handleError(error, 'getDatabaseStats');
    }
  }
}

// =============================================
// EXPORTS
// =============================================

export const apiService = new MediSoluceAPIService();
export default MediSoluceAPIService;
