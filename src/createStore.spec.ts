import { assertType, typeAssertion } from 'type-plus';
import { createStore } from '.';

const moduleName = 'your-module'

test('id.key can be symbol', () => {
  const store = createStore(moduleName, Symbol.for('symbol-key'), 0, () => ({ a: 1 }))
  expect(store.get().a).toBe(1)
})

test('create with same id will get existing store', () => {
  const store1 = createStore(moduleName, 'same-key', 0, () => ({ a: 1 }))
  const store2 = createStore(moduleName, 'same-key', 0, () => ({ a: 1 }))
  store1.get().a = 2

  expect(store2.get()).toEqual({ a: 2 })
})

test('initializer receives empty object the first time', () => {
  let actual
  createStore(moduleName, 'init-receive-empty-obj', 0, previous => actual = previous)
  expect(actual).toEqual({})
})

test('initialize receives the versions processed', () => {
  createStore(moduleName, 'init-receive-versions', 0, (_, versions) => {
    expect(versions).toEqual([])
    return {}
  })
  createStore(moduleName, 'init-receive-versions', 1, (_, versions) => {
    expect(versions).toEqual([0])
    return {}
  })
  createStore(moduleName, 'init-receive-versions', 2, (_, versions) => {
    expect(versions).toEqual([0, 1])
    return {}
  })
})

test('store is typed by the initializer', () => {
  const store1 = createStore(moduleName, 'typed-by-initializer', 0, () => ({ a: 1 }))
  const store2 = createStore(moduleName, 'typed-by-initializer', 0, prev => ({ ...prev, b: 1 }))
  assertType.isNumber(store1.get().a)
  assertType.isNumber(store2.get().b)
})

test('store type can be overridden', () => {
  const store = createStore<{ a: number | undefined }>(moduleName, 'override-type', 0, () => ({ a: undefined }))
  typeAssertion<number | undefined>()(store.get().a)
})

test('initializer receives the previous initial value', () => {
  createStore(moduleName, 'same-key', 0, () => ({ a: 1 }))

  let actual
  createStore(moduleName, 'same-key', 0, prev => actual = prev)

  expect(actual).toEqual({ a: 1 })
})

test('call reset() on 1st store gets latest initial value', () => {
  const store1 = createStore(moduleName, '2nd-reset-get-1st', 0, () => ({ a: 1 }))
  createStore(moduleName, '2nd-reset-get-1st', 0, () => ({ a: 2, b: true }))
  store1.reset()
  expect(store1.get()).toEqual({ a: 2, b: true })
})
// test and get between create

test('gets initial value', () => {
  const store = createStore(moduleName, 'get-all', 0, () => ({ a: 1, b: 'b' }))
  expect(store.get()).toEqual({ a: 1, b: 'b' })
})

test('property reference are persisted', () => {
  const store = createStore(moduleName, 'prop-ref', 0, () => ({ a: { b: 1 } }))
  const orig = store.get()
  orig.a = { b: 3 }
  const actual = store.get()
  expect(actual.a).toEqual(orig.a)
})
