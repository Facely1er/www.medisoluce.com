# Icon Generation Guide

This guide explains how to generate favicon.png and all PWA icon sizes from the MediSoluce logo.

## Quick Start

1. **Install Sharp** (image processing library):
   ```bash
   npm install sharp --save-dev
   ```

2. **Generate all icons**:
   ```bash
   npm run icons:generate
   ```

This will generate:
- `public/favicon.png` (32x32)
- `public/icons/icon-72x72.png`
- `public/icons/icon-96x96.png`
- `public/icons/icon-128x128.png`
- `public/icons/icon-144x144.png`
- `public/icons/icon-152x152.png`
- `public/icons/icon-192x192.png`
- `public/icons/icon-384x384.png`
- `public/icons/icon-512x512.png`

## Alternative Methods

### Using ImageMagick (if Sharp is not available)

```bash
# Generate favicon.png
convert public/medisoluce.png -resize 32x32 public/favicon.png

# Generate all icon sizes
for size in 72 96 128 144 152 192 384 512; do
  convert public/medisoluce.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png
done
```

### Using Online Tools

1. Visit an online image resizer (e.g., https://www.iloveimg.com/resize-image)
2. Upload `public/medisoluce.png`
3. Resize to each required size
4. Save to the appropriate location

## Requirements

- **Source file**: `public/medisoluce.png` must exist
- **Node.js**: Version 14+ (for Sharp)
- **Sharp**: Image processing library (install with `npm install sharp --save-dev`)

## Notes

- All icons are generated with a black background to match the logo design
- Icons maintain aspect ratio and are centered
- The script automatically creates the `public/icons` directory if it doesn't exist

## Troubleshooting

**Error: sharp package not found**
- Run `npm install sharp --save-dev`

**Error: medisoluce.png not found**
- Ensure the logo file exists at `public/medisoluce.png`

**Icons look distorted**
- The script uses `fit: 'contain'` to maintain aspect ratio
- Icons will have black borders if the logo isn't square

