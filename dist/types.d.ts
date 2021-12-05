export declare type StoreValue = Record<string | symbol, any>;
export declare type StoreVersion = string | number;
export declare type StoreInitializer<T extends StoreValue = any> = (current: Partial<T>, processedVersions: StoreVersion[]) => T;
export declare type StoreOptions<T extends StoreValue> = {
    moduleName: string;
    key: string;
    version: StoreVersion;
    initializer: StoreInitializer<T>;
};
