import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Split out the heavy syntax highlighter deps
            if (id.includes('react-syntax-highlighter') || id.includes('refractor')) {
              return 'vendor-syntax-highlighter';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            // Group all React ecosystem together
            if (id.includes('react') || id.includes('scheduler') || id.includes('prop-types')) {
              return 'vendor-react';
            }
            // Everything else
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
