import { afterEach } from '@jest/globals'
import { idAssertions } from './index.ctx.js'
import { addIDAssertion } from './index.js'
import { expect, it } from '@jest/globals'
import { testType } from 'type-plus'
import { MissingInit, createStore, type Store } from './index.js'

it('can create store with string key', () => {
	createStore('key')
})

it('can create store with symbol key', () => {
	createStore(Symbol('key'))
})

it('defaults store type to unknown', () => {
	const store = createStore('default to unknown')
	testType.equal<typeof store, Store<unknown>>(true)
})

it('can specify the type of the store', () => {
	const store = createStore<{ a: number; b?: string }>('type', { a: 1 })
	testType.equal<typeof store, Store<{ a: number; b?: string }>>(true)
})

it('requires init if the type does not include undefined', () => {
	const store = createStore<{ a: number }>('type')
	testType.equal<typeof store, MissingInit<{ a: number }>>(true)
})

it('allows skipping init value if type includes undefined', () => {
	const store = createStore<{ a: number } | undefined>('type')
	testType.equal<typeof store, Store<{ a: number } | undefined>>(true)
})

it('contains the initial value', () => {
	const s = createStore('init-value', 1)
	expect(s.get()).toBe(1)
})

it('infers the type of value from the initial value', () => {
	const s = createStore('init-value', 1)
	testType.equal<typeof s, Store<number>>(true)
})

it('returns the same store if the key is the same string', () => {
	const a = createStore('same-key')
	const b = createStore('same-key')
	expect(a).toBe(b)

	a.set(2)
	expect(b.get()).toBe(2)
})

it('returns the same store if the key is the same symbol', () => {
	const a = createStore(Symbol.for('same-key'))
	const b = createStore(Symbol.for('same-key'))
	expect(a).toBe(b)

	a.set(2)
	expect(b.get()).toBe(2)
})

it('returns different stores for different symbol even if the labels are the same', () => {
	// this is really how symbols work
	const a = createStore(Symbol('same-label'))
	const b = createStore(Symbol('same-label'))
	expect(a).not.toBe(b)

	a.set(2)
	b.set(3)
	expect(a.get()).toBe(2)
	expect(b.get()).toBe(3)
})

it('can listen to changes', () => {
	expect.assertions(1)
	const s = createStore('listen', { a: 1 })
	s.onSet(v => expect(v).toEqual({ a: 2 }))
	s.set({ a: 2 })
})

it('notifies the same listener only once', () => {
	expect.assertions(1)
	const s = createStore('listen-same-listener', { a: 1 })
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	s.onSet(listener)
	s.onSet(listener)
	s.set({ a: 2 })
})

it('can unsubscribe from changes', () => {
	expect.assertions(1)
	const s = createStore('unsubscribe', { a: 1 })
	const unsub = s.onSet(v => expect(v).toEqual({ a: 2 }))
	s.set({ a: 2 })
	unsub()
	s.set({ a: 3 })
})

it('can unsubscribe from changes with same listener', () => {
	expect.assertions(1)
	const s = createStore('unsubscribe-same-listener', { a: 1 })
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	const unsub = s.onSet(listener)
	s.set({ a: 2 })
	unsub()
	s.set({ a: 3 })
})

it('ignores unsubscribe call if already unsubscribed', () => {
	expect.assertions(1)
	const s = createStore('unsubscribe-already-unsubscribed', { a: 1 })
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	const unsub = s.onSet(listener)
	s.set({ a: 2 })
	unsub()
	unsub()
	s.set({ a: 3 })
})

it('ignores unsubscribe call if already unsubscribed (from different listen call with the same listener)', () => {
	expect.assertions(1)
	const s = createStore('unsubscribe-already-unsubscribed', { a: 1 })
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	const unsub1 = s.onSet(listener)
	const unsub2 = s.onSet(listener)
	s.set({ a: 2 })
	unsub1()
	unsub2()
	s.set({ a: 3 })
})

it('can suppress listener error', () => {
	const s = createStore('suppress-listener-error', { a: 1 }, { suppressListenerError: true })
	const listener = () => {
		throw new Error('listener error to console')
	}
	s.onSet(listener)
	s.set({ a: 2 })
})

it('can use a different logger', () => {
	expect.assertions(1)
	const logger = {
		error(error: Error) {
			expect(error.message).toEqual('listener error')
		}
	}

	const s = createStore(
		'different-logger',
		{ a: 1 },
		{
			suppressListenerError: true,
			logger
		}
	)
	s.onSet(() => {
		throw new Error('listener error')
	})
	s.set({ a: 2 })
})

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

it.todo('per store id assertions')
