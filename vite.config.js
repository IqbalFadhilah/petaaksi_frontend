import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest', // Agar Vite memakai sw.js
      srcDir: 'public',             // Lokasi sw.js
      filename: 'sw.js',            // Nama file service worker
      injectManifest: {
        injectionPoint: null,       
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'PetaAksi - Pantau Aksi Massa',
        short_name: 'PetaAksi',
        description: 'Aplikasi pemetaan aksi massa real-time',
        theme_color: '#d32f2f',
        background_color: '#ffffff',
        display: 'standalone', 
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})