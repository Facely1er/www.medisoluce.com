#!/usr/bin/env node

/**
 * MediSoluce Icon Generator
 * 
 * Generates favicon.png and all PWA icon sizes from medisoluce.png logo
 * 
 * Usage:
 *   npm install sharp --save-dev
 *   node scripts/generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'medisoluce.png');
const iconsDir = path.join(publicDir, 'icons');

// Icon sizes to generate
const iconSizes = [
  { size: 32, name: 'favicon.png', path: publicDir },
  { size: 72, name: 'icon-72x72.png', path: iconsDir },
  { size: 96, name: 'icon-96x96.png', path: iconsDir },
  { size: 128, name: 'icon-128x128.png', path: iconsDir },
  { size: 144, name: 'icon-144x144.png', path: iconsDir },
  { size: 152, name: 'icon-152x152.png', path: iconsDir },
  { size: 192, name: 'icon-192x192.png', path: iconsDir },
  { size: 384, name: 'icon-384x384.png', path: iconsDir },
  { size: 512, name: 'icon-512x512.png', path: iconsDir },
];

async function generateIcons() {
  // Check if logo exists
  if (!fs.existsSync(logoPath)) {
    console.error('❌ Error: medisoluce.png not found at', logoPath);
    console.error('Please ensure the logo file exists in the public directory.');
    process.exit(1);
  }

  // Try to use Sharp if available
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (error) {
    console.error('❌ Error: sharp package not found');
    console.error('\nPlease install sharp first:');
    console.error('  npm install sharp --save-dev');
    console.error('\nOr use ImageMagick/GraphicsMagick:');
    console.error('  convert public/medisoluce.png -resize 32x32 public/favicon.png');
    process.exit(1);
  }

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
    console.log('✓ Created icons directory');
  }

  console.log('🖼️  Generating icons from medisoluce.png...\n');

  // Generate each icon size
  for (const icon of iconSizes) {
    try {
      const outputPath = path.join(icon.path, icon.name);
      
      await sharp(logoPath)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 } // Black background
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}:`, error.message);
    }
  }

  console.log('\n✅ Icon generation complete!');
  console.log('\nGenerated files:');
  iconSizes.forEach(icon => {
    console.log(`  - ${path.join(icon.path, icon.name)}`);
  });
}

// Run the generator
generateIcons().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

