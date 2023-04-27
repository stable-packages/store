import { it } from '@jest/globals'

it.todo('first test')
// import { expect, it, test } from '@jest/globals'
// import { getStore } from './index.js'

// const testStoreSymbol = Symbol('testStore')

// it('gets init value if empty', () => {
// 	const r = getStore({
// 		key: testStoreSymbol,
// 		initializer: () => ({
// 			a: 1
// 		})
// 	})

// 	expect(r).toEqual({ a: 1 })
// })

// it('passes undefined as current if the store has not been created yet', () => {
// 	getStore({
// 		key: Symbol('testStore'),
// 		initializer: current => {
// 			expect(current).toBeUndefined()
// 			return {}
// 		}
// 	})
// })

// it('returns the same store if the key is the same', () => {
// 	const a = getStore({
// 		key: 'same-key',
// 		initializer: (current: { a: number } | undefined) => {
// 			if (!current) return { a: 1 }
// 			return { ...current, a: current.a + 1 }
// 		}
// 	})

// 	const b = getStore({
// 		key: 'same-key',
// 		initializer: (current: { a: number } | undefined) => {
// 			if (!current) return { a: 1 }
// 			return { ...current, a: current.a + 1 }
// 		}
// 	})

// 	expect(b).toEqual({ a: 2 })
// })
