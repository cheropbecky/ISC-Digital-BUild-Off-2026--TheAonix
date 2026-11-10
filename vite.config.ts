import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icon.svg',
          'brand/kampas-pwa-192.png',
          'brand/kampas-pwa-512.png',
          'brand/kampas-apple-touch-icon.png',
        ],
        manifestFilename: 'manifest.json',
        manifest: {
          id: '/',
          name: 'Kampas - UEAB Student Platform',
          short_name: 'Kampas',
          description: 'The campus, in one place. University of Eastern Africa, Baraton (UEAB).',
          theme_color: '#0B2A6F',
          background_color: '#F7F9FC',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/brand/kampas-pwa-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/brand/kampas-pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/brand/kampas-pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
