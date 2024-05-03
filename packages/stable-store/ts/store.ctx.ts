import type { StoreKey } from './store.internal.types.js'
import type { Store } from './store.types.js'

export const storeMap: Record<StoreKey, [store: Store<unknown>, assertion?: ((id: string) => void) | undefined]> =
	Object.create(null)
