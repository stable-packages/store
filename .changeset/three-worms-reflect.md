---
"global-store": patch
---

Fix Prototype-polluting assignment.

It is not really exploitable as they are stores and do not use any build-in methods.

However, converting them to `Object.create(null)` is a better and cleaner approach anyway.
