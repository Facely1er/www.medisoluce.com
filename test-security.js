// Test script to verify security manager functionality
import { securityManager } from './src/utils/securityUtils.js';

console.log('Security manager:', securityManager);
console.log('startMonitoring method:', typeof securityManager.startMonitoring);

if (typeof securityManager.startMonitoring === 'function') {
  console.log('✅ startMonitoring method is available');
  securityManager.startMonitoring();
} else {
  console.log('❌ startMonitoring method is not available');
}