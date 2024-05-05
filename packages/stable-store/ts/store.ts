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
 * Create a store of type V.
 *
 * @param key A unique key for the store.
 * @param init The optional initial value of the store.
 * @param options The optional store options.
 *
 * @example
 * ```ts
 * const appStore = createStore('my-app-unique-key', { count: 0 }, { suppressListenerError: true })
 *
 * appStore.get() // { count: 0 }
 * appStore.set({ count: 1 })
 * ```
 *
 * @see https://www.npmjs.com/package/stable-store
 */
export function createStore<V>(options: StoreConfig<V>): Store<V> {
	var key = options.key
	assertID(key)
	var c = storeMap[key]
	if (c) {
		if (c[1]) assertIDInternal(key, c[1])
		return c[0] as Store<V>
	}

	if (options.idAssertion) assertIDInternal(key, options.idAssertion)

	var getListeners: Array<(value: V) => void> = []
	var setListeners: Array<(value: V) => void> = []
	if (options.onGet) getListeners.push(options.onGet)
	if (options.onSet) setListeners.push(options.onSet)

	var v = options.initialize(undefined)
	var logger = options.logger ?? console
	var suppressListenerError = !!options.suppressListenerError

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
	storeMap[key] = [store, options.idAssertion]
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
 * @param key A unique key for the store.
 * @param init The optional initial value of the store.
 * @param options The optional store options.
 *
 * @example
 * ```ts
 * // when the application starts
 * createStore('my-app-unique-key', { count: 0 })
 *
 * // in your code
 * const appStore = getStore('my-app-unique-key')
 *
 * appStore.get() // { count: 0 }
 * appStore.set({ count: 1 })
 * ```
 *
 * @see https://www.npmjs.com/package/stable-store
 */
export function getStore<V>(key: StoreKey): Store<V> {
	assertID(key)
	var c = storeMap[key]
	if (!c) throw new Error(`Store ${key.toString()} not found`)
	var [s, a] = c
	if (a) assertIDInternal(key, a)
	return s as Store<V>
}
