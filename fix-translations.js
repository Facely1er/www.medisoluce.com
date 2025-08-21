const fs = require('fs');

// Fix French translation file
let frContent = fs.readFileSync('/workspace/src/i18n/locales/fr.ts', 'utf8');
// Remove any double commas and fix syntax
frContent = frContent.replace(/,,/g, ',');
frContent = frContent.replace(/,\s*\n\s*,/g, ',');
frContent = frContent.replace(/,\s*\n\s*}/g, '\n  }');

fs.writeFileSync('/workspace/src/i18n/locales/fr.ts', frContent);

// Fix English translation file - rename first errors to form_errors
let enContent = fs.readFileSync('/workspace/src/i18n/locales/en.ts', 'utf8');
enContent = enContent.replace('"errors": {\n  "required_field"', '"form_errors": {\n  "required_field"');

fs.writeFileSync('/workspace/src/i18n/locales/en.ts', enContent);

console.log('Translation files fixed!');