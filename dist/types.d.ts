export declare type StoreValue = Record<string | symbol, unknown>;
export declare type StoreVersion = `${number}.${number}.${number}` | number;
export declare type StoreInitializer<T extends StoreValue> = (current: StoreValue, processedVersions: StoreVersion[]) => T;
export declare type StoreOptions<T extends StoreValue> = {
    moduleName: string;
    key?: string;
    version: StoreVersion;
    initializer: StoreInitializer<T>;
};
