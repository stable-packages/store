import { afterEach, expect, it } from '@jest/globals'
import { testType } from 'type-plus'
import { idAssertions } from './assert_id.ctx.js'
import { createStore, registerIDAssertion, type Store } from './index.js'
import { storeMap } from './store.ctx.js'

afterEach(() => {
	idAssertions.splice(0, idAssertions.length)
	Object.keys(storeMap).forEach((k) => {
		delete storeMap[k]
	})
})

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

it('adds undefined to store type if init value is not provided', () => {
	const store = createStore<{ a: number }>('type')
	const v = store.get()
	testType.equal<typeof v, { a: number } | undefined>(true)
})

it('adds undefined to store type if init value is undefined', () => {
	const store = createStore<{ a: number }>('type', undefined)
	const v = store.get()
	testType.equal<typeof v, { a: number } | undefined>(true)
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
	s.onSet((v) => expect(v).toEqual({ a: 2 }))
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
	const unsub = s.onSet((v) => expect(v).toEqual({ a: 2 }))
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

it('can assert against string key', () => {
	registerIDAssertion((_) => {
		throw new Error('invalid id')
	})
	expect(() => createStore('id')).toThrow()
})

it('can assert against symbol key with description', () => {
	registerIDAssertion((_) => {
		throw new Error('invalid id')
	})
	expect(() => createStore(Symbol('id'))).toThrow()
})

it('can assert with per-store assertion', () => {
	expect(() =>
		createStore(
			Symbol('id'),
			{ a: 1 },
			{
				idAssertion() {
					throw new Error('just because')
				}
			}
		)
	).toThrow()
})

it('assert on re-create', () => {
	let count = 0
	createStore(
		'id',
		{ a: 1 },
		{
			idAssertion() {
				if (count === 0) {
					count++
					return
				}

				throw new Error('just because')
			}
		}
	)
	expect(() => createStore('id', { a: 1 })).toThrow()
})

it('can specify an onGet listener', () => {
	expect.assertions(1)
	const s = createStore('on-get', { a: 1 }, { onGet: (v) => expect(v).toEqual({ a: 1 }) })
	s.get()
})

it('can specify an onSet listener', () => {
	expect.assertions(1)
	const s = createStore<{ a: number }>('on-get', undefined, { onSet: (v) => expect(v).toEqual({ a: 1 }) })
	s.set({ a: 1 })
})
