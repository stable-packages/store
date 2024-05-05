import type { Store, StoreKey, StoreConfig } from './store.types.js'

export const storeMap: Record<StoreKey, [store: Store<unknown>, assertion?: ((id: string) => void) | undefined]> =
	Object.create(null)

export const initializers: Record<StoreKey, Omit<StoreConfig<any>, 'key'>[]> = Object.create(null)
