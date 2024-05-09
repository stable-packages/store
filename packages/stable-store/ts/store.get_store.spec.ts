import { afterEach, expect, it } from '@jest/globals'
import { resetCtx } from './ctx.js'
import { createStore, getStore } from './index.js'

afterEach(() => {
	resetCtx()
})

it('throws if store does not exist', () => {
	expect(() => getStore('does not exist')).toThrow()
})

it('returns the same store if the key is the same string', () => {
	createStore({
		key: 'same-key',
		initialize() {
			return { a: 1 }
		}
	})
	const a = getStore('same-key')
	const b = getStore('same-key')
	expect(a).toBe(b)
})
