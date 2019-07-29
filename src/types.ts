export type StoreOptions<T extends StoreValue> = {
  moduleName: string,
  key: string,
  version: StoreVersion,
  initializer: StoreInitializer<T>
}

export type StoreValue = Record<string | symbol, any>

export type StoreVersion = string | number

export type StoreInitializer<T extends StoreValue = any> = (current: T, processedVersions: StoreVersion[]) => T
