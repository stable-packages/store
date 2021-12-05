import { Store } from './createStore';
import { StoreOptions, StoreValue } from './types';
/**
 * Creates a store of type T asynchronously.
 * https://github.com/unional/global-store#createAsyncStore
 */
export declare function createAsyncStore<T extends StoreValue>({ moduleName, key, version, initializer }: StoreOptions<T>): Promise<Store<T>>;
/**
 * Initializes the stores for `createAsyncStore()`.
 * https://github.com/unional/global-store#initializeAsyncStore
 */
export declare function initializeAsyncStore(moduleName: string, key?: string): void;
