import { Store } from './createStore';
import { StoreInitializer, StoreKey, StoreValue, StoreVersion } from './types';
/**
 * Creates a store of type T asychronously.
 * @param moduleName Name of your module. This will be used during reporting.
 * @param key Specific key of the store scoped to your module. This will not appear in reporting.
 * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
 *
 * It is recommend that the key contains the purpose as well as a random value such as GUID.
 * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
 * This key should not change across versions.
 * @param version Version of the store. It can be numeric or string in the format of "major.minor.patch".
 * No other string format is accepted.
 * When it is numeric, it is compare to the patch number of the string version,
 * if there is a mix of number and string versions.
 * @param initializer Initializing function for the store
 */
export declare function createAsyncStore<T extends StoreValue, V extends StoreVersion>(moduleName: string, key: StoreKey, version: V, initializer: StoreInitializer<T>): Promise<Store<T>>;
/**
 * Initializes the stores for `createAsyncStore()`.
 */
export declare function initializeAsyncStore(moduleName: string, key?: StoreKey): void;
