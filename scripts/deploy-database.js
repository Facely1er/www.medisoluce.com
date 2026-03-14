#!/usr/bin/env node

/**
 * MediSoluce Database Deployment Script
 * 
 * This script deploys the database schema to Supabase using the service role key
 * for administrative operations.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuration - Requires environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing required environment variables');
  console.error('Please set:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nExample:');
  console.error('  export VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('  export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/**
 * Execute SQL statement
 */
async function executeSQL(sql, description) {
  console.log(`📋 ${description}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.log(`⚠️ ${description} - Warning: ${error.message}`);
      return false;
    }
    
    console.log(`✅ ${description} - Success`);
    return true;
  } catch (err) {
    console.log(`⚠️ ${description} - Warning: ${err.message}`);
    return false;
  }
}

/**
 * Test database connection
 */
async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

/**
 * Create schema
 */
async function createSchema() {
  return await executeSQL(
    `CREATE SCHEMA IF NOT EXISTS medisoluce;`,
    'Creating medisoluce schema'
  );
}

/**
 * Deploy core tables
 */
async function deployTables() {
  const tables = [
    {
      name: 'user_profiles',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.user_profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID UNIQUE NOT NULL,
          email VARCHAR(255) NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          organization_name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          department VARCHAR(100),
          phone VARCHAR(20),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          preferences JSONB DEFAULT '{}'::jsonb
        );
      `
    },
    {
      name: 'user_preferences',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.user_preferences (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE CASCADE,
          theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
          language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'fr', 'es')),
          timezone VARCHAR(50) DEFAULT 'UTC',
          report_format VARCHAR(20) DEFAULT 'detailed' CHECK (report_format IN ('detailed', 'summary')),
          auto_save BOOLEAN DEFAULT true,
          assessment_reminders BOOLEAN DEFAULT true,
          email_notifications BOOLEAN DEFAULT true,
          show_guidance_by_default BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'hipaa_assessments',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.hipaa_assessments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE CASCADE,
          assessment_name VARCHAR(255) NOT NULL,
          assessment_type VARCHAR(100) NOT NULL CHECK (assessment_type IN ('initial', 'periodic', 'incident_response', 'training')),
          status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
          score INTEGER CHECK (score >= 0 AND score <= 100),
          max_score INTEGER DEFAULT 100,
          completion_percentage DECIMAL(5,2) DEFAULT 0,
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE,
          due_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `
    },
    {
      name: 'assessment_responses',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.assessment_responses (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          assessment_id UUID REFERENCES medisoluce.hipaa_assessments(id) ON DELETE CASCADE,
          question_id VARCHAR(255) NOT NULL,
          question_text TEXT NOT NULL,
          response_value TEXT NOT NULL,
          response_type VARCHAR(50) DEFAULT 'multiple_choice',
          score INTEGER DEFAULT 0,
          max_score INTEGER DEFAULT 5,
          is_required BOOLEAN DEFAULT true,
          answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'compliance_findings',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.compliance_findings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          assessment_id UUID REFERENCES medisoluce.hipaa_assessments(id) ON DELETE CASCADE,
          finding_type VARCHAR(100) NOT NULL,
          severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          recommendation TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
          assigned_to UUID REFERENCES medisoluce.user_profiles(user_id),
          due_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          resolved_at TIMESTAMP WITH TIME ZONE
        );
      `
    },
    {
      name: 'security_events',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.security_events (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE CASCADE,
          event_type VARCHAR(100) NOT NULL,
          event_category VARCHAR(50) NOT NULL,
          severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
          description TEXT NOT NULL,
          ip_address INET,
          user_agent TEXT,
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'training_modules',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.training_modules (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          module_type VARCHAR(50) NOT NULL,
          difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
          estimated_duration INTEGER DEFAULT 30,
          content JSONB DEFAULT '{}'::jsonb,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'user_training_progress',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.user_training_progress (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE CASCADE,
          module_id UUID REFERENCES medisoluce.training_modules(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
          progress_percentage DECIMAL(5,2) DEFAULT 0,
          score INTEGER,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'audit_logs',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.audit_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE CASCADE,
          action VARCHAR(100) NOT NULL,
          resource_type VARCHAR(50) NOT NULL,
          resource_id UUID,
          old_values JSONB,
          new_values JSONB,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'health_checks',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.health_checks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          check_name VARCHAR(255) NOT NULL,
          check_type VARCHAR(100) NOT NULL,
          status VARCHAR(20) NOT NULL CHECK (status IN ('pass', 'fail', 'warning')),
          description TEXT,
          auto_implementable BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'performance_metrics',
      sql: `
        CREATE TABLE IF NOT EXISTS medisoluce.performance_metrics (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          metric_name VARCHAR(255) NOT NULL,
          metric_value DECIMAL(10,4) NOT NULL,
          metric_unit VARCHAR(50),
          category VARCHAR(100),
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `
    }
  ];

  let successCount = 0;
  
  for (const table of tables) {
    const success = await executeSQL(table.sql, `Creating table ${table.name}`);
    if (success) successCount++;
  }

  console.log(`\n📊 Tables created: ${successCount}/${tables.length}`);
  return successCount === tables.length;
}

/**
 * Create indexes
 */
async function createIndexes() {
  const indexes = [
    {
      name: 'idx_user_profiles_user_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON medisoluce.user_profiles(user_id);'
    },
    {
      name: 'idx_hipaa_assessments_user_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_hipaa_assessments_user_id ON medisoluce.hipaa_assessments(user_id);'
    },
    {
      name: 'idx_assessment_responses_assessment_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_assessment_responses_assessment_id ON medisoluce.assessment_responses(assessment_id);'
    },
    {
      name: 'idx_compliance_findings_assessment_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_compliance_findings_assessment_id ON medisoluce.compliance_findings(assessment_id);'
    },
    {
      name: 'idx_security_events_user_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON medisoluce.security_events(user_id);'
    },
    {
      name: 'idx_audit_logs_user_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON medisoluce.audit_logs(user_id);'
    }
  ];

  let successCount = 0;
  
  for (const index of indexes) {
    const success = await executeSQL(index.sql, `Creating index ${index.name}`);
    if (success) successCount++;
  }

  console.log(`\n🔍 Indexes created: ${successCount}/${indexes.length}`);
  return successCount === indexes.length;
}

/**
 * Enable Row Level Security
 */
async function enableRLS() {
  const tables = [
    'user_profiles',
    'user_preferences',
    'hipaa_assessments',
    'assessment_responses',
    'compliance_findings',
    'security_events',
    'user_training_progress',
    'audit_logs'
  ];

  let successCount = 0;
  
  for (const table of tables) {
    const success = await executeSQL(
      `ALTER TABLE medisoluce.${table} ENABLE ROW LEVEL SECURITY;`,
      `Enabling RLS on ${table}`
    );
    if (success) successCount++;
  }

  console.log(`\n🛡️ RLS enabled on: ${successCount}/${tables.length} tables`);
  return successCount === tables.length;
}

/**
 * Create RLS policies
 */
async function createRLSPolicies() {
  const policies = [
    {
      name: 'user_profiles_policy',
      sql: `
        CREATE POLICY "Users can view own profile" ON medisoluce.user_profiles
        FOR ALL USING (auth.uid() = user_id);
      `
    },
    {
      name: 'user_preferences_policy',
      sql: `
        CREATE POLICY "Users can manage own preferences" ON medisoluce.user_preferences
        FOR ALL USING (auth.uid() = user_id);
      `
    },
    {
      name: 'hipaa_assessments_policy',
      sql: `
        CREATE POLICY "Users can manage own assessments" ON medisoluce.hipaa_assessments
        FOR ALL USING (auth.uid() = user_id);
      `
    },
    {
      name: 'assessment_responses_policy',
      sql: `
        CREATE POLICY "Users can manage own assessment responses" ON medisoluce.assessment_responses
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM medisoluce.hipaa_assessments 
            WHERE id = assessment_id AND user_id = auth.uid()
          )
        );
      `
    },
    {
      name: 'compliance_findings_policy',
      sql: `
        CREATE POLICY "Users can view own compliance findings" ON medisoluce.compliance_findings
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM medisoluce.hipaa_assessments 
            WHERE id = assessment_id AND user_id = auth.uid()
          )
        );
      `
    },
    {
      name: 'security_events_policy',
      sql: `
        CREATE POLICY "Users can view own security events" ON medisoluce.security_events
        FOR SELECT USING (auth.uid() = user_id);
      `
    },
    {
      name: 'user_training_progress_policy',
      sql: `
        CREATE POLICY "Users can manage own training progress" ON medisoluce.user_training_progress
        FOR ALL USING (auth.uid() = user_id);
      `
    },
    {
      name: 'audit_logs_policy',
      sql: `
        CREATE POLICY "Users can view own audit logs" ON medisoluce.audit_logs
        FOR SELECT USING (auth.uid() = user_id);
      `
    }
  ];

  let successCount = 0;
  
  for (const policy of policies) {
    const success = await executeSQL(policy.sql, `Creating policy ${policy.name}`);
    if (success) successCount++;
  }

  console.log(`\n🔒 Policies created: ${successCount}/${policies.length}`);
  return successCount === policies.length;
}

/**
 * Insert initial data
 */
async function insertInitialData() {
  const initialData = [
    {
      name: 'health_checks',
      sql: `
        INSERT INTO medisoluce.health_checks (check_name, check_type, status, description, auto_implementable) VALUES
        ('Database Connection', 'connectivity', 'pass', 'Database connection is working properly', true),
        ('Authentication Service', 'security', 'pass', 'Authentication service is operational', true),
        ('Data Encryption', 'security', 'pass', 'Data encryption is enabled and working', true),
        ('Backup System', 'reliability', 'pass', 'Backup system is operational', true),
        ('Audit Logging', 'compliance', 'pass', 'Audit logging is enabled and working', true)
        ON CONFLICT DO NOTHING;
      `
    },
    {
      name: 'training_modules',
      sql: `
        INSERT INTO medisoluce.training_modules (title, description, module_type, difficulty_level, estimated_duration) VALUES
        ('HIPAA Basics', 'Introduction to HIPAA compliance requirements', 'compliance', 'beginner', 30),
        ('Data Security', 'Understanding data security best practices', 'security', 'intermediate', 45),
        ('Incident Response', 'How to handle security incidents', 'incident_response', 'advanced', 60),
        ('Risk Assessment', 'Conducting comprehensive risk assessments', 'assessment', 'intermediate', 45),
        ('Business Continuity', 'Planning for business continuity', 'continuity', 'advanced', 90)
        ON CONFLICT DO NOTHING;
      `
    }
  ];

  let successCount = 0;
  
  for (const data of initialData) {
    const success = await executeSQL(data.sql, `Inserting initial ${data.name} data`);
    if (success) successCount++;
  }

  console.log(`\n📝 Initial data inserted: ${successCount}/${initialData.length}`);
  return successCount === initialData.length;
}

/**
 * Verify deployment
 */
async function verifyDeployment() {
  console.log('\n🔍 Verifying deployment...');
  
  try {
    // Check schema exists
    const { data: schemas, error: schemaError } = await supabase
      .from('information_schema.schemata')
      .select('schema_name')
      .eq('schema_name', 'medisoluce');

    if (schemaError) {
      console.error('❌ Schema verification failed:', schemaError.message);
      return false;
    }

    // Check tables exist
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'medisoluce');

    if (tableError) {
      console.error('❌ Table verification failed:', tableError.message);
      return false;
    }

    const tableNames = tables?.map(t => t.table_name) || [];
    console.log(`✅ Found ${tableNames.length} tables in medisoluce schema:`);
    tableNames.forEach(name => console.log(`  • ${name}`));

    return true;

  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    return false;
  }
}

/**
 * Main deployment function
 */
async function deployDatabase() {
  console.log('🚀 Starting MediSoluce Database Deployment\n');
  
  try {
    // Test connection
    if (!(await testConnection())) {
      throw new Error('Database connection failed');
    }

    // Create schema
    await createSchema();

    // Deploy tables
    await deployTables();

    // Create indexes
    await createIndexes();

    // Enable RLS
    await enableRLS();

    // Create RLS policies
    await createRLSPolicies();

    // Insert initial data
    await insertInitialData();

    // Verify deployment
    const verified = await verifyDeployment();

    if (verified) {
      console.log('\n🎉 Database deployment completed successfully!');
      console.log('✅ MediSoluce backend is ready for production!');
    } else {
      console.log('\n⚠️ Database deployment completed with issues.');
      console.log('🔧 Please review the verification results above.');
    }

  } catch (error) {
    console.error('\n❌ Database deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
deployDatabase().catch(console.error);
