import { StoreOptions, StoreValue } from './types';
export declare type Store<T extends StoreValue> = {
    /**
     * The store value.
     */
    readonly value: T;
    /**
     * Freezes the store value.
     * @param value Optional new store value.
     * If supplied, this value will be freezed and used as the store value.
     * You can use this update the store value and freeze part of it.
     * If not supplied,
     * the original value will be freezed and its array property will also be freezed.
     */
    freeze(value?: {
        [k in keyof T]: Readonly<T[k]>;
    }): void;
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
