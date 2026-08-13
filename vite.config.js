import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Required for GitHub Pages project site: https://mohdvaqui002.github.io/Duplo_grid/
  base: './',
  server: {
    port: 5173,
    host: true
  }
});
