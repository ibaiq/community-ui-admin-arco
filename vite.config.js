import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dayjs from 'dayjs';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

process.env.VITE_APP_TIME = dayjs().format('YYYY-M-D HH:mm:ss');
// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    plugins: [vue(), VueSetupExtend()],
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
        },
      },
    },
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 50000,
    },
    server: {
      host: '0.0.0.0',
      port: 80,
      open: false,
      proxy: {
        [loadEnv(mode, process.cwd()).VITE_APP_BASE_API + '/alibaba']: {
          target: `https://at.alicdn.com`,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(
              loadEnv(mode, process.cwd()).VITE_APP_BASE_API + '/alibaba',
              ''
            ),
        },
        [loadEnv(mode, process.cwd()).VITE_APP_BASE_API]: {
          target: loadEnv(mode, process.cwd()).VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(loadEnv(mode, process.cwd()).VITE_APP_BASE_API, ''),
        },
      },
    },
  });
