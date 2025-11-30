-- Migration: Initial MediSoluce Schema Setup
-- This migration creates the initial database schema with proper prefixes
-- to avoid conflicts with other projects in the same Supabase instance

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS medisoluce.migrations (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checksum VARCHAR(64),
    description TEXT
);

-- Insert this migration record
INSERT INTO medisoluce.migrations (migration_name, description) 
VALUES ('001_initial_schema_setup', 'Initial MediSoluce schema setup with proper prefixes')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- SCHEMA CREATION
-- =============================================

-- The main schema is defined in schema.sql
-- This migration file serves as a placeholder for future migrations
-- and ensures the migration tracking system is in place

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify schema exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'medisoluce') THEN
        RAISE EXCEPTION 'MediSoluce schema not found. Please run schema.sql first.';
    END IF;
END $$;

-- Verify key tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'medisoluce' 
    AND table_name IN ('user_profiles', 'hipaa_assessments', 'security_events');
    
    IF table_count < 3 THEN
        RAISE EXCEPTION 'Required tables not found in medisoluce schema. Please run schema.sql first.';
    END IF;
END $$;

-- =============================================
-- MIGRATION COMPLETION
-- =============================================

-- Log successful completion
INSERT INTO medisoluce.migrations (migration_name, description, executed_at) 
VALUES ('001_initial_schema_setup_completed', 'Initial schema setup completed successfully', NOW())
ON CONFLICT (migration_name) DO NOTHING;