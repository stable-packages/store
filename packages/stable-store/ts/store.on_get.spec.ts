import { createStore } from './store.js'
import { expect, it } from '@jest/globals'

it('listen to get calls', () => {
	expect.assertions(1)
	const store = createStore('with-get-listener', { a: 1 })
	store.onGet((v) => expect(v).toEqual({ a: 1 }))
	store.get()
})
