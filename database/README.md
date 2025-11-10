# MediSoluce Healthcare Compliance Platform - Database Schema

## Overview

This document describes the database schema for the MediSoluce Healthcare Compliance Platform. The schema uses the `medisoluce` prefix to avoid conflicts with other projects in the same Supabase instance.

## Schema Structure

### Schema Prefix: `medisoluce`

All database objects (tables, views, functions, etc.) are prefixed with `medisoluce.` to ensure isolation from other projects sharing the same Supabase instance.

## Database Tables

### User Management

#### `medisoluce.user_profiles`
Stores user profile information for healthcare compliance platform users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users |
| email | VARCHAR(255) | User email address |
| full_name | VARCHAR(255) | User's full name |
| organization | VARCHAR(255) | Organization name |
| role | VARCHAR(100) | User role |
| department | VARCHAR(100) | Department |
| industry | VARCHAR(100) | Industry type |
| phone_number | VARCHAR(20) | Phone number (encrypted) |
| certifications | TEXT[] | Array of certifications |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| last_login | TIMESTAMP | Last login timestamp |
| is_active | BOOLEAN | Active status |
| preferences | JSONB | User preferences |

#### `medisoluce.user_preferences`
Stores user-specific preferences and settings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to user_profiles |
| theme | VARCHAR(20) | UI theme (light/dark/auto) |
| language | VARCHAR(10) | Language preference |
| timezone | VARCHAR(50) | User timezone |
| report_format | VARCHAR(20) | Report format preference |
| auto_save | BOOLEAN | Auto-save setting |
| assessment_reminders | BOOLEAN | Assessment reminder setting |
| email_notifications | BOOLEAN | Email notification setting |
| show_guidance_by_default | BOOLEAN | Show guidance setting |

### Compliance Assessments

#### `medisoluce.hipaa_assessments`
Stores HIPAA compliance assessments and evaluations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to user_profiles |
| assessment_name | VARCHAR(255) | Assessment name |
| assessment_type | VARCHAR(100) | Type of assessment |
| status | VARCHAR(50) | Assessment status |
| score | INTEGER | Assessment score |
| max_score | INTEGER | Maximum possible score |
| completion_percentage | DECIMAL(5,2) | Completion percentage |
| started_at | TIMESTAMP | Start timestamp |
| completed_at | TIMESTAMP | Completion timestamp |
| due_date | DATE | Due date |
| metadata | JSONB | Additional metadata |

#### `medisoluce.assessment_responses`
Stores individual responses to assessment questions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| assessment_id | UUID | Reference to hipaa_assessments |
| question_id | VARCHAR(255) | Question identifier |
| question_text | TEXT | Question text |
| response_value | TEXT | User response |
| response_type | VARCHAR(50) | Type of response |
| score | INTEGER | Question score |
| max_score | INTEGER | Maximum question score |
| is_required | BOOLEAN | Required question flag |
| answered_at | TIMESTAMP | Response timestamp |

#### `medisoluce.compliance_findings`
Stores compliance findings, gaps, and recommendations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| assessment_id | UUID | Reference to hipaa_assessments |
| finding_type | VARCHAR(100) | Type of finding |
| severity | VARCHAR(20) | Severity level |
| title | VARCHAR(255) | Finding title |
| description | TEXT | Finding description |
| recommendation | TEXT | Recommended action |
| priority | INTEGER | Priority level (1-5) |
| status | VARCHAR(50) | Finding status |
| assigned_to | UUID | Assigned user |
| due_date | DATE | Due date |
| resolved_at | TIMESTAMP | Resolution timestamp |

### Security and Audit

#### `medisoluce.security_events`
Logs security events and incidents.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to user_profiles |
| event_type | VARCHAR(100) | Type of security event |
| severity | VARCHAR(20) | Event severity |
| description | TEXT | Event description |
| ip_address | INET | Source IP address |
| user_agent | TEXT | User agent string |
| session_id | VARCHAR(255) | Session identifier |
| metadata | JSONB | Additional event data |
| created_at | TIMESTAMP | Event timestamp |

#### `medisoluce.security_threats`
Tracks security threats and their mitigation status.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| threat_type | VARCHAR(100) | Type of threat |
| severity | VARCHAR(20) | Threat severity |
| title | VARCHAR(255) | Threat title |
| description | TEXT | Threat description |
| status | VARCHAR(50) | Threat status |
| source | VARCHAR(255) | Threat source |
| affected_systems | TEXT[] | Affected systems |
| mitigation_actions | TEXT[] | Mitigation actions |
| created_at | TIMESTAMP | Detection timestamp |
| resolved_at | TIMESTAMP | Resolution timestamp |

### System Health and Monitoring

#### `medisoluce.health_checks`
Stores system health check results.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| check_name | VARCHAR(255) | Health check name |
| check_type | VARCHAR(100) | Type of check |
| status | VARCHAR(50) | Check status |
| value | DECIMAL(10,2) | Check value |
| threshold | DECIMAL(10,2) | Threshold value |
| unit | VARCHAR(50) | Value unit |
| description | TEXT | Check description |
| auto_implementable | BOOLEAN | Auto-fix capability |
| created_at | TIMESTAMP | Check timestamp |

