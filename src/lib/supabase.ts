import { createClient } from '@supabase/supabase-js';
import { securityUtils } from '../utils/securityUtils';
import backendService from '../services/backendService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nkgekxipzzvceesdjsrh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZ2VreGlwenp2Y2Vlc2Rqc3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTc0MTUsImV4cCI6MjA3MzQzMzQxNX0.W-598e6_uv5ES9DqgVr9ExdeY4uzZxcIZulrvioGqpA';

// Service role key for admin operations (update this with your actual service role key from Supabase dashboard)
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 'UPDATE_WITH_SERVICE_ROLE_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for service operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced security wrapper for Supabase operations with schema prefixing
const secureSupabaseWrapper = {
  // Get the full table name with schema prefix
  getTableName(table: string): string {
    // If table already has schema prefix, use as is
    if (table.includes('.')) {
      return table;
    }
    // Otherwise, add the medisoluce schema prefix
    return `medisoluce.${table}`;
  },

  // Encrypt sensitive data before storing
  async insertSecureData(table: string, data: Record<string, unknown>, sensitiveFields: string[] = []) {
    const secureData = { ...data };
    const fullTableName = this.getTableName(table);
    
    // Encrypt sensitive fields
    sensitiveFields.forEach(field => {
      if (secureData[field]) {
        secureData[field] = securityUtils.encryptSensitiveData(secureData[field]);
      }
    });
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_insert', {
      table: fullTableName,
      sensitiveFields,
      recordId: secureData.id
    }, 'low');
    
    return supabase.from(fullTableName).insert(secureData);
  },

  // Decrypt sensitive data after retrieval
  async selectSecureData(table: string, query: { select: string; column: string; value: unknown }, sensitiveFields: string[] = []) {
    const fullTableName = this.getTableName(table);
    const { data, error } = await supabase.from(fullTableName).select(query.select).eq(query.column, query.value);
    
    if (error) return { data: null, error };
    
    // Decrypt sensitive fields
    const decryptedData = data?.map(record => {
      const decrypted = { ...record };
      sensitiveFields.forEach(field => {
        if (decrypted[field]) {
          try {
            decrypted[field] = securityUtils.decryptSensitiveData(decrypted[field]);
          } catch (decryptError) {
            if (!import.meta.env.PROD) {
              console.warn(`Failed to decrypt field ${field}:`, decryptError);
            }
          }
        }
      });
      return decrypted;
    });
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_select', {
      table: fullTableName,
      recordCount: data?.length || 0,
      sensitiveFields
    }, 'low');
    
    return { data: decryptedData, error };
  },

  // Update data with schema prefixing
  async updateSecureData(table: string, data: Record<string, unknown>, query: { column: string; value: unknown }, sensitiveFields: string[] = []) {
    const secureData = { ...data };
    const fullTableName = this.getTableName(table);
    
    // Encrypt sensitive fields
    sensitiveFields.forEach(field => {
      if (secureData[field]) {
        secureData[field] = securityUtils.encryptSensitiveData(secureData[field]);
      }
    });
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_update', {
      table: fullTableName,
      sensitiveFields,
      queryColumn: query.column,
      queryValue: query.value
    }, 'low');
    
    return supabase.from(fullTableName).update(secureData).eq(query.column, query.value);
  },

  // Delete data with schema prefixing
  async deleteSecureData(table: string, query: { column: string; value: unknown }) {
    const fullTableName = this.getTableName(table);
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_delete', {
      table: fullTableName,
      queryColumn: query.column,
      queryValue: query.value
    }, 'medium');
    
    return supabase.from(fullTableName).delete().eq(query.column, query.value);
  }
};

// Helper functions for common Supabase operations using backend service
export const auth = {
  signUp: async (email: string, password: string) => {
    const result = await backendService.AuthenticationService.signUp(email, password);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  },

  signIn: async (email: string, password: string) => {
    const result = await backendService.AuthenticationService.signIn(email, password);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  },

  signOut: async () => {
    const result = await backendService.AuthenticationService.signOut();
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  resetPassword: async (email: string) => {
    const result = await backendService.AuthenticationService.resetPassword(email);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  onAuthStateChange: (callback: (event: { event: string; session: unknown }, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Export secure wrapper for sensitive data operations
export const secureDB = secureSupabaseWrapper;

// Export table name helper for direct Supabase queries
export const getTableName = (table: string): string => {
  if (table.includes('.')) {
    return table;
  }
  return `medisoluce.${table}`;
};

// Export backend service for direct use
export { backendService };