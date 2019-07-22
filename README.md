# global-store

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
![badge-size-es5-url]
![badge-size-es2015-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/unional/global-store.svg)](https://greenkeeper.io/)

[`global-store`](https://github.com/unional/global-store) provides version stable stores for library.

## Who need this

- libraries that want its state to be shared regardless of how many versions of it exist in memory.
- libraries that want to protect its state from modification.

## Why do you need this

If you use a file level variable to store some states,
and your library might be used by other libraries,
the state it store would scatter around the memory and you will get inconsistent result:

```ts
const registry = {}

export function addComponent(name: string, component: any) {
  registry[name] = component
}
```

This is because when your library is used by other libraries,
they may use different versions.
For example:

```
app
- some-library@1.5
  - your-library@1.0
- your-library@2.0
```

Since the versions are not compatible,
both versions of your library are loaded thus two instance of the `registry` variable exists.

Solution to this problem is to use some form of global storage such as `process.env` in NodeJS,
and `localStorage` or global variable in browser.

The problem is that these mechanism are shared by everything else in the application,
completely exposed to everyone,
and there is no mechanism to consolidate your state when they are populated my each copy of your library.

These are the problems addressed by [`global-store`](https://github.com/unional/global-store)

## API

### `createStore()`

`createStore()` is a version stable store.

```ts
import { createStore } from 'global-store'

const store = createStore(
  'your-module',
  'unique-string',
  previous => ({ ...previous, prop1: false, prop2: [] as string[] })
)

console.log(store.get().prop1) // false

store.get().prop1 = true
store.get().prop2.push('a')
console.log(store.get()) // { prop1: true, prop2: ['a'] }
```

#### `createStore(moduleName, key, initializer)`
- `moduleName: string`: Name of your module. This is typically your npm package name.
- `key: string | symbol`: Together with `moduleName`, `key` + `moduleName` forms an unique id to the store.
  The `key` should be unique for each store you create.
  You can use some random string such as UUID.
  You can also use `symbol`, but not that you need to use the `Symbol.for('key')` variant as `Symbol()` does not work for this purpose.
- `initializer: (previous) => initValue`: initializer to initialize the store.
  Since there may be multiple copies of your library loaded,
  multiple calls to `createStore()` may occurs.
  For the first call, the `previous` argument will be an empty object.
  For subsequence calls, it will be the value returned by the previous call.
  Since there is no way to control the load order,
  `createStore()` can be called by a newer version of your libary before an older version of your libary calls it.
  To property setup your store,
  you can use a property such as `revisions` or `versions` to help this process.

#### `Store#get()`

Gets the store value.
Also use this to update the store.

```ts
import { createStore } from 'global-store'

const store = createStore(
  'your-module',
  'general:300c47d7-b3a8-43ee-9dea-1e05a7b34240',
  p => ({ ...p, a: 1 })
)

store.get().a = 2

console.log(store.get().a) // 2
```

#### `Store#reset()`

Reset the store to its initial value.

This is used mostly in your test, so that the tests would not interferred each other.

### `createReadonlyStore()`

`createReadonlyStore()` is a version stable store that prevents modification.

It is created the same way as `createStore()`, with the additional features:

#### ReadonlyStore#get()

When the store is created,
calling `get()` would result in error if `lock()` is not called.
This avoids the store to be used accidentially without protection.

#### Readonly#lock()

Lock the store, making it read only.

Then the store is locked, the following happens:

- the value is frozen, making each property read only.
- if the property is an array, it is also frozen,
  making it unable to add or remove entry.
- `get()` is open to be used.
- `reset()` results in error.
- `getWritable()` results in error.
- `openForTesting()` results in error.

`lock()` takes an optional `finalizer` argument.
It can contains properties matching the property names of the store,
where each one is a transform function for that property.

It allows you to process the store before it is locked.

The typical use cases are to validate, clean up, transform, and freeze the values.

```ts
import { createReadonlyStore } from 'global-store'

const store = createStore(
  'your-module',
  'general:ea305f50-c48c-4d18-97ef-4c8e8f130446',
  p => ({ ...p, a: 1, b: [], c: {} })
)

store.lock({
  b: values => values.map(v => Object.freeze(v)),
  c: value => Object.freeze(value),
  prev: value => undefined // make the older version property disappear.
})
```

#### ReadonlyStore#getWritable()

Before the store is locked,
you need a mechanism to access the store and configure it.
`getWritable()` by pass the check and allow you to do that.

Once the store is locked, calling `getWritable()` results in error.

#### ReadonlyStore#openForTesting()

During testing,
you need a mechanism to allow the `get()` calls to go through without locking the store.
`openForTesting()` tells the store to turn off all checks so it can be used during test.

Due to its power, you should not have any code calling this method except in your test code.

## Installation

```sh
npm install global-store
yarn add global-store
```

## Bundling

If your library will be a standalone bundle, make sure to exclude [`global-store`](https://github.com/unional/global-store).
If not, there will be multiple copies of [`global-store`](https://github.com/unional/global-store) loaded and will completely defeat the purose.

You also should mark [`global-store`](https://github.com/unional/global-store) as a peer dependency and tell people who use your library to include [`global-store`](https://github.com/unional/global-store) as their dependency.

Any application that eventually uses your library should do the same, install [`global-store`](https://github.com/unional/global-store) as their own dependency.

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
