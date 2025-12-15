import { AsyncLocalStorage } from 'async_hooks'
import { randomUUID } from 'crypto'

interface Context {
  requestId: string
}

const asyncLocalStorage = new AsyncLocalStorage<Context>()

export const asyncContext = {
  runWithId<T>(fn: () => T) {
    const requestId = randomUUID()
    return asyncLocalStorage.run({ requestId }, fn)
  },
  getRequestId(): string | null {
    return asyncLocalStorage.getStore()?.requestId ?? null
  }
}
