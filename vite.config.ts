import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build:single` emits one self-contained HTML file (used for sharing the prototype).
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  base: './',
  build: { assetsInlineLimit: mode === 'single' ? 100_000_000 : 4096 },
  server: {
    host: '0.0.0.0',
    // the preview is served through a proxied https host
    allowedHosts: true,
    hmr: { protocol: 'wss', clientPort: 443 },
  },
  preview: { host: '0.0.0.0', allowedHosts: true },
}));
