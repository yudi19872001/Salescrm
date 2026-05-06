import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE_PATH is set by the GitHub Actions workflow to /<repo-name>/
// so the same config works locally and on GitHub Pages without edits.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: { port: 5173, open: true }
})
