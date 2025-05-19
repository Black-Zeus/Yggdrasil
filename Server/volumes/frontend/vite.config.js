import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          zustand: ['zustand'],
          router: ['react-router-dom']
        }
      }
    }
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite acceder desde cualquier dirección
    port: 3000,      // Usa el puerto 3000
    strictPort: true, // Lanza error si el puerto ya está en uso
    watch: {
      usePolling: true, // Soluciona problemas con sistemas de archivos montados en Docker
      interval: 100,    // Intervalo de tiempo para verificar cambios
    },
    proxy: {
      '/api/services': {
        target: 'http://inventario-backend-api:8000', // o el backend real
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/services/, ''),
      },
    },
  },
});
