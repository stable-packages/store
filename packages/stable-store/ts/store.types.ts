export type StoreKey = string | symbol

/**
 * Options for creating a store..
 */
export interface StoreConfig<V> {
	/**
	 * A unique key for the store.
	 * It can be a string or a symbol.
	 *
	 * This key must remain the same as across versions.
	 * That means you need to use `Synbol.for()` to create a symbol as `Symbol()` cannot be shared across modules.
	 *
	 * So the simplest way to define your key is using your module name,
	 * and maybe adding a random uuid after it (e.g. `<module>:<uuid>`).
	 *
	 * You can also create multiple stores for different purposes.
	 * In that case: `<module>:<purpose>:<uuid>`
	 *
	 * @example
	 * `@just-web/store:state:0fc2bd30-183c-555f-bfff-8299218f7b6b`
	 */
	key: StoreKey
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
	/**
	 * If true, any listener errors will be suppressed and logged through the `logger`.
	 */
	suppressListenerError?: boolean | undefined
	/**
	 * If specified, this store will use this assertion instead of the globally defined one.
	 */
	idAssertion?: ((id: string) => void) | undefined
	/**
	 * Specify a logger to log listener errors.
	 * Defaults to `console`.
	 */
	logger?: { error(...args: any[]): void } | undefined
	/**
	 * Registers a listener to be called whenever the value is retrieved..
	 *
	 * This is used mostly for debugging purpose.
	 */
	onGet?: ((value: V) => void) | undefined
	/**
	 * Registers a listener to be called when the value is set.
	 *
	 * @returns An unregister l to remove the listener.
	 */
	onSet?: ((value: V) => void) | undefined
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
	 * Registers a listener to be called whenever the value is retrieved.
	 *
	 * This is used mostly for debugging purpose.
	 *
	 * @param listener - A callback function to be called whenever the value is retrieved.
	 * It should take in one parameter, the retrieved value.
	 * @return A function that can be called to remove the listener from the list of listeners.
	 */
	onGet(listener: (value: V) => void): () => void
	/**
	 * Set the value.
	 */
	set(value: V): void
	/**
	 * Registers a listener to be called when the value is set.
	 *
	 * @returns An unregister l to remove the listener.
	 */
	onSet(listener: (value: V) => void): () => void
}
