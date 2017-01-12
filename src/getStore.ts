
/**
 * Store interface.
 */
export interface Store<T> {
  /**
   * ID of the store.
   */
  id: string

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
  constructor(public id: string, defaultValue: T = {} as T) {
    this.value = defaultValue
   }
}

const globalState: { [i: string]: Store<any> } = {}

/**
 * Gets or creates a store.
 * @param id A unique identifier to the store.
 * This id MUST be unique across all modules in an application.
 * You should make it descriptive.
 * You should use your module's name or unique key as part of the id.
 * @param defaultValue Optional, but most of the time you will specify it.
 * You can skip the defaultValue for very basic use cases: basic types and hash.
 */
export function getStore<T>(id: string, defaultValue?: T): Store<T> {
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
