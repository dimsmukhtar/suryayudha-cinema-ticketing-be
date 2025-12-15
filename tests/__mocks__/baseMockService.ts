import { vi } from 'vitest'

export const createMockService = <T extends object>(methods: Array<keyof T>) => {
  const service: Partial<Record<keyof T, any>> = {}

  methods.forEach((method) => {
    service[method] = vi.fn()
  })

  return service
}
