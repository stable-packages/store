import { StoreInitializer, StoreValue, StoreVersion, StoreKey } from './types';
import { StoreId, Stores } from './typesInternal';

export function getStoreValue(stores: Stores, id: StoreId): any {
  return getStore(stores, id).value
}

export function initStoreValue<T extends StoreValue>(stores: Stores, id: StoreId, version: StoreVersion, initializer: StoreInitializer<T>) {
  const store = getStore(stores, id)
  store.init = initializer(store.init, store.versions)
  store.versions.push(version)
  store.value = createStoreValue(store.init)
}

export function resetStoreValue(stores: Stores, id: StoreId) {
  const store = getStore(stores, id)
  store.value = createStoreValue(store.init)
}

export function getStore(stores: Stores, id: StoreId) {
  const moduleStore = stores[id.moduleName] = stores[id.moduleName] || {}
  return moduleStore[id.key as any] = moduleStore[id.key as any] || { versions: [], init: {} }
}

export function createStoreValue(initialValue: any) {
  return { ...initialValue }
}

export type StoreCreator<S> = {
  version: StoreVersion,
  resolve: (store: S) => void,
  initializer: StoreInitializer<any>
}

export function resolveCreators<S>(moduleName: string, key: StoreKey, storeCreators: Array<StoreCreator<S>>, createStore: any) {
  sortByVersion(storeCreators).forEach(({ version, resolve, initializer }) => resolve(createStore(moduleName, key, version, initializer)))
}

export function sortByVersion<S>(storeCreators: Array<StoreCreator<S>>) {
  return storeCreators.sort((a, b) => compareVersion(toStringVersion(a.version), toStringVersion(b.version))
  )
}

function toStringVersion(v: string | number) {
  return typeof v === 'number' ? `0.0.${v}` : v
}

export function compareVersion(a: string, b: string) {
  const v1 = a.split('.').map(v => Number(v))
  const v2 = b.split('.').map(v => Number(v))
  return v1[0] !== v2[0] ? v1[0] - v2[0] :
    v1[1] !== v2[1] ? v1[1] - v2[1] :
      v1[2] - v2[2]
}
