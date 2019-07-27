# global-store

[![NPM version][npm-image]][npm-url]
[![NPM beta version][npm-beta-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
![badge-size-es5-url]
![badge-size-esnext-url]

[![Circle CI][circleci-image]][circleci-url]
[![Travis CI][travis-image]][travis-url]
[![Codecov][codecov-image]][codecov-url]
[![Coveralls Status][coveralls-image]][coveralls-url]

[![Greenkeeper][greenkeeper-image]][greenkeeper-url]
[![Visual Studio Code][vscode-image]][vscode-url]
[![Wallaby.js][wallaby-image]][wallaby-url]

[global-store] provides version stable stores for library.

Once this library reaches `1.0`, it will forever be backward compatible.
Meaning there will never be a breaking change or `2.0` version of this library.

PLEASE NOTE: This document describes the new `1.0.0-beta` version (finally!! :tada:).

For the current stable version, please check out [here](https://github.com/unional/global-store/blob/v0.8.2/README.md).

## Who need this

- library can be used by other libraries, and
- library with state, and/or
- library wants to protect its state from modification.

## Why do you need this

If you use a file level variable to store some states,
and your library can be used by other libraries,
the state it stores could scatter around the memory and you will get inconsistent result.

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

```
app
- some-library@1.5
  - your-library@1.0
- your-library@2.0
```

Since the versions are not compatible,
both versions of your library are loaded thus two instances of the `registry` variable exist and contain different values.

Solution to this problem is to use some form of global storage such as `global` in NodeJS,
or global variable in browser.

The problem is that these mechanisms are shared by everything else in the application,
completely exposed to everyone,
and there is no mechanism to consolidate your state when they are populated by each version of your library being loaded.

These are the problems addressed by [global-store].

## Installation

```sh
npm install global-store
yarn add global-store
```

## API

### createStore()

Type: `(options: StoreOptions) => Store`

`createStore()` creates a version stable store.

```ts
import { createStore } from 'global-store'

const store = createStore({
  moduleName: 'your-module',
  key: 'some-unique-string',
  version: '1.0.0',
  initializer: (current, versions) =>({
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

This is typically your npm package name.
This will be shown if something goes wrong.

#### StoreOptions#key

Type: `string`

Specific key for each store in your module.

You can create multiple stores in your module for different purposes.
The key for each store needs to be unique.
And the key has to be remain the same across versions.

For example, you can use a format like this to make it unique: `<some-purpose>:<UUID>`

e.g. `config:d15427a4-75cf-4999-9065-1dc325839a59`

`key` + `moduleName` forms an unique id to the store.

`key` not be shown if something goes wrong.

#### StoreOptions#version

Type: `StoreVersion = string | number`

Version of the store.

This is used during initialization to determine should the [`StoreOptions#initializer`](#StoreOptionsinitializer) be called (and in what order for [`createAsyncStore()`](#createAsyncStore) and [`createAsyncReadonlyStore()`](#createAsyncReadonlyStore)).

It will be added to the `processedVersions` argument of the [`StoreOptions#initializer()`](#StoreOptionsinitializer) after it is being called.

When specifing as string (recommended),
it must be in this format: `major.minor.patch`.

When there is a mix of string and numeric verions across different versions of your library,
the numeric value is compared to the patch number of the string version.

#### StoreOptions#initializer()

Type: `<T extends StoreValue>(current: StoreValue, processedVersions: StoreVersion[]) => T`

Function to initialize the store.

Since there may be multiple copies of your library loaded,
multiple calls to the store creation function (e.g. [`createStore()`](#createStore)) may occur.
For the first call, the `current` argument will be an empty object.
For subsequence calls, it will be the value returned by the last call.

The `processedVersions` contains all the versions the have been processed so far.
You can use it to help determine what do you need to do.

For asynchronous store creation functions ([`createAsyncStore()`](#createAsyncStore) and [`createAsyncReadonlyStore()`](#createAsyncReadonlyStore)),
the `initializer` function will be called in the order of `version`.

For synchronous store creation functions ([`createStore()`](#createStore) and [`createReadonlyStore()`](#createReadonlyStore)),
since there is no way to control the load order,
they can be called by a newer version of your libary before an older version.
This means your `initializer` needs to be future proof.

To do that, you should fill in the pieces your specific version needs,
and carry over whatever currently available.

This is only a general guideline,
the actual implementation will depend on how you use your store.

#### StoreValue

Type: `Record<string | symbol, any>`

Shape of the value stored in the stores.

Note that the key must be string or `Symbol.for()` because `Symbol()` cannot be shared across versions.

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

This is mostly used in tests, so that the tests would not interferred each other.

### createReadonlyStore()

`createReadonlyStore()` creates a version stable store that prevents modification.

Its signature is the same as [`createStore()`](#createStore).
The returned `ReadonlyStore` has the following additional features:

#### ReadonlyStore#value

When the store is created,
try accessing `value` would result in error if `lock()` is not called.
This avoids the store to be used accidentially without protection.

#### ReadonlyStore#lock()

Lock the store, making it read only.

When the store is locked, the following happens:

- the value is frozen, making each property read only.
- if the property is an array, it is also frozen,
  making it unable to add or remove entry.
- [`value`](#ReadonlyStorevalue) is open to be used.
- [`reset()`](#ReadonlyStorereset) results in error.
- [`writable`](#ReadonlyStorewritable) results in error.
- [`disableProtection()`](#ReadonlyStoredisableProtection) results in error.

`lock()` takes an optional `finalizer` argument.
It can contains properties matching the property names of the store,
where each one is a transform function for that property.

It allows you to process the store before it is locked.

The typical use cases are to validate, clean up, transform, or freeze the values.

```ts
import { createReadonlyStore } from 'global-store'

const store = createStore<{ a: number, b: Foo[], c: Boo }>(...)

store.lock({
  b: values => values.map(v => Object.freeze(v)),
  c: value => Object.freeze(value),
  prev: value => undefined // make the older version property disappear.
})
```

#### ReadonlyStore#writable

Access to a the value in the store before lock.

Before the store is locked,
you need a mechanism to access the store to configure it.
`writable` by pass the check and allow you to do that.

Once the store is locked, accessing `writable` results in error.

#### ReadonlyStore#disableProtection()

During testing,
you need a mechanism to allow the access [`value`](#ReadonlyStorevalue) to go through without locking the store.
`disableProtection()` tells the store to turn off all checks so it will not complain during test.

Due to its power, you should not have any code calling this method except in your test code.

### createAsyncStore()

An async variant of [`createStore()`](#createStore).
It will return a promise,
which will resolve when the [`initializeAsyncStore()`](#initializeAsyncStore) is called.

One benefit of using this over [`createStore()`](#createStore) is that the initializers will be called in the order of `version`.

This makes initialization much easier to handle.

### initializeAsyncStore()

Calling [`initializeAsyncStore()`](#initializeAsyncStore) will start the initialization process of [`createAsyncStore()`](#createAsyncStore).

It takes two arguments:
- `moduleName: string`: Name of your mdodule.
- `key: string`: Optional. Key of the specific store to initialize.
  If omitted, all stores in the module will be initialized.

### createAsyncReadonlyStore()

An async variant of [`createReadonlyStore()`](#createReadonlyStore).

### initializeAsyncReadonlyStore()

An variant of [`initializeAsyncStore()`](#initializeAsyncStore) for `ReadonlyStore`.

### compareVersion()

Type: `(a: StoreVersion, b: StoreVersion) => number`

Helper utility function to compare versions when implementing [`StoreOptions#initializer()`](#StoreOptionsinitializer).

## Bundling

If your library will be a standalone bundle, make sure to exclude [global-store].
If not, there will be multiple copies of [global-store] loaded and will completely defeat the purpose.

You also should mark [global-store] as a peer dependency and tell people who use your library to include [global-store] as their dependency.

Any application that eventually uses your library should do the same, install [global-store] as their own dependency.

[badge-size-es5-url]: http://img.badgesize.io/unional/global-store/master/dist/global-store.es5.js.svg?label=es5_size&compression=gzip
[badge-size-esnext-url]: http://img.badgesize.io/unional/global-store/master/dist/global-store.es.js.svg?label=esnext_size&compression=gzip
[circleci-image]: https://circleci.com/gh/unional/global-store/tree/master.svg?style=shield
[circleci-url]: https://circleci.com/gh/unional/global-store/tree/master
[codecov-image]: https://codecov.io/gh/unional/global-store/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/global-store
[coveralls-image]: https://coveralls.io/repos/github/unional/global-store/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/global-store
[downloads-image]: https://img.shields.io/npm/dm/global-store.svg?style=flat
[downloads-url]: https://npmjs.org/package/global-store
[global-store]: https://github.com/unional/global-store
[greenkeeper-image]: https://badges.greenkeeper.io/unional/global-store.svg
[greenkeeper-url]: https://greenkeeper.io/
[npm-beta-image]: https://img.shields.io/npm/v/global-store/beta.svg?style=flat
[npm-image]: https://img.shields.io/npm/v/global-store.svg?style=flat
[npm-url]: https://npmjs.org/package/global-store
[downloads-image]: https://img.shields.io/npm/dm/global-store.svg?style=flat
[downloads-url]: https://npmjs.org/package/global-store
[travis-image]: https://img.shields.io/travis/unional/global-store/master.svg?style=flat
[travis-url]: https://travis-ci.org/unional/global-store?branch=master
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
[wallaby-image]: https://img.shields.io/badge/wallaby.js-configured-green.svg
[wallaby-url]: https://wallabyjs.com
