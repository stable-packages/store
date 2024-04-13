import { idAssertions } from './assert_id.ctx.js'
import { assertIDInternal } from './asset_id.internal.js'

/**
 * Asserts that the provided ID is a valid string or symbol.
 *
 * This function is used to validate the ID passed to the stable store.
 *
 * @param id - The ID to assert.
 */
export function assertID(id: string | symbol) {
	assertIDInternal(id, assertIDString)
}

/**
 * Register an assertion for the ID globally.
 *
 * Since the same stable store is used for every module loaded,
 * your ID should follow certain pattern which you can match before doing your assertion.
 *
 * e.g. `<module name><version>:<token>`.
 * so that you will not accidentally prevent other modules from using the store.
 */
export function registerIDAssertion(assertion: (id: string) => void) {
	idAssertions.push(assertion)
}


function assertIDString(id: string) {
	idAssertions.forEach((assertion) => assertion(id))
}
