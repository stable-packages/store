import { StoreKey, StoreVersion } from './types';

export type StoreId = {
  /**
   * Name of your module. This will be used during reporting.
   */
  moduleName: string,
  /**
   * Specific key of the store scoped to your module. This will not appear in reporting.
   * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
   *
   * It is recommend that the key contains the purpose as well as a random value such as GUID.
   * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
   * This key should not change across versions.
   */
  key: StoreKey
}

export type Stores = Record<StoreId['moduleName'], Record<StoreId['key'], { versions: StoreVersion[], init: any, value: any }>>
