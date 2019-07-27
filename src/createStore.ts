import { StoreOptions, StoreValue } from './types';
import { Stores } from './typesInternal';
import { getStoreValue, initStoreValue, resetStoreValue } from './util';

export type Store<T extends StoreValue> = {
  /**
   * Value from the store.
   */
  readonly value: T
  /**
   * Resets the store to its initial value.
   * You should only use this during testing.
   */
  reset(): void
}

const stores: Stores = {}

/**
 * Creates a store of type T.
 * https://github.com/unional/global-store#createstore
 */
export function createStore<
  T extends StoreValue
>({ moduleName, key, version, initializer }: StoreOptions<T>): Store<T> {
  initStoreValue(stores, { moduleName, key }, version, initializer)

  return {
    get value() { return getStoreValue(stores, { moduleName, key }) },
    reset: () => resetStoreValue(stores, { moduleName, key })
  }
}
