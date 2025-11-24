# MediSoluce Demo/Trials

This folder contains a simplified HTML-based demo version of the MediSoluce healthcare compliance platform. This demo is designed for easy deployment, sharing, and demonstration purposes.

## Overview

The demo includes standalone HTML pages that showcase the main features and pricing information for:
- HIPAA Compliance Assessment
- Ransomware Protection
- Business Continuity Planning
- Dependency Management

## Files Structure

```
demo-trials/
├── index.html              # Main landing page
├── hipaa-pricing.html      # HIPAA compliance pricing page
├── ransomware-pricing.html # Ransomware protection pricing page
├── contact.html            # Contact form page
├── styles.css              # Shared stylesheet
└── README.md               # This file
```

## Features

- **Pure HTML/CSS**: No build process required, works in any web server
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Modern UI**: Clean, professional design matching the main application
- **Self-contained**: All styles are in a single CSS file
- **Easy to Deploy**: Can be hosted on any static hosting service

## Usage

### Local Development

Simply open any HTML file in a web browser:
```bash
# Open in default browser
open index.html

# Or use a simple HTTP server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Deployment

You can deploy this demo folder to any static hosting service:

- **GitHub Pages**: Push to a `gh-pages` branch or enable Pages in repository settings
- **Netlify**: Drag and drop the `demo-trials` folder
- **Vercel**: Deploy the `demo-trials` folder as a static site
- **Any Web Server**: Upload the folder contents to your web server

### Example Deployment Commands

```bash
# Using Netlify CLI
netlify deploy --dir=demo-trials --prod

# Using Vercel CLI
vercel demo-trials --prod

# Using GitHub Pages (if in a repo)
git subtree push --prefix demo-trials origin gh-pages
```

## Customization

### Styling

All styles are in `styles.css`. Key CSS variables are defined at the top:
- `--primary`: Primary brand color (blue)
- `--secondary`: Secondary color (green)
- `--danger`: Danger/error color (red)
- `--warning`: Warning color (orange)
- `--success`: Success color (green)

### Content

Edit the HTML files directly to update:
- Pricing information
- Feature descriptions
- Contact information
- Navigation links

## Notes

- This is a **demo version** - forms don't actually submit data
- The contact form shows a success message but doesn't send emails
- All links are relative and work within the demo folder
- The demo badge is visible in the header to indicate this is a demo

## Integration with Main App

If you want to link from the main application to the demo:
- Use relative paths: `/demo-trials/` or `../demo-trials/`
- Or use absolute paths if deployed separately

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with some CSS limitations)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Same license as the main MediSoluce project.

