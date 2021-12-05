export type StoreValue = Record<string | symbol, any>

export type StoreVersion = string | number

export type StoreInitializer<T extends StoreValue = any> = (current: Partial<T>, processedVersions: StoreVersion[]) => T

export type StoreOptions<T extends StoreValue> = {
  moduleName: string,
  key: string,
  version: StoreVersion,
  initializer: StoreInitializer<T>
}
