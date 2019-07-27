import { StoreOptions, StoreValue } from './types';
export declare type Store<T extends StoreValue> = {
    /**
     * Value from the store.
     */
    readonly value: T;
    /**
     * Resets the store to its initial value.
     * You should only use this during testing.
     */
    reset(): void;
};
/**
 * Creates a store of type T.
 * https://github.com/unional/global-store#createstore
 */
export declare function createStore<T extends StoreValue>({ moduleName, key, version, initializer }: StoreOptions<T>): Store<T>;
