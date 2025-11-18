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
        functions: 90, // minimal 90% fungsi harus terpanggil dalam test.
        branches: 85, // minimal 85% branch (if/else, switch, ternary) harus terpanggil.
        statements: 90, // minimal 90% pernyataan kode dieksekusi.
        lines: 90 // minimal 90% baris kode dieksekusi.
      }
    }
  }
})
