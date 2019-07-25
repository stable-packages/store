import { createStore, Store } from './createStore';
import { StoreOptions, StoreValue } from './types';
import { resolveCreators, StoreCreator } from './util';

const asyncStoreCreators: Record<string, Record<string, Array<StoreCreator<Store<any>>>>> = {}

/**
 * Creates a store of type T asychronously.
 * https://github.com/unional/global-store#createAsyncStore
 */
export async function createAsyncStore<T extends StoreValue>({ moduleName, key, version, initializer }: StoreOptions<T>): Promise<Store<T>> {
  return new Promise(resolve => {
    const creatorsOfModules = asyncStoreCreators[moduleName] = asyncStoreCreators[moduleName] || {}
    const storeCreators = creatorsOfModules[key as any] = creatorsOfModules[key as any] || []
    storeCreators.push({ version, resolve, initializer })
  })
}

/**
 * Initializes the stores for `createAsyncStore()`.
 * https://github.com/unional/global-store#initializeAsyncStore
 */
export function initializeAsyncStore(moduleName: string, key?: string) {
  const creatorsOfModules = asyncStoreCreators[moduleName]
  if (!creatorsOfModules) return

  if (key) {
    const storeCreators = creatorsOfModules[key as any]
    resolveCreators(moduleName, key, storeCreators, createStore)
  }
  else {
    Object.keys(creatorsOfModules).forEach(k => {
      const storeCreators = creatorsOfModules[k]
      resolveCreators(moduleName, k, storeCreators, createStore)
    })
  }
}
