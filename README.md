# global-store

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
![badge-size-es6-url]

[![GitHub NodeJS][github-nodejs]][github-action-url]
[![Codecov][codecov-image]][codecov-url]

[![Visual Studio Code][vscode-image]][vscode-url]

[global-store] provides version stable stores for libraries.

Once this library reaches `1.0`, it will forever be backward compatible.
Meaning there will never be a breaking change or `2.0` version of this library.

PLEASE NOTE: This document describes the new `1.0.0-beta` version (finally!! 🎉).

For the current stable version, please check out [here](https://github.com/unional/global-store/blob/v0.8.2/README.md).

## Who needs this

- A library used by other libraries, and
- A library with state, and/or
- A library wants to protect its state from modification.

## Why do you need this

If you use a file-level variable to store some states,
and your library can be used by other libraries,
the state it stores could scatter around the memory,
and you will get inconsistent results.

For example, you have this:

```ts
const registry = {}

export function addComponent(name: string, component: any) {
  registry[name] = component
}
```

When your library is used by other libraries,
they may use different versions.
For example:

```sh
app
- some-library@1.5
  - your-library@1.0
- your-library@2.0
```

Since the versions are not compatible,
both versions of your library are loaded thus two instances of the `registry` variable exist and contain different values.

The solution to this problem is to use some form of global storage such as `global` in NodeJS,
or global variable in the browser.

The problem is that these mechanisms are shared by everything else in the application,
completely exposed to everyone,
and there is no mechanism to consolidate or protect your state when they are populated by each version of your library being loaded.

These are the problems addressed by [global-store].

## Installation

```sh
npm install global-store
yarn add global-store
```

## API

### createStore()

Type: `<T>(options: StoreOptions<T>) => Store<T>`

Creates a store of type `T`.

`T` is inferred by [`initializer`](#StoreOptionsInitializer).

```ts
import { createStore } from 'global-store'

const store = createStore({
  moduleName: 'your-module',
  key: 'some-unique-string',
  version: '1.0.0',
  initializer: (current, versions) => ({
    prop1: false,
    prop2: [] as string[],
    ...current
  })
})

console.log(store.value.prop1) // false

store.value.prop1 = true
store.value.prop2.push('a')
console.log(store.value) // { prop1: true, prop2: ['a'] }
```

#### StoreOptions#moduleName

Type: `string`

Name of your module.

This is typically your NPM package name.
This will be shown if something goes wrong.

#### StoreOptions#key

Type: optional `string`

A specific key for each store in your module.

You can create multiple stores in your module for different purposes.
The key for each store needs to be unique.
And the key has to remain the same across versions.

For example, you can use a format like this to make it unique: `<some-purpose>:<UUID>`

e.g. `config:d15427a4-75cf-4999-9065-1dc325839a59`

`key` + `moduleName` forms a unique ID to the store.

`key` will not be shown if something goes wrong.

If `key` is not specified, it defaults to the string `default`.

#### StoreOptions#version

Type: `StoreVersion = string | number`

The version of the store.

This is used during initialization to determine should the [`StoreOptions#initializer`](#StoreOptionsinitializer) be called (and in what order for [`createAsyncStore()`](#createAsyncStore)).

It will be added to the `processedVersions` argument of the [`StoreOptions#initializer()`](#StoreOptionsinitializer) after it is being called.

When specified as a string (recommended),
it must be in this format: `major.minor.patch`.

When there is a mix of string and numeric versions across different versions of your library,
the numeric value is compared to the patch number of the string version.

#### StoreOptions#initializer()

Type: `<T extends StoreValue>(current: StoreValue, processedVersions: StoreVersion[]) => T`

The function to initialize the store.

Since there may be multiple copies of your library loaded,
multiple calls to the store creation function (e.g. [`createStore()`](#createStore)) may occur.
For the first call, the `current` argument will be an empty object.
For subsequence calls, it will be the value returned by the last call.

The `processedVersions` contains all the versions the have been processed so far.
You can use it to help determine what do you need to do.

For [`createAsyncStore`](#createAsyncStore),
the `initializer` function will be called in the order of `version`.

For [`createStore`](#createStore),
since there is no way to control the load order,
they can be called by a newer version of your library before an older version.
This means your `initializer` needs to be future-proof.

To do that, you should fill in the pieces your specific version needs,
and carry over whatever is currently available.

This is only a general guideline,
the actual implementation will depend on how you use your store.

#### StoreValue

Type: `Record<string | symbol, any>`

The type of value stored in the stores.

Note that the key must be a string or `Symbol.for()` because `Symbol()` cannot be shared across versions.

#### Store#value

Access to the value in the store.

```ts
import { createStore } from 'global-store'

const store = createStore({ ..., initializer: () => ({ x: 1 })}

console.info(store.value.x) // 1
store.value.x = 2
```

#### Store#reset()

Reset the store to its initial value.

This is mostly used in tests so that the tests would not interfere with each other.

### createAsyncStore()

A `async` variant of [`createStore()`](#createStore).
It will return a promise,
which will resolve when the [`initializeAsyncStore()`](#initializeAsyncStore) is called.

One benefit of using this over [`createStore()`](#createStore) is that the initializers will be called in the order of `version`.

This makes initialization much easier to handle.

### initializeAsyncStore()

Calling [`initializeAsyncStore()`](#initializeAsyncStore) will start the initialization process of [`createAsyncStore()`](#createAsyncStore).

It takes two arguments:

- `moduleName: string`: Name of your module.
- `key: string`: Optional. Key of the specific store to initialize.
  If omitted, all stores in the module will be initialized.

## Bundling

If your library will be a standalone bundle, make sure to exclude [global-store].

If not, there will be multiple copies of [global-store] loaded and will completely defeat the purpose.

Except the consuming application, which will declare [global-store] as a regular dependency,
all libraries should declare [global-store] as a peer dependency.

[badge-size-es6-url]: http://img.badgesize.io/unional/global-store/main/packages/global-store/dist/global-store.js.svg?label=bundled&compression=gzip
[codecov-image]: https://codecov.io/gh/unional/global-store/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/global-store
[downloads-image]: https://img.shields.io/npm/dm/global-store.svg?style=flat
[downloads-url]: https://npmjs.org/package/global-store
[github-nodejs]: https://github.com/unional/global-store/workflows/release/badge.svg
[github-action-url]: https://github.com/unional/global-store/actions
[global-store]: https://github.com/unional/global-store
[npm-image]: https://img.shields.io/npm/v/global-store.svg?style=flat
[npm-url]: https://npmjs.org/package/global-store
[downloads-image]: https://img.shields.io/npm/dm/global-store.svg?style=flat
[downloads-url]: https://npmjs.org/package/global-store
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
