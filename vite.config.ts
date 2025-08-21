import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'medisoluce.png'],
      manifest: {
        name: 'MediSoluce - Healthcare Compliance Platform',
        short_name: 'MediSoluce',
        description: 'Comprehensive healthcare compliance platform combining HIPAA compliance, technology dependency management, and business continuity planning.',
        theme_color: '#0073e6',
        background_color: '#ffffff',
        display: 'standalone',
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
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.VERCEL === '1' ? false : (process.env.NODE_ENV !== 'production'),
    minify: 'terser',
    target: 'es2015',
    cssTarget: 'chrome80',
    terserOptions: {
      compress: {
        drop_debugger: true,
      }
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['@sentry/browser'],
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts'],
          i18n: ['i18next', 'react-i18next']
        }
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __COMMIT_HASH__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || 'development')
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
  }
});