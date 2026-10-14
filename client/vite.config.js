import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const renderHost = process.env.RENDER_EXTERNAL_HOSTNAME || 'mern-frontend-234876.onrender.com'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      renderHost,
      'mern-frontend-xo7a.onrender.com',
      'mern-frontend-234876.onrender.com',
    ],
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      renderHost,
      'mern-frontend-xo7a.onrender.com',
      'mern-frontend-234876.onrender.com',
    ],
  },
})