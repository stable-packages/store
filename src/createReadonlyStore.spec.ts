import a from 'assertron';
import { assertType, typeAssertion } from 'type-plus';
import { AccessedBeforeLock, createReadonlyStore, Prohibited } from '.';

const moduleName = 'your-module-2'

test('create with same id will get existing store', () => {
  const key = 'same-key'
  const store1 = createReadonlyStore({ moduleName, key, version: 0, initializer: () => ({ a: 1 }) })
  const store2 = createReadonlyStore({ moduleName, key, version: 1, initializer: () => ({ a: 1 }) })

  store1.disableProtection()
  store2.disableProtection()

  store1.value.a = 2

  expect(store2.value).toEqual({ a: 2 })
})

test('initializer receives empty object the first time', () => {
  let actual
  createReadonlyStore({ moduleName, key: 'init-receive-empty-obj', version: 0, initializer: previous => actual = previous })
  expect(actual).toEqual({})
})

test('store is typed by the initializer', () => {
  const store1 = createReadonlyStore({ moduleName, key: 'typed-by-initializer', version: 0, initializer: () => ({ a: 1 }) })
  const store2 = createReadonlyStore({ moduleName, key: 'typed-by-initializer', version: 1, initializer: prev => ({ ...prev, b: 1 }) })

  store1.disableProtection()
  store2.disableProtection()

  assertType.isNumber(store1.value.a)
  assertType.isNumber(store2.value.b)
})

test('store type can be overridden', () => {
  const store = createReadonlyStore<{ a: number | undefined }>({ moduleName, key: 'override-type', version: 0, initializer: () => ({ a: undefined }) }).lock()
  typeAssertion<number | undefined>()(store.value.a)
})

test('initializer receives the previous initial value', () => {
  createReadonlyStore({ moduleName, key: 'get-prev', version: 0, initializer: () => ({ a: 1 }) })

  let actual
  createReadonlyStore({ moduleName, key: 'get-prev', version: 1, initializer: prev => actual = prev })

  expect(actual).toEqual({ a: 1 })
})

test('initialize receives the versions processed', () => {
  createReadonlyStore({
    moduleName, key: 'init-receive-versions', version: 0, initializer: (_, versions) => {
      expect(versions).toEqual([])
      return {}
    }
  })
  createReadonlyStore({
    moduleName, key: 'init-receive-versions', version: 1, initializer: (_, versions) => {
      expect(versions).toEqual([0])
      return {}
    }
  })
  createReadonlyStore({
    moduleName, key: 'init-receive-versions', version: 2, initializer: (_, versions) => {
      expect(versions).toEqual([0, 1])
      return {}
    }
  })
})

test('call reset() on 1st store gets latest initial value', () => {
  const store1 = createReadonlyStore({ moduleName, key: '2nd-reset-get-1st', version: 0, initializer: () => ({ a: 1 }) })
  createReadonlyStore({ moduleName, key: '2nd-reset-get-1st', version: 1, initializer: () => ({ a: 2, b: true }) })
  store1.disableProtection()

  store1.reset()
  expect(store1.value).toEqual({ a: 2, b: true })
})

test('call get() on not locked store throws', () => {
  const store = createReadonlyStore({ moduleName, key: 'get-throws', version: 0, initializer: () => ({ a: 1 }) })
  a.throws(() => store.value, AccessedBeforeLock)
})

test('call openForTesting() when the store is locked will throw', () => {
  const store = createReadonlyStore({ moduleName, key: 'locked-test-throw', version: 0, initializer: () => ({ a: 1 }) }).lock()
  a.throws(() => store.disableProtection(), Prohibited)
})

test('call lock() after openForTesting() will not lock the store', () => {
  const store = createReadonlyStore({ moduleName, key: 'test-lock-noop', version: 0, initializer: () => ({ a: 1 }) })

  store.disableProtection()
  store.lock()
  store.reset() // did not throw
})

test('can call get() after the store is locked', () => {
  const store = createReadonlyStore({ moduleName, key: 'locked-get', version: 0, initializer: () => ({ a: 1 }) }).lock()
  expect(store.value).toEqual({ a: 1 })
})

test('call reset() on locked store throws', () => {
  const store = createReadonlyStore({ moduleName, key: 'reset-locked-throws', version: 0, initializer: () => ({ a: 1 }) }).lock()
  a.throws(() => store.reset(), Prohibited)
})

test('call lock() on locked store is no-op', () => {
  const store = createReadonlyStore({ moduleName, key: 'lock-on-locked', version: 0, initializer: () => ({}) }).lock()
  store.lock()
})

describe('getWritable()', () => {
  test('throws if the store is locked', () => {
    const store = createReadonlyStore({ moduleName, key: 'getwritable-on-locked', version: 0, initializer: () => ({}) }).lock()
    a.throws(() => store.writeable, Prohibited)
  })

  test('can be used during config to get and update the store value before the store is locked', () => {
    const store = createReadonlyStore({ moduleName, key: 'getwritable-before-locked', version: 0, initializer: () => ({ a: 1 }) })
    store.writeable.a = 2
    store.lock()
    expect(store.value).toEqual({ a: 2 })
  })
});

test('property values are frozen in a locked store', () => {
  const store = createReadonlyStore({ moduleName, key: 'prop-freeze', version: 0, initializer: () => ({ a: 1, b: true, c: 'str', d: {}, e: [] as any[] }) }).lock()

  a.throws(() => store.value.a = 2, TypeError)
  a.throws(() => store.value.b = false, TypeError)
  a.throws(() => store.value.c = 'abc', TypeError)
  a.throws(() => store.value.d = { z: 1 }, TypeError)
  a.throws(() => store.value.e = ['a'], TypeError)
})

test('property value can be undefined', () => {
  createReadonlyStore({ moduleName, key: 'prop-array-freeze', version: 0, initializer: () => ({ und: undefined }) }).lock()
})

test('array property is frozen in a locked store', () => {
  const store = createReadonlyStore({ moduleName, key: 'prop-array-freeze', version: 0, initializer: () => ({ arr: [] as any[], und: undefined }) }).lock()

  a.throws(() => store.value.arr.push('a'), TypeError)
})

test('property can be symbol', () => {
  const sym1 = Symbol()
  const sym2 = Symbol()
  const store = createReadonlyStore({ moduleName, key: 'prop-array-freeze', version: 0, initializer: () => ({ [sym1]: undefined, [sym2]: [] as any[] }) }).lock()

  a.throws(() => store.value[sym2].push('a'), TypeError)
})

test('can specify finalizer during lock() to process the values', () => {
  const store = createReadonlyStore({ moduleName, key: 'finalizer', version: 0, initializer: () => ({ a: 1, b: { c: 1 }, c: ['a'] }) })

  store.lock({
    a: (value) => value + 1,
    b: (value) => Object.freeze(value),
    c: (value) => {
      value.push('b')
      return value
    }
  })

  expect(store.value.a).toBe(2)
  expect(Object.isFrozen(store.value.b)).toBeTruthy()
  expect(store.value.c).toEqual(['a', 'b'])
})

test('finalizer can contain properties out of the store type so it can process older version store values', () => {
  const store = createReadonlyStore({ moduleName, key: 'finalizer-record', version: 0, initializer: () => ({ a: 1 }) })

  store.lock({
    a: v => v + 1,
    b: () => undefined
  })
})
