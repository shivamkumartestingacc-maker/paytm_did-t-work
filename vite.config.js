import { defineConfig } from 'vite';

// The checked-in index.html is the prebuilt single-file application.
// Vite processes its inline module into dist/assets and writes dist/index.html.
export default defineConfig({
  base: './',
});
