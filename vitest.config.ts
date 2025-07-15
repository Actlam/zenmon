import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js',
        'coverage/**',
        '.next/**',
        'public/**',
      ],
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});