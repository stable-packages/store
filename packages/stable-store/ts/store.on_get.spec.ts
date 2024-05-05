import { expect, it } from '@jest/globals'
import { createStore } from './store.js'

it('listen to get calls', () => {
	expect.assertions(1)
	const store = createStore({ key: 'with-get-listener', initialize: () => ({ a: 1 }) })
	store.onGet((v) => expect(v).toEqual({ a: 1 }))
	store.get()
})
