import defaultCreate, { createStore } from './index.js'

describe('package', () => {
	test('default export is `createStore`', () => {
		expect(defaultCreate).toBe(createStore)
	})
})
