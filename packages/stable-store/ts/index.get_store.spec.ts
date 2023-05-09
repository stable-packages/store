import { expect, it } from '@jest/globals'
import { createStore, getStore } from './index.js'

it('throws if store does not exist', () => {
	expect(() => getStore('does not exist')).toThrow()
})

it('returns the same store if the key is the same string', () => {
  createStore('same-key')
  const a = getStore('same-key')
  const b = getStore('same-key')
  expect(a).toBe(b)
})

it.todo('id assertions')
