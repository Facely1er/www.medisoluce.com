# React + TypeScript + Vite

# MediSoluce Healthcare Compliance Platform

A comprehensive healthcare compliance platform that combines HIPAA compliance assessment, technology dependency management, and business continuity planning to protect patient data and ensure operational resilience.

## 🏥 Features

- **HIPAA Compliance Assessment** - Comprehensive 10-question evaluation with scoring and recommendations
- **Technology Dependency Mapping** - Visualize and secure critical healthcare system relationships
- **Business Impact Analysis** - Assess operational and financial risks from system failures
- **Business Continuity Planning** - Develop comprehensive recovery strategies
- **Ransomware Protection** - Specialized healthcare cybersecurity guidance
- **Staff Training Platform** - Interactive compliance education with certification
- **Resource Toolkit** - Expert-designed templates, policies, and implementation guides

## 🔒 Privacy-First Design

- **Local Data Storage** - All user data stored locally on device
- **No Account Required** - Use anonymously or create optional account for sync
- **HIPAA-Compliant Architecture** - Designed for healthcare data protection
- **Zero Data Collection** - No tracking or data collection without consent

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🏗️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom healthcare design system
- **State Management:** React Hooks + Context API
- **Data Storage:** localStorage (privacy-first) + optional Supabase
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Testing:** Vitest + React Testing Library
- **Build:** Vite with production optimizations

## 📊 Performance

- **Lighthouse Score:** 95+ across all metrics
- **Core Web Vitals:** Optimized for healthcare workflows
- **Bundle Size:** Optimized with code splitting
- **Caching Strategy:** Progressive loading with service worker

## 🔧 Development

### Environment Setup

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Configure your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   Get these values from your [Supabase project dashboard](https://app.supabase.com/project/YOUR_PROJECT/settings/api)

3. Install dependencies: `npm install`

4. Start dev server: `npm run dev`

**Note:** For production deployment, use `env.production.example` as a template and set environment variables in your deployment platform (Vercel, Netlify, etc.).

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build analysis
npm run build:analyze
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Netlify
```bash
# Deploy to Netlify
netlify deploy --prod
```

### Self-Hosted
```bash
# Build for production
npm run build

# Serve with your preferred web server
# Note: Configure server to serve index.html for all routes (SPA)
```

## 🏥 Healthcare Compliance

- **HIPAA Compliant** - Designed for healthcare data protection
- **Security Headers** - Comprehensive CSP, HSTS, and security controls
- **Audit Trail** - All user actions logged for compliance
- **Data Encryption** - All sensitive data encrypted in storage
- **Access Controls** - Role-based permissions and authentication

## 📈 Monitoring & Analytics

- **Error Tracking** - Production-ready error monitoring
- **Performance Monitoring** - Core Web Vitals and custom metrics
- **Health Checks** - Automated system health validation
- **Comprehensive Health Management** - Advanced health monitoring, auto-healing, and predictive analysis
- **Security Monitoring** - CSP violation tracking and security alerts

## 🔐 Security Features

- **Content Security Policy** - Comprehensive CSP implementation
- **HTTPS Enforcement** - Automatic HTTPS redirects
- **Secure Headers** - HSTS, X-Frame-Options, and more
- **Input Sanitization** - XSS protection and input validation
- **Rate Limiting** - Protection against abuse and brute force

## 📱 Progressive Web App

- **Offline Capabilities** - Service worker for offline access
- **Installable** - PWA installation prompts
- **Push Notifications** - System update notifications
- **Background Sync** - Data synchronization when online

## 🌐 Internationalization

- **Multi-Language Support** - English and French translations
- **Locale-Aware Formatting** - Dates, numbers, and currencies
- **RTL Support Ready** - Architecture supports RTL languages
- **Dynamic Language Switching** - Real-time language changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

- **Email:** support@medisoluce.com
- **Documentation:** [docs.medisoluce.com](https://docs.medisoluce.com)
- **Issues:** [GitHub Issues](https://github.com/medisoluce/platform/issues)

## 📄 License

Copyright © 2024 ERMITS. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

**Built with ❤️ for Healthcare Professionals**
