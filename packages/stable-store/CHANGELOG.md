# stable-store

## 1.0.0-beta.2

### Minor Changes

- 93304c7: Drop support of `MissingInit<>`.
  It now allows creating store with type specified but not initial value.
  In that case, the resulting store will add `| undefined` to the value type.

  This change is made to accommodate the usage of `options`.

- 5d3a0e2: `getStore()` takes an object instead.

### Patch Changes

- 998833b: Update TypeScript to 5.4.5.
  Adjust type to support `exactOptionalPropertyTypes`.

## 1.0.0-beta.1

### Patch Changes

- 2f26541: Add JSDocs comments for `onGet` and `onSet`.

  Hide the internal `brandedSymbol`.

## 1.0.0-beta.0

### Major Changes

- fecb2b7: Beta release of [stable-store].
