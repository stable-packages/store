import a from 'assertron';
import { assertType, typeAssertion } from 'type-plus';
import { AccessedBeforeLock, createReadonlyStore, Prohibited } from '.';

const moduleName = 'your-module-2'

test('store key can be symbol', () => {
  createReadonlyStore(moduleName, Symbol.for('symbol-key'), 0, () => ({ a: 1, b: 2 }))
})

test('create with same id will get existing store', () => {
  const store1 = createReadonlyStore(moduleName, 'same-key', 0, () => ({ a: 1 }))
  const store2 = createReadonlyStore(moduleName, 'same-key', 0, () => ({ a: 1 }))

  store1.disableProtection()
  store2.disableProtection()

  store1.get().a = 2

  expect(store2.get()).toEqual({ a: 2 })
})

test('initializer receives empty object the first time', () => {
  let actual
  createReadonlyStore(moduleName, 'init-receive-empty-obj', 0, previous => actual = previous)
  expect(actual).toEqual({})
})

test('store is typed by the initializer', () => {
  const store1 = createReadonlyStore(moduleName, 'typed-by-initializer', 0, () => ({ a: 1 }))
  const store2 = createReadonlyStore(moduleName, 'typed-by-initializer', 0, prev => ({ ...prev, b: 1 }))

  store1.disableProtection()
  store2.disableProtection()

  assertType.isNumber(store1.get().a)
  assertType.isNumber(store2.get().b)
})

test('store type can be overridden', () => {
  const store = createReadonlyStore<{ a: number | undefined }>(moduleName, 'override-type', 0, () => ({ a: undefined })).lock()
  typeAssertion<number | undefined>()(store.get().a)
})

test('initializer receives the previous initial value', () => {
  createReadonlyStore(moduleName, 'same-key', 0, () => ({ a: 1 }))

  let actual
  createReadonlyStore(moduleName, 'same-key', 0, prev => actual = prev)

  expect(actual).toEqual({ a: 1 })
})

test('initialize receives the versions processed', () => {
  createReadonlyStore(moduleName, 'init-receive-versions', 0, (_, versions) => {
    expect(versions).toEqual([])
    return {}
  })
  createReadonlyStore(moduleName, 'init-receive-versions', 1, (_, versions) => {
    expect(versions).toEqual([0])
    return {}
  })
  createReadonlyStore(moduleName, 'init-receive-versions', 2, (_, versions) => {
    expect(versions).toEqual([0, 1])
    return {}
  })
})

test('call reset() on 1st store gets latest initial value', () => {
  const store1 = createReadonlyStore(moduleName, '2nd-reset-get-1st', 0, () => ({ a: 1 }))
  createReadonlyStore(moduleName, '2nd-reset-get-1st', 0, () => ({ a: 2, b: true }))
  store1.disableProtection()

  store1.reset()
  expect(store1.get()).toEqual({ a: 2, b: true })
})

test('call get() on not locked store throws', () => {
  const store = createReadonlyStore(moduleName, 'get-throws', 0, () => ({ a: 1 }))
  a.throws(() => store.get(), AccessedBeforeLock)
})

test('call openForTesting() when the store is locked will throw', () => {
  const store = createReadonlyStore(moduleName, 'locked-test-throw', 0, () => ({ a: 1 })).lock()
  a.throws(() => store.disableProtection(), Prohibited)
})

test('call lock() after openForTesting() will not lock the store', () => {
  const store = createReadonlyStore(moduleName, 'test-lock-noop', 0, () => ({ a: 1 }))

  store.disableProtection()
  store.lock()
  store.reset() // did not throw
})

test('can call get() after the store is locked', () => {
  const store = createReadonlyStore(moduleName, 'locked-get', 0, () => ({ a: 1 })).lock()
  expect(store.get()).toEqual({ a: 1 })
})

test('call reset() on locked store throws', () => {
  const store = createReadonlyStore(moduleName, 'reset-locked-throws', 0, () => ({ a: 1 })).lock()
  a.throws(() => store.reset(), Prohibited)
})

test('call lock() on locked store is no-op', () => {
  const store = createReadonlyStore(moduleName, 'lock-on-locked', 0, () => ({})).lock()
  store.lock()
})

describe('getWritable()', () => {
  test('throws if the store is locked', () => {
    const store = createReadonlyStore(moduleName, 'getwritable-on-locked', 0, () => ({})).lock()
    a.throws(() => store.getWritable(), Prohibited)
  })

  test('can be used during config to get and update the store value before the store is locked', () => {
    const store = createReadonlyStore(moduleName, 'getwritable-on-locked', 0, () => ({ a: 1 }))
    store.getWritable().a = 2
    store.lock()
    expect(store.get()).toEqual({ a: 2 })
  })
});

test('property values are frozen in a locked store', () => {
  const store = createReadonlyStore(moduleName, 'prop-freeze', 0, () => ({ a: 1, b: true, c: 'str', d: {}, e: [] as any[] })).lock()

  a.throws(() => store.get().a = 2, TypeError)
  a.throws(() => store.get().b = false, TypeError)
  a.throws(() => store.get().c = 'abc', TypeError)
  a.throws(() => store.get().d = { z: 1 }, TypeError)
  a.throws(() => store.get().e = ['a'], TypeError)
})

test('property value can be undefined', () => {
  createReadonlyStore(moduleName, 'prop-array-freeze', 0, () => ({ und: undefined })).lock()
})

test('array property is frozen in a locked store', () => {
  const store = createReadonlyStore(moduleName, 'prop-array-freeze', 0, () => ({ arr: [] as any[], und: undefined })).lock()

  a.throws(() => store.get().arr.push('a'), TypeError)
})

test('property can be symbol', () => {
  const sym1 = Symbol()
  const sym2 = Symbol()
  const store = createReadonlyStore(moduleName, 'prop-array-freeze', 0, () => ({ [sym1]: undefined, [sym2]: [] as any[] })).lock()

  a.throws(() => store.get()[sym2].push('a'), TypeError)
})

test('can specify finalizer during lock() to process the values', () => {
  const store = createReadonlyStore(moduleName, 'finalizer', 0, () => ({ a: 1, b: { c: 1 }, c: ['a'] }))

  store.lock({
    a: (value) => value + 1,
    b: (value) => Object.freeze(value),
    c: (value) => {
      value.push('b')
      return value
    }
  })

  expect(store.get().a).toBe(2)
  expect(Object.isFrozen(store.get().b)).toBeTruthy()
  expect(store.get().c).toEqual(['a', 'b'])
})

test('finalizer can contain properties out of the store type so it can process older version store values', () => {
  const store = createReadonlyStore(moduleName, 'finalizer-record', 0, () => ({ a: 1 }))

  store.lock({
    a: v => v + 1,
    b: () => undefined
  })
})
