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
	createStore({
		key: 'library-a',
		version: '1.0.0',
		initialize() {
			return { a: 1 }
		}
	})
})

it('can create store with symbol key', () => {
	createStore({
		key: Symbol.for('library-b'),
		version: '1.0.0',
		initialize() {
			return { a: 1 }
		}
	})
})

it('defaults store type to return type of initialize', () => {
	const store = createStore({
		key: 'return-type',
		version: '1.0.0',
		initialize() {
			return { a: 1 }
		}
	})
	testType.equal<typeof store, Store<{ a: number }>>(true)
})

it('can specify the type of the store using type params', () => {
	const store = createStore<{ a: number; b?: string }>({
		key: 'type-specified',
		version: '1.0.0',
		initialize() {
			return { a: 1 }
		}
	})
	testType.equal<typeof store, Store<{ a: number; b?: string }>>(true)
})

it('contains the initial value', () => {
	const s = createStore({
		key: 'initial-value',
		version: '1.0.0',
		initialize() {
			return 1
		}
	})
	expect(s.get()).toBe(1)
})

it.skip('throws if creating store with same key', () => {
	createStore({
		key: 'duplicate-key',
		version: '1.0.0',
		initialize() {
			return 1
		}
	})
	expect(() =>
		createStore({
			key: 'duplicate-key',
			version: '1.0.0',
			initialize() {
				return 1
			}
		})
	).toThrow()
})

it('returns the same store if the key is the same string', () => {
	const a = createStore({
		key: 'same-key',
		initialize() {
			return 1
		}
	})
	const b = createStore({
		key: 'same-key',
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
		key: Symbol.for('same-key'),
		initialize() {
			return 1
		}
	})
	const b = createStore({
		key: Symbol.for('same-key'),
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
		key: Symbol('same-label'),
		initialize() {
			return 1
		}
	})
	const b = createStore({
		key: Symbol('same-label'),
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

it('can listen to changes', () => {
	expect.assertions(1)
	const s = createStore({
		key: 'listen',
		initialize() {
			return { a: 1 }
		}
	})
	s.onSet((v) => expect(v).toEqual({ a: 2 }))
	s.set({ a: 2 })
})

it('notifies the same listener only once', () => {
	expect.assertions(1)
	const s = createStore({
		key: 'listen-once',
		initialize() {
			return { a: 1 }
		}
	})
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	s.onSet(listener)
	s.onSet(listener)
	s.set({ a: 2 })
})

it('can unsubscribe from changes', () => {
	expect.assertions(1)
	const s = createStore({
		key: 'unsubscribe',
		initialize() {
			return { a: 1 }
		}
	})
	const unsub = s.onSet((v) => expect(v).toEqual({ a: 2 }))
	s.set({ a: 2 })
	unsub()
	s.set({ a: 3 })
})

it('can unsubscribe from changes with same listener', () => {
	expect.assertions(1)
	const s = createStore({
		key: 'unsubscribe-same-listener',
		initialize() {
			return { a: 1 }
		}
	})
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	const unsub = s.onSet(listener)
	s.set({ a: 2 })
	unsub()
	s.set({ a: 3 })
})

it('ignores unsubscribe call if already unsubscribed', () => {
	expect.assertions(1)
	const s = createStore({
		key: 'unsubscribe-already-unsubscribed',
		initialize() {
			return { a: 1 }
		}
	})
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	const unsub = s.onSet(listener)
	s.set({ a: 2 })
	unsub()
	unsub()
	s.set({ a: 3 })
})

it('ignores unsubscribe call if already unsubscribed (from different listen call with the same listener)', () => {
	expect.assertions(1)
	const s = createStore({
		key: 'unsubscribe-already-unsubscribed-same-listener',
		initialize() {
			return { a: 1 }
		}
	})
	const listener = (v: unknown) => expect(v).toEqual({ a: 2 })
	const unsub1 = s.onSet(listener)
	const unsub2 = s.onSet(listener)
	s.set({ a: 2 })
	unsub1()
	unsub2()
	s.set({ a: 3 })
})

it('can suppress listener error', () => {
	const s = createStore({
		key: 'suppress-listener-error',
		initialize() {
			return { a: 1 }
		},
		suppressListenerError: true
	})
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

	const s = createStore({
		key: 'different-logger',
		initialize() {
			return { a: 1 }
		},
		suppressListenerError: true,
		logger
	})
	s.onSet(() => {
		throw new Error('listener error')
	})
	s.set({ a: 2 })
})

it('can assert against string key', () => {
	registerIDAssertion((_) => {
		throw new Error('invalid id')
	})
	expect(() =>
		createStore({
			key: 'id',
			initialize() {
				return { a: 1 }
			}
		})
	).toThrow()
})

it('can assert against symbol key with description', () => {
	registerIDAssertion((_) => {
		throw new Error('invalid id')
	})
	expect(() =>
		createStore({
			key: Symbol('id'),
			initialize() {
				return { a: 1 }
			}
		})
	).toThrow()
})

it('can assert with per-store assertion', () => {
	expect(() =>
		createStore({
			key: 'id',
			initialize() {
				return { a: 1 }
			},
			idAssertion() {
				throw new Error('just because')
			}
		})
	).toThrow()
})

it('assert on re-create', () => {
	let count = 0
	createStore({
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
	expect(() =>
		createStore({
			key: 'id',
			initialize() {
				return { a: 1 }
			}
		})
	).toThrow()
})

it('can specify an onGet listener', () => {
	expect.assertions(1)
	const s = createStore({
		key: 'on-get',
		initialize() {
			return { a: 1 }
		},
		onGet: (v) => expect(v).toEqual({ a: 1 })
	})
	s.get()
})

it('can specify an onSet listener', () => {
	expect.assertions(1)
	const s = createStore<{ a: number }>({
		key: 'on-set',
		initialize() {
			return { a: 1 }
		},
		onSet: (v) => expect(v).toEqual({ a: 1 })
	})
	s.set({ a: 1 })
})
