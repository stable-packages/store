import { StoreInitializer, StoreVersion } from './types';

export type StoreId = { moduleName: string, key: string }

export type Stores = Record<StoreId['moduleName'], Record<StoreId['key'], { versions: StoreVersion[], init: any, value: any }>>

export type StoreCreator<S> = {
  version: StoreVersion,
  resolve: (store: S) => void,
  initializer: StoreInitializer<any>
}

export type StoreCreators<Store> = Record<StoreId['moduleName'], Record<StoreId['key'], Array<StoreCreator<Store>>>>
