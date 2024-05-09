import { ctx } from './ctx.js'

export interface Config {
	/**
	 * Specify a logger to log listener errors.
	 * Defaults to `console`.
	 */
	logger?: { error(...args: any[]): void } | undefined
}

/**
 * Configure `stable-store` overall environment.
 * This should be called by the host application and it should be called only once.
 *
 * Calling this function more than once will throw an exception.
 */
export function config({ logger }: Config) {
	if (ctx.configured) {
		throw new Error('stable-store is already configured')
	}

	ctx.configured = true
	ctx.logger = logger ?? console
}
