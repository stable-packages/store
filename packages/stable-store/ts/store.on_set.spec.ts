import { afterEach, expect, it } from '@jest/globals'
import { config } from './config.js'
import { resetCtx } from './ctx.js'
import { createStore } from './index.js'

afterEach(() => {
	resetCtx()
})

it('notifies listeners on set', () => {
	const s = createStore({ id: 'on-set-notify', initialize: () => 1 })
	const values: number[] = []
	s.onSet((v) => values.push(v))
	s.set(2)
	s.set(3)
	expect(values).toEqual([2, 3])
})

it('adds the same listener only once', () => {
	const s = createStore({ id: 'on-set-once', initialize: () => 1 })
	const values: number[] = []
	const fn = (v: number) => values.push(v)
	s.onSet(fn)
	s.onSet(fn)
	s.set(2)
	expect(values).toEqual([2])
})

it('stops notifying after unsubscribe', () => {
	const s = createStore({ id: 'on-set-unsubscribe', initialize: () => 1 })
	const values: number[] = []
	const unsubscribe = s.onSet((v) => values.push(v))
	s.set(2)
	unsubscribe()
	unsubscribe()
	s.set(3)
	expect(values).toEqual([2])
})

it('logs listener error when suppressed', () => {
	const errors: unknown[] = []
	config({ logger: { error: (e: unknown) => errors.push(e) } })
	const s = createStore({ id: 'on-set-suppressed', initialize: () => 1 })
	const error = new Error('listener failed')
	s.onSet(() => {
		throw error
	})
	s.set(2)
	expect(errors).toEqual([error])
})

it('throws listener error when not suppressed', () => {
	config({ suppressListenerError: false })
	const s = createStore({ id: 'on-set-not-suppressed', initialize: () => 1 })
	s.onSet(() => {
		throw new Error('listener failed')
	})
	expect(() => s.set(2)).toThrow('listener failed')
})
