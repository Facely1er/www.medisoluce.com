/**
 * Untranslated Text Checker
 * Scans the codebase for hardcoded text that should be translated
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns to identify hardcoded text
const TEXT_PATTERNS = [
  // JSX text content
  />\s*['"]([A-Z][^'"]{3,})['"]\s*</g,
  // String literals in JSX
  /['"]([A-Z][a-zA-Z\s]{5,})['"]/g,
  // Template literals with text
  /`([A-Z][^`]{5,})`/g,
  // Error messages
  /(error|Error|message|Message|title|Title|description|Description|label|Label|placeholder|Placeholder|text|Text)\s*[:=]\s*['"]([^'"]{5,})['"]/g,
];

// Patterns to exclude (already translated or should not be translated)
const EXCLUDE_PATTERNS = [
  /t\(['"`]/g, // Already using translation function
  /useTranslation/g, // Import statement
  /from ['"]react-i18next['"]/g, // Import statement
  /console\.(log|error|warn)/g, // Console statements
  /\/\/.*/g, // Comments
  /\/\*[\s\S]*?\*\//g, // Block comments
  /className=/g, // CSS classes
  /id=/g, // HTML IDs
  /href=/g, // Links
  /src=/g, // Image sources
  /alt=/g, // Alt text (should be translated but checking separately)
  /aria-label=/g, // ARIA labels (should be translated)
  /placeholder=/g, // Placeholders (should be translated)
  /title=/g, // HTML title attributes (should be translated)
  /type=['"]/g, // Input types
  /value=['"]/g, // Input values
  /key=/g, // React keys
  /data-/g, // Data attributes
  /import.*from/g, // Import statements
  /export.*from/g, // Export statements
  /const.*=.*require/g, // Require statements
  /\.(tsx?|jsx?|json|css|scss|md)$/g, // File extensions
  /['"]\d+['"]/g, // Numbers
  /['"][a-z]+:\/\//g, // URLs
  /['"]#[0-9a-fA-F]{3,6}['"]/g, // Hex colors
  /['"]\$\{[^}]+\}['"]/g, // Template literals with variables
  /['"]\w+@\w+\.\w+['"]/g, // Email addresses
  /['"]\/[^'"]*['"]/g, // Paths starting with /
  /['"]\.\/[^'"]*['"]/g, // Relative paths
  /['"]https?:\/\/[^'"]*['"]/g, // HTTP URLs
  /['"]\d{4}-\d{2}-\d{2}['"]/g, // Dates
  /['"]\d+:\d+['"]/g, // Times
  /['"]\$\d+['"]/g, // Currency
  /['"]\d+%['"]/g, // Percentages
  /['"]\w+\.(png|jpg|jpeg|gif|svg|webp|ico)['"]/g, // Image files
  /['"]\w+\.(pdf|doc|docx|xls|xlsx)['"]/g, // Document files
  /['"]\w+\.(ts|tsx|js|jsx|json|css|scss)['"]/g, // Code files
  /['"]MediSoluce['"]/g, // Brand name
  /['"]HIPAA['"]/g, // Acronym
  /['"]PHI['"]/g, // Acronym
  /['"]RPS['"]/g, // Acronym
  /['"]HHS['"]/g, // Acronym
  /['"]NIST['"]/g, // Acronym
  /['"]CCPA['"]/g, // Acronym
  /['"]GDPR['"]/g, // Acronym
  /['"]EHR['"]/g, // Acronym
  /['"]PACS['"]/g, // Acronym
  /['"]LIS['"]/g, // Acronym
  /['"]MDM['"]/g, // Acronym
  /['"]SIEM['"]/g, // Acronym
  /['"]BAA['"]/g, // Acronym
  /['"]RTO['"]/g, // Acronym
  /['"]RPO['"]/g, // Acronym
  /['"]SLA['"]/g, // Acronym
  /['"]SOC['"]/g, // Acronym
  /['"]CISO['"]/g, // Acronym
  /['"]ROI['"]/g, // Acronym
  /['"]API['"]/g, // Acronym
  /['"]URL['"]/g, // Acronym
  /['"]HTML['"]/g, // Acronym
  /['"]CSS['"]/g, // Acronym
  /['"]JS['"]/g, // Acronym
  /['"]TS['"]/g, // Acronym
  /['"]JSON['"]/g, // Acronym
  /['"]PDF['"]/g, // Acronym
  /['"]XML['"]/g, // Acronym
  /['"]CSV['"]/g, // Acronym
  /['"]XSS['"]/g, // Acronym
  /['"]CSRF['"]/g, // Acronym
  /['"]SQL['"]/g, // Acronym
  /['"]No['"]/g, // Single word "No"
  /['"]Yes['"]/g, // Single word "Yes"
  /['"]OK['"]/g, // Single word "OK"
  /['"]Cancel['"]/g, // Common button (should check if translated)
  /['"]Submit['"]/g, // Common button (should check if translated)
  /['"]Save['"]/g, // Common button (should check if translated)
  /['"]Delete['"]/g, // Common button (should check if translated)
  /['"]Edit['"]/g, // Common button (should check if translated)
  /['"]Close['"]/g, // Common button (should check if translated)
  /['"]Loading['"]/g, // Common text (should check if translated)
  /['"]Error['"]/g, // Common text (should check if translated)
  /['"]Success['"]/g, // Common text (should check if translated)
  /['"]Warning['"]/g, // Common text (should check if translated)
  /['"]Info['"]/g, // Common text (should check if translated)
];

// Files to check
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];

// Collect all files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file) && !file.startsWith('.')) {
        getAllFiles(filePath, fileList);
      }
    } else if (EXTENSIONS.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Check if text is already translated
function isTranslated(content, lineNumber, match) {
  const lines = content.split('\n');
  const line = lines[lineNumber - 1];
  const matchIndex = line.indexOf(match);
  
  // Check if t( is nearby
  const beforeMatch = line.substring(Math.max(0, matchIndex - 50), matchIndex);
  const afterMatch = line.substring(matchIndex, matchIndex + match.length + 50);
  
  return beforeMatch.includes('t(') || afterMatch.includes('t(');
}

// Check if text matches exclude patterns
function shouldExclude(text, line) {
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.test(text) || pattern.test(line)) {
      return true;
    }
    return false;
  });
}

// Extract hardcoded text
function findHardcodedText(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const lines = content.split('\n');
  
  // Pattern 1: Text in JSX children (between > and <)
  const jsxTextPattern = />\s*['"]([A-Z][^'"]{5,})['"]\s*</g;
  let match;
  let lineNumber = 1;
  
  lines.forEach((line, index) => {
    lineNumber = index + 1;
    
    // Skip if line contains t( function
    if (line.includes('t(') || line.includes('useTranslation')) {
      return;
    }
    
    // Check for hardcoded strings that look like user-facing text
    // Pattern: strings with capital letters and spaces (likely user-facing)
    const stringPattern = /['"`]([A-Z][a-zA-Z\s]{4,}[a-zA-Z])['"`]/g;
    let stringMatch;
    
    while ((stringMatch = stringPattern.exec(line)) !== null) {
      const text = stringMatch[1];
      
      // Skip if it's already translated
      if (isTranslated(content, lineNumber, stringMatch[0])) {
        continue;
      }
      
      // Skip if it matches exclude patterns
      if (shouldExclude(text, line)) {
        continue;
      }
      
      // Skip very short strings or single words
      if (text.split(' ').length < 2 && text.length < 10) {
        continue;
      }
      
      // Skip if it's a variable name or function call
      if (text.includes('(') || text.includes(')') || text.includes('{') || text.includes('}')) {
        continue;
      }
      
      issues.push({
        file: filePath,
        line: lineNumber,
        text: text,
        context: line.trim(),
        type: 'hardcoded_text'
      });
    }
    
    // Check for aria-label, placeholder, title attributes
    const attrPatterns = [
      /aria-label=['"]([^'"]{5,})['"]/g,
      /placeholder=['"]([^'"]{5,})['"]/g,
      /title=['"]([^'"]{5,})['"]/g,
      /alt=['"]([^'"]{5,})['"]/g,
    ];
    
    attrPatterns.forEach(pattern => {
      let attrMatch;
      while ((attrMatch = pattern.exec(line)) !== null) {
        const text = attrMatch[1];
        
        // Skip if it's already translated
        if (isTranslated(content, lineNumber, attrMatch[0])) {
          return;
        }
        
        // Skip if it matches exclude patterns
        if (shouldExclude(text, line)) {
          return;
        }
        
        // Skip if it's a variable
        if (text.includes('${') || text.includes('{')) {
          return;
        }
        
        issues.push({
          file: filePath,
          line: lineNumber,
          text: text,
          context: line.trim(),
          type: 'attribute_text'
        });
      }
    });
  });
  
  return issues;
}

// Main function
function checkUntranslatedText() {
  const srcDir = path.join(__dirname, '../src');
  const files = getAllFiles(srcDir);
  
  console.log(`\n=== UNTRANSLATED TEXT CHECKER ===\n`);
  console.log(`Scanning ${files.length} files...\n`);
  
  const allIssues = [];
  
  files.forEach(file => {
    try {
      const issues = findHardcodedText(file);
      if (issues.length > 0) {
        allIssues.push(...issues);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });
  
  // Group by file
  const issuesByFile = {};
  allIssues.forEach(issue => {
    if (!issuesByFile[issue.file]) {
      issuesByFile[issue.file] = [];
    }
    issuesByFile[issue.file].push(issue);
  });
  
  // Report
  console.log(`Found ${allIssues.length} potential untranslated text issues\n`);
  
  if (allIssues.length === 0) {
    console.log('✅ No untranslated text found! All text appears to be using translations.');
    return;
  }
  
  console.log('=== ISSUES BY FILE ===\n');
  
  Object.entries(issuesByFile).forEach(([file, issues]) => {
    const relativePath = path.relative(srcDir, file);
    console.log(`\n📄 ${relativePath} (${issues.length} issues)`);
    console.log('─'.repeat(80));
    
    issues.forEach(issue => {
      console.log(`\n  Line ${issue.line} (${issue.type}):`);
      console.log(`  Text: "${issue.text}"`);
      console.log(`  Context: ${issue.context.substring(0, 100)}${issue.context.length > 100 ? '...' : ''}`);
    });
  });
  
  console.log('\n=== SUMMARY ===\n');
  console.log(`Total issues: ${allIssues.length}`);
  console.log(`Files with issues: ${Object.keys(issuesByFile).length}`);
  console.log(`\n⚠️  Review these files and ensure text is wrapped in t() function calls.`);
  
  // Generate report file
  const reportPath = path.join(__dirname, '../UNTRANSLATED_TEXT_REPORT.md');
  const report = generateReport(allIssues, issuesByFile);
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Detailed report saved to: UNTRANSLATED_TEXT_REPORT.md`);
}

function generateReport(allIssues, issuesByFile) {
  let report = '# Untranslated Text Report\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `**Total Issues:** ${allIssues.length}\n`;
  report += `**Files Affected:** ${Object.keys(issuesByFile).length}\n\n`;
  
  report += '## Issues by File\n\n';
  
  Object.entries(issuesByFile).forEach(([file, issues]) => {
    const relativePath = path.relative(path.join(__dirname, '../src'), file);
    report += `### ${relativePath}\n\n`;
    report += `**Issues:** ${issues.length}\n\n`;
    
    issues.forEach(issue => {
      report += `- **Line ${issue.line}** (${issue.type}):\n`;
      report += `  - Text: \`"${issue.text}"\`\n`;
      report += `  - Context: \`${issue.context}\`\n\n`;
    });
  });
  
  report += '## Recommendations\n\n';
  report += '1. Wrap all user-facing text in `t()` function calls\n';
  report += '2. Add translation keys to `src/i18n/locales/en.ts` and `src/i18n/locales/fr.ts`\n';
  report += '3. Use descriptive translation keys (e.g., `common.button.submit`)\n';
  report += '4. Test language switching to ensure all text is translated\n\n';
  
  return report;
}

// Run the check
checkUntranslatedText();

