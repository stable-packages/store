# stable-store

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][npm-url]

[stable-store] allows you to create in-memory stores and access them anywhere within the physical boundary of your application.

## The problem

Let's say you want to share something between two piece of code.
It can be data or functions, doesn't really matter.

There are several ways to do it:

- Parameter passing: pass it around as parameters.
- Scope Sharing: lexical, file, module, etc.
- Scope Attachment: object, global, DOM, etc.

There are pros and cons for each approach.
But if you want to make sure the sharing works across:

- different versions of your library loaded into memory, and
- different copies of your library loaded through bundles of differene MFEs (micro frontends), and
- isolated rendering such as [island architecture]

only "parameter passing" and "global scope attachment" will work.

But as you might know, there are major drawbacks for either approach.

This library provides another way through "module scope sharing".

## The solution

The key for this library to work is to make sure there will always be one and only one copy of the library loaded into memory.

It achieves this by:

- stable version: this library will always stay at `1.x` and will never have a breaking change.
- ESM only: this library is only available as ESM.
- host loading: only the host application should load this library. All other libraries reference this library as `peerDependency`.

## Install

```sh
# npm
npm install stable-store

# yarn
yarn add stable-store

# pnpm
pnpm install stable-store

#rush
rush add -p stable-store
```

## Usage

This library provides a basic store with the ability to listen to changes.

```ts
import { store } from 'stable-store'

const initialData = { ... }
const appStore = store(Symbol.for('your-app'), initialData)

appStore.listen(data => console.log('data changed', data))

const data = appStore.get()
appStore.set({ ... })
```

It does not provide any other fancy features each as immutability (e.g. [immer]) or version merging (e.g. [global-store]).

This is by design so that there are minimum moving parts and the library can stay stable.

[downloads-image]: https://img.shields.io/npm/dm/unional/stable-store.svg?style=flat
[global-store]: https://www.npmjs.com/package/global-store
[immer]: https://www.npmjs.com/package/immer
[island architecture]: https://jasonformat.com/islands-architecture/
[npm-image]: https://img.shields.io/npm/v/unional/stable-store.svg?style=flat
[npm-url]: https://npmjs.org/package/unional/stable-store
[stable-store]: https://www.npmjs.com/package/stable-store
