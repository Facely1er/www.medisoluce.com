/**
 * Test script to validate localStorage optimization and schema differentiation
 */

import { optimizedLocalStorage } from './src/utils/optimizedLocalStorage';
import { schemaManager } from './src/utils/schemaDifferentiation';

// Test localStorage optimization
console.log('🧪 Testing localStorage optimization...');

// Test basic operations
const testData = {
  id: 'test-123',
  name: 'Test User',
  email: 'test@example.com',
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: true
  },
  metadata: {
    created: new Date().toISOString(),
    version: '1.0.0'
  }
};

// Test setItem
const setResult = optimizedLocalStorage.setItem('test-user', testData);
console.log('✅ Set item result:', setResult);

// Test getItem
const retrievedData = optimizedLocalStorage.getItem('test-user');
console.log('✅ Retrieved data:', retrievedData);

// Test metrics
const metrics = optimizedLocalStorage.getMetrics();
console.log('✅ Storage metrics:', metrics);

// Test health status
const healthStatus = optimizedLocalStorage.getHealthStatus();
console.log('✅ Health status:', healthStatus);

// Test schema differentiation
console.log('\n🧪 Testing schema differentiation...');

// Test schema prefix
const schemaPrefix = schemaManager.getSchemaPrefix();
console.log('✅ Schema prefix:', schemaPrefix);

// Test table info
const tableInfo = await schemaManager.getTableInfo('user_profiles');
console.log('✅ Table info:', tableInfo);

// Test schema metrics
const schemaMetrics = await schemaManager.getSchemaMetrics();
console.log('✅ Schema metrics:', schemaMetrics);

console.log('\n🎉 All tests completed successfully!');
