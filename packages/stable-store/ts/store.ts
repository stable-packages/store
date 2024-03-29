import { idAssertions, storeMap } from './store.ctx.js'
import { type Store } from './store.types.js'

const brandedSymbol = Symbol('internal branded symbol')

/**
 * Init value is required.
 */
export type MissingInit<T> = { [brandedSymbol]: T }

/**
 * Register an assertion for the ID globally.
 *
 * Since the same stable store is used for every module loaded,
 * your ID should follow certain pattern which you can match before doing your assertion.
 *
 * e.g. `<module name><version>:<token>`.
 * so that you will not accidentally prevent other modules from using the store.
 */
export function registerIDAssertion(assertion: (id: string) => void) {
	idAssertions.push(assertion)
}

function assertID(id: string | symbol) {
	assertIDInternal(id, assertIDString)
}

function assertIDInternal(id: string | symbol, assertion: (id: string) => void) {
	if (typeof id === 'string') {
		assertion(id)
	} else if (id.description) {
		assertion(id.description)
	}
}

function assertIDString(id: string) {
	idAssertions.forEach(assertion => assertion(id))
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
	 * If specified, this store will use this assertion instead of the globally defined one.
	 */
	idAssertion?: ((id: string) => void) | undefined
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
	if (c) {
		const [s, a] = c
		if (a) assertIDInternal(id, a)
		return s as Store<V>
	}

	if (options?.idAssertion) assertIDInternal(id, options.idAssertion)

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
	storeMap.set(id, [store, options?.idAssertion])
	return store
}

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
 * @param id A unique key for the store.
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
export function getStore<V>(id: string | symbol): Store<V> {
	assertID(id)
	const c = storeMap.get(id)
	if (!c) throw new Error(`Store ${id.toString()} not found`)
	const [s, a] = c
	if (a) assertIDInternal(id, a)
	return s as Store<V>
}
