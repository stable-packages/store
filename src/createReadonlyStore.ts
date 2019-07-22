import { Store } from './createStore';
import { AccessedBeforeLock, Prohibited } from './errors';
import { StoreInitializer, StoreValue } from './types';
import { getModuleStore, getStoreValue, initStoreValue, resetStoreValue } from './util';
import { Stores, StoreId } from './typesInternal';

const readonlyStores: Stores = {}

export type ReadonlyStore<T extends StoreValue> = Store<T> & {
  /**
   * Gets a writable value from the store.
   * This can be used for configure the store value before it is locked.
   * This is useful if your configuration is distributed in nature.
   * When configuration is completed,
   * you should `lock()` the store and use the `get()` method.
   */
  getWritable(): T
  /**
   * Open the store for testing.
   * Calling this function will make the store not readonly.
   * It will behaves just like the normal `Store`.
   * Obviously, you should only call this during testing.
   */
  openForTesting(): void,
  /**
   * Lock the store so that it cannot be modified.
   * @param finalizer A finalizer object to do a final process of the value.
   * You can use this to change the value, or freeze object.
   * By default, the value itself will be frozen,
   * If it contains array properties, those will also be frozen.
   */
  lock(finalizer?: Partial<{ [K in keyof T]: (value: T[K]) => T[K] }> & Record<keyof any, (value: any) => any>): ReadonlyStore<T>
}

/**
 * Creates a readonly store of type T.
 * @param moduleName Name of your module. This will be used during reporting.
 * @param key Specific key of the store scoped to your module. This will not appear in reporting.
 * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
 *
 * It is recommend that the key contains the purpose as well as a random value such as GUID.
 * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
 * This key should not change across versions.
 * @param initializer Initializing function for the store.
 */
export function createReadonlyStore<
  T extends StoreValue
>(moduleName: string, key: string | symbol, initializer: StoreInitializer<T>): ReadonlyStore<T> {
  initStoreValue(readonlyStores, { moduleName, key }, initializer)
  let isLocked = false
  let testing = false
  return {
    openForTesting() {
      if (isLocked) throw new Prohibited(moduleName, 'enable testing')
      testing = true
    },
    // todo: getter/setter for properties
    get() {
      if (!testing && !isLocked) throw new AccessedBeforeLock(moduleName)
      return getStoreValue(readonlyStores, { moduleName, key })
    },
    getWritable() {
      if (!testing && isLocked) throw new Prohibited(moduleName, 'ReadonlyStore#getWritable')
      return getStoreValue(readonlyStores, { moduleName, key })
    },
    lock(finalizer) {
      if (!isLocked) {
        if (finalizer) {
          updateStoreValue(readonlyStores, { moduleName, key }, finalizer)
        }
        freezeStoreValue(readonlyStores, { moduleName, key })
        isLocked = true
        testing = false
      }
      return this
    },
    reset() {
      if (!testing && isLocked) throw new Prohibited(moduleName, 'ReadonlyStore#reset')
      resetStoreValue(readonlyStores, { moduleName, key })
    }
  }
}


function updateStoreValue(stores: Stores, id: StoreId, finalizer: any /* Record<any, (value: any) => any> */) {
  const moduleStore = getModuleStore(stores, id.moduleName)
  const current = moduleStore[id.key as any].value

  Object.keys(finalizer).forEach(k => current[k] = finalizer[k](current[k]))
}

function freezeStoreValue(stores: Stores, id: StoreId) {
  const moduleStore = getModuleStore(stores, id.moduleName)
  const store = moduleStore[id.key as any]

  moduleStore[id.key as any] = {
    init: store.init,
    value: freezeValue(store.value)
  }
}

function freezeValue(storeValue: StoreValue) {
  Object.keys(storeValue).forEach(k => freezeArray(storeValue, k))
  // istanbul ignore next
  if (Object.getOwnPropertySymbols) {
    Object.getOwnPropertySymbols(storeValue).forEach(k => freezeArray(storeValue, k))
  }

  return Object.freeze(storeValue)
}

function freezeArray(storeValue: StoreValue, k: any) {
  const value = storeValue[k]
  if (Array.isArray(value)) {
    storeValue[k] = Object.freeze(value)
  }
}
