import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Precaching for the app shell (CacheFirst strategy)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        
        // Runtime caching for dynamic/external assets
        runtimeCaching: [
          {
            // Cache images from picsum.photos with StaleWhileRevalidate
            urlPattern: /^https:\/\/picsum\.photos\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'picsum-images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache tailwindcss with StaleWhileRevalidate
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tailwind-css-cache',
            },
          },
          {
            // Cache react/react-dom from CDN with CacheFirst
            urlPattern: /^https:\/\/aistudiocdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'react-cdn-cache',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
          }
        ],
      },
      manifest: {
        name: 'Bike Advance',
        short_name: 'BikeAdvance',
        description: 'An advanced, futuristic bike monitoring and tracking progressive web application with real-time GPS tracking, an intelligent fuel management system, and a comprehensive bike database.',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
