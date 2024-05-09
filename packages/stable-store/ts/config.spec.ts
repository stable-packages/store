import { afterEach, expect, it } from '@jest/globals'
import { config } from './config.js'
import { resetCtx } from './ctx.js'

afterEach(() => {
	resetCtx()
})

it('throws when called the second time', () => {
	config({})

	expect(() => {
		config({})
	}).toThrow()
})
