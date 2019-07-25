import { ReadonlyStore } from './createReadonlyStore';
import { StoreOptions, StoreValue } from './types';
/**
 * Creates a readonly store of type T.
 * https://github.com/unional/global-store#createAsyncReadonlyStore
 */
export declare function createAsyncReadonlyStore<T extends StoreValue>({ moduleName, key, version, initializer }: StoreOptions<T>): Promise<ReadonlyStore<T>>;
/**
 * Initializes the stores for `createAsyncReadonlyStore()`.
 * https://github.com/unional/global-store#initializeAsyncReadonlyStore
 */
export declare function initializeAsyncReadonlyStore(moduleName: string, key?: string): void;
