import t from 'assert';
import { Appender, getLogger, Logger } from 'aurelia-logging';
import defaultCreate, { create, get, set } from './index';

const logger = getLogger('GlobalStore:spec')

test('simple string', () => {
  const str = get('someSimpleKey', 'somevalue')
  t.strictEqual(str, 'somevalue')

  // Retain current value instead of the new default value.
  t.strictEqual(get('someSimpleKey', ''), str)

  set('someSimpleKey', 'abc')
  const str2 = get('someSimpleKey')
  t.notStrictEqual(str2, str)
})

test('complex store', () => {
  const defaultValue = { loggers: [] as Logger[], appenders: [] as Appender[] }
  const value = get('aurelia-logging:global', defaultValue)
  value.loggers.push(logger)

  const another = get<typeof defaultValue>('aurelia-logging:global')
  t.strictEqual(another.loggers[0], logger)
})

test('getting store before setting should return undefined', () => {
  const value = get('empty-store')
  t.strictEqual(value, undefined)

  set('empty-store', 1)
  const another = get('empty-store')
  t.strictEqual(another, 1)
})

test('create a store.', () => {
  const defaultValue = { a: 1 }
  const store = create('create-store', defaultValue)
  const actual = store.get()
  t.deepStrictEqual(actual, defaultValue)

  const newValue = { a: 2 }
  store.set(newValue)
  t.strictEqual(store.get(), newValue)
})

test('get/set with symbol', () => {
  const sym = Symbol.for('get/set with symbol')
  const actual = get(sym, 'x')
  t.strictEqual(actual, 'x')
  set(sym, 'y')
  t.strictEqual(get(sym), 'y')
})

test('create with symbol', () => {
  const sym = Symbol.for('create with symbol')
  const store = create(sym, { a: 1, b: 2 })
  t.deepStrictEqual(store.get(), { a: 1, b: 2 })
  store.set({ a: 3, b: 4 })
  t.deepStrictEqual(store.get(), { a: 3, b: 4 })
})

test('default export is `create`', () => {
  t.strictEqual(defaultCreate, create)
})

test('by default the store is created with value any', () => {
  const store = create('default any store')
  let value = store.get()
  value = 1
  value = 'anything'
  store.set(value)
})
