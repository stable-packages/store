import { afterEach, expect, it } from '@jest/globals'
import { addIDAssertion, createStore } from './index.js'
import { idAssertions } from './index.ctx.js'

afterEach(() => {
	idAssertions.splice(0, idAssertions.length)
})

it('can assert against string key', () => {
	addIDAssertion(_ => {
		throw new Error('invalid id')
	})
	expect(() => createStore('id')).toThrow()
})

it('can assert against symbol key with description', () => {
	addIDAssertion(_ => {
		throw new Error('invalid id')
	})
	expect(() => createStore(Symbol('id'))).toThrow()
})

it('can assert specific set of ids using regex', () => {
	expect.assertions(2)

	addIDAssertion(id => expect(id).toBe('match'), /^match/)
	expect(() => createStore('notmatch')).not.toThrow()
	createStore('match')
})

it('can assert specific set of ids using function', () => {
	expect.assertions(2)

	addIDAssertion(
		id => expect(id).toBe('match'),
		id => id === 'match'
	)
	expect(() => createStore('notmatch')).not.toThrow()
	createStore('match')
})
