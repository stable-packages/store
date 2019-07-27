import { StoreInitializer, StoreVersion, StoreValue } from './types';

export type StoreId = { moduleName: string, key: string }

export type Stores = Record<
  StoreId['moduleName'],
  Record<
    StoreId['key'],
    { versions: StoreVersion[], initializers: StoreInitializer[], value: StoreValue }
  >
>

export type StoreCreator<S> = {
  version: StoreVersion,
  resolve: (store: S) => void,
  initializer: StoreInitializer
}

export type StoreCreators<Store> = Record<StoreId['moduleName'], Record<StoreId['key'], Array<StoreCreator<Store>>>>
