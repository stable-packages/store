/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

// UNUSED EXPORTS: store

;// CONCATENATED MODULE: ../../../packages/global-store/lib/toVersionArray.js
function toVersionArray(v) {
    return typeof v === 'number' ? [0, 0, v] :
        v.split('.').map(v => parseInt(v, 10));
}
//# sourceMappingURL=toVersionArray.js.map
;// CONCATENATED MODULE: ../../../packages/global-store/lib/shouldInvokeInitializer.js

function shouldInvokeInitializer(versions, version) {
    const vs = versions.map(toVersionArray);
    const v = toVersionArray(version);
    return noMatchMajor(vs, v) || hasNewVersion(vs, v);
}
function noMatchMajor(versions, version) {
    return !versions.some(v => v[0] === version[0]);
}
function hasNewVersion(versions, version) {
    return versions.filter(v => v[0] === version[0])
        .some(v => version[1] > v[1] || (version[1] === v[1] && version[2] > v[2]));
}
//# sourceMappingURL=shouldInvokeInitializer.js.map
;// CONCATENATED MODULE: ../../../packages/global-store/lib/util.js


function getStoreValue(stores, id) {
    return getStore(stores, id).value;
}
function initStoreValue(stores, id, version, initializer) {
    const store = getStore(stores, id);
    if (shouldInvokeInitializer(store.versions, version)) {
        store.initializers.push(initializer);
        store.value = initializer(store.value, store.versions);
        store.versions.push(version);
    }
}
function resetStoreValue(stores, id) {
    const store = getStore(stores, id);
    const versions = store.versions;
    store.versions = [];
    store.value = store.initializers.reduce((value, initializer, i) => {
        value = initializer(value, store.versions);
        store.versions.push(versions[i]);
        return value;
    }, {});
}
function getStore(stores, id) {
    const moduleStore = stores[id.moduleName] = stores[id.moduleName] || Object.create(null);
    const key = id.key ?? 'default';
    return moduleStore[key] = moduleStore[key] || { versions: [], value: {}, initializers: [] };
}
function util_resolveCreators(moduleName, key, storeCreators, cs) {
    sortByVersion(storeCreators).forEach(({ version, resolve, initializer }) => resolve(cs({ moduleName, key, version, initializer })));
}
function sortByVersion(storeCreators) {
    return storeCreators.sort((a, b) => compareVersion(a.version, b.version));
}
function freezeStoreValue(stores, id, value) {
    const store = getStore(stores, id);
    store.value = value ?
        Object.isFrozen(value) ? value : Object.freeze(value) :
        freezeValue(store.value);
}
function freezeValue(storeValue) {
    if (Object.isFrozen(storeValue))
        throw TypeError('Frozen value cannot be freezed again');
    Object.keys(storeValue).forEach(k => freezeIfIsArray(storeValue, k));
    // istanbul ignore next
    if (Object.getOwnPropertySymbols) {
        Object.getOwnPropertySymbols(storeValue).forEach(k => freezeIfIsArray(storeValue, k));
    }
    return Object.freeze(storeValue);
}
function freezeIfIsArray(storeValue, k) {
    const value = storeValue[k];
    if (Array.isArray(value)) {
        storeValue[k] = Object.freeze(value);
    }
}
//# sourceMappingURL=util.js.map
;// CONCATENATED MODULE: ../../../packages/global-store/lib/createStore.js

const stores = Object.create(null);
/**
 * Creates a store of type T.
 * @see https://www.npmjs.com/package/global-store
 */
function createStore_createStore({ moduleName, key, version, initializer }) {
    const id = { moduleName, key };
    initStoreValue(stores, id, version, initializer);
    return {
        get value() { return getStoreValue(stores, id); },
        freeze(value) { return freezeStoreValue(stores, id, value); },
        reset() { return resetStoreValue(stores, id); }
    };
}
//# sourceMappingURL=createStore.js.map
;// CONCATENATED MODULE: ../../../packages/global-store/lib/createAsyncStore.js


const asyncStoreCreators = Object.create(null);
/**
 * Creates a store of type T asynchronously.
 * @see https://github.com/unional/global-store#createAsyncStore
 */
async function createAsyncStore({ moduleName, key, version, initializer }) {
    return new Promise(resolve => {
        const creatorsOfModules = asyncStoreCreators[moduleName] = asyncStoreCreators[moduleName] || Object.create(null);
        const k = key ?? 'default';
        const storeCreators = creatorsOfModules[k] = creatorsOfModules[k] || [];
        storeCreators.push({ version, resolve, initializer });
    });
}
/**
 * Initializes the stores for `createAsyncStore()`.
 * @see https://github.com/unional/global-store#initializeAsyncStore
 */
function initializeAsyncStore(moduleName, key) {
    const creatorsOfModules = asyncStoreCreators[moduleName];
    if (!creatorsOfModules)
        return;
    const keys = key ? [key] : Object.keys(creatorsOfModules);
    keys.forEach(key => resolveCreators(moduleName, key, creatorsOfModules[key], createStore));
}
//# sourceMappingURL=createAsyncStore.js.map
;// CONCATENATED MODULE: ../../../packages/global-store/lib/index.js




//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./src/index.ts

var store = createStore_createStore({
    moduleName: 'webpack-lib',
    version: '1.0.0',
    initializer: function () { return ({ a: 1 }); }
});

/******/ })()
;