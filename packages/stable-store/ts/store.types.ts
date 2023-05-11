/**
 * A store containing value of V.
 */
export type Store<V> = {
	/**
	 * Get the current value.
	 */
	get(): V
	onGet(fn: (value: V) => void): () => void
	/**
	 * Set the value.
	 */
	set(value: V): void
	onSet(fn: (value: V) => void): () => void
}
