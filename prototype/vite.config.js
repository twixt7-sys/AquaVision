import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));

// The canonical JSON corpus lives one level up in ../data. We alias it as @data
// and import JSON directly — Vite bundles it into dist/, so the build is fully
// self-contained and works offline. fs.allow must include the repo root or the
// dev server refuses to serve files outside the Vite project root.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  resolve: {
    alias: {
      '@data': path.resolve(here, '../data'),
      '@': path.resolve(here, 'src'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(here, '..')],
    },
  },
});
