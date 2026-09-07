# global-store

## 1.0.0-beta.23

### Patch Changes

- 998833b: Fix handling when `key` is unknown in `initializeAsyncStore()`
- 66c0578: Pin `type-plus` to the exact version `8.0.0-beta.10`.

  `type-plus` is a devDependency in both packages and its types do not leak into the
  emitted declarations (the only imports live in `*.spec.ts`, which `files` excludes
  from the published tarball). Consumers therefore inherit nothing from the upgrade —
  no new `typescript >= 5.6.0` peer, no runtime dependency change — so this is a patch.

  The version is pinned rather than caret-ranged because `^8.0.0-beta.10` resolves to
  `>=8.0.0-beta.10 <9.0.0-0`, which admits every later `8.0.0` prerelease as well as
  `8.0.0` and `8.1.0`. The 8 line is a prerelease line where breaking changes land
  between betas (beta.10 -> beta.11 changed `Equal`'s signature and removed
  `isType.f`). An exact version makes each bump a reviewable PR instead of something a
  lockfile refresh can do silently.

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
