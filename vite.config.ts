import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://pointagebackend-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env': {},
  }
})
