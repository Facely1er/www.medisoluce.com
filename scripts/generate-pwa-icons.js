/**
 * Generate PWA icons from public/favicon.png for Store and installability.
 * Run: node scripts/generate-pwa-icons.js
 * Requires: sharp (npm install)
 */
import sharp from 'sharp';
import { mkdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const faviconPath = join(publicDir, 'favicon.png');
const outDir = join(publicDir, 'icons');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function main() {
  await mkdir(outDir, { recursive: true });
  const imageBuffer = await readFile(faviconPath);

  for (const size of SIZES) {
    const outPath = join(outDir, `icon-${size}x${size}.png`);
    await sharp(imageBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`Generated ${outPath}`);
  }
  console.log('PWA icons generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
