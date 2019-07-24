
export type StoreValue = Record<string | symbol, any>

export type StoreVersion = string | number

export type StoreKey = string | symbol

/**
 * Function to initialize the store.
 * @param previousInitValue The initial value returned by previous call.
 * It will be an empty object if `createStore()` is called the first time.
 * @param lastProcessedVersion The version of the last initializer.
 * This is useful to figure out that information should be kept or not.
 */
export type StoreInitializer<T extends StoreValue> = (previousInitValue: StoreValue, processedVersions: StoreVersion[]) => T

