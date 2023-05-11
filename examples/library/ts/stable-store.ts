import { createStore } from 'stable-store'

export const stableStore = createStore('stable-store', { count: 0 })
