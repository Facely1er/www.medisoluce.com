import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Resolve the npm package name (scoped or not) from a Rollup module id.
 * e.g. ".../node_modules/@supabase/supabase-js/dist/x.js" -> "@supabase/supabase-js"
 *      ".../node_modules/.pnpm/react@18/node_modules/react/index.js" -> "react"
 */
function packageNameFromId(id: string): string | null {
  const marker = 'node_modules/';
  const idx = id.lastIndexOf(marker);
  if (idx === -1) return null;
  const rest = id.slice(idx + marker.length).split('/');
  if (rest[0]?.startsWith('@')) {
    return rest.length > 1 ? `${rest[0]}/${rest[1]}` : rest[0];
  }
  return rest[0] || null;
}

/** Packages in the react-markdown / unified pipeline that lack a shared prefix. */
const MARKDOWN_PACKAGES = new Set([
  'react-markdown',
  'unified',
  'bail',
  'trough',
  'is-plain-obj',
  'devlop',
  'decode-named-character-reference',
  'character-entities',
  'property-information',
  'space-separated-tokens',
  'comma-separated-tokens',
  'html-url-attributes',
  'estree-util-is-identifier-name',
  'style-to-object',
  'style-to-js',
  'inline-style-parser',
  'trim-lines',
  'zwitch',
  'longest-streak',
  'ccount',
  'markdown-table',
  'escape-string-regexp',
]);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        inlineWorkboxRuntime: false,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/(?!fonts\.googleapis\.com|fonts\.gstatic\.com|www\.googletagmanager\.com|www\.google-analytics\.com|region1\.google-analytics\.com).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'offlineCache',
              expiration: {
                maxEntries: 200
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.png', 'favicon.ico', 'icons/icon-192x192.png', 'icons/icon-512x512.png'],
      manifest: {
        name: 'MediSoluce - Healthcare Compliance Platform',
        short_name: 'MediSoluce',
        description: 'Privacy-first healthcare compliance platform. HIPAA assessments, dependency mapping, and business continuity—minimal data collection; your data stays in your browser by default.',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ],
        shortcuts: [
          { name: 'HIPAA Assessment', short_name: 'HIPAA', description: 'Start HIPAA compliance assessment', url: '/hipaa-check', icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }] },
          { name: 'System Dependencies', short_name: 'Dependencies', description: 'Map critical system dependencies', url: '/dependency-manager', icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }] },
          { name: 'Dashboard', short_name: 'Dashboard', description: 'View compliance dashboard', url: '/dashboard', icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }] }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  preview: {
    port: 4173,
    host: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'esbuild',
    target: 'esnext',
    cssTarget: 'chrome80',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            const pkg = packageNameFromId(id);
            if (!pkg) return 'vendor';

            // Core runtime that every route needs.
            if (['react', 'react-dom', 'scheduler', 'react-router', 'react-router-dom', 'react-helmet-async'].includes(pkg)) {
              return 'react-vendor';
            }
            if (pkg === 'framer-motion' || pkg === 'lucide-react') {
              return 'ui';
            }
            // recharts and its d3/victory dependency tree; only chart-heavy routes load it.
            if (pkg === 'recharts' || pkg === 'recharts-scale' || pkg === 'victory-vendor' || pkg.startsWith('d3-') || pkg === 'internmap' || pkg === 'delaunator' || pkg === 'robust-predicates') {
              return 'charts';
            }
            // react-markdown pulls in the whole unified/remark/micromark pipeline; policy pages only.
            if (MARKDOWN_PACKAGES.has(pkg) || pkg.startsWith('micromark') || pkg.startsWith('mdast-') || pkg.startsWith('hast-') || pkg.startsWith('unist-') || pkg.startsWith('remark-') || pkg.startsWith('rehype-') || pkg.startsWith('vfile')) {
              return 'markdown';
            }
            if (pkg === 'i18next' || pkg === 'react-i18next' || pkg.startsWith('i18next-')) {
              return 'i18n';
            }
            if (pkg.startsWith('@supabase/')) {
              return 'supabase';
            }
            if (pkg.startsWith('@sentry/')) {
              return 'sentry';
            }
            if (pkg === 'react-hook-form' || pkg.startsWith('@hookform/') || pkg === 'zod') {
              return 'forms';
            }
            return 'vendor';
          }
          
          // Security utilities should be in their own chunk to avoid dynamic import conflicts
          if (id.includes('securityUtils.ts')) {
            return 'security';
          }
          
          // Performance utilities
          if (id.includes('performanceOptimizer.ts')) {
            return 'performance';
          }

          // Modules imported both statically and dynamically elsewhere: pin them to a
          // named chunk so Rollup does not warn and the dynamic imports stay cheap.
          if (id.includes('/src/utils/serviceFallback.ts')) {
            return 'fallback';
          }
          if (id.includes('/src/lib/supabase.ts')) {
            return 'supabase';
          }
          if (id.includes('/src/utils/comprehensiveHealthManager.ts') || id.includes('/src/components/health/HealthOptimizer.tsx')) {
            return 'health';
          }
        }
      }
    },
    cssCodeSplit: true,
    emptyOutDir: true
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __COMMIT_HASH__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'development')
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
    exclude: ['@vite/client', '@vite/env']
  },
  esbuild: {
    legalComments: 'none',
    target: 'es2015',
    exclude: ['@sentry/browser'],
    drop: ['debugger'],
    pure: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.debug'] : []
  }
});
