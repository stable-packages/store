import { afterEach, expect, it } from '@jest/globals'
import { config } from './config.js'
import { resetCtx } from './ctx.js'
import { createStore } from './index.js'

afterEach(() => {
	resetCtx()
})

it('throws when called the second time', () => {
	config({})

	expect(() => {
		config({})
	}).toThrow()
})

it('listen to get calls', () => {
	expect.assertions(2)
	config({
		onGet: (id, value) => {
			expect(id).toBe('with-get-listener')
			expect(value).toEqual({ a: 1 })
		}
	})
	const store = createStore({ id: 'with-get-listener', version: '1.0.0', initialize: () => ({ a: 1 }) })
	store.get()
})

it('can listen to set calls', () => {
	expect.assertions(2)
	config({
		onSet: (id, value) => {
			expect(id).toBe('listen-to-set')
			expect(value).toEqual({ a: 2 })
		}
	})
	const store = createStore({ id: 'listen-to-set', version: '1.0.0', initialize: () => ({ a: 1 }) })
	store.set({ a: 2 })
})

it('listener error is suppressed by default and shows up in console', () => {
	config({
		suppressListenerError: true,
		onSet: () => {
			throw new Error('error throw in listener will show up in console as expected')
		}
	})

	const s = createStore({
		id: 'suppress-listener-error',
		initialize() {
			return { a: 1 }
		}
	})

	s.set({ a: 2 })
})

it('can disable listener error suppression', () => {
	config({
		suppressListenerError: false,
		onSet: () => {
			throw new Error('error throw in listener will show up in console as expected')
		}
	})

	const s = createStore({
		id: 'suppress-listener-error',
		initialize() {
			return { a: 1 }
		}
	})

	expect(() => s.set({ a: 2 })).toThrow()
})

it('can use a different logger', () => {
	expect.assertions(1)
	const logger = {
		error(error: Error) {
			expect(error.message).toEqual('listener error')
		}
	}
	config({
		logger,
		onSet: () => {
			throw new Error('listener error')
		}
	})

	const s = createStore({
		id: 'different-logger',
		initialize() {
			return { a: 1 }
		}
	})
	s.set({ a: 2 })
})
