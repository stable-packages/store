import { createReadonlyStore, ReadonlyStore } from './createReadonlyStore';
import { StoreOptions, StoreValue } from './types';
import { StoreCreators } from './typesInternal';
import { resolveCreators } from './util';

const asyncReadonlyStoreCreators: StoreCreators<ReadonlyStore<any>> = {}

/**
 * Creates a readonly store of type T.
 * https://github.com/unional/global-store#createAsyncReadonlyStore
 */
export function createAsyncReadonlyStore<T extends StoreValue>(
  { moduleName, key, version, initializer }: StoreOptions<T>): Promise<ReadonlyStore<T>> {
  return new Promise(resolve => {
    const creatorsOfModules = asyncReadonlyStoreCreators[moduleName] = asyncReadonlyStoreCreators[moduleName] || {}
    const storeCreators = creatorsOfModules[key as any] = creatorsOfModules[key as any] || []
    storeCreators.push({ version, resolve, initializer })
  })
}

/**
 * Initializes the stores for `createAsyncReadonlyStore()`.
 * https://github.com/unional/global-store#initializeAsyncReadonlyStore
 */
export function initializeAsyncReadonlyStore(moduleName: string, key?: string) {
  const creatorsOfModules = asyncReadonlyStoreCreators[moduleName]
  if (!creatorsOfModules) return

  if (key) {
    const storeCreators = creatorsOfModules[key as any]
    resolveCreators(moduleName, key, storeCreators, createReadonlyStore)
  }
  else {
    Object.keys(creatorsOfModules).forEach(k => {
      const storeCreators = creatorsOfModules[k]
      resolveCreators(moduleName, k, storeCreators, createReadonlyStore)
    })
  }
}
