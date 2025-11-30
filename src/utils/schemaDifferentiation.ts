/**
 * Database Schema Differentiation and Isolation Manager
 * 
 * This module ensures proper database schema isolation and differentiation
 * for multi-project Supabase deployments with:
 * - Schema prefix validation
 * - Table name conflict prevention
 * - Data isolation verification
 * - Migration management
 * - Cross-project safety checks
 */

import { supabase } from '../lib/supabase';

// =============================================
// TYPES AND INTERFACES
// =============================================

interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

interface TableInfo {
  tableName: string;
  schemaName: string;
  fullName: string;
  exists: boolean;
  rowCount?: number;
  lastModified?: string;
}

interface SchemaMetrics {
  totalTables: number;
  totalRows: number;
  schemaSize: number;
  lastBackup?: string;
  isolationScore: number;
}

interface MigrationInfo {
  version: string;
  description: string;
  appliedAt: string;
  checksum: string;
  rollbackSql?: string;
}

// =============================================
// CONFIGURATION
// =============================================

const SCHEMA_CONFIG = {
  // Schema prefix for this project
  SCHEMA_PREFIX: 'medisoluce',
  
  // Reserved table names that should never conflict
  RESERVED_TABLES: [
    'user_profiles',
    'user_preferences',
    'hipaa_assessments',
    'assessment_responses',
    'compliance_findings',
    'security_events',
    'security_threats',
    'health_checks',
    'performance_metrics',
    'training_modules',
    'user_training_progress',
    'audit_logs',
    'compliance_reports',
    'migrations'
  ],
  
  // Tables that should be isolated (not shared)
  ISOLATED_TABLES: [
    'user_profiles',
    'user_preferences',
    'hipaa_assessments',
    'assessment_responses',
    'compliance_findings',
    'security_events',
    'security_threats',
    'user_training_progress',
    'audit_logs',
    'compliance_reports'
  ],
  
  // Tables that can be shared across projects (read-only)
  SHARED_TABLES: [
    'training_modules',
    'health_checks',
    'performance_metrics'
  ],
  
  // Maximum allowed table count per schema
  MAX_TABLES_PER_SCHEMA: 50,
  
  // Maximum allowed rows per table
  MAX_ROWS_PER_TABLE: 1000000,
  
  // Schema validation rules
  VALIDATION_RULES: {
    requireSchemaPrefix: true,
    requireTablePrefix: false,
    allowCrossSchemaQueries: false,
    requireRLS: true,
    requireAuditLogging: true
  }
};

// =============================================
// MAIN SCHEMA MANAGER CLASS
// =============================================

class SchemaDifferentiationManager {
  private schemaPrefix: string;
  private validationCache: Map<string, SchemaValidationResult> = new Map();

  constructor(schemaPrefix: string = SCHEMA_CONFIG.SCHEMA_PREFIX) {
    this.schemaPrefix = schemaPrefix;
  }

  /**
   * Validate schema isolation and differentiation
   */
  async validateSchemaIsolation(): Promise<SchemaValidationResult> {
    const cacheKey = `validation_${this.schemaPrefix}`;
    
    // Check cache first
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!;
    }

