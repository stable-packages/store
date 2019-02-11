import t from 'assert';
import { typeAssert } from 'type-plus';
import { createStore, getStoreValue, setStoreValue } from '.';

describe('createStore()', () => {
  test('create a store without default value is initialized with undefined', () => {
    const store = createStore('store-without-default')
    expect(store.get()).toBeUndefined()
  })

  test('create store without default has type any', () => {
    const store = createStore('store-is-any')
    store.set(1)
    store.set(true)
    store.set('a')
  })

  test('store type by default follows shape of the default value', () => {
    const strStore = createStore('str-store', 'abc')
    typeAssert.isString(strStore.get())

    const numStore = createStore('num-store', 1)
    typeAssert.isNumber(numStore.get())

    const boolStore = createStore('bool-store', false)
    typeAssert.isBoolean(boolStore.get())
  })

  test('store type can be overriden', () => {
    const store = createStore<{ a?: string }>('override', {})
    typeAssert.isString(store.get().a!)
  })

  test('initialized with default value', () => {
    const defaultValue = { a: 1 }
    const store = createStore('init-value', defaultValue)
    const actual = store.get()
    expect(actual).toBe(defaultValue)
  })

  test('update value by set()', () => {
    const store = createStore('set-store', {})

    const newValue = { a: 2 }
    store.set(newValue)
    t.strictEqual(store.get(), newValue)
  })

  test('store id can be symbol', () => {
    const sym = Symbol.for('create with symbol')
    const store = createStore(sym, { a: 1, b: 2 })
    t.deepStrictEqual(store.get(), { a: 1, b: 2 })
    store.set({ a: 3, b: 4 })
    t.deepStrictEqual(store.get(), { a: 3, b: 4 })
  })

  test('property reference are persisted', () => {
    const store = createStore('prop-ref', { a: { b: 1 } })
    const orig = store.get()
    orig.a = { b: 3 }
    const actual = store.get()
    expect(actual.a).toEqual(orig.a)
  })

  test('create with same id will get existing store', () => {
    createStore('same-name', { a: 1 })
    const actual = createStore('same-name')
    expect(actual.get()).toEqual({ a: 1 })
  })
})

describe('getStoreValue()/setStoreValue()', () => {
  test('get a store value without default value is initialized with undefined', () => {
    const value = getStoreValue('store-without-default-fn')
    expect(value).toBeUndefined()
  })

  test('get a store value without default has type any', () => {
    let value = getStoreValue('store-is-any-fn')
    value = 1
    value = true
    value = 'a'
    expect(value).toBe('a')
  })

  test('store type by default follows shape of the default value', () => {
    const strValue = getStoreValue('str-store-fn', 'abc')
    typeAssert.isString(strValue)

    const numValue = getStoreValue('num-store-fn', 1)
    typeAssert.isNumber(numValue)

    const boolValue = getStoreValue('bool-store-fn', false)
    typeAssert.isBoolean(boolValue)
  })

  test('store type can be overriden', () => {
    const value = getStoreValue<{ a?: string }>('override-fn', {})
    typeAssert.isString(value.a!)
  })

  test('initialized with default value', () => {
    const defaultValue = { a: 1 }
    const actual = getStoreValue('init-value-fn', defaultValue)
    expect(actual).toBe(defaultValue)
  })

  test('update value by set()', () => {
    getStoreValue('set-store-fn', {})

    const newValue = { a: 2 }
    setStoreValue('set-store-fn', newValue)
    t.strictEqual(getStoreValue('set-store-fn'), newValue)
  })

  test('store id can be symbol', () => {
    const sym = Symbol.for('create with symbol fn')
    const actual = getStoreValue(sym, { a: 1, b: 2 })
    t.deepStrictEqual(actual, { a: 1, b: 2 })
    setStoreValue(sym, { a: 3, b: 4 })
    t.deepStrictEqual(getStoreValue(sym), { a: 3, b: 4 })
  })

  test('property reference are persisted', () => {
    const orig = getStoreValue('prop-ref-fn', { a: { b: 1 } })
    orig.a = { b: 3 }
    const actual = getStoreValue('prop-ref-fn')
    expect(actual.a).toEqual(orig.a)
  })

  test('get with same id will get existing store', () => {
    getStoreValue('same-name-fn', { a: 1 })
    const actual = getStoreValue('same-name-fn')
    expect(actual).toEqual({ a: 1 })
  })
})
