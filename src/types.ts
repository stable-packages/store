export type StoreValue = Record<string | symbol, unknown>

export type StoreVersion = `${number}.${number}.${number}` | number

export type StoreInitializer<T extends StoreValue> = (current: StoreValue, processedVersions: StoreVersion[]) => T

export type StoreOptions<T extends StoreValue> = {
  moduleName: string,
  key: string,
  version: StoreVersion,
  initializer: StoreInitializer<T>
}
