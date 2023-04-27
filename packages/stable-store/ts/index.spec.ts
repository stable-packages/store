import { expect, it } from '@jest/globals'
import { testType } from 'type-plus'
import { Store, store } from './index.js'

it('can use string key', () => {
	store('key')
})

it('can use symbol key', () => {
	store(Symbol('key'))
})

it('has undefined as the initial value', () => {
	const s = store('key')
	expect(s.get()).toBeUndefined()
})

it('defaults the type of value to unknown', () => {
	const s = store('key')
	testType.equal<typeof s, Store<unknown>>(true)
})

it('can specify initial value', () => {
	const s = store('init-value', 1)
	expect(s.get()).toBe(1)
})

it('defers the type of value from the initial value', () => {
	const s = store('init-value', 1)
	testType.equal<typeof s, Store<number>>(true)
})

it('returns the same store if the key is the same string', () => {
	const a = store('same-key')
	const b = store('same-key')
	expect(a).toBe(b)

	a.set(2)
	expect(b.get()).toBe(2)
})

it('returns the same store if the key is the same symbol', () => {
	const a = store(Symbol.for('same-key'))
	const b = store(Symbol.for('same-key'))
	expect(a).toBe(b)

	a.set(2)
	expect(b.get()).toBe(2)
})

it('returns different stores for different symbol even if the labels are the same', () => {
	// this is really how symbols work
	const a = store(Symbol('same-label'))
	const b = store(Symbol('same-label'))
	expect(a).not.toBe(b)

	a.set(2)
	b.set(3)
	expect(a.get()).toBe(2)
	expect(b.get()).toBe(3)
})

it('can listen to changes', () => {
	expect.assertions(1)
	const s = store('listen', { a: 1 })
	s.listen(v => expect(v).toEqual({ a: 2 }))
	s.set({ a: 2 })
})

it('notifies the same listener only once', () => {
	expect.assertions(1)
	const s = store('listen-same-listener', { a: 1 })
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	s.listen(listener)
	s.listen(listener)
	s.set({ a: 2 })
})

it('can unsubscribe from changes', () => {
	expect.assertions(1)
	const s = store('unsubscribe', { a: 1 })
	const unsub = s.listen(v => expect(v).toEqual({ a: 2 }))
	s.set({ a: 2 })
	unsub()
	s.set({ a: 3 })
})

it('can unsubscribe from changes with same listener', () => {
	expect.assertions(1)
	const s = store('unsubscribe-same-listener', { a: 1 })
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	const unsub = s.listen(listener)
	s.set({ a: 2 })
	unsub()
	s.set({ a: 3 })
})

it('ignores unsubscribe call if already unsubscribed', () => {
	expect.assertions(1)
	const s = store('unsubscribe-already-unsubscribed', { a: 1 })
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	const unsub = s.listen(listener)
	s.set({ a: 2 })
	unsub()
	unsub()
	s.set({ a: 3 })
})

it('ignores unsubscribe call if already unsubscribed (from different listen call with the same listener)', () => {
	expect.assertions(1)
	const s = store('unsubscribe-already-unsubscribed', { a: 1 })
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	const unsub1 = s.listen(listener)
	const unsub2 = s.listen(listener)
	s.set({ a: 2 })
	unsub1()
	unsub2()
	s.set({ a: 3 })
})

it('can suppress listener error', () => {
	const s = store('suppress-listener-error', { a: 1 }, { suppressListenerError: true })
	const listener = () => {
		throw new Error('listener error to console')
	}
	s.listen(listener)
	s.set({ a: 2 })
})

it('can use a different logger', () => {
	expect.assertions(1)
	const logger = {
		error(error: Error) {
			expect(error.message).toEqual('listener error')
		}
	}

	const s = store(
		'different-logger',
		{ a: 1 },
		{
			suppressListenerError: true,
			logger
		}
	)
	s.listen(() => {
		throw new Error('listener error')
	})
	s.set({ a: 2 })
})
