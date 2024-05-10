import { afterEach, expect, it } from '@jest/globals'
import { testType } from 'type-plus'
import { resetCtx } from './ctx.js'
import { createStore, type Store } from './index.js'

afterEach(() => {
	resetCtx()
})

it('can create store with string key', () => {
	createStore({
		id: 'library-a',
		version: '1.0.0',
		initialize() {
			return { a: 1 }
		}
	})
})

it('can create store with symbol key', () => {
	createStore({
		id: Symbol.for('library-b'),
		version: '1.0.0',
		initialize() {
			return { a: 1 }
		}
	})
})

it('defaults store type to return type of initialize', () => {
	const store = createStore({
		id: 'return-type',
		version: '1.0.0',
		initialize() {
			return { a: 1 }
		}
	})
	testType.equal<typeof store, Store<{ a: number }>>(true)
})

it('can specify the type of the store using type params', () => {
	const store = createStore<{ a: number; b?: string }>({
		id: 'type-specified',
		version: '1.0.0',
		initialize() {
			return { a: 1 }
		}
	})
	testType.equal<typeof store, Store<{ a: number; b?: string }>>(true)
})

it('contains the initial value', () => {
	const s = createStore({
		id: 'initial-value',
		version: '1.0.0',
		initialize() {
			return 1
		}
	})
	expect(s.get()).toBe(1)
})

it.skip('throws if creating store with same key', () => {
	createStore({
		id: 'duplicate-key',
		version: '1.0.0',
		initialize() {
			return 1
		}
	})
	expect(() =>
		createStore({
			id: 'duplicate-key',
			version: '1.0.0',
			initialize() {
				return 1
			}
		})
	).toThrow()
})

it('returns the same store if the key is the same string', () => {
	const a = createStore({
		id: 'same-key',
		initialize() {
			return 1
		}
	})
	const b = createStore({
		id: 'same-key',
		initialize() {
			return 1
		}
	})
	expect(a).toBe(b)

	a.set(2)
	expect(b.get()).toBe(2)
})

it('returns the same store if the key is the same symbol', () => {
	const a = createStore({
		id: Symbol.for('same-key'),
		initialize() {
			return 1
		}
	})
	const b = createStore({
		id: Symbol.for('same-key'),
		initialize() {
			return 1
		}
	})
	expect(a).toBe(b)

	a.set(2)
	expect(b.get()).toBe(2)
})

it('returns different stores for different symbol even if the labels are the same', () => {
	// this is really how symbols work
	const a = createStore({
		id: Symbol('same-label'),
		initialize() {
			return 1
		}
	})
	const b = createStore({
		id: Symbol('same-label'),
		initialize() {
			return 1
		}
	})
	expect(a).not.toBe(b)

	a.set(2)
	b.set(3)
	expect(a.get()).toBe(2)
	expect(b.get()).toBe(3)
})
