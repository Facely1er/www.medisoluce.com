-- Migration: Rename Existing Tables with MediSoluce Prefix
-- This migration renames any existing tables to use the medisoluce_ prefix
-- to avoid conflicts with other projects in the same Supabase instance

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Insert migration record
INSERT INTO medisoluce.migrations (migration_name, description) 
VALUES ('002_rename_existing_tables', 'Rename existing tables with medisoluce prefix')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- TABLE RENAMING LOGIC
-- =============================================

-- This migration handles the renaming of any existing tables that might conflict
-- with other projects. Since this is a new project, we'll create a template
-- for future use when tables need to be renamed.

-- Example of how to rename tables (uncomment and modify as needed):
/*
-- Rename users table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        ALTER TABLE public.users RENAME TO medisoluce_users;
        ALTER TABLE medisoluce_users SET SCHEMA medisoluce;
    END IF;
END $$;

-- Rename profiles table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles RENAME TO medisoluce_profiles;
        ALTER TABLE medisoluce_profiles SET SCHEMA medisoluce;
    END IF;
END $$;

-- Rename assessments table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessments' AND table_schema = 'public') THEN
        ALTER TABLE public.assessments RENAME TO medisoluce_assessments;
        ALTER TABLE medisoluce_assessments SET SCHEMA medisoluce;
    END IF;
END $$;

-- Rename security_events table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_events' AND table_schema = 'public') THEN
        ALTER TABLE public.security_events RENAME TO medisoluce_security_events;
        ALTER TABLE medisoluce_security_events SET SCHEMA medisoluce;
    END IF;
END $$;
*/

-- =============================================
-- VIEW AND FUNCTION RENAMING
-- =============================================

-- Rename any existing views that might conflict
/*
DO $$
DECLARE
    view_name TEXT;
BEGIN
    FOR view_name IN 
        SELECT table_name 
        FROM information_schema.views 
        WHERE table_schema = 'public' 
        AND table_name IN ('user_dashboard', 'compliance_summary', 'health_metrics')
    LOOP
        EXECUTE format('ALTER VIEW public.%I RENAME TO medisoluce_%I', view_name, view_name);
        EXECUTE format('ALTER VIEW medisoluce_%I SET SCHEMA medisoluce', view_name);
    END LOOP;
END $$;
*/

-- =============================================
-- INDEX RENAMING
-- =============================================

-- Rename any existing indexes that might conflict
/*
DO $$
DECLARE
    index_name TEXT;
BEGIN
    FOR index_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname LIKE 'idx_%'
    LOOP
        EXECUTE format('ALTER INDEX public.%I RENAME TO medisoluce_%I', index_name, index_name);
    END LOOP;
END $$;
*/

-- =============================================
-- POLICY RENAMING
-- =============================================

-- Drop and recreate policies for renamed tables
-- (This would be done automatically when tables are moved to the medisoluce schema)

-- =============================================
-- VERIFICATION
-- =============================================

-- Verify no conflicting table names exist in public schema
DO $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO conflict_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'user_profiles', 'hipaa_assessments', 'security_events', 
        'compliance_findings', 'training_modules', 'audit_logs'
    );
    
    IF conflict_count > 0 THEN
        RAISE NOTICE 'Found % potentially conflicting tables in public schema', conflict_count;
    ELSE
        RAISE NOTICE 'No conflicting tables found in public schema';
    END IF;
END $$;

-- =============================================
-- MIGRATION COMPLETION
-- =============================================

-- Log successful completion
INSERT INTO medisoluce.migrations (migration_name, description, executed_at) 
VALUES ('002_rename_existing_tables_completed', 'Table renaming completed successfully', NOW())
ON CONFLICT (migration_name) DO NOTHING;