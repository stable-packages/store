export type StoreKey = string | symbol

/**
 * Options for creating a store..
 */
export interface StoreConfig<V> {
	id: StoreKey
	/**
	 * An optional key assertion function.
	 *
	 * This can be used to validate the caller of `getStore()` can access the store.
	 */
	keyAssertion?: (key: string | undefined) => void
	/**
	 * Version of the store.
	 * This version should follow [semantic-versioning](https://semver.org/).
	 *
	 * The correct store will be retrieved by `getStore()` based on the version requested.
	 *
	 * Depends on the use case,
	 * it can be the same as the version of your module.
	 * That means the store is not shared between different major versions of your module.
	 *
	 * You can also use a different version for each store.
	 * The version of the store determine which store will be used,
	 * and which `initialize()` function will be called.
	 */
	version?: string
	/**
	 * The initialize function of your store.
	 *
	 * When `getStore()` is called,
	 * `stable-store` will match the latest version that matches the version requested.
	 *
	 * If the store has not been created,
	 * the `initialize()` function of the matching version will be called.
	 * In that case, the `current` will be `undefined`.
	 *
	 * If the store has already created,
	 * but there is a newer compatible version registered,
	 * the `initialize()` function of the newer version will be called,
	 * and the `current` will be the value of the existing store.
	 *
	 * The value returned will be used by all compatible instances of the store.
	 */
	initialize: (current: unknown) => V
}

/**
 * A store containing value of V.
 */
export type Store<V> = {
	/**
	 * Get the current value.
	 */
	get(): V

	/**
	 * Set the value.
	 */
	set(value: V): void
	/**
	 * Registers a listener to be called when the store value is set.
	 *
	 * @param listener - A callback function to be called whenever the value is set.
	 * @returns An unregister function to remove the listener.
	 */
	onSet(listener: (value: V) => void): () => void
}
