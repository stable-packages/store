import { compareVersion } from './compareVersion';
import { StoreInitializer, StoreValue, StoreVersion } from './types';
import { StoreCreator, StoreId, Stores } from './typesInternal';
import { shouldInvokeInitializer } from './shouldInvokeInitializer';

export function getStoreValue(stores: Stores, id: StoreId): any {
  return getStore(stores, id).value
}

export function initStoreValue<T extends StoreValue>(stores: Stores, id: StoreId, version: StoreVersion, initializer: StoreInitializer<T>) {
  const store = getStore(stores, id)
  if (shouldInvokeInitializer(store.versions, version)) {
    store.initializers.push(initializer)
    store.value = initializer(store.value as T, store.versions)
    store.versions.push(version)
  }
}

export function resetStoreValue(stores: Stores, id: StoreId) {
  const store = getStore(stores, id)
  const versions = store.versions
  store.versions = []
  store.value = store.initializers.reduce((value, initializer, i) => {
    value = initializer(value, store.versions)
    store.versions.push(versions[i])
    return value
  }, {})
}

export function getStore(stores: Stores, id: StoreId) {
  const moduleStore = stores[id.moduleName] = stores[id.moduleName] || {}
  return moduleStore[id.key as any] = moduleStore[id.key as any] || { versions: [], value: {}, initializers: [] }
}

export function resolveCreators<S>(moduleName: string, key: string, storeCreators: Array<StoreCreator<S>>, createStore: any) {
  sortByVersion(storeCreators).forEach(({ version, resolve, initializer }) => resolve(createStore({ moduleName, key, version, initializer })))
}

export function sortByVersion<S>(storeCreators: Array<StoreCreator<S>>) {
  return storeCreators.sort((a, b) => compareVersion(a.version, b.version))
}

export function freezeStoreValue(stores: Stores, id: StoreId, value?: any) {
  const store = getStore(stores, id)
  store.value = freezeValue(value || store.value)
}

function freezeValue(storeValue: StoreValue) {
  if (Object.isFrozen(storeValue)) throw TypeError('Frozen value cannot be freezed again')

  Object.keys(storeValue).forEach(k => freezeIfIsArray(storeValue, k))
  // istanbul ignore next
  if (Object.getOwnPropertySymbols) {
    Object.getOwnPropertySymbols(storeValue).forEach(k => freezeIfIsArray(storeValue, k))
  }

  return Object.freeze(storeValue)
}

function freezeIfIsArray(storeValue: StoreValue, k: any) {
  const value = storeValue[k]
  if (Array.isArray(value)) {
    storeValue[k] = Object.freeze(value)
  }
}
