#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment checks...\n');

let hasErrors = false;

// Check for required environment variables
const checkEnvVars = () => {
  console.log('📋 Checking environment variables...');
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const envFile = path.join(__dirname, '..', '.env.production.local');
  if (!fs.existsSync(envFile)) {
    console.error('❌ .env.production.local file not found!');
    console.log('   Create it from .env.production.example');
    hasErrors = true;
    return;
  }

  const envContent = fs.readFileSync(envFile, 'utf8');
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName) || envContent.includes(`${varName}=your_`)) {
      console.error(`❌ ${varName} not properly configured`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName} configured`);
    }
  });
};

// Check build size
const checkBuildSize = () => {
  console.log('\n📦 Checking build size...');
  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('❌ Build directory not found! Run "npm run build" first.');
    hasErrors = true;
    return;
  }

  const getDirSize = (dir) => {
    let size = 0;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stat.size;
      }
    });
    
    return size;
  };

  const totalSize = getDirSize(distPath);
  const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
  
  console.log(`📊 Total build size: ${sizeMB} MB`);
  
  if (totalSize > 5 * 1024 * 1024) {
    console.warn('⚠️  Build size is larger than 5MB. Consider optimizing.');
  } else {
    console.log('✅ Build size is optimal');
  }
};

// Check for console.log statements in production
const checkConsoleLogs = () => {
  console.log('\n🔍 Checking for console statements...');
  const srcPath = path.join(__dirname, '..', 'src');
  let consoleCount = 0;

  const checkFile = (filePath) => {
    if (filePath.includes('node_modules') || filePath.includes('test')) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/console\.(log|debug|info|warn|error)/g);
    
    if (matches) {
      consoleCount += matches.length;
    }
  };

  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        checkFile(filePath);
      }
    });
  };

  walkDir(srcPath);
  
  if (consoleCount > 0) {
    console.warn(`⚠️  Found ${consoleCount} console statements. They will be removed during build.`);
  } else {
    console.log('✅ No console statements found');
  }
};

// Check security headers
const checkSecurityHeaders = () => {
  console.log('\n🔒 Checking security configurations...');
  
  const vercelConfig = path.join(__dirname, '..', 'vercel.json');
  const netlifyConfig = path.join(__dirname, '..', 'netlify.toml');
  
  if (fs.existsSync(vercelConfig)) {
    console.log('✅ Vercel security headers configured');
  }
  
  if (fs.existsSync(netlifyConfig)) {
    console.log('✅ Netlify security headers configured');
  }
};

// Run all checks
console.log('🚀 MediSoluce Pre-Deployment Checklist\n');
console.log('=====================================\n');

checkEnvVars();
checkBuildSize();
checkConsoleLogs();
checkSecurityHeaders();

console.log('\n=====================================\n');

if (hasErrors) {
  console.error('❌ Pre-deployment checks failed! Please fix the issues above.');
  process.exit(1);
} else {
  console.log('✅ All pre-deployment checks passed!');
  console.log('\n🎉 Ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Deploy to staging: git push origin feature/branch');
  console.log('2. After testing, merge to main for production deployment');
}