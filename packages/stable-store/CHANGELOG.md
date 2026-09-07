# stable-store

## 1.0.0-beta.2

### Minor Changes

- 93304c7: Drop support of `MissingInit<>`.
  It now allows creating store with type specified but not initial value.
  In that case, the resulting store will add `| undefined` to the value type.

  This change is made to accommodate the usage of `options`.

- 5d3a0e2: `getStore()` takes an object instead.

### Patch Changes

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

## 1.0.0-beta.1

### Patch Changes

- 2f26541: Add JSDocs comments for `onGet` and `onSet`.

  Hide the internal `brandedSymbol`.

## 1.0.0-beta.0

### Major Changes

- fecb2b7: Beta release of [stable-store].
