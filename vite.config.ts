import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://api.korip.me/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        secure: true,
      },
      '/auth/api': {
        target: 'https://api.korip.me/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        secure: true,
      },
    },
  },
});
