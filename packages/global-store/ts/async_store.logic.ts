import { createStore } from './store.js'
import type { StoreCreator } from './typesInternal.js'
import { compareVersion } from './version.js'

export function resolveCreators(
	moduleName: string,
	key: string,
	storeCreators: Array<StoreCreator<any>>,
	cs: typeof createStore
) {
	sortByVersion(storeCreators).forEach(({ version, resolve, initializer }) =>
		resolve(cs({ moduleName, key, version, initializer }))
	)
}

function sortByVersion<S>(storeCreators: Array<StoreCreator<S>>) {
	return storeCreators.sort((a, b) => compareVersion(a.version, b.version))
}
