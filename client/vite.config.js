import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build config — modifié pour forcer le rebuild
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    copyPublicDir: true,
  },
});
