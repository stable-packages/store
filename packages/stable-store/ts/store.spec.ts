import { expect, it } from '@jest/globals'
import { getStore } from './index.js'

const testStoreSymbol = Symbol('testStore')

it('gets init value if empty', () => {
	const r = getStore<{ a: number }>({
		key: testStoreSymbol,
		initializer: current => ({
			...current,
			a: 1
		})
	})

	expect(r).toEqual({ a: 1 })
})
