import { StoreInitializer, StoreValue, StoreVersion, StoreKey } from './types';
export declare type Store<T extends StoreValue> = {
    /**
     * Gets value from the store.
     */
    get(): T;
    /**
     * Resets the store to its initial value.
     * You should only use this during testing.
     */
    reset(): void;
};
/**
 * Creates a store of type T.
 * @param moduleName Name of your module. This will be used during reporting.
 * @param key Specific key of the store scoped to your module. This will not appear in reporting.
 * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
 *
 * It is recommend that the key contains the purpose as well as a random value such as GUID.
 * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
 * This key should not change across versions.
 * @param initializer Initializing function for the store
 */
export declare function createStore<T extends StoreValue>(moduleName: string, key: StoreKey, version: StoreVersion, initializer: StoreInitializer<T>): Store<T>;
