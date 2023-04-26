import type { StoreInitializer, StoreValue, StoreVersion } from './types.js'
import type { Store, StoreId, Stores } from './typesInternal.js'
import { toVersionArray, type ParsedVersion } from './version.js'

export function initStoreValue<T extends StoreValue>(
	stores: Stores,
	id: StoreId,
	version: StoreVersion,
	initializer: StoreInitializer<T>
) {
	const store = getStore(stores, id)
	if (shouldInvokeInitializer(store.versions, version)) {
		store.initializers.push(initializer as StoreInitializer<StoreValue>)
		store.value = initializer(store.value as T, store.versions)
		store.versions.push(version)
	}
}

export function getStoreValue<T extends StoreValue>(stores: Stores, id: StoreId): T {
	return getStore(stores, id).value as T
}

export function freezeStoreValue(stores: Stores, id: StoreId, value?: StoreValue) {
	const store = getStore(stores, id)
	store.value = value
		? Object.isFrozen(value)
			? value
			: Object.freeze(value)
		: freezeValue(store.value)
}

function freezeValue(storeValue: StoreValue) {
	if (Object.isFrozen(storeValue)) throw TypeError('Frozen value cannot be freezed again')

	Object.keys(storeValue).forEach(k => freezeIfIsArray(storeValue, k))
	// istanbul ignore next
	if (Object.getOwnPropertySymbols) {
		Object.getOwnPropertySymbols(storeValue).forEach(k => freezeIfIsArray(storeValue, k))
	}

	return Object.freeze(storeValue)
}

function freezeIfIsArray(storeValue: StoreValue, k: string | number | symbol) {
	const value = storeValue[k]
	if (Array.isArray(value)) {
		storeValue[k] = Object.freeze(value)
	}
}

export function resetStoreValue(stores: Stores, id: StoreId) {
	const store = getStore(stores, id)
	const versions = store.versions
	store.versions = []
	store.value = store.initializers.reduce<StoreValue>((value, initializer, i) => {
		value = initializer(value, store.versions)
		store.versions.push(versions[i]!)
		return value
	}, {})
}

function getStore(stores: Stores, id: StoreId) {
	const moduleStore = (stores[id.moduleName] = stores[id.moduleName] ?? Object.create(null) as Store)
	// const moduleStore = (stores[id.moduleName] = stores[id.moduleName] || Object.create(null))
	const key = id.key ?? 'default'
	return (moduleStore[key] = moduleStore[key] || {
		versions: [],
		value: {},
		initializers: []
	})
}

/**
 * @internal
 */
export function shouldInvokeInitializer(versions: StoreVersion[], version: StoreVersion) {
	const vs = versions.map(toVersionArray)
	const v = toVersionArray(version)
	return noMatchMajor(vs, v) || hasNewVersion(vs, v)
}

function noMatchMajor(versions: ParsedVersion[], version: ParsedVersion) {
	return !versions.some(v => v[0] === version[0])
}

function hasNewVersion(versions: ParsedVersion[], version: ParsedVersion) {
	return versions
		.filter(v => v[0] === version[0])
		.some(v => version[1] > v[1] || (version[1] === v[1] && version[2] > v[2]))
}
