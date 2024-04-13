import type { StoreKey } from './store.internal.types.js'
import type { Store } from './store.types.js'

export const idAssertions: Array<(id: string) => void> = []
export const storeMap = new Map<StoreKey, [store: Store<unknown>, assertion?: ((id: string) => void) | undefined]>()
