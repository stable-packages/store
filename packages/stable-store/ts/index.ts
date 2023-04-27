

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
	listen(fn: (value: V) => void): () => void
	notify(): void
}

/**
 * Options for creating a store.
 *
 * @property suppressListenerError If true, listener errors will be suppressed.
 * @property logger A logger to log listener errors. Defaults to `console`.
 */
export type StoreOptions = {
	/**
	 * If true, any listener errors will be suppressed and logged through the `logger`.
	 */
	suppressListenerError?: boolean
	/**
	 * Specify a logger to log listener errors.
	 * Defaults to `console`.
	 */
	logger?: { error(...args: any[]): void }
}

/**
 * Get a store of of type V.
 *
 * @param key A unique key for the store.
 * @param init The optional initial value of the store.
 * @param options The optional store options.
 *
 * @example
 * ```ts
 * const appStore = store('my-app-unique-key', { count: 0 }, { suppressListenerError: true })
 *
 * appStore.listen(value => console.log(value)) // listen to changes
 * appStore.get() // { count: 0 }
 * appStore.set({ count: 1 })
 * ```
 *
 * @see https://www.npmjs.com/package/stable-store
 */
export function store<V>(key: string | symbol, init?: V, options?: StoreOptions) {
	return (storeMap.get(key) ?? create(key, init, options)) as Store<V>
}

function create<V>(key: StoreKey, init?: V, options?: StoreOptions) {
	var v = init
	var listeners: Array<(value: V) => void> = []
	var logger = options?.logger ?? console
	var suppressListenerError = options?.suppressListenerError ?? false

	function get() {
		return v
	}
	function set(s: V) {
		v = s
		notify()
	}
	function notify() {
		listeners.forEach(fn => {
			try {
				fn(v!)
			} catch (e) {
				if (suppressListenerError) {
					logger.error(e)
				} else {
					throw e
				}
			}
		})
	}
	function listen(fn: (value: V) => void) {
		if (listeners.indexOf(fn) === -1) {
			listeners.push(fn)
		}
		return () => {
			const x = listeners.indexOf(fn)
			if (x >= 0) {
				listeners.splice(x, 1)
			}
		}
	}

	const store = { get, set, listen, notify }
	storeMap.set(key, store)
	return store
}

type StoreKey = string | symbol
const storeMap = new Map<StoreKey, Store<unknown>>()
