import { afterEach, expect, it } from '@jest/globals'
import { idAssertions } from './index.ctx.js'
import { registerIDAssertion, createStore, getStore } from './index.js'

it('throws if store does not exist', () => {
	expect(() => getStore('does not exist')).toThrow()
})

it('returns the same store if the key is the same string', () => {
	createStore('same-key')
	const a = getStore('same-key')
	const b = getStore('same-key')
	expect(a).toBe(b)
})

afterEach(() => {
	idAssertions.splice(0, idAssertions.length)
})

it('can assert against string key', () => {
	createStore('id')
	registerIDAssertion(_ => {
		throw new Error('invalid id')
	})
	expect(() => getStore('id')).toThrow()
})

it('can assert against symbol key with description', () => {
	createStore(Symbol.for('id'))

	registerIDAssertion(_ => {
		throw new Error('invalid id')
	})
	expect(() => getStore(Symbol.for('id'))).toThrow()
})

it('can assert specific set of ids using regex', () => {
	createStore('notmatch')
	createStore('match')
	expect.assertions(2)

	registerIDAssertion(id => expect(id).toBe('match'), /^match/)
	expect(() => getStore('notmatch')).not.toThrow()
	getStore('match')
})

it('can assert specific set of ids using function', () => {
	createStore('notmatch')
	createStore('match')
	expect.assertions(2)

	registerIDAssertion(
		id => expect(id).toBe('match'),
		id => id === 'match'
	)
	expect(() => getStore('notmatch')).not.toThrow()
	getStore('match')
})
