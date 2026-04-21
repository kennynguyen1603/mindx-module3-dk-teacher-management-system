import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:8080/api/v1',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://localhost:8080/api/v1',
        changeOrigin: true,
      },
      '/teachers': {
        target: 'http://localhost:8080/api/v1',
        changeOrigin: true,
      },
      '/teacher-positions': {
        target: 'http://localhost:8080/api/v1',
        changeOrigin: true,
      },
    },
  },
});
