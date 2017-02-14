
/**
 * Store interface.
 */
export interface Store<T> {
  /**
   * ID of the store.
   */
  id: string | symbol

  /**
   * The store value.
   */
  value: T
}

/**
 * Store implementation.
 * The Store interface and StoreImpl is separated so that
 * consumer cannot get access to the StoreImpl class to instantiate it directly.
 */
class StoreImpl<T> implements Store<T> {
  value: T

  /**
   * `defaultValue` is default to `{}` to support simple hash.
   * If consumer use this is simple type store (`string`, `number` etc),
   * this `{}` is wasted but it is a trade off to be made.
   */
  constructor(public id: string | symbol, defaultValue: T = {} as T) {
    this.value = defaultValue
   }
}

const globalState = {}

/**
 * Gets or creates a store.
 * @param id A unique identifier to the store.
 * It can be a symbol created from `Symbol.for(key)`,
 * or a runtime-wide unique string:
 * You should make it descriptive.
 * You should use your module's name or unique key as part of the id.
 * You can add some secret random string to it.
 * @param defaultValue Optional default value.
 */
export function getStore<T>(id: string | symbol, defaultValue?: T): Store<T> {
  return globalState[id] = globalState[id] || new StoreImpl<T>(id, defaultValue)
}

/**
 * Remove a store from the global state.
 * Internal for testing only
 */
export function removeStore(store: Store<any>): void {
  if (store) {
    delete globalState[store.id]
  }
}
