import { Store } from './createStore';
import { StoreInitializer, StoreKey, StoreValue, StoreVersion } from './types';
export declare type ReadonlyStore<T extends StoreValue> = Store<T> & {
    /**
     * Gets a writable value from the store.
     * This can be used for configure the store value before it is locked.
     * This is useful if your configuration is distributed in nature.
     * When configuration is completed,
     * you should `lock()` the store and use the `get()` method.
     */
    getWritable(): T;
    /**
     * Disable the readonly feature of the store.
     * Calling this function will make the store not readonly.
     * It will behaves just like the normal `Store`.
     * Obviously, you should only call this during testing.
     */
    disableProtection(): void;
    /**
     * Lock the store so that it cannot be modified.
     * @param finalizer A finalizer object to do a final process of the value.
     * You can use this to change the value, or freeze object.
     * By default, the value itself will be frozen,
     * If it contains array properties, those will also be frozen.
     */
    lock(finalizer?: Partial<{
        [K in keyof T]: (value: T[K]) => T[K];
    }> & Record<keyof any, (value: any) => any>): ReadonlyStore<T>;
};
/**
 * Creates a readonly store of type T.
 * @param moduleName Name of your module. This will be used during reporting.
 * @param key Specific key of the store scoped to your module. This will not appear in reporting.
 * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
 *
 * It is recommend that the key contains the purpose as well as a random value such as GUID.
 * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
 * This key should not change across versions.
 * @param initializer Initializing function for the store.
 */
export declare function createReadonlyStore<T extends StoreValue>(moduleName: string, key: StoreKey, version: StoreVersion, initializer: StoreInitializer<T>): ReadonlyStore<T>;
