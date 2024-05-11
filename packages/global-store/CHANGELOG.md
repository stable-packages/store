# global-store

## 1.0.0-beta.23

### Patch Changes

- 998833b: Fix handling when `key` is unknown in `initializeAsyncStore()`
- 998833b: Update TypeScript to 5.4.5.
  Adjust type to support `exactOptionalPropertyTypes`.

## 1.0.0-beta.22

### Patch Changes

- 44aa1cc: adding `import type`.
- 92e5973: Update flow type.

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