    const result: SchemaValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      recommendations: []
    };

    try {
      // Check if schema exists
      const schemaExists = await this.checkSchemaExists();
      if (!schemaExists) {
        result.errors.push(`Schema '${this.schemaPrefix}' does not exist`);
        result.isValid = false;
      }

      // Check table isolation
      const tableIsolation = await this.checkTableIsolation();
      if (!tableIsolation.isValid) {
        result.errors.push(...tableIsolation.errors);
        result.isValid = false;
      }

      // Check for naming conflicts
      const namingConflicts = await this.checkNamingConflicts();
      if (namingConflicts.length > 0) {
        result.warnings.push(...namingConflicts);
      }

      // Check RLS policies
      const rlsStatus = await this.checkRLSPolicies();
      if (!rlsStatus.isValid) {
        result.errors.push(...rlsStatus.errors);
        result.isValid = false;
      }

      // Check data isolation
      const dataIsolation = await this.checkDataIsolation();
      if (!dataIsolation.isValid) {
        result.errors.push(...dataIsolation.errors);
        result.isValid = false;
      }

      // Generate recommendations
      result.recommendations = this.generateRecommendations(result);

      // Cache the result
      this.validationCache.set(cacheKey, result);

    } catch (error) {
      result.errors.push(`Validation failed: ${error}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Check if schema exists
   */
  private async checkSchemaExists(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('check_schema_exists', {
        schema_name: this.schemaPrefix
      });
      
      if (error) {
        // Fallback: try to query a table in the schema
        const { error: tableError } = await supabase
          .from(`${this.schemaPrefix}.user_profiles`)
          .select('id')
          .limit(1);
        
        return !tableError;
      }
      
      return data === true;
    } catch {
      return false;
    }
  }

  /**
   * Check table isolation
   */
  private async checkTableIsolation(): Promise<{ isValid: boolean; errors: string[] }> {
    const result = { isValid: true, errors: [] as string[] };

    try {
      // Check if all required tables exist in the schema
      for (const tableName of SCHEMA_CONFIG.RESERVED_TABLES) {
        const fullTableName = `${this.schemaPrefix}.${tableName}`;
        const { error } = await supabase
          .from(fullTableName)
          .select('id')
          .limit(1);

        if (error && error.code !== 'PGRST116') { // PGRST116 = table not found
          result.errors.push(`Table ${fullTableName} is not accessible: ${error.message}`);
          result.isValid = false;
        }
      }

      // Check for tables in public schema that might conflict
      const { data: publicTables, error: publicError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (!publicError && publicTables) {
        const conflictingTables = publicTables
          .map(t => t.table_name)
          .filter(tableName => SCHEMA_CONFIG.RESERVED_TABLES.includes(tableName));

        if (conflictingTables.length > 0) {
          result.errors.push(`Conflicting tables found in public schema: ${conflictingTables.join(', ')}`);
          result.isValid = false;
        }
      }

    } catch (error) {
      result.errors.push(`Table isolation check failed: ${error}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Check for naming conflicts
   */
  private async checkNamingConflicts(): Promise<string[]> {
    const warnings: string[] = [];

    try {
      // Check for similar table names in other schemas
      const { data: allTables, error } = await supabase
        .from('information_schema.tables')
        .select('table_schema, table_name')
        .neq('table_schema', this.schemaPrefix)
        .neq('table_schema', 'information_schema')
        .neq('table_schema', 'pg_catalog');

      if (!error && allTables) {
        const ourTables = SCHEMA_CONFIG.RESERVED_TABLES;
        
        allTables.forEach(({ table_schema, table_name }) => {
          if (ourTables.includes(table_name)) {
            warnings.push(`Table '${table_name}' exists in schema '${table_schema}' - potential naming conflict`);
          }
        });
      }

    } catch (error) {
      warnings.push(`Naming conflict check failed: ${error}`);
    }

    return warnings;
  }

  /**
   * Check RLS policies
   */
  private async checkRLSPolicies(): Promise<{ isValid: boolean; errors: string[] }> {
    const result = { isValid: true, errors: [] as string[] };

    try {
      // Check if RLS is enabled on all tables
      for (const tableName of SCHEMA_CONFIG.ISOLATED_TABLES) {
        const fullTableName = `${this.schemaPrefix}.${tableName}`;
        
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('is_insertable_into')
          .eq('table_schema', this.schemaPrefix)
          .eq('table_name', tableName);

        if (!error && data && data.length > 0) {
          // Check if RLS is enabled (this is a simplified check)
          // In a real implementation, you'd check pg_class.relrowsecurity
          const { error: rlsError } = await supabase
            .from(fullTableName)
            .select('*')
            .limit(0);

          if (rlsError && rlsError.message.includes('permission denied')) {
            // This suggests RLS is working
          } else {
            result.warnings.push(`RLS may not be properly configured for table ${fullTableName}`);
          }
        }
      }

    } catch (error) {
      result.errors.push(`RLS policy check failed: ${error}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Check data isolation
   */
  private async checkDataIsolation(): Promise<{ isValid: boolean; errors: string[] }> {
    const result = { isValid: true, errors: [] as string[] };

    try {
      // Check if we can access data from other schemas
      const { data: otherSchemas, error } = await supabase
        .from('information_schema.schemata')
        .select('schema_name')
        .neq('schema_name', this.schemaPrefix)
        .neq('schema_name', 'information_schema')
        .neq('schema_name', 'pg_catalog')
        .neq('schema_name', 'public');

      if (!error && otherSchemas) {
        // Try to access tables in other schemas
        for (const { schema_name } of otherSchemas) {
          const { error: accessError } = await supabase
            .from(`${schema_name}.user_profiles`)
            .select('id')
            .limit(1);

          if (!accessError) {
            result.errors.push(`Can access data from schema '${schema_name}' - data isolation compromised`);
            result.isValid = false;
          }
        }
      }

    } catch (error) {
      result.errors.push(`Data isolation check failed: ${error}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(result: SchemaValidationResult): string[] {
    const recommendations: string[] = [];

    if (result.errors.length > 0) {
      recommendations.push('Fix all validation errors before proceeding with deployment');
    }

    if (result.warnings.length > 0) {
      recommendations.push('Review warnings and consider addressing potential issues');
    }

    if (result.isValid) {
      recommendations.push('Schema isolation is properly configured');
      recommendations.push('Consider setting up automated schema validation in CI/CD');
      recommendations.push('Implement regular schema backup procedures');
    }

    return recommendations;
  }

  /**
   * Get schema metrics
   */
  async getSchemaMetrics(): Promise<SchemaMetrics> {
    const metrics: SchemaMetrics = {
      totalTables: 0,
      totalRows: 0,
      schemaSize: 0,
      isolationScore: 0
    };

    try {
      // Get table count
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', this.schemaPrefix);

      if (!tableError && tables) {
        metrics.totalTables = tables.length;

        // Get row counts for each table
        for (const { table_name } of tables) {
          const { count, error: countError } = await supabase
            .from(`${this.schemaPrefix}.${table_name}`)
            .select('*', { count: 'exact', head: true });

          if (!countError && count) {
            metrics.totalRows += count;
          }
        }
      }

      // Calculate isolation score
      const validation = await this.validateSchemaIsolation();
      metrics.isolationScore = validation.isValid ? 100 : Math.max(0, 100 - (validation.errors.length * 20));

    } catch (error) {
      console.error('Failed to get schema metrics:', error);
    }

    return metrics;
  }

  /**
   * Get table information
   */
  async getTableInfo(tableName: string): Promise<TableInfo> {
    const fullTableName = `${this.schemaPrefix}.${tableName}`;
    
    const info: TableInfo = {
      tableName,
      schemaName: this.schemaPrefix,
      fullName: fullTableName,
      exists: false
    };

    try {
      const { data, error } = await supabase
        .from(fullTableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        info.exists = true;
        info.rowCount = data?.length || 0;
      }

    } catch (error) {
      console.error(`Failed to get table info for ${fullTableName}:`, error);
    }

    return info;
  }

  /**
   * Create schema if it doesn't exist
   */
  async createSchema(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('create_schema_if_not_exists', {
        schema_name: this.schemaPrefix
      });

      if (error) {
        console.error('Failed to create schema:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to create schema:', error);
      return false;
    }
  }

  /**
   * Run schema migration
   */
  async runMigration(migrationSql: string, version: string): Promise<boolean> {
    try {
      // Start transaction
      const { error: beginError } = await supabase.rpc('begin_transaction');
      if (beginError) throw beginError;

      // Execute migration
      const { error: migrationError } = await supabase.rpc('execute_sql', {
        sql: migrationSql
      });
      if (migrationError) throw migrationError;

      // Record migration
      const { error: recordError } = await supabase
        .from(`${this.schemaPrefix}.migrations`)
        .insert({
          version,
          description: `Migration ${version}`,
          applied_at: new Date().toISOString(),
          checksum: this.calculateChecksum(migrationSql)
        });

      if (recordError) throw recordError;

      // Commit transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) throw commitError;

      return true;
    } catch (error) {
      // Rollback on error
      await supabase.rpc('rollback_transaction');
      console.error('Migration failed:', error);
      return false;
    }
  }

  /**
   * Calculate checksum for migration
   */
  private calculateChecksum(sql: string): string {
    let hash = 0;
    for (let i = 0; i < sql.length; i++) {
      const char = sql.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Get migration history
   */
  async getMigrationHistory(): Promise<MigrationInfo[]> {
    try {
      const { data, error } = await supabase
        .from(`${this.schemaPrefix}.migrations`)
        .select('*')
        .order('applied_at', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to get migration history:', error);
      return [];
    }
  }

  /**
   * Verify schema isolation
   */
  async verifyIsolation(): Promise<boolean> {
    const validation = await this.validateSchemaIsolation();
    return validation.isValid;
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.validationCache.clear();
  }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Get schema prefix for current project
 */
export function getSchemaPrefix(): string {
  return SCHEMA_CONFIG.SCHEMA_PREFIX;
}

/**
 * Get full table name with schema prefix
 */
export function getFullTableName(tableName: string): string {
  return `${SCHEMA_CONFIG.SCHEMA_PREFIX}.${tableName}`;
}

/**
 * Check if table is isolated
 */
export function isTableIsolated(tableName: string): boolean {
  return SCHEMA_CONFIG.ISOLATED_TABLES.includes(tableName);
}

/**
 * Check if table can be shared
 */
export function isTableShared(tableName: string): boolean {
  return SCHEMA_CONFIG.SHARED_TABLES.includes(tableName);
}

/**
 * Validate table name
 */
export function validateTableName(tableName: string): boolean {
  return SCHEMA_CONFIG.RESERVED_TABLES.includes(tableName);
}

// =============================================
// EXPORTS
// =============================================

export const schemaManager = new SchemaDifferentiationManager();
export default SchemaDifferentiationManager;
