import { afterEach, expect, it } from '@jest/globals'
import { resetCtx } from './ctx.js'
import { createStore, getStore } from './index.js'

afterEach(() => {
	resetCtx()
})

it('throws if store does not exist', () => {
	expect(() => getStore({ id: 'does not exist' })).toThrow()
})

it('returns the same store if the id is the same string', () => {
	createStore({
		id: 'same-key',
		initialize() {
			return { a: 1 }
		}
	})
	const a = getStore({ id: 'same-key' })
	const b = getStore({ id: 'same-key' })
	expect(a).toBe(b)
})
