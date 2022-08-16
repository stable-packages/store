import { createStore } from 'global-store'

export const store = createStore({
  moduleName: 'webpack-lib',
  version: '1.0.0',
  initializer: () => ({ a: 1 })
})
