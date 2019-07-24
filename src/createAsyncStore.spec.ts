import { AssertOrder } from 'assertron';
import { createAsyncStore, initializeAsyncStore } from '.';

test('calling initializeAsyncStore() with no createAsyncStore() call does nothing', () => {
  initializeAsyncStore('unknown-module')
})

test('init single store with key', async () => {
  const moduleName = 'module-one-store-init-with-key'
  const key = '6e9dec9c-db22-4bbd-a088-ce734e34b5fd'
  const p = createAsyncStore(moduleName, key, 0, () => ({ a: 1 }))

  initializeAsyncStore(moduleName, key)

  const store = await p

  expect(store.get().a).toBe(1)
})

test('init single store without key', async () => {
  const moduleName = 'module-one-store-init-without-key'
  const key = '720d0a3b-a301-4c34-9fd9-41bb7510a5f9'
  const p = createAsyncStore(moduleName, key, 0, () => ({ a: 1 }))

  initializeAsyncStore(moduleName)

  const store = await p

  expect(store.get().a).toBe(1)
})

test('init multiple createAsynStore calls with key', async () => {
  const moduleName = 'module-multi-stores-init-with-key'
  const key = '4f9a6b0c-8756-4c5b-9e98-030b1f973dbd'
  const p1 = createAsyncStore(moduleName, key, 0, () => ({ a: 1 }))
  const p2 = createAsyncStore(moduleName, key, 0, () => ({ a: 1 }))

  initializeAsyncStore(moduleName, key)

  const store1 = await p1
  const store2 = await p2

  expect(store1.get().a).toBe(1)
  expect(store2.get().a).toBe(1)

  store1.get().a = 2
  expect(store2.get().a).toBe(2)
})

test('init multiple stores in the same module without key', async () => {
  const moduleName = 'module-multi-stores-init-without-key'
  const p1 = createAsyncStore(moduleName, '4f9a6b0c-8756-4c5b-9e98-030b1f973dbd', 0, () => ({ a: 1 }))
  const p2 = createAsyncStore(moduleName, '3856d28c-5a8e-4edc-9ec4-6b777dbf87cb', 0, () => ({ b: 2 }))

  initializeAsyncStore(moduleName)

  const store1 = await p1
  const store2 = await p2

  expect(store1.get().a).toBe(1)
  expect(store2.get().b).toBe(2)
})

test('init stores with different numeric versions is ordered by version', async () => {
  const o = new AssertOrder(2)
  const moduleName = 'num-version'
  const key = '2197e51e-8d14-4706-8f4f-f1beacb5a388'
  const p1 = createAsyncStore(moduleName, key, 1, (prev) => {
    expect(prev).toEqual({})
    o.once(1)
    return { a: 1 }
  })
  const p2 = createAsyncStore(moduleName, key, 3, (prev) => {
    expect(prev).toEqual({ a: 1 })
    o.once(2)
    return { ...prev, b: 2 }
  })

  initializeAsyncStore(moduleName)

  const store2 = await p2
  const store1 = await p1

  expect(store1.get().a).toBe(1)
  expect(store2.get().b).toBe(2)

  o.end()
})

test('init stores with different string versions is ordered by version', async () => {
  const o = new AssertOrder(8)
  const moduleName = 'str-version'
  const key = '9fda28d3-8478-417f-b27d-f28b7c5fc93f'

  const promises = [
    createAsyncStore(moduleName, key, '1.0.0', () => { o.once(5); return { a: 1 } }),
    createAsyncStore(moduleName, key, '1.1.0', () => { o.once(6); return { a: 1 } }),
    createAsyncStore(moduleName, key, '0.0.0', () => { o.once(1); return { a: 1 } }),
    createAsyncStore(moduleName, key, '0.0.1', () => { o.once(2); return { a: 1 } }),
    createAsyncStore(moduleName, key, '0.1.0', () => { o.once(3); return { a: 1 } }),
    createAsyncStore(moduleName, key, '0.1.1', () => { o.once(4); return { a: 1 } }),
    createAsyncStore(moduleName, key, '1.1.1', () => { o.once(7); return { a: 1 } }),
    createAsyncStore(moduleName, key, '2.0.0', () => { o.once(8); return { a: 1 } })
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
    createAsyncStore(moduleName, key, 1, () => { o.once(1); return { a: 1 } }),
    createAsyncStore(moduleName, key, '0.0.2', () => { o.once(2); return { a: 1 } }),
    createAsyncStore(moduleName, key, 3, () => { o.once(3); return { a: 1 } }),
    createAsyncStore(moduleName, key, '0.1.0', () => { o.once(4); return { a: 1 } })
  ]

  initializeAsyncStore(moduleName)

  await Promise.all(promises)

  o.end()
})
