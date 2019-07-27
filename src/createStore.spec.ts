import { assertType, typeAssertion } from 'type-plus';
import { createStore } from '.';

const moduleName = 'your-module'

test('create with same id will get existing store', () => {
  const key = 'same-key'
  const version = 0
  const initializer = () => ({ a: 1 })
  const store1 = createStore({ moduleName, key, version, initializer })
  const store2 = createStore({ moduleName, key, version, initializer })
  store1.get().a = 2

  expect(store2.get()).toEqual({ a: 2 })
})

test('initializer of the same version is skipped', () => {
  const key = 'skip-same-ver-init'
  const version = 0
  createStore({ moduleName, key, version, initializer: () => ({ a: 1 }) })
  createStore({ moduleName, key, version, initializer: () => { throw new Error('should not reach') } })
})

test('initializer receives empty object the first time', () => {
  let actual
  createStore({ moduleName, key: 'init-receive-empty-obj', version: 0, initializer: previous => actual = previous })
  expect(actual).toEqual({})
})

test('initialize receives the versions processed', () => {
  const key = 'init-receive-versions'
  createStore({
    moduleName, key, version: 0, initializer: (_, versions) => {
      expect(versions).toEqual([])
      return {}
    }
  })
  createStore({
    moduleName, key, version: 1, initializer: (_, versions) => {
      expect(versions).toEqual([0])
      return {}
    }
  })
  createStore({
    moduleName, key, version: 2, initializer: (_, versions) => {
      expect(versions).toEqual([0, 1])
      return {}
    }
  })
})

test('store is typed by the initializer', () => {
  const key = 'typed-by-initializer'
  const store1 = createStore({
    moduleName, key, version: 0, initializer: () => ({ a: 1 })
  })
  const store2 = createStore({
    moduleName, key, version: 1, initializer: prev => ({ ...prev, b: 1 })
  })
  assertType.isNumber(store1.get().a)
  assertType.isNumber(store2.get().b)
})

test('store type can be overridden', () => {
  const store = createStore<{ a: number | undefined }>({
    moduleName, key: 'override-type', version: 0, initializer: () => ({ a: undefined })
  })
  typeAssertion<number | undefined>()(store.get().a)
})

test('initializer receives the previous initial value', () => {
  const key = 'init-get-prev'
  createStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })

  let actual
  createStore({ moduleName, key, version: 1, initializer: prev => actual = prev })

  expect(actual).toEqual({ a: 1 })
})

test('reset() will reset object values', () => {
  const key = 'reset-obj'
  const store = createStore({ moduleName, key, version: 0, initializer: () => ({ a: { b: 2 } }) })
  store.get().a.b = 3
  store.reset()

  expect(store.get().a.b).toBe(2)
})

test('call reset() on 1st store gets latest initial value', () => {
  const key = '2nd-reset-get-1st'
  const store1 = createStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })
  createStore({ moduleName, key, version: 1, initializer: () => ({ a: 2, b: true }) })
  store1.reset()
  expect(store1.get()).toEqual({ a: 2, b: true })
})
// test and get between create

test('gets initial value', () => {
  const store = createStore({ moduleName, key: 'get-all', version: 0, initializer: () => ({ a: 1, b: 'b' }) })
  expect(store.get()).toEqual({ a: 1, b: 'b' })
})

test('property reference are persisted', () => {
  const store = createStore({ moduleName, key: 'prop-ref', version: 0, initializer: () => ({ a: { b: 1 } }) })
  const orig = store.get()
  orig.a = { b: 3 }
  const actual = store.get()
  expect(actual.a).toEqual(orig.a)
})
