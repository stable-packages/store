import { AssertOrder } from 'assertron'
import { createAsyncStore, initializeAsyncStore } from './index.js'

test('calling initializeAsyncStore() with no createAsyncStore() call does nothing', () => {
	initializeAsyncStore('unknown-module')
})

it('unknown key', async () => {
	const moduleName = 'module-one-store-init-with-key'
	const key = '6e9dec9c-db22-4bbd-a088-ce734e34b5fd'
	createAsyncStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })
	initializeAsyncStore(moduleName, 'some-unknown-key')

})

test('init single store with key', async () => {
	const moduleName = 'module-one-store-init-with-key'
	const key = '6e9dec9c-db22-4bbd-a088-ce734e34b5fd'
	const p = createAsyncStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })

	initializeAsyncStore(moduleName, key)

	const store = await p

	expect(store.value.a).toBe(1)
})

test('init single store without key', async () => {
	const moduleName = 'module-one-store-init-without-key'
	const key = '720d0a3b-a301-4c34-9fd9-41bb7510a5f9'
	const p = createAsyncStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })

	initializeAsyncStore(moduleName)

	const store = await p

	expect(store.value.a).toBe(1)
})

test('init multiple createAsyncStore calls with key', async () => {
	const moduleName = 'module-multi-stores-init-with-key'
	const key = '4f9a6b0c-8756-4c5b-9e98-030b1f973dbd'
	const p1 = createAsyncStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })
	const p2 = createAsyncStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })

	initializeAsyncStore(moduleName, key)

	const store1 = await p1
	const store2 = await p2

	expect(store1.value.a).toBe(1)
	expect(store2.value.a).toBe(1)

	store1.value.a = 2
	expect(store2.value.a).toBe(2)
})

test('init multiple stores in the same module without key', async () => {
	const moduleName = 'module-multi-stores-init-without-key'
	const p1 = createAsyncStore({
		moduleName,
		key: '4f9a6b0c-8756-4c5b-9e98-030b1f973dbd',
		version: 0,
		initializer: () => ({ a: 1 })
	})
	const p2 = createAsyncStore({
		moduleName,
		key: '3856d28c-5a8e-4edc-9ec4-6b777dbf87cb',
		version: 0,
		initializer: () => ({ b: 2 })
	})

	initializeAsyncStore(moduleName)

	const store1 = await p1
	const store2 = await p2

	expect(store1.value.a).toBe(1)
	expect(store2.value.b).toBe(2)
})

test('init stores with different numeric versions is ordered by version', async () => {
	const o = new AssertOrder(2)
	const moduleName = 'num-version'
	const key = '2197e51e-8d14-4706-8f4f-f1beacb5a388'
	const p1 = createAsyncStore({
		moduleName,
		key,
		version: 1,
		initializer: (prev) => {
			expect(prev).toEqual({})
			o.once(1)
			return { a: 1 }
		}
	})
	const p2 = createAsyncStore({
		moduleName,
		key,
		version: 3,
		initializer: (prev) => {
			expect(prev).toEqual({ a: 1 })
			o.once(2)
			return { ...prev, b: 2 }
		}
	})

	initializeAsyncStore(moduleName)

	const store2 = await p2
	const store1 = await p1

	expect(store1.value.a).toBe(1)
	expect(store2.value.b).toBe(2)

	o.end()
})

test('init stores with different string versions is ordered by version', async () => {
	const o = new AssertOrder(8)
	const moduleName = 'str-version'
	const key = '9fda28d3-8478-417f-b27d-f28b7c5fc93f'

	const promises = [
		createAsyncStore({
			moduleName,
			key,
			version: '1.0.0',
			initializer: () => {
				o.once(5)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: '1.1.0',
			initializer: () => {
				o.once(6)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: '0.0.0',
			initializer: () => {
				o.once(1)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: '0.0.1',
			initializer: () => {
				o.once(2)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: '0.1.0',
			initializer: () => {
				o.once(3)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: '0.1.1',
			initializer: () => {
				o.once(4)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: '1.1.1',
			initializer: () => {
				o.once(7)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: '2.0.0',
			initializer: () => {
				o.once(8)
				return { a: 1 }
			}
		})
	]

	initializeAsyncStore(moduleName)

	await Promise.all(promises)

	o.end()
})

test('number version is compared to the patch value of string version', async () => {
	const o = new AssertOrder(4)
	const moduleName = 'mix-version'
	const key = '9fda28d3-8478-417f-b27d-f28b7c5fc93f'

	const promises = [
		createAsyncStore({
			moduleName,
			key,
			version: 1,
			initializer: () => {
				o.once(1)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: '0.0.2',
			initializer: () => {
				o.once(2)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: 3,
			initializer: () => {
				o.once(3)
				return { a: 1 }
			}
		}),
		createAsyncStore({
			moduleName,
			key,
			version: '0.1.0',
			initializer: () => {
				o.once(4)
				return { a: 1 }
			}
		})
	]

	initializeAsyncStore(moduleName)

	await Promise.all(promises)

	o.end()
})

test('key is optional', async () => {
	const moduleName = 'async-key-optional'
	const p = createAsyncStore({ moduleName, version: '1.0.0', initializer: () => ({ a: 1 }) })
	initializeAsyncStore(moduleName)
	const store = await p
	expect(store.value.a).toBe(1)
})
