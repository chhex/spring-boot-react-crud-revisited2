/// <reference types="vitest/config" />

import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load all VITE_* from .env files
  const env = loadEnv(mode, process.cwd(), '');
  const USE_MOCK = env.VITE_USE_MOCK === 'true';
  const BACKEND_URL = env.VITE_BACKEND_URL || 'http://localhost:8080';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    /**
     * Dev server
     * - If USE_MOCK=true → no proxy (api served from mocks)
     * - If USE_MOCK=false → proxy /clients to Spring Boot (:8080 by default)
     */
    server: {
      port: 5173,
      ...(USE_MOCK
        ? {}
        : {
            proxy: {
              '/clients': {
                target: BACKEND_URL,
                changeOrigin: true,
              },
            },
          }),
    },

    // Expose a resolved flag so the app can know we’re mocking (optional)
    define: {
      'import.meta.env.VITE_USE_MOCK_RESOLVED': JSON.stringify(USE_MOCK),
    },

    // Vitest config unchanged
    test: {
      bail: 1,
      clearMocks: true,
      coverage: {
        enabled: true,
        exclude: ['src/main.tsx', 'src/mocks/browser.ts'],
        include: ['src/**/*'],
        reporter: ['text', 'lcov'],
        reportsDirectory: 'coverage',
        thresholds: { '100': true },
      },
      css: false,
      environment: 'happy-dom',
      globals: true,
      include: ['src/**/*.test.ts?(x)'],
      setupFiles: 'src/test-setup.ts',
    },
  };
});