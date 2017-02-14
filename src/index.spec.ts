import test from 'ava'

import { getLogger, Logger, Appender } from 'aurelia-logging'

import { removeStore } from './getStore'
import defaultGet, { getStore } from './index'

const logger = getLogger('GlobalStore:spec')

test('shape', t => {
  t.is(defaultGet, getStore)
})

test('simple string store', t => {
  const store = getStore('something', 'somevalue')
  t.is(store.value, 'somevalue')

  t.is(getStore('something', ''), store)

  // Retain current value instead of the new default value.
  t.is(store.value, 'somevalue')

  removeStore(store)
  const store2 = getStore('something')
  t.not(store2, store)
})

test('complex store', t => {
  const defaultValue = { loggers: [] as Logger[], appenders: [] as Appender[] }
  const store = getStore('aurelia-logging:global', defaultValue)
  store.value.loggers.push(logger)

  const another = getStore('aurelia-logging:global', defaultValue)
  t.is(another.value.loggers[0], logger)
})

test('empty store', t => {
  const store = getStore('empty-store')
  t.deepEqual(store.value, {})

  store.value = 1
  const another = getStore('empty-store')
  t.is(another.value, 1)
})
