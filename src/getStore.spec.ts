import test from 'ava'

import { getLogger, Logger, Appender } from 'aurelia-logging'

import { removeStore } from './getStore'
import defaultGet, { getStore } from './index'

const logger = getLogger('GlobalStore:spec')

test('shape', t => {
  t.is(defaultGet, getStore)
})

test('simple string store', t => {
  const store = getStore('something')
  store.value = 'somevalue'

  t.is(store.value, 'somevalue')

  t.is(getStore('something', ''), store)

  removeStore(store)
  const store2 = getStore('something')
  t.not(store2, store)

  t.notThrows(() => removeStore(undefined as any))
})

test('complex store', t => {
  const defaultValue = { loggers: [] as Logger[], appenders: [] as Appender[] }
  const store = getStore('aurelia-logging:global', defaultValue)
  store.value.loggers.push(logger)

  const another = getStore('aurelia-logging:global', defaultValue)
  t.is(another.value.loggers[0], logger)
})
