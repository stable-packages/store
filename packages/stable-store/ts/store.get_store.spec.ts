import { afterEach, expect, it } from '@jest/globals'
import { idAssertions } from './assert_id.ctx.js'
import { createStore, getStore, registerIDAssertion } from './index.js'
import { storeMap } from './store.ctx.js'

it('throws if store does not exist', () => {
	expect(() => getStore('does not exist')).toThrow()
})

it('returns the same store if the key is the same string', () => {
	createStore( {
		key:'same-key',
		initialize() {
			return { a: 1 }
		}
	})
	const a = getStore('same-key')
	const b = getStore('same-key')
	expect(a).toBe(b)
})

afterEach(() => {
	idAssertions.splice(0, idAssertions.length)
	Object.keys(storeMap).forEach((k) => {
		delete storeMap[k]
	})
})

it('can assert against string key', () => {
	createStore( {
		key: 'id',
		initialize() {
			return { a: 1 }
		}
	})
	registerIDAssertion((_) => {
		throw new Error('invalid id')
	})
	expect(() => getStore('id')).toThrow()
})

it('can assert against symbol key with description', () => {
	createStore( {
		key: Symbol.for('id'),
		initialize() {
			return { a: 1 }
		}
	})

	registerIDAssertion((_) => {
		throw new Error('invalid id')
	})
	expect(() => getStore(Symbol.for('id'))).toThrow()
})

it('uses per-store assertion', () => {
	let count = 0
	createStore( {
		key: 'id',
		initialize() {
			return { a: 1 }
		},
		idAssertion() {
			if (count === 0) {
				count++
				return
			}

			throw new Error('just because')
		}
	})

	expect(() => getStore('id')).toThrow()
})
