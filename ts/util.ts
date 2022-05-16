import { compareVersion } from './compareVersion.js'
import { createStore } from './createStore.js'
import { shouldInvokeInitializer } from './shouldInvokeInitializer.js'
import { StoreInitializer, StoreValue, StoreVersion } from './types.js'
import { StoreCreator, StoreId, Stores } from './typesInternal.js'

export function getStoreValue<T extends StoreValue>(stores: Stores, id: StoreId): T {
  return getStore(stores, id).value as T
}

export function initStoreValue<T extends StoreValue>(stores: Stores, id: StoreId, version: StoreVersion, initializer: StoreInitializer<T>) {
  const store = getStore(stores, id)
  if (shouldInvokeInitializer(store.versions, version)) {
    store.initializers.push(initializer as StoreInitializer<StoreValue>)
    store.value = initializer(store.value as T, store.versions)
    store.versions.push(version)
  }
}

export function resetStoreValue(stores: Stores, id: StoreId) {
  const store = getStore(stores, id)
  const versions = store.versions
  store.versions = []
  store.value = store.initializers.reduce<StoreValue>((value, initializer, i) => {
    value = initializer(value, store.versions)
    store.versions.push(versions[i])
    return value
  }, {})
}

export function getStore(stores: Stores, id: StoreId) {
  const moduleStore = stores[id.moduleName] = stores[id.moduleName] || Object.create(null)
  const key = id.key ?? 'default'
  return moduleStore[key] = moduleStore[key] || { versions: [], value: {}, initializers: [] }
}

export function resolveCreators(moduleName: string, key: string, storeCreators: Array<StoreCreator<any>>, cs: typeof createStore) {
  sortByVersion(storeCreators).forEach(({ version, resolve, initializer }) => resolve(cs({ moduleName, key, version, initializer })))
}

export function sortByVersion<S>(storeCreators: Array<StoreCreator<S>>) {
  return storeCreators.sort((a, b) => compareVersion(a.version, b.version))
}

export function freezeStoreValue(stores: Stores, id: StoreId, value?: StoreValue) {
  const store = getStore(stores, id)
  store.value = value ?
    Object.isFrozen(value) ? value : Object.freeze(value) :
    freezeValue(store.value)
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

function freezeIfIsArray(storeValue: StoreValue, k: string | number | symbol) {
  const value = storeValue[k]
  if (Array.isArray(value)) {
    storeValue[k] = Object.freeze(value)
  }
}
