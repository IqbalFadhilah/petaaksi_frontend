import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // --- TAMBAHAN KRUSIAL UNTUK PUSH NOTIFIKASI ---
      strategies: 'injectManifest', // Menyuruh Vite memakai sw.js buatan kita sendiri
      srcDir: 'public',             // Lokasi sw.js kita
      filename: 'sw.js',            // Nama file service worker kita
      injectManifest: {
        injectionPoint: null,       // Mencegah error build karena kita pakai SW kustom murni
      },
      // ----------------------------------------------
      
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'PetaAksi - Pantau Aksi Massa',
        short_name: 'PetaAksi',
        description: 'Aplikasi pemetaan aksi massa real-time',
        theme_color: '#d32f2f',
        background_color: '#ffffff', // Bagus untuk layar loading awal
        display: 'standalone',       // WAJIB: Membuat aplikasi full-screen tanpa UI browser saat diinstal
        icons: [
          {
            src: 'logo-aplikasi-petaaksi-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-aplikasi-petaaksi-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})