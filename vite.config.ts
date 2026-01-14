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
            if (id.includes('react-syntax-highlighter')) {
              return 'vendor-syntax-highlighter';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            // Group React core together to avoid circular deps
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            // Put other large libs in their own chunk if needed, otherwise 'vendor'
            return 'vendor'; 
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
