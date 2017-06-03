const globalState: any = {}

/**
 * Gets a value.
 * @param id A unique identifier to the store.
 * It can be a symbol created from `Symbol.for(key)`,
 * or a runtime-wide unique string:
 * You should make it descriptive.
 * You should use your module's name or unique key as part of the id.
 * You can add some secret random string to it.
 * e.g. `my-module:some-purpose:some-random-string`
 * @param defaultValue Optional default value.
 */
export function get<T = any>(id: string | symbol, defaultValue?: T): T {
  return globalState[id] = globalState[id] || defaultValue
}

/**
 * Sets a value.
 * @param id The unique identifier of the store.
 * @param value Any value you want to save.
 */
export function set(id: string | symbol, value: any) {
  globalState[id] = value
}

export interface Store<T> {
  get(): T
  set(value: T): void
}

/**
 * Creates a store of type T.
 * @param id A unique identifier to the store.
 * It can be a symbol created from `Symbol.for(key)`,
 * or a runtime-wide unique string:
 * You should make it descriptive.
 * You should use your module's name or unique key as part of the id.
 * You can add some secret random string to it.
 * e.g. `my-module:some-purpose:some-random-string`
 * @param defaultValue Optional default value.
 */
export function create<T = any>(id: string | symbol, defaultValue?: T): Store<T> {
  return {
    get() {
      return get<T>(id, defaultValue)
    },
    set(value: T) {
      set(id, value)
    }
  }
}

export default create
