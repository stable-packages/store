# global-store

[![unstable][unstable-image]][unstable-url]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
![badge-size-es5-url]
![badge-size-es2015-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/unional/global-store.svg)](https://greenkeeper.io/)

A version locked global store.

The objective is to have the only one *instance* of `global-store` in any given application.

Once this library reaches `1.0`, it will never update to other major or minor releases.
i.e. there will be no `1.1` or `2.0` of this library.

It may release patches to add misc info, e.g. improve typings, fix typos, or add `flow` support, but that's it.

## Summary

This libary provides a reliable place in memory for your library to store and retrieve any information.
With the version locked, even if there are multiple versions of your library exist in an application, they will access the same global store.

This library is designed to be used by libraries only.
Specifically, for libraries that want to have some global states in memory for the lifetime of the application.

For example, caching, registry, etc.

You should understand the drawbacks of using any global state in your library,
and mitigate the drawbacks by properly structure your code to get around these drawbacks.

For application code, you do not need this library.

## Overview (don't skim this!)

Global state is bad.

Specifically, globally referenced state is bad.

Furthermore, *mutable globally referenced state* is worse (for simplicity, we will refer it to simply *mutable global state* in this document).

If you utilize some form of *mutable global state*, more often than not it will obstruct you from writing unit tests and your code will be harder to maintain.

*Mutable global state* comes in many different forms.
Well known *mutable global state* are singleton, global namespace variable, and mutable static variables.

With modularization, *private module data* is added to the list.

Besides testability and maintainability, using *private module data* can lead to [incorrect result](#multi-versions-issue).

Then why am I making this library?

There are some situations you do need to retain some information globally.
It is ok to have global state only if it does not affect your codes testability and maintainability.

**I can't stress that enough**.

This library attempts to provide a holy ground for those global states.

It is an in-memory store, and will ever only be an in-memory store.

## Usage

```ts
import { createStore } from 'global-store'

interface SomeInfo { ... }

function createDefault(): SomeInfo {
  return { ... }
}

// Note: The id MUST be runtime-wide unique.
const store = createStore('my-module:some-purpose:[some-random-string]', createDefault())

// Or use symbol
const store = createStore(Symbol.for('my-module:some-purpose'), createDefault())

const value = store.get()

// update value
value.hachou = 2
store.set(value)
```

If you prefer functional programming, you can also do this:

```ts
import { getStoreValue, setStoreValue } from 'global-store'

interface SomeInfo { ... }

function createDefault(): SomeInfo {
  return { ... }
}

// Note: The id MUST be runtime-wide unique.
const value = getStoreValue('my-module:some-purpose:<some-random-string>', createDefault())

// Or use symbol
const value = getStoreValue(Symbol.for('my-module:some-purpose'), createDefault())

// update value
value.hachou = 2
setStoreValue('my-module:some-purpose:<some-random-string>', value)
```

For `Symbol`, remember to use `Symbol.for()` instead of `Symbol()`.
The latter doesn't work for this purpose.

It is recommended to use a function to create the default value.
This way, you can easily reset your store during testing.

When you bundle your library, remember to exclude this library or else that really defeat the purpose.

## Aware of reference changes

Be aware that what you are persisting is a simple object.
That means if you set a new object, other part of your code may not aware of it.

```ts
// a.ts
import { createStore } from 'global-store'

const store = createStore('some-store', { a: 1 })
const value = store.get()

// b.ts
import { createStore } from 'global-store'

const store = createStore('some-store')
store.set({ a: 2 })
```

In the example above, after `b.ts` is processed, the `value` in `a.ts` is still `{ a: 1 }`,

The same goes for functional style.

The best practice is mutating the object instead of replacing it.
Using the functional style as an example:

```ts
import { getStoreValue, setStoreValue } from 'global-store'

const value = getStoreValue('some-store', { a: { b: 1 } })

value.a = { b: 2 }
setStoreValue('some-store', value) // reuse the same reference
```

## About patch version increment

Patch version change may still cause problem if the a module locks the exact version of this library.
But it rarely happens, and we need some versioning flexibility to make improvements to the library.

## Multi-versions issue

Say your are writing `your-module-a`.
It has some mutable private module data, e.g.:

```ts
const cakeSold = 0

export function sellCake() {
  cakeSold++
  return new Cake()
}

export function getCakeSold() {
  return cakeSold
}
```

You released `your-module-a@1.0`.

Someone else notice `your-module-a`, liked it, and start using it in his own module, `his-module-b`.

He released `his-module-b@1.5` using `your-module-a@1.0`.

Some time later, you have made some changes to `your-module-a`, and release it as `your-module-a@2.0`.
The `cakeSold`, `getCake()` and `getCakeSold()` were not changed.

Now I come in and create an application, using both `your-module-a@2.0` and `his-module-b@1.5`.

Since `his-module-b@1.5` uses `your-module-a@1.0`, my version tree looks like this:

```sh
- his-module-b@1.5
  - your-module-a@1.0
- your-module-a@2.0
```

As you can guess, in memory there will be two different `cakeSold` and your module stopped working correctly.

## How about global namespace

You may wonder that global namespace "provides" the same functionality.
Yes it does, and it is funny that it sounds like we are going full circle back and realize the goodness of global namespace.

`global-store` provides the same functionality of global namespace in this regards, but without the publicity.

If your library only works on the server side, e.g. NodeJS, you can also consider using environment variable directly.

## What about cross process / iframe sharing

`global-store` does not do this in order to keep the version locked.
You can easily imagine if `global-store` support them, it will be a neverending story and version locking is just not possible.

If you need to share states between process / iframe, use the same old IPC, web worker, process, whatever, to share the data between those `global-store`s.

## Contribute

```sh
# right after clone
npm install

# begin making changes
git checkout -b <branch>
npm run watch

# edit `webpack.config.dev.js` to exclude dependencies for the global build.

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

## Npm Commands

There are a few useful commands you can use during development.

```sh
# Run tests (and lint) automatically whenever you save a file.
npm run watch

# Run tests with coverage stats (but won't fail you if coverage does not meet criteria)
npm run test

# Manually verify the project.
# This will be ran during 'npm preversion' so you normally don't need to run this yourself.
npm run verify

# Build the project.
# You normally don't need to do this.
npm run build

# Run tslint
# You normally don't need to do this as `npm run watch` and `npm version` will automatically run lint for you.
npm run lint
```

Generated by [`generator-unional@0.4.0`](https://github.com/unional/unional-cli)

[unstable-image]: http://badges.github.io/stability-badges/dist/unstable.svg
[unstable-url]: http://github.com/badges/stability-badges
[npm-image]: https://img.shields.io/npm/v/global-store.svg?style=flat
[npm-url]: https://npmjs.org/package/global-store
[downloads-image]: https://img.shields.io/npm/dm/global-store.svg?style=flat
[downloads-url]: https://npmjs.org/package/global-store
[travis-image]: https://img.shields.io/travis/unional/global-store/master.svg?style=flat
[travis-url]: https://travis-ci.org/unional/global-store?branch=master
[coveralls-image]: https://coveralls.io/repos/github/unional/global-store/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/global-store
[badge-size-es5-url]: http://img.badgesize.io/unional/global-store/master/dist/global-store.es5.js.svg?label=es5_size
[badge-size-es2015-url]: http://img.badgesize.io/unional/global-store/master/dist/global-store.es2015.js.svg?label=es2015_size
