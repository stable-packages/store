import type { Store, StoreConfig, StoreKey } from './store.types.js'

export const ctx = {
	configured: false,
	logger: console as { error(...args: any[]): void },
	suppressListenerError: true,
	storeMap: Object.create(null) as Record<StoreKey, [store: Store<unknown>]>,
	initializers: Object.create(null) as Record<StoreKey, Omit<StoreConfig<any>, 'key'>[]>
}

export function resetCtx() {
	ctx.configured = false
	ctx.storeMap = Object.create(null)
	ctx.initializers = Object.create(null)
	ctx.logger = console
	ctx.suppressListenerError = true
}
