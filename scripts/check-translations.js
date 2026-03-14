/**
 * Translation Completeness Checker
 * Compares French translations against English to identify missing keys
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to flatten nested objects
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
}

// Helper function to get nested value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Main comparison function
function compareTranslations(enPath, frPath) {
  try {
    // Read and parse translation files
    const enContent = fs.readFileSync(enPath, 'utf8');
    const frContent = fs.readFileSync(frPath, 'utf8');
    
    // Extract the translation objects (remove export statement)
    const enMatch = enContent.match(/const enTranslation = ({[\s\S]*});/);
    const frMatch = frContent.match(/const frTranslation = ({[\s\S]*});/);
    
    if (!enMatch || !frMatch) {
      console.error('Could not parse translation files');
      return;
    }
    
    // Evaluate the objects (in a safe way)
    const enTranslation = eval(`(${enMatch[1]})`);
    const frTranslation = eval(`(${frMatch[1]})`);
    
    // Flatten both objects
    const enFlat = flattenObject(enTranslation);
    const enKeys = Object.keys(enFlat);
    const frFlat = flattenObject(frTranslation);
    const frKeys = Object.keys(frFlat);
    
    // Find missing keys
    const missingInFr = enKeys.filter(key => !frKeys.includes(key));
    const extraInFr = frKeys.filter(key => !enKeys.includes(key));
    
    // Calculate coverage
    const coverage = ((enKeys.length - missingInFr.length) / enKeys.length) * 100;
    
    // Generate report
    console.log('\n=== FRENCH TRANSLATION COMPLETENESS REPORT ===\n');
    console.log(`Total English keys: ${enKeys.length}`);
    console.log(`Total French keys: ${frKeys.length}`);
    console.log(`Missing in French: ${missingInFr.length}`);
    console.log(`Extra in French: ${extraInFr.length}`);
    console.log(`Coverage: ${coverage.toFixed(2)}%\n`);
    
    if (missingInFr.length > 0) {
      console.log('=== MISSING KEYS IN FRENCH ===\n');
      missingInFr.forEach(key => {
        const enValue = enFlat[key];
        console.log(`❌ ${key}`);
        console.log(`   EN: ${typeof enValue === 'string' ? enValue.substring(0, 80) : JSON.stringify(enValue).substring(0, 80)}`);
        console.log('');
      });
    }
    
    if (extraInFr.length > 0) {
      console.log('\n=== EXTRA KEYS IN FRENCH (not in English) ===\n');
      extraInFr.forEach(key => {
        console.log(`⚠️  ${key}`);
      });
    }
    
    // Check for empty or placeholder translations
    console.log('\n=== POTENTIAL ISSUES ===\n');
    let issuesFound = false;
    
    frKeys.forEach(key => {
      const frValue = frFlat[key];
      const enValue = enFlat[key];
      
      if (frValue === '' || frValue === null || frValue === undefined) {
        console.log(`⚠️  Empty translation: ${key}`);
        issuesFound = true;
      }
      
      // Check if French translation is same as English (might be untranslated)
      if (enValue && frValue === enValue && typeof enValue === 'string' && enValue.length > 3) {
        console.log(`⚠️  Possible untranslated: ${key} (FR same as EN)`);
        issuesFound = true;
      }
    });
    
    if (!issuesFound) {
      console.log('✅ No obvious issues found');
    }
    
    // Summary
    console.log('\n=== SUMMARY ===\n');
    if (coverage === 100 && missingInFr.length === 0 && extraInFr.length === 0) {
      console.log('✅ French translations are complete!');
    } else {
      console.log(`⚠️  French translations need attention:`);
      if (missingInFr.length > 0) {
        console.log(`   - ${missingInFr.length} missing keys need to be added`);
      }
      if (extraInFr.length > 0) {
        console.log(`   - ${extraInFr.length} extra keys should be reviewed`);
      }
    }
    
    return {
      totalKeys: enKeys.length,
      frenchKeys: frKeys.length,
      missing: missingInFr.length,
      extra: extraInFr.length,
      coverage,
      missingKeys: missingInFr,
      extraKeys: extraInFr
    };
    
  } catch (error) {
    console.error('Error comparing translations:', error);
    throw error;
  }
}

// Run the comparison
const enPath = path.join(__dirname, '../src/i18n/locales/en.ts');
const frPath = path.join(__dirname, '../src/i18n/locales/fr.ts');

if (!fs.existsSync(enPath) || !fs.existsSync(frPath)) {
  console.error('Translation files not found!');
  process.exit(1);
}

compareTranslations(enPath, frPath);

