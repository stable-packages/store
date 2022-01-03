import { StoreInitializer, StoreVersion, StoreValue } from './types'

export type StoreId = { moduleName: string, key?: string }

export type Stores = Record<
  StoreId['moduleName'],
  Record<
    string,
    { versions: StoreVersion[], initializers: StoreInitializer<StoreValue>[], value: StoreValue }
  >
>

export type StoreCreator<S> = {
  version: StoreVersion,
  resolve: (store: S) => void,
  initializer: StoreInitializer<StoreValue>
}

export type StoreCreators<Store> = Record<
  StoreId['moduleName'],
  Record<string, Array<StoreCreator<Store>>>>
