import { assertID } from './assert_id.js'
import { assertIDInternal } from './asset_id.internal.js'
import { storeMap } from './store.ctx.js'
import type { Store, StoreKey } from './store.types.js'

/**
 * Options for creating a store.
 *
 * @property suppressListenerError If true, listener errors will be suppressed.
 * @property logger A logger to log listener errors. Defaults to `console`.
 */
export interface StoreOptions<G, S = G> {
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
	onGet?: ((value: G) => void) | undefined
	/**
	 * Registers a listener to be called when the value is set.
	 *
	 * @returns An unregister l to remove the listener.
	 */
	onSet?: ((value: S) => void) | undefined
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
 * appStore.onSet(value => console.log(value)) // listen to changes
 * appStore.get() // { count: 0 }
 * appStore.set({ count: 1 })
 * ```
 *
 * @see https://www.npmjs.com/package/stable-store
 */
export function createStore<V>(key: StoreKey, init: V, options?: StoreOptions<V> | undefined): Store<V>
export function createStore<V>(
	key: StoreKey,
	init?: undefined,
	options?: StoreOptions<V | undefined, V> | undefined
): Store<V | undefined>
export function createStore<V>(key: StoreKey, init?: V | undefined, options?: StoreOptions<V> | undefined): Store<V> {
	assertID(key)
	var c = storeMap[key]
	if (c) {
		if (c[1]) assertIDInternal(key, c[1])
		return c[0] as Store<V>
	}

	if (options?.idAssertion) assertIDInternal(key, options.idAssertion)

	var getListeners: Array<(value: V) => void> = []
	var setListeners: Array<(value: V) => void> = []
	if (options?.onGet) getListeners.push(options.onGet)
	if (options?.onSet) setListeners.push(options.onSet)

	var v = init
	var logger = options?.logger ?? console
	var suppressListenerError = !!options?.suppressListenerError

	function get() {
		notify(getListeners, v)
		return v!
	}
	function set(s: V) {
		v = s
		notify(setListeners, v)
	}
	function notify(listeners: Array<(value: any) => void>, value: V | undefined) {
		listeners.forEach((fn) => {
			try {
				fn(value)
			} catch (e) {
				if (!suppressListenerError) throw e
				logger.error(e)
			}
		})
	}
	var onGet = listenerAdder<V>(getListeners)
	var onSet = listenerAdder<V>(setListeners)

	var store = { get, onGet, set, onSet }
	storeMap[key] = [store, options?.idAssertion]
	return store
}

function listenerAdder<V>(listeners: Array<(value: V) => void>) {
	return (fn: (value: V) => void) => {
		if (listeners.indexOf(fn) === -1) {
			listeners.push(fn)
		}
		return () => {
			var x = listeners.indexOf(fn)
			if (x >= 0) {
				listeners.splice(x, 1)
			}
		}
	}
}

/**
 * Get a store of of type V.
 *
 * @param id A unique key for the store.
 * @param init The optional initial value of the store.
 * @param options The optional store options.
 *
 * @example
 * ```ts
 * const appStore = store('my-app-unique-key', { count: 0 }, { suppressListenerError: true })
 *
 * appStore.onSet(value => console.log(value)) // listen to changes
 * appStore.get() // { count: 0 }
 * appStore.set({ count: 1 })
 * ```
 *
 * @see https://www.npmjs.com/package/stable-store
 */
export function getStore<V>(id: StoreKey): Store<V> {
	assertID(id)
	var c = storeMap[id]
	if (!c) throw new Error(`Store ${id.toString()} not found`)
	var [s, a] = c
	if (a) assertIDInternal(id, a)
	return s as Store<V>
}
