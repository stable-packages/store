import type { Store, StoreConfig, StoreKey } from './store.types.js'

export const ctx = {
	configured: false,
	logger: console as { error(...args: any[]): void },
	suppressListenerError: true,
	storeMap: Object.create(null) as Record<
		StoreKey,
		[store: Store<unknown>, keyAssertion?: ((key: string | undefined) => void) | undefined]
	>,
	initializers: Object.create(null) as Record<StoreKey, Omit<StoreConfig<any>, 'key'>[]>,
	onGet: undefined as ((id: StoreKey, value: any) => void) | undefined,
	onSet: undefined as ((id: StoreKey, value: any) => void) | undefined
}

export function resetCtx() {
	ctx.configured = false
	ctx.storeMap = Object.create(null)
	ctx.initializers = Object.create(null)
	ctx.logger = console
	ctx.suppressListenerError = true
	ctx.onGet = undefined
	ctx.onSet = undefined
}

export function notify(fn:((id: StoreKey, value: any) => void) | undefined,id: StoreKey, value: any) {
	if (fn === undefined) return

	try {
		fn(id, value)
	} catch (e) {
		if (!ctx.suppressListenerError) throw e
		ctx.logger.error(e)
	}
}
