import type { StoreInitializer, StoreValue, StoreVersion } from './types.js'

export interface StoreId {
	moduleName: string
	key?: string | undefined
}

export type Stores = Record<
	StoreId['moduleName'],
	Record<string, { versions: StoreVersion[]; initializers: StoreInitializer<StoreValue>[]; value: StoreValue }>
>

export interface StoreCreator<S> {
	version: StoreVersion
	resolve: (store: S) => void
	initializer: StoreInitializer<StoreValue>
}

export type StoreCreators<Store> = Record<StoreId['moduleName'], Record<string, Array<StoreCreator<Store>>>>
