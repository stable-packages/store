import createStore from '.';
import { StoreInitializer, StoreValue, StoreVersion } from './types';
import { StoreCreator, StoreId, Stores } from './typesInternal';
export declare function getStoreValue<T extends StoreValue>(stores: Stores, id: StoreId): T;
export declare function initStoreValue<T extends StoreValue>(stores: Stores, id: StoreId, version: StoreVersion, initializer: StoreInitializer<T>): void;
export declare function resetStoreValue(stores: Stores, id: StoreId): void;
export declare function getStore(stores: Stores, id: StoreId): {
    versions: StoreVersion[];
    initializers: StoreInitializer<StoreValue, StoreValue>[];
    value: StoreValue;
};
export declare function resolveCreators(moduleName: string, key: string, storeCreators: Array<StoreCreator<any>>, cs: typeof createStore): void;
export declare function sortByVersion<S>(storeCreators: Array<StoreCreator<S>>): StoreCreator<S>[];
export declare function freezeStoreValue(stores: Stores, id: StoreId, value?: StoreValue): void;
