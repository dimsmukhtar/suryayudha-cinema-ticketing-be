import { vi } from 'vitest'

export const mockPrisma = () => {
  return {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}
