import { idAssertions } from './index.ctx.js'

export const brandedSymbol = Symbol('internal branded symbol')

/**
 * Init value is required.
 */
export type MissingInit<T> = { [brandedSymbol]: T }

/**
 * Add an assertion for the ID globally.
 *
 *
 */
export function addIDAssertion(
	assertion: (id: string) => void,
	filter?: string | RegExp | ((id: string) => boolean)
) {
	idAssertions.push([assertion, filter])
}

function assertID(id: string | symbol) {
	if (typeof id === 'string') {
		assertIDString(id)
	} else if (id.description) {
		assertIDString(id.description)
	}
}

function assertIDString(id: string) {
	idAssertions.forEach(([assertion, filter]) => {
		if (
			!filter ||
			(filter instanceof RegExp && filter.test(id)) ||
			(typeof filter === 'function' && filter(id))
		) {
			assertion(id)
		}
	})
}

/**
 * A store containing value of V.
 */
export type Store<V> = {
	/**
	 * Get the current value.
	 */
	get(): V
	onGet(fn: (value: V) => void): () => void
	/**
	 * Set the value.
	 */
	set(value: V): void
	onSet(fn: (value: V) => void): () => void
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
	idAssertion?: (id: string) => void
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
export function createStore<V>(key: string | symbol, init: V, options?: StoreOptions): Store<V>
export function createStore<V>(
	key: string | symbol,
	init?: undefined,
	options?: StoreOptions
): [undefined] extends [V] ? Store<V> : MissingInit<V>
export function createStore<V>(id: string | symbol, init?: V, options?: StoreOptions): Store<V> {
	assertID(id)
	const c = storeMap.get(id)
	if (c) return c as Store<V>

	var setListeners: Array<(value: V | undefined) => void> = []
	var getListeners: Array<(value: V | undefined) => void> = []

	var v = init
	var logger = options?.logger ?? console
	var suppressListenerError = options?.suppressListenerError ?? false

	function get() {
		notify(getListeners, v)
		return v!
	}
	function set(s: V) {
		v = s
		notify(setListeners, v)
	}
	function notify(listeners: Array<(value: V | undefined) => void>, value: V | undefined) {
		listeners.forEach(fn => {
			try {
				fn(value)
			} catch (e) {
				if (suppressListenerError) {
					logger.error(e)
				} else {
					throw e
				}
			}
		})
	}
	const onGet = listenerAdder<V>(getListeners)
	const onSet = listenerAdder<V>(setListeners)

	const store = { get, onGet, set, onSet }
	storeMap.set(id, store)
	return store
}

type StoreKey = string | symbol
const storeMap = new Map<StoreKey, Store<unknown>>()

function listenerAdder<V>(listeners: Array<(value: V) => void>) {
	return function (fn: (value: V) => void) {
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
export function getStore<V>(key: string): Store<V> {
	const c = storeMap.get(key)
	if (!c) throw new Error(`Store ${key} not found`)
	return c as Store<V>
}
