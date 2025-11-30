-- MediSoluce Healthcare Compliance Platform Database Schema
-- This schema uses the 'medisoluce_' prefix to avoid conflicts with other projects
-- in the same Supabase instance

-- Enable necessary extensions
-- Note: gen_random_uuid() is built-in to PostgreSQL 13+ and Supabase
-- uuid-ossp extension not needed if using gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom schema for better organization
CREATE SCHEMA IF NOT EXISTS medisoluce;

-- Set search path to include our custom schema
SET search_path TO medisoluce, public;

-- =============================================
-- USER MANAGEMENT TABLES
-- =============================================

-- User profiles table
CREATE TABLE IF NOT EXISTS medisoluce.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    organization VARCHAR(255),
    role VARCHAR(100),
    department VARCHAR(100),
    industry VARCHAR(100),
    phone_number VARCHAR(20),
    certifications TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'::jsonb
);

-- User preferences table
CREATE TABLE IF NOT EXISTS medisoluce.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- =============================================
-- COMPLIANCE ASSESSMENT TABLES
-- =============================================

-- HIPAA compliance assessments
CREATE TABLE IF NOT EXISTS medisoluce.hipaa_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Assessment responses
CREATE TABLE IF NOT EXISTS medisoluce.assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES medisoluce.hipaa_assessments(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    question_text TEXT NOT NULL,
    response_value TEXT,
    response_type VARCHAR(50) CHECK (response_type IN ('text', 'number', 'boolean', 'multiple_choice', 'rating')),
    score INTEGER,
    max_score INTEGER,
    is_required BOOLEAN DEFAULT false,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance findings and recommendations
CREATE TABLE IF NOT EXISTS medisoluce.compliance_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES medisoluce.hipaa_assessments(id) ON DELETE CASCADE,
    finding_type VARCHAR(100) NOT NULL CHECK (finding_type IN ('gap', 'violation', 'recommendation', 'best_practice')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT,
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES medisoluce.user_profiles(user_id),
    due_date DATE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SECURITY AND AUDIT TABLES
-- =============================================

-- Security events log
CREATE TABLE IF NOT EXISTS medisoluce.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL CHECK (event_type IN ('authentication', 'data_access', 'suspicious_input', 'failed_auth', 'csp_violation', 'privacy_violation', 'malware_detected', 'injection_attempt')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security threats
CREATE TABLE IF NOT EXISTS medisoluce.security_threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    threat_type VARCHAR(100) NOT NULL CHECK (threat_type IN ('malware', 'phishing', 'injection', 'data_breach', 'unauthorized_access', 'privacy_violation')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'mitigated', 'resolved')),
    source VARCHAR(255),
    affected_systems TEXT[],
    mitigation_actions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SYSTEM HEALTH AND MONITORING TABLES
-- =============================================

-- System health checks
CREATE TABLE IF NOT EXISTS medisoluce.health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_name VARCHAR(255) NOT NULL,
    check_type VARCHAR(100) NOT NULL CHECK (check_type IN ('performance', 'security', 'compliance', 'accessibility', 'connectivity')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('pass', 'warning', 'fail', 'unknown')),
    value DECIMAL(10,2),
    threshold DECIMAL(10,2),
    unit VARCHAR(50),
    description TEXT,
    auto_implementable BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS medisoluce.performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE SET NULL,
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_unit VARCHAR(50),
    page_url VARCHAR(500),
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TRAINING AND EDUCATION TABLES
-- =============================================

-- Training modules
CREATE TABLE IF NOT EXISTS medisoluce.training_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module_type VARCHAR(100) NOT NULL CHECK (module_type IN ('hipaa', 'security', 'compliance', 'general')),
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_duration INTEGER, -- in minutes
    is_required BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    content JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User training progress
CREATE TABLE IF NOT EXISTS medisoluce.user_training_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE CASCADE,
    module_id UUID REFERENCES medisoluce.training_modules(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    score DECIMAL(5,2),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- =============================================
-- AUDIT AND COMPLIANCE TRACKING TABLES
-- =============================================

-- Audit logs
CREATE TABLE IF NOT EXISTS medisoluce.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance reports
CREATE TABLE IF NOT EXISTS medisoluce.compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES medisoluce.user_profiles(user_id) ON DELETE CASCADE,
    report_type VARCHAR(100) NOT NULL CHECK (report_type IN ('hipaa_assessment', 'security_audit', 'training_completion', 'system_health', 'compliance_summary')),
    report_name VARCHAR(255) NOT NULL,
    report_data JSONB NOT NULL,
    file_path VARCHAR(500),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON medisoluce.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON medisoluce.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization ON medisoluce.user_profiles(organization);

-- Assessment indexes
CREATE INDEX IF NOT EXISTS idx_hipaa_assessments_user_id ON medisoluce.hipaa_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_hipaa_assessments_status ON medisoluce.hipaa_assessments(status);
CREATE INDEX IF NOT EXISTS idx_hipaa_assessments_created_at ON medisoluce.hipaa_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_assessment_id ON medisoluce.assessment_responses(assessment_id);

-- Security indexes
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON medisoluce.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON medisoluce.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON medisoluce.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_threats_status ON medisoluce.security_threats(status);

-- Health check indexes
CREATE INDEX IF NOT EXISTS idx_health_checks_check_type ON medisoluce.health_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_health_checks_status ON medisoluce.health_checks(status);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_name ON medisoluce.performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON medisoluce.performance_metrics(created_at);

-- Training indexes
CREATE INDEX IF NOT EXISTS idx_user_training_progress_user_id ON medisoluce.user_training_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_training_progress_module_id ON medisoluce.user_training_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_training_progress_status ON medisoluce.user_training_progress(status);

-- Audit indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON medisoluce.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON medisoluce.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON medisoluce.audit_logs(created_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE medisoluce.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.hipaa_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.compliance_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.security_threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.user_training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medisoluce.compliance_reports ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON medisoluce.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON medisoluce.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON medisoluce.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON medisoluce.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Assessment policies
CREATE POLICY "Users can manage own assessments" ON medisoluce.hipaa_assessments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own assessment responses" ON medisoluce.assessment_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM medisoluce.hipaa_assessments 
            WHERE id = assessment_id AND user_id = auth.uid()
        )
    );

-- Security events policies (admin only for viewing, users can insert their own)
CREATE POLICY "Users can insert own security events" ON medisoluce.security_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Training progress policies
CREATE POLICY "Users can manage own training progress" ON medisoluce.user_training_progress
    FOR ALL USING (auth.uid() = user_id);

-- Audit logs policies (read-only for users)
CREATE POLICY "Users can view own audit logs" ON medisoluce.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Compliance reports policies
CREATE POLICY "Users can manage own compliance reports" ON medisoluce.compliance_reports
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION medisoluce.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON medisoluce.user_profiles
    FOR EACH ROW EXECUTE FUNCTION medisoluce.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON medisoluce.user_preferences
    FOR EACH ROW EXECUTE FUNCTION medisoluce.update_updated_at_column();

CREATE TRIGGER update_hipaa_assessments_updated_at BEFORE UPDATE ON medisoluce.hipaa_assessments
    FOR EACH ROW EXECUTE FUNCTION medisoluce.update_updated_at_column();

CREATE TRIGGER update_compliance_findings_updated_at BEFORE UPDATE ON medisoluce.compliance_findings
    FOR EACH ROW EXECUTE FUNCTION medisoluce.update_updated_at_column();

CREATE TRIGGER update_security_threats_updated_at BEFORE UPDATE ON medisoluce.security_threats
    FOR EACH ROW EXECUTE FUNCTION medisoluce.update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON medisoluce.training_modules
    FOR EACH ROW EXECUTE FUNCTION medisoluce.update_updated_at_column();

CREATE TRIGGER update_user_training_progress_updated_at BEFORE UPDATE ON medisoluce.user_training_progress
    FOR EACH ROW EXECUTE FUNCTION medisoluce.update_updated_at_column();

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- User dashboard view
CREATE OR REPLACE VIEW medisoluce.user_dashboard AS
SELECT 
    up.id,
    up.user_id,
    up.full_name,
    up.organization,
    up.role,
    up.last_login,
    up.is_active,
    COUNT(DISTINCT ha.id) as total_assessments,
    COUNT(DISTINCT CASE WHEN ha.status = 'completed' THEN ha.id END) as completed_assessments,
    COUNT(DISTINCT utp.id) as training_modules_started,
    COUNT(DISTINCT CASE WHEN utp.status = 'completed' THEN utp.id END) as training_modules_completed,
    AVG(ha.score) as average_assessment_score
FROM medisoluce.user_profiles up
LEFT JOIN medisoluce.hipaa_assessments ha ON up.user_id = ha.user_id
LEFT JOIN medisoluce.user_training_progress utp ON up.user_id = utp.user_id
GROUP BY up.id, up.user_id, up.full_name, up.organization, up.role, up.last_login, up.is_active;

-- Compliance summary view
CREATE OR REPLACE VIEW medisoluce.compliance_summary AS
SELECT 
    up.organization,
    COUNT(DISTINCT ha.id) as total_assessments,
    COUNT(DISTINCT CASE WHEN ha.status = 'completed' THEN ha.id END) as completed_assessments,
    AVG(ha.score) as average_score,
    COUNT(DISTINCT cf.id) as total_findings,
    COUNT(DISTINCT CASE WHEN cf.status = 'open' THEN cf.id END) as open_findings,
    COUNT(DISTINCT CASE WHEN cf.severity = 'critical' AND cf.status = 'open' THEN cf.id END) as critical_findings
FROM medisoluce.user_profiles up
LEFT JOIN medisoluce.hipaa_assessments ha ON up.user_id = ha.user_id
LEFT JOIN medisoluce.compliance_findings cf ON ha.id = cf.assessment_id
GROUP BY up.organization;

-- =============================================
-- INITIAL DATA SEEDING
-- =============================================

-- Insert default training modules
INSERT INTO medisoluce.training_modules (title, description, module_type, difficulty_level, estimated_duration, is_required) VALUES
('HIPAA Basics', 'Introduction to HIPAA compliance requirements and best practices', 'hipaa', 'beginner', 30, true),
('Security Awareness', 'Healthcare security awareness and threat recognition', 'security', 'beginner', 45, true),
('Privacy Protection', 'Patient privacy protection and data handling procedures', 'compliance', 'intermediate', 60, true),
('Incident Response', 'How to respond to security incidents and data breaches', 'security', 'advanced', 90, false),
('Advanced Compliance', 'Advanced HIPAA compliance strategies and implementation', 'hipaa', 'expert', 120, false)
ON CONFLICT DO NOTHING;

-- Insert default health checks
INSERT INTO medisoluce.health_checks (check_name, check_type, status, value, threshold, unit, description, auto_implementable) VALUES
('Page Load Time', 'performance', 'pass', 0, 3000, 'ms', 'Average page load time should be under 3 seconds', true),
('Security Headers', 'security', 'pass', 0, 1, 'count', 'Essential security headers should be present', true),
('Accessibility Score', 'accessibility', 'pass', 0, 90, 'percent', 'WCAG accessibility compliance score', true),
('HIPAA Compliance', 'compliance', 'pass', 0, 100, 'percent', 'Overall HIPAA compliance score', false),
('System Connectivity', 'connectivity', 'pass', 0, 1, 'boolean', 'System connectivity and availability', true)
ON CONFLICT DO NOTHING;

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON SCHEMA medisoluce IS 'MediSoluce Healthcare Compliance Platform - Isolated schema to prevent conflicts with other projects';
COMMENT ON TABLE medisoluce.user_profiles IS 'User profile information for healthcare compliance platform users';
COMMENT ON TABLE medisoluce.hipaa_assessments IS 'HIPAA compliance assessments and evaluations';
COMMENT ON TABLE medisoluce.security_events IS 'Security event logging and monitoring';
COMMENT ON TABLE medisoluce.compliance_findings IS 'Compliance findings, gaps, and recommendations';
COMMENT ON TABLE medisoluce.training_modules IS 'Training modules and educational content';
COMMENT ON TABLE medisoluce.audit_logs IS 'Audit trail for all user actions and system events';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA medisoluce TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA medisoluce TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA medisoluce TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA medisoluce TO authenticated;