#!/bin/bash

# MediSoluce Database Deployment Script
# This script deploys the database schema to Supabase with proper prefixing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCHEMA_FILE="schema.sql"
MIGRATIONS_DIR="migrations"
BACKUP_DIR="backups"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is installed
check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        log_error "Supabase CLI is not installed. Please install it first:"
        echo "npm install -g supabase"
        exit 1
    fi
    log_success "Supabase CLI is available"
}

# Check if we're in a Supabase project
check_supabase_project() {
    if [ ! -f "supabase/config.toml" ]; then
        log_error "Not in a Supabase project directory. Please run 'supabase init' first."
        exit 1
    fi
    log_success "Supabase project detected"
}

# Create backup directory
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi
}

# Backup existing schema
backup_existing_schema() {
    log_info "Creating backup of existing schema..."
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$BACKUP_DIR/schema_backup_$timestamp.sql"
    
    if supabase db dump --schema medisoluce > "$backup_file" 2>/dev/null; then
        log_success "Schema backup created: $backup_file"
    else
        log_warning "No existing medisoluce schema found, skipping backup"
    fi
}

# Deploy schema
deploy_schema() {
    log_info "Deploying MediSoluce schema..."
    
    if [ ! -f "$SCHEMA_FILE" ]; then
        log_error "Schema file not found: $SCHEMA_FILE"
        exit 1
    fi
    
    # Apply schema
    if supabase db reset --db-url "$DATABASE_URL" < "$SCHEMA_FILE"; then
        log_success "Schema deployed successfully"
    else
        log_error "Failed to deploy schema"
        exit 1
    fi
}

# Run migrations
run_migrations() {
    log_info "Running migrations..."
    
    if [ ! -d "$MIGRATIONS_DIR" ]; then
        log_warning "No migrations directory found, skipping migrations"
        return
    fi
    
    for migration in "$MIGRATIONS_DIR"/*.sql; do
        if [ -f "$migration" ]; then
            log_info "Running migration: $(basename "$migration")"
            if supabase db reset --db-url "$DATABASE_URL" < "$migration"; then
                log_success "Migration completed: $(basename "$migration")"
            else
                log_error "Migration failed: $(basename "$migration")"
                exit 1
            fi
        fi
    done
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check if schema exists
    if supabase db dump --schema medisoluce | grep -q "CREATE SCHEMA medisoluce"; then
        log_success "MediSoluce schema exists"
    else
        log_error "MediSoluce schema not found"
        exit 1
    fi
    
    # Check if key tables exist
    local required_tables=("user_profiles" "hipaa_assessments" "security_events" "training_modules")
    for table in "${required_tables[@]}"; do
        if supabase db dump --schema medisoluce | grep -q "CREATE TABLE.*$table"; then
            log_success "Table $table exists"
        else
            log_error "Table $table not found"
            exit 1
        fi
    done
}

# Generate environment file
generate_env_file() {
    log_info "Generating environment configuration..."
    
    cat > .env.database << EOF
# MediSoluce Database Configuration
# Generated on $(date)

# Database Schema
DATABASE_SCHEMA=medisoluce

# Table Prefixes
TABLE_PREFIX=medisoluce

# Security Settings
ENABLE_ROW_LEVEL_SECURITY=true
ENABLE_DATA_ENCRYPTION=true

# Migration Settings
MIGRATION_TABLE=medisoluce.migrations
AUTO_MIGRATE=true

# Backup Settings
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE="0 2 * * *"

# Monitoring
ENABLE_AUDIT_LOGGING=true
ENABLE_PERFORMANCE_MONITORING=true
EOF

    log_success "Environment file generated: .env.database"
}

# Main deployment function
main() {
    log_info "Starting MediSoluce database deployment..."
    
    # Check prerequisites
    check_supabase_cli
    check_supabase_project
    
    # Setup
    create_backup_dir
    backup_existing_schema
    
    # Deploy
    deploy_schema
    run_migrations
    
    # Verify
    verify_deployment
    
    # Generate config
    generate_env_file
    
    log_success "MediSoluce database deployment completed successfully!"
    log_info "Next steps:"
    echo "1. Update your application to use the new schema prefix"
    echo "2. Test all database operations"
    echo "3. Update your Supabase dashboard to view the new schema"
    echo "4. Configure monitoring and alerts"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "backup")
        check_supabase_cli
        check_supabase_project
        create_backup_dir
        backup_existing_schema
        ;;
    "verify")
        check_supabase_cli
        check_supabase_project
        verify_deployment
        ;;
    "help")
        echo "Usage: $0 [deploy|backup|verify|help]"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy the complete database schema (default)"
        echo "  backup  - Create a backup of existing schema"
        echo "  verify  - Verify the deployment"
        echo "  help    - Show this help message"
        ;;
    *)
        log_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac