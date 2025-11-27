import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to extract all translation keys from TypeScript translation file
function extractKeysFromTSFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();
  
  // Extract the translation object content
  const objectMatch = content.match(/const \w+Translation = ({[\s\S]*?});/);
  if (!objectMatch) {
    return keys;
  }
  
  const objectContent = objectMatch[1];
  const lines = objectContent.split('\n');
  
  // Track nesting path
  const keyPath = [];
  let braceDepth = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let currentLine = line;
    
    // Simple state tracking
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const prevChar = j > 0 ? line[j - 1] : '';
      
      // Track string state
      if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
      }
      
      // Track braces (only when not in string)
      if (!inString) {
        if (char === '{') {
          braceDepth++;
        } else if (char === '}') {
          // When closing, pop from keyPath
          if (keyPath.length > 0 && braceDepth > 0) {
            keyPath.pop();
          }
          braceDepth--;
        }
      }
    }
    
    // Extract keys from this line
    // Match pattern: "key": value
    const keyMatches = line.matchAll(/"([^"]+)":\s*(?:[^,}\]]+)?/g);
    for (const match of keyMatches) {
      const key = match[1];
      const fullKey = keyPath.length > 0 ? `${keyPath.join('.')}.${key}` : key;
      
      // Check if this key opens an object
      const afterColon = line.substring(match.index + match[0].length).trim();
      const isObject = afterColon.startsWith('{') || afterColon.startsWith('[');
      
      // Add the key (always add leaf keys, add parent keys if they're objects)
      if (!isObject || afterColon.includes('[')) {
        // It's a leaf key or array
        keys.add(fullKey);
      }
      
      // If it's an object, add to path
      if (isObject && !afterColon.includes('[')) {
        keyPath.push(key);
      }
    }
    
    // Reset string state for next line
    inString = false;
  }
  
  return keys;
}

// More robust key extraction using regex
function extractKeysRobust(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();
  
  // Find the translation object
  const objMatch = content.match(/const \w+Translation = ({[\s\S]*?});/);
  if (!objMatch) return keys;
  
  const objStr = objMatch[1];
  
  // Extract all "key": patterns
  const keyPattern = /"([^"]+)":/g;
  const matches = [...objStr.matchAll(keyPattern)];
  
  // Build key paths by tracking nesting
  const stack = [];
  let currentPath = [];
  
  // Split by lines to track structure
  const lines = objStr.split('\n');
  let depth = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments
    if (trimmed.startsWith('//')) continue;
    
    // Count braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    const prevDepth = depth;
    depth += openBraces - closeBraces;
    
    // Find keys in this line
    const lineKeys = [...line.matchAll(/"([^"]+)":/g)];
    
    for (const keyMatch of lineKeys) {
      const key = keyMatch[1];
      const afterKey = line.substring(keyMatch.index + keyMatch[0].length).trim();
      const isObject = afterKey.startsWith('{');
      const isArray = afterKey.startsWith('[');
      
      // Build full key path
      const fullKey = currentPath.length > 0 
        ? `${currentPath.join('.')}.${key}` 
        : key;
      
      // Add key if it's not an object (or if it's an array/leaf value)
      if (!isObject || afterKey.match(/:\s*["\d\[\]]/)) {
        keys.add(fullKey);
      }
      
      // Update path
      if (isObject && !isArray) {
        currentPath.push(key);
      }
    }
    
    // Adjust path based on closing braces
    if (closeBraces > 0 && depth < prevDepth) {
      const popCount = prevDepth - depth;
      for (let i = 0; i < popCount && currentPath.length > 0; i++) {
        currentPath.pop();
      }
    }
  }
  
  return keys;
}

// Main verification function
function verifyTranslations() {
  console.log('🔍 Verifying MediSoluce translations...\n');
  
  const enPath = path.join(__dirname, '../src/i18n/locales/en.ts');
  const frPath = path.join(__dirname, '../src/i18n/locales/fr.ts');
  
  if (!fs.existsSync(enPath) || !fs.existsSync(frPath)) {
    console.error('❌ Translation files not found!');
    process.exit(1);
  }
  
  // Extract keys using robust method
  const enKeys = extractKeysRobust(enPath);
  const frKeys = extractKeysRobust(frPath);
  
  console.log('📊 Translation Statistics:');
  console.log(`   English keys: ${enKeys.size}`);
  console.log(`   French keys: ${frKeys.size}\n`);
  
  // Find missing keys
  const missingInFrench = [...enKeys].filter(key => !frKeys.has(key));
  const missingInEnglish = [...frKeys].filter(key => !enKeys.has(key));
  
  // Report results
  if (missingInFrench.length === 0 && missingInEnglish.length === 0) {
    console.log('✅ All translations are complete!');
    console.log('   English and French translation files are in sync.\n');
  } else {
    if (missingInFrench.length > 0) {
      console.log(`❌ Missing ${missingInFrench.length} translation(s) in French:`);
      const sorted = missingInFrench.sort();
      sorted.slice(0, 30).forEach(key => {
        console.log(`   - ${key}`);
      });
      if (missingInFrench.length > 30) {
        console.log(`   ... and ${missingInFrench.length - 30} more`);
      }
      console.log('');
    }
    
    if (missingInEnglish.length > 0) {
      console.log(`⚠️  ${missingInEnglish.length} key(s) found in French but not in English:`);
      missingInEnglish.slice(0, 10).forEach(key => {
        console.log(`   - ${key}`);
      });
      if (missingInEnglish.length > 10) {
        console.log(`   ... and ${missingInEnglish.length - 10} more`);
      }
      console.log('');
    }
  }
  
  // Calculate completion percentage
  const totalKeys = enKeys.size;
  const frComplete = totalKeys - missingInFrench.length;
  const frCompletePct = totalKeys > 0 ? ((frComplete / totalKeys) * 100).toFixed(1) : 0;
  
  console.log('📋 Summary:');
  console.log(`   Total English keys: ${totalKeys}`);
  console.log(`   Total French keys: ${frKeys.size}`);
  console.log(`   Missing in French: ${missingInFrench.length}`);
  console.log(`   Extra in French: ${missingInEnglish.length}`);
  console.log(`   French completion: ${frCompletePct}%\n`);
  
  if (missingInFrench.length === 0) {
    console.log('✅ Translation verification complete! All keys are present in both languages.');
    return 0;
  } else {
    console.log('❌ Translation verification found missing keys. Please add the missing translations.');
    return 1;
  }
}

// Run verification
const exitCode = verifyTranslations();
process.exit(exitCode);
