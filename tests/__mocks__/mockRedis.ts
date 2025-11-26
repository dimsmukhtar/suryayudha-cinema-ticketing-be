import { vi } from 'vitest'

export const createMockRedis = () => {
  return {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    expire: vi.fn(),
    ttl: vi.fn(),
    incr: vi.fn(),
    decr: vi.fn(),

    publish: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),

    pipeline: vi.fn(() => ({
      set: vi.fn().mockReturnThis(),
      del: vi.fn().mockReturnThis(),
      expire: vi.fn().mockReturnThis(),
      exec: vi.fn()
    })),
    multi: vi.fn(() => ({
      set: vi.fn().mockReturnThis(),
      del: vi.fn().mockReturnThis(),
      expire: vi.fn().mockReturnThis(),
      exec: vi.fn()
    })),

    on: vi.fn(),
    quit: vi.fn(),
    disconnect: vi.fn(),

    options: {}
  }
}
export type MockRedisType = ReturnType<typeof createMockRedis>
