---
'stable-store': minor
---

Drop support of `MissingInit<>`.
It now allows creating store with type specified but not initial value.
In that case, the resulting store will add `| undefined` to the value type.

This change is made to accommodate the usage of `options`.

`options` now accepts `onGet` and `onSet` so that you can add the listener while creating the store.