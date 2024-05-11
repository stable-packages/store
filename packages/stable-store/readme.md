# Stable Store

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][npm-url]

[`stable-store`] allows you to create stores for data, functions, or modules and access them anywhere within the physical boundary.

## The problem

Let's say you want to share something between two pieces of code.
It can be data, functions, or modules, doesn't really matter.

There are several ways to do it:

- Parameter passing: pass it around as parameter or return it.
- Scope Sharing: lexical, file, module, etc.
- Scope Attachment: object, global, DOM, etc.
- External Storage: service, browser storage, etc. For serializable data only.

There are pros and cons for each approach.
But if you want to make sure the sharing works across:

- different versions of your library loaded into memory, and
- different copies of your library loaded through bundles of different MFEs (micro frontends), and
- isolated rendering such as [island architecture]

Then "scope sharing" does not work, because you can have two different source code.

So that left with "parameter passing", "scope attachment", and "external storage".

But as you might know, there are major drawbacks for either approach.

Parameter passing either causes abstraction leakage,
meaning the parent needs to know what the child depends on,
or run into service locator antipattern.

For scope attachment, object scope attachment does work for obvious reason,
and global scope attachment has security implication.

DOM scope attachment is a good alternative.
That's basically what React Context is.
But it suffers from the same problem as scope sharing,
two different source code creates two different React Contexts,
and each contains different copies of the data.

For external storage, it is limited to serializable data only.

This library provides another way through "module scope sharing".

## The solution

The idea is pretty simple: make the module unique.

To do that, we need to make sure there will always be one and only one copy of the library loaded into memory.

[`stable-store`] achieves this by:

- Stable consuming API: the API used by the library will remain stable and backward compatible.
- ESM only: this library is only available as ESM.
- Loaded by Host: only the host application should load [`stable-store`].
  Libraries using [`stable-store`] will reference it as `peerDependency`.

## Install

For application, install it as a dependency:

```sh
# npm
npm install stable-store

# yarn
yarn add stable-store

# pnpm
pnpm add stable-store

#rush
rush add -p stable-store
```

For library, install it as a peer dependency:

```sh
# npm
npm install stable-store --save-peer

# yarn
yarn add stable-store --save-peer

# pnpm
pnpm add stable-store --save-peer

#rush
rush add -p stable-store --save-peer
```

## Usage

This library provides a basic store with the ability to listen to changes.

```ts
import { createStore, getStore } from 'stable-store'

createStore({ id: Symbol.for('your-library'), initialize: () => ({ ... }) })

const myStore = getStore({ id: Symbol.for('your-library') })

// Get data
const data = myStore.get()

// Set data
myStore.set({ ... })
```

### Securing access

The store access can be secured by `key` and `keyAssertion`.

When you create a store, you can provide a `keyAssertion` function:

```ts
import { createStore } from 'stable-store'

createStore({
	id: 'some-id',
	initialize: () => ({ ... })
	keyAssertion: (key: string | undefined) => {
		if (isInvalid(key)) throw new Error('invalid key')
	},
})
```

The `key` is provided when calling `getStore()`:

```ts
import { getStore } from 'stable-store'

const store = getStore({ id: 'some-id', key: 'some-key' })
```

You can validate against this key to ensure only your code or the code that you trust can access the store.

How to validate the `key` is up to you,
you can use a simple string comparison, or deploy some cryptographic algorithm.

If the `key` is valid, just return. Otherwise, throw an error.

[`stable-store`]: https://www.npmjs.com/package/stable-store
[downloads-image]: https://img.shields.io/npm/dm/stable-store.svg?style=flat
[island architecture]: https://jasonformat.com/islands-architecture/
[npm-image]: https://img.shields.io/npm/v/stable-store.svg?style=flat
[npm-url]: https://www.npmjs.com/package/stable-store
