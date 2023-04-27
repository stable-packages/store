import { createStore } from 'global-store'

export const globalStore = createStore({
	moduleName: 'example-library',
	version: 0,
	initializer: () => ({ count: 0 })
})
