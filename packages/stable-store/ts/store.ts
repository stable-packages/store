import { ctx } from './ctx.js'
import type { Store, StoreConfig, StoreKey } from './store.types.js'

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
	var c = ctx.storeMap[key]
	if (c) {
		return c[0] as Store<V>
	}

	var getListeners: Array<(value: V) => void> = []
	var setListeners: Array<(value: V) => void> = []
	if (options.onGet) getListeners.push(options.onGet)
	if (options.onSet) setListeners.push(options.onSet)

	var v = options.initialize(undefined)

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
				if (!ctx.suppressListenerError) throw e
				ctx.logger.error(e)
			}
		})
	}
	var onGet = listenerAdder<V>(getListeners)
	var onSet = listenerAdder<V>(setListeners)

	var store = { get, onGet, set, onSet }
	ctx.storeMap[key] = [store]
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
	var c = ctx.storeMap[key]
	if (!c) throw new Error(`Store ${key.toString()} not found`)
	var [s] = c
	return s as Store<V>
}
