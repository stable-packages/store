import { expect, it } from '@jest/globals'
import { createStore } from './store.js'

it('listen to get calls', () => {
	expect.assertions(2)
	const store = createStore({ key: 'with-get-listener', version: '1.0.0', initialize: () => ({ a: 1 }) })
	store.onGet((v) => expect(v).toEqual({ a: 1 }))
	expect(store.get()).toEqual({ a: 1 })
})
