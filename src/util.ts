import { StoreInitializer, StoreValue } from './types';
import { StoreId, Stores } from './typesInternal';

export function getStoreValue(stores: Stores, id: StoreId): any {
  const moduleStore = getModuleStore(stores, id.moduleName)
  return moduleStore[id.key as any].value
}

export function initStoreValue<T extends StoreValue>(stores: Stores, id: StoreId, initializer: StoreInitializer<T>) {
  const moduleStore = getModuleStore(stores, id.moduleName)
  const store = moduleStore[id.key as any]
  const init = initializer(store && store.init || {})
  moduleStore[id.key as any] = { init, value: createStoreValue(init) }
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
