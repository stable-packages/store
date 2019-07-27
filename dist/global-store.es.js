function compareVersion(a, b) {
    const v1 = toVersionArray(a);
    const v2 = toVersionArray(b);
    return v1[0] !== v2[0] ? v1[0] - v2[0] :
        v1[1] !== v2[1] ? v1[1] - v2[1] :
            v1[2] - v2[2];
}
function toVersionArray(v) {
    return typeof v === 'number' ? [0, 0, v] :
        v.split('.').map(v => Number.parseInt(v, 10));
}

class Prohibited extends Error {
    constructor(moduleName, action) {
        super(`Unable to perform '${action}' on a locked store from module '${moduleName}'`);
        this.moduleName = moduleName;
        this.action = action;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class AccessedBeforeLock extends Error {
    constructor(moduleName) {
        super(`A readonly store from '${moduleName}' is being accessed before it is locked. Please call the approprate function in '${moduleName}' to lock the store.`);
        this.moduleName = moduleName;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

function getStoreValue(stores, id) {
    return getStore(stores, id).value;
}
function initStoreValue(stores, id, version, initializer) {
    const store = getStore(stores, id);
    if (!~store.versions.indexOf(version)) {
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
    const moduleStore = stores[id.moduleName] = stores[id.moduleName] || {};
    return moduleStore[id.key] = moduleStore[id.key] || { versions: [], value: {}, initializers: [] };
}
function resolveCreators(moduleName, key, storeCreators, createStore) {
    sortByVersion(storeCreators).forEach(({ version, resolve, initializer }) => resolve(createStore({ moduleName, key, version, initializer })));
}
function sortByVersion(storeCreators) {
    return storeCreators.sort((a, b) => compareVersion(a.version, b.version));
}

const readonlyStores = {};
/**
 * Creates a readonly store of type T.
 * https://github.com/unional/global-store#createreadonlystore
 */
function createReadonlyStore({ moduleName, key, version, initializer }) {
    initStoreValue(readonlyStores, { moduleName, key }, version, initializer);
    let isLocked = false;
    let disabled = false;
    return {
        disableProtection() {
            if (isLocked)
                throw new Prohibited(moduleName, 'ReadonlyStore#disableProtection');
            disabled = true;
        },
        get value() {
            if (!disabled && !isLocked)
                throw new AccessedBeforeLock(moduleName);
            return getStoreValue(readonlyStores, { moduleName, key });
        },
        get writeable() {
            if (!disabled && isLocked)
                throw new Prohibited(moduleName, 'ReadonlyStore#getWritable');
            return getStoreValue(readonlyStores, { moduleName, key });
        },
        lock(finalizer) {
            if (!disabled && !isLocked) {
                if (finalizer) {
                    updateStoreValue(readonlyStores, { moduleName, key }, finalizer);
                }
                freezeStoreValue(readonlyStores, { moduleName, key });
                isLocked = true;
                disabled = false;
            }
            return this;
        },
        reset() {
            if (!disabled && isLocked)
                throw new Prohibited(moduleName, 'ReadonlyStore#reset');
            resetStoreValue(readonlyStores, { moduleName, key });
        }
    };
}
function updateStoreValue(stores, id, finalizer) {
    const current = getStoreValue(stores, id);
    Object.keys(finalizer).forEach(k => current[k] = finalizer[k](current[k]));
}
function freezeStoreValue(stores, id) {
    const store = getStore(stores, id);
    store.value = freezeValue(store.value);
}
function freezeValue(storeValue) {
    Object.keys(storeValue).forEach(k => freezeArray(storeValue, k));
    // istanbul ignore next
    if (Object.getOwnPropertySymbols) {
        Object.getOwnPropertySymbols(storeValue).forEach(k => freezeArray(storeValue, k));
    }
    return Object.freeze(storeValue);
}
function freezeArray(storeValue, k) {
    const value = storeValue[k];
    if (Array.isArray(value)) {
        storeValue[k] = Object.freeze(value);
    }
}

const asyncReadonlyStoreCreators = {};
/**
 * Creates a readonly store of type T.
 * https://github.com/unional/global-store#createAsyncReadonlyStore
 */
function createAsyncReadonlyStore({ moduleName, key, version, initializer }) {
    return new Promise(resolve => {
        const creatorsOfModules = asyncReadonlyStoreCreators[moduleName] = asyncReadonlyStoreCreators[moduleName] || {};
        const storeCreators = creatorsOfModules[key] = creatorsOfModules[key] || [];
        storeCreators.push({ version, resolve, initializer });
    });
}
/**
 * Initializes the stores for `createAsyncReadonlyStore()`.
 * https://github.com/unional/global-store#initializeAsyncReadonlyStore
 */
function initializeAsyncReadonlyStore(moduleName, key) {
    const creatorsOfModules = asyncReadonlyStoreCreators[moduleName];
    if (!creatorsOfModules)
        return;
    if (key) {
        const storeCreators = creatorsOfModules[key];
        resolveCreators(moduleName, key, storeCreators, createReadonlyStore);
    }
    else {
        Object.keys(creatorsOfModules).forEach(k => {
            const storeCreators = creatorsOfModules[k];
            resolveCreators(moduleName, k, storeCreators, createReadonlyStore);
        });
    }
}

const stores = {};
/**
 * Creates a store of type T.
 * https://github.com/unional/global-store#createstore
 */
function createStore({ moduleName, key, version, initializer }) {
    initStoreValue(stores, { moduleName, key }, version, initializer);
    return {
        get value() { return getStoreValue(stores, { moduleName, key }); },
        reset: () => resetStoreValue(stores, { moduleName, key })
    };
}

const asyncStoreCreators = {};
/**
 * Creates a store of type T asychronously.
 * https://github.com/unional/global-store#createAsyncStore
 */
async function createAsyncStore({ moduleName, key, version, initializer }) {
    return new Promise(resolve => {
        const creatorsOfModules = asyncStoreCreators[moduleName] = asyncStoreCreators[moduleName] || {};
        const storeCreators = creatorsOfModules[key] = creatorsOfModules[key] || [];
        storeCreators.push({ version, resolve, initializer });
    });
}
/**
 * Initializes the stores for `createAsyncStore()`.
 * https://github.com/unional/global-store#initializeAsyncStore
 */
function initializeAsyncStore(moduleName, key) {
    const creatorsOfModules = asyncStoreCreators[moduleName];
    if (!creatorsOfModules)
        return;
    if (key) {
        const storeCreators = creatorsOfModules[key];
        resolveCreators(moduleName, key, storeCreators, createStore);
    }
    else {
        Object.keys(creatorsOfModules).forEach(k => {
            const storeCreators = creatorsOfModules[k];
            resolveCreators(moduleName, k, storeCreators, createStore);
        });
    }
}

export default createStore;
export { AccessedBeforeLock, Prohibited, compareVersion, createAsyncReadonlyStore, createAsyncStore, createReadonlyStore, createStore, initializeAsyncReadonlyStore, initializeAsyncStore };
//# sourceMappingURL=global-store.es.js.map
