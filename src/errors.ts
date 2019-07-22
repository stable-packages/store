export class Prohibited extends Error {
  constructor(public moduleName: string, public action: string) {
    super(`Unable to perform '${action}' on a locked store from module '${moduleName}'`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class AccessedBeforeLock extends Error {
  constructor(public moduleName: string) {
    super(`A readonly store from '${moduleName}' is being accessed before it is locked. Please call the approprate function in '${moduleName}' to lock the store.`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
