import { StoreInitializer, StoreValue, StoreVersion, StoreKey } from './types';
import { StoreId, Stores } from './typesInternal';

export function getStoreValue(stores: Stores, id: StoreId): any {
  const moduleStore = getModuleStore(stores, id.moduleName)
  return moduleStore[id.key as any].value
}

export function initStoreValue<T extends StoreValue>(stores: Stores, id: StoreId, version: StoreVersion, initializer: StoreInitializer<T>) {
  const moduleStore = getModuleStore(stores, id.moduleName)
  const store: StoreValue = moduleStore[id.key as any] || { versions: [], init: {} }
  const versions = store.versions
  const init = initializer(store.init, versions)
  versions.push(version)
  moduleStore[id.key as any] = { versions, init, value: createStoreValue(init) }
}

export function resetStoreValue(stores: Stores, id: StoreId) {
  const moduleStore = getModuleStore(stores, id.moduleName)
  moduleStore[id.key as any].value = createStoreValue(moduleStore[id.key as any].init)
}

export function getModuleStore(stores: Stores, moduleName: string) {
  return stores[moduleName] = stores[moduleName] || {}
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
  return storeCreators.sort((a, b) => compareVersion(
    typeof a.version === 'number' ? `0.0.${a.version}` : a.version,
    typeof b.version === 'number' ? `0.0.${b.version}` : b.version)
  )
}

export function compareVersion(a: string, b: string) {
  const v1 = a.split('.').map(v => Number(v))
  const v2 = b.split('.').map(v => Number(v))
  return v1[0] !== v2[0] ? v1[0] - v2[0] :
    v1[1] !== v2[1] ? v1[1] - v2[1] :
      v1[2] - v2[2]
}
