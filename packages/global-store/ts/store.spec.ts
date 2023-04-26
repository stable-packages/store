import { describe, expect, it } from '@jest/globals'
import { assertron as a } from 'assertron'
import { assertType } from 'type-plus'
import { StoreValue, createStore } from './index.js'

const moduleName = 'your-module'

it('create with same id will get existing store', () => {
	const key = 'same-key'
	const version = 0
	const initializer = () => ({ a: 1 })
	const store1 = createStore({ moduleName, key, version, initializer })
	const store2 = createStore({ moduleName, key, version, initializer })
	store1.value.a = 2

	expect(store2.value).toEqual({ a: 2 })
})

it('initializer of the same version is skipped', () => {
	const key = 'skip-same-ver-init'
	const version = 0
	createStore({ moduleName, key, version, initializer: () => ({ a: 1 }) })
	createStore({
		moduleName,
		key,
		version,
		initializer: () => {
			throw new Error('should not reach')
		}
	})
})

it('initializer receives empty object the first time', () => {
	let actual
	createStore({
		moduleName,
		key: 'init-receive-empty-obj',
		version: 0,
		initializer: previous => (actual = previous)
	})
	expect(actual).toEqual({})
})

it('initialize receives the versions processed', () => {
	const key = 'init-receive-versions'
	createStore({
		moduleName,
		key,
		version: 0,
		initializer: (_, versions) => {
			expect(versions).toEqual([])
			return {}
		}
	})
	createStore({
		moduleName,
		key,
		version: 1,
		initializer: (_, versions) => {
			expect(versions).toEqual([0])
			return {}
		}
	})
	createStore({
		moduleName,
		key,
		version: 2,
		initializer: (_, versions) => {
			expect(versions).toEqual([0, 1])
			return {}
		}
	})
})

it('store is typed by the initializer', () => {
	const key = 'typed-by-initializer'
	const store1 = createStore({
		moduleName,
		key,
		version: 0,
		initializer: () => ({ a: 1 })
	})
	const store2 = createStore({
		moduleName,
		key,
		version: 1,
		initializer: prev => ({ ...prev, b: 1 })
	})
	assertType.isNumber(store1.value.a)
	assertType.isNumber(store2.value.b)
})

it('initialize input is partial T because previous version may not have the same data structure', () => {
	const key = 'initializer-receive-partial'
	const store = createStore<{ a: string }>({
		moduleName,
		key,
		version: 1,
		initializer: prev => ({
			a: 'abc',
			...prev
		})
	})

	store.value.a = '123'
})

it('store type can be overridden', () => {
	const store = createStore<{ a: number | undefined }>({
		moduleName,
		key: 'override-type',
		version: 0,
		initializer: () => ({ a: undefined })
	})
	assertType<number | undefined>(store.value.a)
})

it('initializer receives the previous initial value', () => {
	const key = 'init-get-prev'
	createStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })

	let actual
	createStore({ moduleName, key, version: 1, initializer: prev => (actual = prev) })

	expect(actual).toEqual({ a: 1 })
})

it('reset() will reset object values', () => {
	const key = 'reset-obj'
	const store = createStore({ moduleName, key, version: 0, initializer: () => ({ a: { b: 2 } }) })
	store.value.a.b = 3
	store.reset()

	expect(store.value.a.b).toBe(2)
})

it('call reset() on 1st store gets latest initial value', () => {
	const key = '2nd-reset-get-1st'
	const store1 = createStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })
	createStore({ moduleName, key, version: 1, initializer: () => ({ a: 2, b: true }) })
	store1.reset()
	expect(store1.value).toEqual({ a: 2, b: true })
})

it('gets initial value', () => {
	const store = createStore({
		moduleName,
		key: 'get-all',
		version: 0,
		initializer: () => ({ a: 1, b: 'b' })
	})
	expect(store.value).toEqual({ a: 1, b: 'b' })
})

it('property reference are persisted', () => {
	const store = createStore({
		moduleName,
		key: 'prop-ref',
		version: 0,
		initializer: () => ({ a: { b: 1 } })
	})
	const orig = store.value
	orig.a = { b: 3 }
	const actual = store.value
	expect(actual.a).toEqual(orig.a)
})

describe('freeze store', () => {
	it('cannot add new property', () => {
		const store = createStore<{ a: number } & StoreValue>({
			moduleName,
			key: 'freeze-no-add',
			version: 0,
			initializer: () => ({ a: 1 })
		})
		store.freeze()
		store.value
		a.throws(() => (store.value['b'] = 2), TypeError)
	})

	it('cannot be freezed again', () => {
		const store = createStore<any>({
			moduleName,
			key: 'freeze-no-freeze',
			version: 0,
			initializer: () => ({ a: 1 })
		})
		store.freeze()

		a.throws(() => store.freeze(), TypeError)
	})

	it('property values are frozen', () => {
		const store = createStore({
			moduleName,
			key: 'prop-freeze',
			version: 0,
			initializer: () => ({ a: 1, b: true, c: 'str', d: {}, e: [] as any[] })
		})
		store.freeze()

		a.throws(() => (store.value.a = 2), TypeError)
		a.throws(() => (store.value.b = false), TypeError)
		a.throws(() => (store.value.c = 'abc'), TypeError)
		a.throws(() => (store.value.d = { z: 1 }), TypeError)
		a.throws(() => (store.value.e = ['a']), TypeError)
	})

	it('object property is not frozen', () => {
		const store = createStore({
			moduleName,
			key: 'obj-not-frozen',
			version: 0,
			initializer: () => ({ a: { b: 1, c: {} } })
		})
		store.freeze()
		store.value.a.b = 2
		store.value.a.c = { p: 'power' }
	})

	it('array property is frozen', () => {
		const store = createStore({
			moduleName,
			key: 'prop-array-freeze',
			version: 0,
			initializer: () => ({ arr: [] as any[], und: undefined })
		})
		store.freeze()

		a.throws(() => store.value.arr.push('a'), TypeError)
	})

	it('object in array property is not frozen', () => {
		const store = createStore({
			moduleName,
			key: 'obj-in-array-not-frozen',
			version: 0,
			initializer: () => ({ a: [{ x: 'x' }] })
		})
		store.freeze()
		store.value.a[0]!.x = 'y'
	})

	it('freeze provided value but not array property', () => {
		const store = createStore({
			moduleName,
			key: 'not freeze array value',
			version: 0,
			initializer: () => ({ a: { b: 1 }, c: [{ x: 1 }] })
		})

		store.freeze(store.value)
		a.throws(() => (store.value.a = { b: 2 }), TypeError)
		store.value.c.push({ x: 2 })
	})
	it('user can pre-freeze value', () => {
		const store = createStore({
			moduleName,
			key: 'self freeze',
			version: 0,
			initializer: () => ({ a: { b: 1 } })
		})

		store.freeze(Object.freeze(store.value))
	})
})

it('reset on freezed store will get new unfreezed value', () => {
	const store = createStore({
		moduleName,
		key: 'reset on freeze',
		version: 0,
		initializer: () => ({ a: { b: 1 } })
	})

	store.freeze()
	store.reset()
	store.value.a = { b: 2 }
})

it('key is optional', () => {
	const store = createStore({ moduleName, version: '1.0.0', initializer: () => ({ a: 1 }) })
	expect(store.value.a).toBe(1)
})
