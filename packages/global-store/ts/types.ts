export type StoreValue = Record<string | symbol, unknown>

export type StoreVersion = `${number}.${number}.${number}` | number

export type StoreInitializer<T extends StoreValue> = (current: StoreValue, processedVersions: StoreVersion[]) => T

export interface StoreOptions<T extends StoreValue> {
	moduleName: string
	key?: string
	/**
	 * The store version.
	 * It can be `major.minor.patch` (recommended) or number.
	 */
	version: StoreVersion
	initializer: StoreInitializer<T>
}
