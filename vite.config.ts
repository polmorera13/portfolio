import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function copyPublicSafe(): import('vite').Plugin {
  return {
    name: 'copy-public-safe',
    apply: 'build',
    closeBundle() {
      const src = path.resolve(__dirname, 'public');
      const dest = path.resolve(__dirname, 'dist');
      copyDirSafe(src, dest);
    },
  };
}

function copyDirSafe(src: string, dest: string) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(src, { withFileTypes: true });
  } catch {
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSafe(srcPath, destPath);
    } else {
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch {
        // skip locked / unavailable files
      }
    }
  }
}

// https://vitejs.dev/config/
// BASE_PATH: "/" en producción y "/test/" en la copia de pruebas
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), copyPublicSafe()],
  publicDir: false,
  // manifest: lo lee el prerenderizado para anunciar el JavaScript de cada página
  build: { manifest: true },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
