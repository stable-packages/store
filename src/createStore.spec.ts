import t from 'assert';
import { Appender, getLogger, Logger } from 'aurelia-logging';
import defaultCreate, { createStore } from '.';

const logger = getLogger('GlobalStore:spec')

test('simple string', () => {
  const store = createStore('someSimpleKey', 'somevalue')
  const str = store.get()
  t.strictEqual(str, 'somevalue')

  // Retain current value instead of the new default value.
  const sameStore = createStore('someSimpleKey', '')
  const str2 = sameStore.get()
  t.strictEqual(str2, str)

  store.set('abc')
  const str3 = sameStore.get()
  t.notStrictEqual(str3, str)
})

test('complex store', () => {
  const defaultValue = { loggers: [] as Logger[], appenders: [] as Appender[] }
  const store = createStore('aurelia-logging:global', defaultValue)
  const value = store.get()
  value.loggers.push(logger)

  const anotherStore = createStore<typeof defaultValue>('aurelia-logging:global')
  t.strictEqual(anotherStore.get().loggers[0], logger)
})

test('getting store before setting should return undefined', () => {
  const store = createStore('empty-store')
  const value = store.get()
  t.strictEqual(value, undefined)

  store.set(1)
  const another = store.get()
  t.strictEqual(another, 1)
})

test('create a store.', () => {
  const defaultValue = { a: 1 }
  const store = createStore('create-store', defaultValue)
  const actual = store.get()
  t.deepStrictEqual(actual, defaultValue)

  const newValue = { a: 2 }
  store.set(newValue)
  t.strictEqual(store.get(), newValue)
})

test('create with symbol', () => {
  const sym = Symbol.for('create with symbol')
  const store = createStore(sym, { a: 1, b: 2 })
  t.deepStrictEqual(store.get(), { a: 1, b: 2 })
  store.set({ a: 3, b: 4 })
  t.deepStrictEqual(store.get(), { a: 3, b: 4 })
})

test('default export is `createStore`', () => {
  t.strictEqual(defaultCreate, createStore)
})

test('by default the store is created with value any', () => {
  const store = createStore('default any store')
  let value = store.get()
  value = 1
  value = 'anything'
  store.set(value)
})
