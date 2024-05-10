import { ctx } from './ctx.js'
import type { StoreKey } from './store.types.js'

export interface Config {
	/**
	 * Specify a logger to log listener errors.
	 * Defaults to `console`.
	 */
	logger?: { error(...args: any[]): void } | undefined
	/**
	 * The error thrown within listener will be suppressed and logged through the `logger`.
	 *
	 * Defaults to true
	 */
	suppressListenerError?: boolean | undefined
	/**
	 * Registers a listener to be called whenever a store value is retrieved.
	 *
	 * This is used mostly for debugging purpose.
	 *
	 * @param listener - A callback function to be called whenever the value is retrieved.
	 * The first parameter is the `id` of the store,
	 * and the second one is the retrieved value.
	 * @return An unregister function to remove the listener.
	 */
	onGet?: (id: StoreKey, value: any) => void
	/**
	 * Registers a listener to be called when the store value is set.
	 *
	 * This is used mostly for debugging purpose.
	 *
	 * @param listener - A callback function to be called whenever the value is set.
	 * The first parameter is the `id` of the store,
	 * and the second one is the new value.
	 * @returns An unregister function to remove the listener.
	 */
	onSet?: (id: StoreKey, value: any) => void
}

/**
 * Configure `stable-store` overall environment.
 * This should be called by the host application and it should be called only once.
 *
 * Calling this function more than once will throw an exception.
 */
export function config({ logger, suppressListenerError, onGet, onSet }: Config) {
	if (ctx.configured) {
		throw new Error('stable-store is already configured')
	}

	ctx.configured = true
	ctx.logger = logger ?? console
	ctx.suppressListenerError = suppressListenerError ?? true
	ctx.onGet = onGet
	ctx.onSet = onSet
}
