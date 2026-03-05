import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/NSStudy/backend/api.php',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '?path='),
      },
      '/uploads': {
        target: 'http://localhost/NSStudy/backend/uploads',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uploads/, ''),
      }
    }
  }
})
