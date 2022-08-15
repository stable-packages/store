# global-store

## 1.0.0-beta.21

### Patch Changes

- 4e20bf5: Fix prototype polluting for `createAsyncStore()`.

  Same issue as the `createStore()`,
  just fixing it to clear code analysis.

## 1.0.0-beta.20

### Patch Changes

- d11a99a: Fix Prototype-polluting assignment.

  It is not really exploitable as they are stores and do not use any built-in methods.

  However, converting them to `Object.create(null)` is a better and cleaner approach anyway.
