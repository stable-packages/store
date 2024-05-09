import { ctx } from './ctx.js'

/**
 * Configure `stable-store` overall environment.
 * This should be called by the host application and it should be called only once.
 *
 * Calling this function more than once will throw an exception.
 */
export function config() {
	if (ctx.configured) {
		throw new Error('stable-store is already configured')
	}

	ctx.configured = true
}
