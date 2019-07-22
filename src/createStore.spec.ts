import { assertType, typeAssertion } from 'type-plus';
import { createStore } from '.';

const moduleName = 'your-module'

test('id.key can be symbol', () => {
  createStore(moduleName, Symbol.for('symbol-key'), () => ({ a: 1 }))
})

test('create with same id will get existing store', () => {
  const store1 = createStore(moduleName, 'same-key', () => ({ a: 1 }))
  const store2 = createStore(moduleName, 'same-key', () => ({ a: 1 }))
  store1.get().a = 2

  expect(store2.get()).toEqual({ a: 2 })
})

test('initializer receives empty object the first time', () => {
  let actual
  createStore(moduleName, 'init-receive-empty-obj', previous => actual = previous)
  expect(actual).toEqual({})
})

test('store is typed by the initializer', () => {
  const store1 = createStore(moduleName, 'typed-by-initializer', () => ({ a: 1 }))
  const store2 = createStore(moduleName, 'typed-by-initializer', prev => ({ ...prev, b: 1 }))
  assertType.isNumber(store1.get().a)
  assertType.isNumber(store2.get().b)
})

test('store type can be overridden', () => {
  const store = createStore<{ a: number | undefined }>(moduleName, 'override-type', () => ({ a: undefined }))
  typeAssertion<number | undefined>()(store.get().a)
})

test('initializer receives the previous initial value', () => {
  createStore(moduleName, 'same-key', () => ({ a: 1 }))

  let actual
  createStore(moduleName, 'same-key', prev => actual = prev)

  expect(actual).toEqual({ a: 1 })
})

test('call reset() on 1st store gets latest initial value', () => {
  const store1 = createStore(moduleName, '2nd-reset-get-1st', () => ({ a: 1 }))
  createStore(moduleName, '2nd-reset-get-1st', () => ({ a: 2, b: true }))
  store1.reset()
  expect(store1.get()).toEqual({ a: 2, b: true })
})
// test and get between create

test('gets initial value', () => {
  const store = createStore(moduleName, 'get-all', () => ({ a: 1, b: 'b' }))
  expect(store.get()).toEqual({ a: 1, b: 'b' })
})

test('property reference are persisted', () => {
  const store = createStore(moduleName, 'prop-ref', () => ({ a: { b: 1 } }))
  const orig = store.get()
  orig.a = { b: 3 }
  const actual = store.get()
  expect(actual.a).toEqual(orig.a)
})
