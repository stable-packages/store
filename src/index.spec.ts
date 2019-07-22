import defaultCreate, { createStore } from '.';

describe('package', () => {
  test('default export is `createStore`', () => {
    expect(defaultCreate).toBe(createStore)
  })
})
