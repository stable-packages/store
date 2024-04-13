export function assertIDInternal(id: string | symbol, assertion: (id: string) => void) {
	if (typeof id === 'string') {
		assertion(id)
	} else if (id.description) {
		assertion(id.description)
	}
}
