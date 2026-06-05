import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Deployed to GitHub Pages at /davids-website/ ; dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/davids-website/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
  },
}))
