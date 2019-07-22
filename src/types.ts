
export type StoreValue = Record<string | symbol, any>

/**
 * Function to initialize the store.
 * @param previousInitValue The existing initial value.
 * Undefined if `createStore()` is called the first time.
 */
export type StoreInitializer<T extends StoreValue> = (previousInitValue: StoreValue) => T
