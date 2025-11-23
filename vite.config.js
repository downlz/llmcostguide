import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  preview: {
    port: 4173,
    host: true
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'chunk-mui';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'chunk-react-query';
            }
            if (id.includes('@supabase')) {
              return 'chunk-supabase';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'chunk-react';
            }
            if (id.includes('lodash')) {
              return 'chunk-lodash';
            }
            if (id.includes('luxon') || id.includes('papaparse') || id.includes('react-hook-form')) {
              return 'chunk-utils';
            }
            return 'chunk-vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200
  }
})
