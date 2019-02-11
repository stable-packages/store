import defaultCreate, { createStore } from '.';

test('default export is `createStore`', () => {
  expect(defaultCreate).toBe(createStore)
})