#### `medisoluce.performance_metrics`
Stores performance metrics and measurements.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to user_profiles |
| metric_name | VARCHAR(255) | Metric name |
| metric_value | DECIMAL(10,4) | Metric value |
| metric_unit | VARCHAR(50) | Value unit |
| page_url | VARCHAR(500) | Page URL |
| user_agent | TEXT | User agent |
| session_id | VARCHAR(255) | Session ID |
| created_at | TIMESTAMP | Metric timestamp |

### Training and Education

#### `medisoluce.training_modules`
Stores training modules and educational content.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Module title |
| description | TEXT | Module description |
| module_type | VARCHAR(100) | Module type |
| difficulty_level | VARCHAR(20) | Difficulty level |
| estimated_duration | INTEGER | Duration in minutes |
| is_required | BOOLEAN | Required module flag |
| is_active | BOOLEAN | Active status |
| content | JSONB | Module content |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `medisoluce.user_training_progress`
Tracks user progress through training modules.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to user_profiles |
| module_id | UUID | Reference to training_modules |
| status | VARCHAR(50) | Progress status |
| progress_percentage | DECIMAL(5,2) | Completion percentage |
| score | DECIMAL(5,2) | Module score |
| started_at | TIMESTAMP | Start timestamp |
| completed_at | TIMESTAMP | Completion timestamp |
| last_accessed_at | TIMESTAMP | Last access timestamp |

### Audit and Compliance Tracking

#### `medisoluce.audit_logs`
Comprehensive audit trail for all user actions and system events.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to user_profiles |
| action | VARCHAR(100) | Action performed |
| resource_type | VARCHAR(100) | Resource type |
| resource_id | UUID | Resource identifier |
| old_values | JSONB | Previous values |
| new_values | JSONB | New values |
| ip_address | INET | Source IP address |
| user_agent | TEXT | User agent string |
| created_at | TIMESTAMP | Action timestamp |

#### `medisoluce.compliance_reports`
Stores generated compliance reports.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to user_profiles |
| report_type | VARCHAR(100) | Report type |
| report_name | VARCHAR(255) | Report name |
| report_data | JSONB | Report data |
| file_path | VARCHAR(500) | File path |
| generated_at | TIMESTAMP | Generation timestamp |
| expires_at | TIMESTAMP | Expiration timestamp |
| is_public | BOOLEAN | Public visibility |
| created_at | TIMESTAMP | Creation timestamp |

## Database Views

### `medisoluce.user_dashboard`
Aggregated view of user dashboard data including assessment counts, training progress, and performance metrics.

### `medisoluce.compliance_summary`
Organization-level compliance summary including assessment statistics and finding counts.

## Security Features

### Row Level Security (RLS)
All tables have Row Level Security enabled with policies that ensure:
- Users can only access their own data
- Admin users have appropriate access levels
- Sensitive data is properly protected

### Data Encryption
Sensitive fields are encrypted using the security wrapper functions:
- Phone numbers
- Certifications
- Personal identification information

### Audit Logging
All database operations are logged in the audit_logs table for compliance tracking.

## Migration Strategy

### Existing Data
If migrating from an existing system:
1. Run the schema creation script
2. Use the migration scripts to rename existing tables
3. Update application code to use new table names
4. Verify data integrity

### New Installations
1. Run the schema creation script
2. Run the initial migration
3. Verify all tables and policies are created correctly

## Usage Examples

### Using the Database Service

```typescript
import { DatabaseService, TABLES } from '@/lib/database';

// Create a user profile
const profile = await DatabaseService.createUserProfile({
  user_id: 'user-uuid',
  email: 'user@example.com',
  full_name: 'John Doe',
  organization: 'Healthcare Corp'
});

// Get user assessments
const assessments = await DatabaseService.getAssessments('user-uuid');

// Log a security event
await DatabaseService.logSecurityEvent({
  event_type: 'authentication',
  severity: 'low',
  description: 'User logged in successfully'
});
```

### Direct Supabase Queries

```typescript
import { supabase, getTableName } from '@/lib/supabase';

// Query with schema prefix
const { data, error } = await supabase
  .from(getTableName('user_profiles'))
  .select('*')
  .eq('user_id', userId);
```

## Maintenance

### Regular Tasks
- Monitor audit logs for suspicious activity
- Review and update security policies
- Clean up old performance metrics
- Archive completed assessments

### Backup Strategy
- Regular automated backups of the medisoluce schema
- Point-in-time recovery capabilities
- Cross-region backup replication

## Troubleshooting

### Common Issues
1. **Permission Denied**: Check RLS policies and user permissions
2. **Table Not Found**: Verify schema prefix is correct
3. **Encryption Errors**: Check security wrapper configuration

### Support
For database-related issues, refer to:
- Supabase documentation
- PostgreSQL documentation
- Internal database team

## Version History

- v1.0.0: Initial schema with medisoluce prefix
- v1.1.0: Added training modules and progress tracking
- v1.2.0: Enhanced security features and audit logging