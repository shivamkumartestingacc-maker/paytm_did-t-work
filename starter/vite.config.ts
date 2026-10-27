import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Run with:  npx vite --config starter/vite.config.ts
// `root` is the starter folder, so this app is self-contained.
export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  plugins: [react()],
  base: './',
  server: { host: '0.0.0.0', allowedHosts: true, port: 5199 },
  preview: { host: '0.0.0.0', allowedHosts: true },
  build: { outDir: '../dist-starter', emptyOutDir: true },
});
