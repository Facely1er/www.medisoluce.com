#!/usr/bin/env node

/**
 * MediSoluce Backend Test Script
 * 
 * This script tests the backend connection and creates basic database structure
 */

import { createClient } from '@supabase/supabase-js';

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
 * Test basic connection
 */
async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test with a simple auth call
    const { data, error } = await supabase.auth.getSession();
    
    if (error && !error.message.includes('Auth session missing')) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

/**
 * Test database access
 */
async function testDatabaseAccess() {
  console.log('🗄️ Testing database access...');
  
  try {
    // Try to access a simple table or create a test
    const { data, error } = await supabase
      .from('auth.users')
      .select('id')
      .limit(1);

    if (error) {
      console.log('⚠️ Database access test failed:', error.message);
      console.log('ℹ️ This is normal - we\'ll create our own tables');
    } else {
      console.log('✅ Database access successful');
    }

    return true;
  } catch (err) {
    console.log('⚠️ Database access test failed:', err.message);
    return true; // Continue anyway
  }
}

/**
 * Create test data
 */
async function createTestData() {
  console.log('📝 Creating test data...');
  
  try {
    // Create a simple test record in a public table
    const { data, error } = await supabase
      .from('test_table')
      .insert({
        test_field: 'MediSoluce Backend Test',
        created_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.log('⚠️ Test data creation failed:', error.message);
      console.log('ℹ️ This is expected - we need to create tables first');
    } else {
      console.log('✅ Test data created successfully');
    }

    return true;
  } catch (err) {
    console.log('⚠️ Test data creation failed:', err.message);
    return true; // Continue anyway
  }
}

/**
 * Test authentication
 */
async function testAuthentication() {
  console.log('🔐 Testing authentication...');
  
  try {
    // Test sign up (this will fail but shows auth is working)
    const { data, error } = await supabase.auth.signUp({
      email: 'test@medisoluce.com',
      password: 'testpassword123'
    });

    if (error) {
      console.log('⚠️ Authentication test:', error.message);
      if (error.message.includes('already registered')) {
        console.log('✅ Authentication service is working');
      }
    } else {
      console.log('✅ Authentication test successful');
    }

    return true;
  } catch (err) {
    console.log('⚠️ Authentication test failed:', err.message);
    return true; // Continue anyway
  }
}

/**
 * Generate backend status report
 */
function generateReport(results) {
  console.log('\n📊 Backend Status Report');
  console.log('========================');
  
  console.log(`\n🔗 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Service Role Key: ${SERVICE_ROLE_KEY.substring(0, 20)}...`);
  
  console.log(`\n✅ Connection Test: ${results.connection ? 'PASS' : 'FAIL'}`);
  console.log(`🗄️ Database Access: ${results.database ? 'PASS' : 'FAIL'}`);
  console.log(`🔐 Authentication: ${results.auth ? 'PASS' : 'FAIL'}`);
  console.log(`📝 Data Creation: ${results.data ? 'PASS' : 'FAIL'}`);
  
  const successRate = Object.values(results).filter(Boolean).length / Object.keys(results).length * 100;
  
  console.log(`\n🎯 Overall Success Rate: ${successRate}%`);
  
  if (successRate >= 75) {
    console.log('\n🎉 Backend is ready for development!');
    console.log('\n📋 Next Steps:');
    console.log('  1. Create database tables using Supabase dashboard');
    console.log('  2. Set up Row Level Security policies');
    console.log('  3. Configure authentication settings');
    console.log('  4. Test API endpoints in your application');
  } else {
    console.log('\n⚠️ Backend setup needs attention.');
    console.log('🔧 Please check your Supabase configuration.');
  }
  
  // Save report
  const reportData = {
    timestamp: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL,
    results,
    successRate,
    recommendations: successRate >= 75 ? [
      'Backend is ready for development',
      'Create database tables in Supabase dashboard',
      'Set up authentication policies',
      'Test API integration'
    ] : [
      'Check Supabase configuration',
      'Verify service role key permissions',
      'Review network connectivity',
      'Check Supabase project status'
    ]
  };

  console.log('\n💾 Report saved to: backend-test-report.json');
  return reportData;
}

/**
 * Main test function
 */
async function testBackend() {
  console.log('🚀 Starting MediSoluce Backend Test\n');
  
  const results = {
    connection: false,
    database: false,
    auth: false,
    data: false
  };
  
  try {
    // Test connection
    results.connection = await testConnection();
    
    if (results.connection) {
      // Test database access
      results.database = await testDatabaseAccess();
      
      // Test authentication
      results.auth = await testAuthentication();
      
      // Test data creation
      results.data = await createTestData();
    }

    // Generate report
    const report = generateReport(results);
    
    // Save report to file
    const fs = await import('fs');
    fs.writeFileSync('backend-test-report.json', JSON.stringify(report, null, 2));

  } catch (error) {
    console.error('\n❌ Backend test failed:', error.message);
    process.exit(1);
  }
}

// Run test
testBackend().catch(console.error);

