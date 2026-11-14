---
'global-store': patch
'stable-store': patch
---

Pin `type-plus` to the exact version `8.0.0-beta.10`.

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
