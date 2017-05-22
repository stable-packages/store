import test from 'ava'

import { getLogger, Logger, Appender } from 'aurelia-logging'

import create, { get, set } from './index'

const logger = getLogger('GlobalStore:spec')

test('simple string', t => {
  const str = get('someSimpleKey', 'somevalue')
  t.is(str, 'somevalue')

  // Retain current value instead of the new default value.
  t.is(get('someSimpleKey', ''), str)

  set('someSimpleKey', 'abc')
  const str2 = get('someSimpleKey')
  t.not(str2, str)
})

test('complex store', t => {
  const defaultValue = { loggers: [] as Logger[], appenders: [] as Appender[] }
  const value = get('aurelia-logging:global', defaultValue)
  value.loggers.push(logger)

  const another = get<typeof defaultValue>('aurelia-logging:global')
  t.is(another.loggers[0], logger)
})

test('getting store before setting should return undefined', t => {
  const value = get('empty-store')
  t.is(value, undefined)

  set('empty-store', 1)
  const another = get('empty-store')
  t.is(another, 1)
})

test('create a store.', t => {
  const defaultValue = { a: 1 }
  const store = create('create-store', defaultValue)
  const actual = store.get()
  t.deepEqual(actual, defaultValue)

  const newValue = { a: 2 }
  store.set(newValue)
  t.is(store.get(), newValue)
})

test('get/set with symbol', t => {
  const sym = Symbol.for('get/set with symbol')
  const actual = get(sym, 'x')
  t.is(actual, 'x')
  set(sym, 'y')
  t.is(get(sym), 'y')
})

test('create with symbol', t => {
  const sym = Symbol.for('create with symbol')
  const store = create(sym, { a: 1, b: 2 })
  t.deepEqual(store.get(), { a: 1, b: 2 })
  store.set({ a: 3, b: 4 })
  t.deepEqual(store.get(), { a: 3, b: 4 })
})
