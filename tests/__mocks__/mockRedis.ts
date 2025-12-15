import { vi } from 'vitest'

class MockRedis {
  constructor() {}
  connect = vi.fn()
  quit = vi.fn()
  on = vi.fn()
  set = vi.fn()
  get = vi.fn()
  del = vi.fn()
}

vi.mock('ioredis', () => {
  return {
    default: class Redis extends MockRedis {},
    Redis: class Redis extends MockRedis {}
  }
})

vi.mock('../../../src/infrastructure/config/redis', () => {
  return {
    default: new MockRedis(),
    createRedis: vi.fn(() => new MockRedis())
  }
})
