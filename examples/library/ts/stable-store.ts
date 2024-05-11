import { createStore } from 'stable-store'

export const stableStore = createStore({ id: 'stable-store', initialize: () => ({ count: 0 }) })
