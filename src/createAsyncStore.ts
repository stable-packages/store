import { createStore, Store } from './createStore';
import { StoreInitializer, StoreValue } from './types';

const asyncStoreCreators: Record<string, Record<string | symbol, Array<StoreCreator>>> = {}

type StoreCreator = {
  version: string | number,
  resolve: (store: Store<any>) => void,
  initializer: StoreInitializer<any>
}

/**
 * Creates a store of type T asychronously.
 * @param moduleName Name of your module. This will be used during reporting.
 * @param key Specific key of the store scoped to your module. This will not appear in reporting.
 * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
 *
 * It is recommend that the key contains the purpose as well as a random value such as GUID.
 * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
 * This key should not change across versions.
 * @param version Version of the store. It can be numeric or string in the format of "major.minor.patch".
 * No other string format is accepted.
 * When it is numeric, it is compare to the patch number of the string version,
 * if there is a mix of number and string versions.
 * @param initializer Initializing function for the store
 */
export async function createAsyncStore<
  T extends StoreValue,
  V extends string | number
>(moduleName: string, key: string | symbol, version: V, initializer: StoreInitializer<T>): Promise<Store<T>> {
  return new Promise(resolve => {
    const creatorsOfModules = asyncStoreCreators[moduleName] = asyncStoreCreators[moduleName] || {}
    const storeCreators = creatorsOfModules[key as any] = creatorsOfModules[key as any] || []
    storeCreators.push({ version, resolve, initializer })
  })

}

/**
 * Initializes the stores for `createAsyncStore()`.
 */
export function initializeAsyncStore(moduleName: string, key?: string | symbol) {
  const creatorsOfModules = asyncStoreCreators[moduleName]
  if (!creatorsOfModules) return

  if (!key) {
    Object.keys(creatorsOfModules).forEach(k => {
      const storeCreators = creatorsOfModules[k]
      resolveCreators(moduleName, k, storeCreators)
    })
  }
  else {
    const storeCreators = creatorsOfModules[key as any]
    resolveCreators(moduleName, key, storeCreators)
  }
}

function resolveCreators(moduleName: string, key: string | symbol, storeCreators: Array<StoreCreator>) {
  sortByVersion(storeCreators).forEach(({ resolve, initializer }) => resolve(createStore(moduleName, key, initializer)))
}

function sortByVersion(storeCreators: Array<StoreCreator>) {
  return storeCreators.sort((a, b) => compareVersion(
    typeof a.version === 'number' ? `0.0.${a.version}` : a.version,
    typeof b.version === 'number' ? `0.0.${b.version}` : b.version)
  )
}

function compareVersion(a: string, b: string) {
  const v1 = a.split('.').map(v => Number(v))
  const v2 = b.split('.').map(v => Number(v))
  return v1[0] !== v2[0] ? v1[0] - v2[0] :
    v1[1] !== v2[1] ? v1[1] - v2[1] :
      v1[2] - v2[2]
}
