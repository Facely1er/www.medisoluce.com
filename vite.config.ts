import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

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
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: ONE_YEAR_IN_SECONDS
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: ONE_YEAR_IN_SECONDS
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'offlineCache',
              expiration: {
                maxEntries: 200
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'medisoluce.png'],
      manifest: {
        name: 'MediSoluce - Healthcare Compliance Platform',
        short_name: 'MediSoluce',
        description: 'Comprehensive healthcare compliance platform combining HIPAA compliance, technology dependency management, and business continuity planning.',
        theme_color: '#0073e6',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'medisoluce.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'medisoluce.png',
            sizes: '512x512',
            type: 'image/png'
          }
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
    minify: 'terser',
    target: 'esnext',
    cssTarget: 'chrome80',
    reportCompressedSize: true,
    terserOptions: {
      compress: {
        drop_debugger: true,
        drop_console: process.env.NODE_ENV === 'production',
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false,
        ecma: 2015
      }
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase';
            }
            if (id.includes('react-hook-form')) {
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
    exclude: ['@sentry/browser']
  }
});