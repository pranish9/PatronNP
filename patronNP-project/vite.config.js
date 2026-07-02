import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  server: {
    // Bind to 0.0.0.0 so the dev server is reachable from other devices
    // on the same network (e.g. a phone at http://<your-lan-ip>:5173),
    // or through a tunnel like ngrok.
    host: true,
    // Forward backend-rooted paths to Spring Boot so the browser only ever
    // talks to ONE origin (this dev server) no matter how it was reached
    // (localhost, a LAN IP, or an ngrok URL) — sidesteps CORS and the
    // "frontend/backend on different hosts" problem entirely.
    proxy: {
      '/api': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/ws': { target: 'http://localhost:8080', ws: true },
    },
  },
})
