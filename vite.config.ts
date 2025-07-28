import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    proxy: {
      '/api/weather': {
        target: 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, ''),
      },
      '/api/uv': {
        target: 'https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4', // V4 추가
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/uv/, ''),
      },
      '/api/asos': {
        target: 'https://apis.data.go.kr/1360000/AsosHourlyInfoService',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/asos/, ''),
      },
      '/api/air': {
        target: 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/air/, ''),
      },
    },
  },
});
