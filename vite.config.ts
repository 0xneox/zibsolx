import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'buffer': 'buffer/'
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    include: [
      'buffer',
      'process'
    ]
  },
  build: {
    rollupOptions: {
      external: ['buffer', 'process'],
      output: {
        globals: {
          buffer: 'Buffer',
          process: 'process'
        }
      }
    }
  }
});
