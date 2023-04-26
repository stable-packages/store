import { describe, expect, it } from '@jest/globals'
import defaultCreate, { createStore } from './index.js'

describe('package', () => {
  it('default export is `createStore`', () => {
    expect(defaultCreate).toBe(createStore)
  })
})
