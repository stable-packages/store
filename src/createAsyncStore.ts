import { createStore, Store } from './createStore'
import { StoreOptions, StoreValue } from './types'
import { StoreCreators } from './typesInternal'
import { resolveCreators } from './util'

const asyncStoreCreators: StoreCreators<Store<any>> = {}

/**
 * Creates a store of type T asynchronously.
 * @see https://github.com/unional/global-store#createAsyncStore
 */
export async function createAsyncStore<T extends StoreValue>({ moduleName, key, version, initializer }: StoreOptions<T>): Promise<Store<T>> {
  return new Promise(resolve => {
    const creatorsOfModules = asyncStoreCreators[moduleName] = asyncStoreCreators[moduleName] || {}
    const storeCreators = creatorsOfModules[key] = creatorsOfModules[key] || []
    storeCreators.push({ version, resolve, initializer })
  })
}

/**
 * Initializes the stores for `createAsyncStore()`.
 * @see https://github.com/unional/global-store#initializeAsyncStore
 */
export function initializeAsyncStore(moduleName: string, key?: string) {
  const creatorsOfModules = asyncStoreCreators[moduleName]
  if (!creatorsOfModules) return

  const keys = key ? [key] : Object.keys(creatorsOfModules)
  keys.forEach(key => resolveCreators(moduleName, key, creatorsOfModules[key], createStore))
}
