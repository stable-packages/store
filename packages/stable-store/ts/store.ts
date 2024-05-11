import { ctx, notifyHost } from './ctx.js'
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
	var id = options.id
	var c = ctx.storeMap[id]
	if (c) {
		return c[0] as Store<V>
	}

	var v = options.initialize(undefined)

	function get() {
		notifyHost(ctx.onGet, id, v)
		return v!
	}
	function set(s: V) {
		v = s
		notifyHost(ctx.onSet, id, v)
		notify(setListeners, v)
	}

	var setListeners: Array<(value: V) => void> = []
	var onSet = listenerAdder<V>(setListeners)

	var store = { get, set, onSet }
	ctx.storeMap[id] = [store]
	return store
}

function notify<V>(listeners: Array<(value: V) => void>, value: V) {
	listeners.forEach((fn) => {
		try {
			fn(value)
		} catch (e) {
			if (!ctx.suppressListenerError) throw e
			ctx.logger.error(e)
		}
	})
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
 * @param id The store id
 * @param key An optional key to validate the caller can access the store.
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
export function getStore<V>({ id, key }: { id: StoreKey; key?: string }): Store<V> {
	var c = ctx.storeMap[id]
	if (!c) throw new Error(`Store ${id.toString()} not found`)
	var [s, k] = c
	if (k) {
		k(key)
	}
	return s as Store<V>
}
