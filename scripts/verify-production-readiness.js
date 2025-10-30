#!/usr/bin/env node

/**
 * Production Readiness Verification Script
 * 
 * This script verifies all critical aspects of production readiness
 * including build, security, configuration, and deployment readiness.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkmark(passed) {
  return passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
}

// Verification results
const results = {
  build: { passed: false, issues: [] },
  security: { passed: false, issues: [] },
  configuration: { passed: false, issues: [] },
  deployment: { passed: false, issues: [] },
};

console.log('\n' + '='.repeat(70));
log('🚀 MediSoluce Production Readiness Verification', 'cyan');
console.log('='.repeat(70) + '\n');

// 1. Build Verification
log('📦 Build Verification...', 'blue');
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  const hasIndexHtml = files.includes('index.html');
  const hasAssets = fs.existsSync(path.join(distDir, 'assets'));
  const hasServiceWorker = files.some(f => f.includes('sw.js') || f.includes('workbox'));
  
  if (hasIndexHtml && hasAssets) {
    results.build.passed = true;
    log(`  ${checkmark(true)} Build directory exists with required files`, 'green');
    
    // Check bundle sizes
    if (hasAssets) {
      const assetsDir = path.join(distDir, 'assets', 'js');
      if (fs.existsSync(assetsDir)) {
        const jsFiles = fs.readdirSync(assetsDir);
        const mainBundle = jsFiles.find(f => f.startsWith('index-'));
        if (mainBundle) {
          const bundlePath = path.join(assetsDir, mainBundle);
          const stats = fs.statSync(bundlePath);
          const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
          log(`  ${checkmark(true)} Main bundle size: ${sizeMB} MB`, 'green');
          
          if (stats.size > 5 * 1024 * 1024) {
            results.build.issues.push('Main bundle is larger than 5MB - consider code splitting');
          }
        }
      }
    }
    
    if (hasServiceWorker) {
      log(`  ${checkmark(true)} Service worker generated`, 'green');
    } else {
      results.build.issues.push('Service worker not found');
    }
  } else {
    results.build.issues.push('Missing required build files (index.html or assets)');
  }
} else {
  results.build.issues.push('Build directory (dist) does not exist - run npm run build:prod');
}

// 2. Security Configuration Verification
log('\n🔒 Security Configuration Verification...', 'blue');

// Check vercel.json security headers
const vercelJsonPath = path.join(rootDir, 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  const headers = vercelConfig.headers?.[0]?.headers || [];
  
  const requiredHeaders = [
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection',
  ];
  
  const presentHeaders = headers.map(h => h.key);
  const missingHeaders = requiredHeaders.filter(h => !presentHeaders.includes(h));
  
  if (missingHeaders.length === 0) {
    log(`  ${checkmark(true)} Vercel security headers configured`, 'green');
    results.security.passed = true;
  } else {
    results.security.issues.push(`Missing security headers in vercel.json: ${missingHeaders.join(', ')}`);
  }
} else {
  results.security.issues.push('vercel.json not found');
}

// Check netlify.toml security headers
const netlifyTomlPath = path.join(rootDir, 'netlify.toml');
if (fs.existsSync(netlifyTomlPath)) {
  const netlifyConfig = fs.readFileSync(netlifyTomlPath, 'utf8');
  const hasSecurityHeaders = netlifyConfig.includes('Content-Security-Policy') &&
                             netlifyConfig.includes('Strict-Transport-Security');
  
  if (hasSecurityHeaders) {
    log(`  ${checkmark(true)} Netlify security headers configured`, 'green');
    if (!results.security.passed) results.security.passed = true;
  } else {
    results.security.issues.push('Netlify security headers incomplete');
  }
}

// 3. Environment Configuration Verification
log('\n⚙️  Configuration Verification...', 'blue');

const envExamplePath = path.join(rootDir, '.env.example');
const envProdExamplePath = path.join(rootDir, '.env.production.example');

if (fs.existsSync(envExamplePath)) {
  log(`  ${checkmark(true)} .env.example exists`, 'green');
} else {
  results.configuration.issues.push('.env.example not found');
}

if (fs.existsSync(envProdExamplePath)) {
  log(`  ${checkmark(true)} .env.production.example exists`, 'green');
} else {
  results.configuration.issues.push('.env.production.example not found');
}

// Check Supabase configuration in code
const supabaseConfigPath = path.join(rootDir, 'src', 'lib', 'supabase.ts');
if (fs.existsSync(supabaseConfigPath)) {
  const supabaseConfig = fs.readFileSync(supabaseConfigPath, 'utf8');
  const hasSupabaseUrl = supabaseConfig.includes('VITE_SUPABASE_URL') || 
                         supabaseConfig.includes('nkgekxipzzvceesdjsrh');
  const hasAnonKey = supabaseConfig.includes('VITE_SUPABASE_ANON_KEY') ||
                     supabaseConfig.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  
  if (hasSupabaseUrl && hasAnonKey) {
    log(`  ${checkmark(true)} Supabase configuration found`, 'green');
    results.configuration.passed = true;
  } else {
    results.configuration.issues.push('Supabase configuration incomplete');
  }
}

// 4. Deployment Configuration Verification
log('\n🚀 Deployment Configuration Verification...', 'blue');

const deploymentConfigs = [
  { name: 'Vercel', file: 'vercel.json', exists: fs.existsSync(vercelJsonPath) },
  { name: 'Netlify', file: 'netlify.toml', exists: fs.existsSync(netlifyTomlPath) },
  { name: 'Docker', file: 'Dockerfile', exists: fs.existsSync(path.join(rootDir, 'Dockerfile')) },
];

deploymentConfigs.forEach(config => {
  if (config.exists) {
    log(`  ${checkmark(true)} ${config.name} configuration found`, 'green');
    results.deployment.passed = true;
  } else {
    results.deployment.issues.push(`${config.name} configuration (${config.file}) not found`);
  }
});

// Database schema verification
const schemaPath = path.join(rootDir, 'database', 'schema.sql');
if (fs.existsSync(schemaPath)) {
  log(`  ${checkmark(true)} Database schema file exists`, 'green');
} else {
  results.deployment.issues.push('Database schema.sql not found');
}

// 5. Package.json scripts verification
log('\n📜 Package Scripts Verification...', 'blue');
const packageJsonPath = path.join(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts || {};
  
  const requiredScripts = [
    'build:prod',
    'test',
    'deploy:vercel',
    'deploy:netlify',
  ];
  
  const missingScripts = requiredScripts.filter(s => !scripts[s]);
  
  if (missingScripts.length === 0) {
    log(`  ${checkmark(true)} All required scripts present`, 'green');
  } else {
    results.deployment.issues.push(`Missing scripts: ${missingScripts.join(', ')}`);
  }
}

// Summary
console.log('\n' + '='.repeat(70));
log('📊 Verification Summary', 'cyan');
console.log('='.repeat(70) + '\n');

const allCategories = [
  { name: 'Build', result: results.build },
  { name: 'Security', result: results.security },
  { name: 'Configuration', result: results.configuration },
  { name: 'Deployment', result: results.deployment },
];

allCategories.forEach(category => {
  const status = category.result.passed ? 'PASS' : 'FAIL';
  const color = category.result.passed ? 'green' : 'red';
  log(`${category.name}: ${status}`, color);
  
  if (category.result.issues.length > 0) {
    category.result.issues.forEach(issue => {
      log(`  ⚠️  ${issue}`, 'yellow');
    });
  }
});

const allPassed = allCategories.every(c => c.result.passed);
const totalIssues = allCategories.reduce((sum, c) => sum + c.result.issues.length, 0);

console.log('\n' + '='.repeat(70));
if (allPassed && totalIssues === 0) {
  log('✅ PRODUCTION READY - All checks passed!', 'green');
  process.exit(0);
} else {
  log(`⚠️  PRODUCTION READY WITH ISSUES - ${totalIssues} issue(s) found`, 'yellow');
  log('\nPlease review and fix the issues above before deploying to production.', 'yellow');
  process.exit(totalIssues === 0 ? 0 : 1);
}
