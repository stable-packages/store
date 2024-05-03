import type { Store, StoreKey } from './store.types.js'

export const storeMap: Record<StoreKey, [store: Store<unknown>, assertion?: ((id: string) => void) | undefined]> =
	Object.create(null)
