import { defineConfig } from 'vitest/config';

/** Browser tests (npm run test:e2e): playwright-core + local Chrome against `astro preview` of dist/. */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/e2e/**/*.test.ts'],
    globalSetup: ['tests/e2e/preview-server.ts'],
    testTimeout: 40_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
});
