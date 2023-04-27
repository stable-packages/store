export type StoreKey = string | symbol
export type StoreValue = Record<string | symbol, unknown>

export type Store<V extends StoreValue> = {
	value: V | undefined
	initializers: Array<{
		version?: number | undefined
		initializer: (current: V | undefined, processedVersions: number[]) => V
	}>
}

// const storeMap = new Map<StoreKey, Store<any>>()

export type StoreParams<T extends StoreValue> = {
	/**
	 * Key of the store.
	 * This is used to identify the store.
	 *
	 *
	 */
	key: StoreKey
	version?: number | undefined
	initializer: (current: T | undefined, processedVersions: number[]) => T
}

// export function createStore<T extends StoreValue>(options: StoreParams<T>): Store<T> {
// 	const store: Store<T> = storeMap.get(options.key) ?? { value: undefined, initializers: [] }
// 	store.initializers.push(options)
// 	return {
//     get() { }
//     clear()
//     delete()
//     entries()
//     forEach()
//     get()
//     has()
//     keys()
//     set()
//     size()
//     values()
//   }
// }
