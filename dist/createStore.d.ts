import { StoreOptions, StoreValue } from './types';
export declare type Store<T extends StoreValue> = {
    /**
     * The store value.
     */
    readonly value: T;
    /**
     * Freezes the store value.
     * @param value Optional new store value.
     * You can use this update the store value and freeze part of it.
     */
    freeze(value?: T): void;
    /**
     * Resets the store to its initial value.
     * You should only use this during testing.
     */
    reset(): void;
};
/**
 * Creates a store of type T.
 * https://www.npmjs.com/package/global-store
 */
export declare function createStore<T extends StoreValue>({ moduleName, key, version, initializer }: StoreOptions<T>): Store<T>;
