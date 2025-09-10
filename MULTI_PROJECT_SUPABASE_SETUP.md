# Multi-Project Supabase Setup Guide

## 🏗️ MediSoluce Healthcare Compliance Platform

This guide ensures your MediSoluce project is properly isolated from other projects sharing the same Supabase instance.

## ✅ Current Schema Isolation Status

Your MediSoluce project is **ALREADY PROPERLY CONFIGURED** for multi-project Supabase usage with the following isolation measures:

### 1. Schema Prefixing ✅
- **Custom Schema**: `medisoluce` (separate from `public`)
- **All Tables**: Prefixed with `medisoluce.` (e.g., `medisoluce.user_profiles`)
- **All Functions**: Namespaced under `medisoluce` schema
- **All Views**: Scoped to `medisoluce` schema

### 2. Database Objects Isolation ✅
- **Tables**: 12 tables all in `medisoluce` schema
- **Indexes**: Prefixed with `medisoluce_` pattern
- **Policies**: Scoped to `medisoluce` tables only
- **Functions**: Namespaced under `medisoluce` schema

### 3. Application Code Isolation ✅
- **Supabase Client**: Uses schema prefixing wrapper
- **Database Service**: All operations use `medisoluce.` prefix
- **Type Safety**: Full TypeScript support for isolated schema

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env.production.local` file with:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Analytics and Monitoring
VITE_GA_TRACKING_ID=your-ga-id
VITE_SENTRY_DSN=your-sentry-dsn
```

### Supabase Project Setup

1. **Create New Supabase Project** (if not exists):
   ```bash
   # Go to https://supabase.com/dashboard
   # Click "New Project"
   # Choose organization
   # Set project name: "medisoluce-healthcare-compliance"
   ```

2. **Run Database Schema**:
   ```bash
   # Connect to your Supabase project
   # Go to SQL Editor
   # Run the schema.sql file
   ```

3. **Verify Schema Creation**:
   ```sql
   -- Check schema exists
   SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'medisoluce';
   
   -- Check tables are created
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'medisoluce';
   ```

## 🛡️ Security Configuration

### Row Level Security (RLS)

All tables have RLS enabled with user-scoped policies:

```sql
-- Example: Users can only access their own data
CREATE POLICY "Users can view own profile" ON medisoluce.user_profiles
    FOR SELECT USING (auth.uid() = user_id);
```

### Data Encryption

Sensitive fields are automatically encrypted:
- Phone numbers
- Certifications
- Personal identification data

### Audit Logging

All database operations are logged in `medisoluce.audit_logs`.

## 📊 Database Schema Overview

### Core Tables (medisoluce schema)

| Table | Purpose | RLS Enabled |
|-------|---------|-------------|
| `user_profiles` | User account information | ✅ |
| `user_preferences` | User settings | ✅ |
| `hipaa_assessments` | Compliance assessments | ✅ |
| `assessment_responses` | Assessment answers | ✅ |
| `compliance_findings` | Compliance gaps/findings | ✅ |
| `security_events` | Security event logging | ✅ |
| `security_threats` | Threat tracking | ✅ |
| `health_checks` | System health monitoring | ✅ |
| `performance_metrics` | Performance data | ✅ |
| `training_modules` | Training content | ✅ |
| `user_training_progress` | Training progress | ✅ |
| `audit_logs` | Audit trail | ✅ |
| `compliance_reports` | Generated reports | ✅ |

## 🚀 Deployment Steps

### 1. Pre-Deployment Checklist

```bash
# Run pre-deployment checks
npm run pre-deploy

# Build the application
npm run build

# Test locally
npm run preview
```

### 2. Environment Setup

1. **Create Production Environment File**:
   ```bash
   cp .env.example .env.production.local
   # Edit with your Supabase credentials
   ```

2. **Configure Supabase**:
   - Set up authentication providers
   - Configure email templates
   - Set up storage buckets (if needed)

### 3. Deploy to Production

**Vercel (Recommended)**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

**Netlify**:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 🔍 Verification Steps

### 1. Schema Isolation Check

```sql
-- Verify no conflicts with other projects
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles', 'assessments', 'security_events'
);

-- Should return empty (no conflicts)
```

### 2. Application Testing

```typescript
// Test database operations
import { DatabaseService } from '@/lib/database';

// This should work without conflicts
const profile = await DatabaseService.createUserProfile({
  user_id: 'test-user',
  email: 'test@example.com'
});
```

### 3. Security Verification

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'medisoluce';

-- Verify encryption is working
SELECT phone_number FROM medisoluce.user_profiles LIMIT 1;
-- Should show encrypted data
```

## 🚨 Conflict Prevention

### What's Protected

1. **Table Names**: All prefixed with `medisoluce.`
2. **Schema**: Isolated in `medisoluce` schema
3. **Functions**: Namespaced under `medisoluce`
4. **Views**: Scoped to `medisoluce` schema
5. **Indexes**: Prefixed with `medisoluce_`

### Best Practices

1. **Never use `public` schema** for project-specific tables
2. **Always use schema prefixing** in queries
3. **Test in isolation** before deploying
4. **Monitor for conflicts** in shared Supabase instance

## 🔧 Troubleshooting

### Common Issues

**Issue**: "Table doesn't exist"
```sql
-- Check if using correct schema
SELECT * FROM medisoluce.user_profiles; -- ✅ Correct
SELECT * FROM user_profiles; -- ❌ Wrong (no schema)
```

**Issue**: "Permission denied"
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

**Issue**: "Schema not found"
```sql
-- Verify schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'medisoluce';
```

### Support Commands

```bash
# Check build status
npm run build

# Run tests
npm run test

# Check deployment readiness
npm run pre-deploy
```

## 📈 Monitoring

### Key Metrics to Monitor

1. **Database Performance**: Query execution times
2. **Security Events**: Failed authentication attempts
3. **User Activity**: Assessment completions
4. **System Health**: Performance metrics

### Alerts to Set Up

1. **High Error Rate**: >5% error rate
2. **Security Threats**: Any high-severity events
3. **Performance Degradation**: >3s response times
4. **Storage Usage**: >80% capacity

## 🎯 Next Steps

1. ✅ **Schema is properly isolated** - No changes needed
2. ✅ **Application code uses schema prefixing** - No changes needed
3. ✅ **Security policies are in place** - No changes needed
4. 🔄 **Deploy to production** - Follow deployment steps above
5. 🔄 **Monitor and maintain** - Use monitoring guidelines

## 📞 Support

For issues related to:
- **Database conflicts**: Check schema isolation
- **Deployment issues**: Review environment variables
- **Security concerns**: Verify RLS policies
- **Performance problems**: Check query optimization

---

**Status**: ✅ **READY FOR MULTI-PROJECT DEPLOYMENT**

Your MediSoluce project is fully configured for safe deployment alongside other projects in the same Supabase instance.