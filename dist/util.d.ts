import { StoreInitializer, StoreValue, StoreVersion, StoreKey } from './types';
import { StoreId, Stores } from './typesInternal';
export declare function getStoreValue(stores: Stores, id: StoreId): any;
export declare function initStoreValue<T extends StoreValue>(stores: Stores, id: StoreId, version: StoreVersion, initializer: StoreInitializer<T>): void;
export declare function resetStoreValue(stores: Stores, id: StoreId): void;
export declare function getStore(stores: Stores, id: StoreId): {
    versions: StoreVersion[];
    init: any;
    value: any;
};
export declare function createStoreValue(initialValue: any): any;
export declare type StoreCreator<S> = {
    version: StoreVersion;
    resolve: (store: S) => void;
    initializer: StoreInitializer<any>;
};
export declare function resolveCreators<S>(moduleName: string, key: StoreKey, storeCreators: Array<StoreCreator<S>>, createStore: any): void;
export declare function sortByVersion<S>(storeCreators: Array<StoreCreator<S>>): StoreCreator<S>[];
export declare function compareVersion(a: string, b: string): number;
