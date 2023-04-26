const storeMap = new Map<string | symbol, unknown>()

export type Store = Record<string | symbol, unknown>

export type StoreParams<T extends Store> = {
	/**
	 * Key of the store.
	 * This is used to identify the store.
	 *
	 *
	 */
	key: string | symbol
	version?: number
	initializer: (current: T, processedVersions: number[]) => T
}

export function getStore<T extends Store>(options: StoreParams<T>): T {
	const current = storeMap.has(options.key) ? (storeMap.get(options.key) as T) : ({} as T)
	return storeMap.set(options.key, options.initializer(current as T, [])).get(options.key) as T
}
