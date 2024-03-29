/**
 * A store containing value of V.
 */
export type Store<V> = {
	/**
	 * Get the current value.
	 */
	get(): V
	/**
	 * Adds a listener function to be called whenever the value is retrieved.
	 *
	 * @param {function} listener - A callback function to be called whenever the value is retrieved.
	 * It should take in one parameter, the retrieved value.
	 * @return {function} A function that can be called to remove the listener from the list of listeners.
	 */
	onGet(listener: (value: V) => void): () => void
	/**
	 * Set the value.
	 */
	set(value: V): void
	/**
	 * Registers a listener to be called when the value is set.
	 *
	 * @returns {() => void} An unregister l to remove the listener.
	 */
	onSet(listener: (value: V) => void): () => void
}
