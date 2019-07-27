import { Store } from './createStore';
import { AccessedBeforeLock, Prohibited } from './errors';
import { StoreOptions, StoreValue } from './types';
import { StoreId, Stores } from './typesInternal';
import { getStore, getStoreValue, initStoreValue, resetStoreValue } from './util';

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
   * Disable the readonly feature of the store.
   * Calling this function will make the store not readonly.
   * It will behaves just like the normal `Store`.
   * Obviously, you should only call this during testing.
   */
  disableProtection(): void,
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
 * https://github.com/unional/global-store#createreadonlystore
 */
export function createReadonlyStore<
  T extends StoreValue
>({ moduleName, key, version, initializer }: StoreOptions<T>): ReadonlyStore<T> {
  initStoreValue(readonlyStores, { moduleName, key }, version, initializer)
  let isLocked = false
  let disabled = false
  return {
    disableProtection() {
      if (isLocked) throw new Prohibited(moduleName, 'ReadonlyStore#disableProtection')
      disabled = true
    },
    get value() {
      if (!disabled && !isLocked) throw new AccessedBeforeLock(moduleName)
      return getStoreValue(readonlyStores, { moduleName, key })
    },
    getWritable() {
      if (!disabled && isLocked) throw new Prohibited(moduleName, 'ReadonlyStore#getWritable')
      return getStoreValue(readonlyStores, { moduleName, key })
    },
    lock(finalizer) {
      if (!disabled && !isLocked) {
        if (finalizer) {
          updateStoreValue(readonlyStores, { moduleName, key }, finalizer)
        }
        freezeStoreValue(readonlyStores, { moduleName, key })
        isLocked = true
        disabled = false
      }
      return this
    },
    reset() {
      if (!disabled && isLocked) throw new Prohibited(moduleName, 'ReadonlyStore#reset')
      resetStoreValue(readonlyStores, { moduleName, key })
    }
  }
}


function updateStoreValue(stores: Stores, id: StoreId, finalizer: Record<keyof any, (prev: any) => any>) {
  const current = getStoreValue(stores, id)
  Object.keys(finalizer).forEach(k => current[k] = finalizer[k](current[k]))
}

function freezeStoreValue(stores: Stores, id: StoreId) {
  const store = getStore(stores, id)
  store.value = freezeValue(store.value)
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
