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
  build: {
    minify: 'terser', // "Terser야, 네가 마무리해라"
    terserOptions: {
      compress: {
        drop_console: false, // 일단 콘솔 자체를 다 날리는 거 막는 용
        pure_funcs: ['console.log', 'console.info'], // log랑 info 함수만 찾아서 제거!
      },
    },
  },
});
