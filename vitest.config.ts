import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['./tests/**/*.test.ts'],
    setupFiles: ['./tests/global-setup.ts'],
    testTimeout: 20000, // timout 20 detik untuk setiap test
    hookTimeout: 20000, // timeout 20 detik untuk setiap hook kayak beforeAll, beforeEach, afterAll dan lain lain
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        functions: 90,
        branches: 85,
        statements: 90,
        lines: 90
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
