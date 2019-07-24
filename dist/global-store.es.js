/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Prohibited = /** @class */ (function (_super) {
    __extends(Prohibited, _super);
    function Prohibited(moduleName, action) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, "Unable to perform '" + action + "' on a locked store from module '" + moduleName + "'") || this;
        _this.moduleName = moduleName;
        _this.action = action;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return Prohibited;
}(Error));
var AccessedBeforeLock = /** @class */ (function (_super) {
    __extends(AccessedBeforeLock, _super);
    function AccessedBeforeLock(moduleName) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, "A readonly store from '" + moduleName + "' is being accessed before it is locked. Please call the approprate function in '" + moduleName + "' to lock the store.") || this;
        _this.moduleName = moduleName;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return AccessedBeforeLock;
}(Error));

function getStoreValue(stores, id) {
    return getStore(stores, id).value;
}
function initStoreValue(stores, id, version, initializer) {
    var store = getStore(stores, id);
    store.init = initializer(store.init, store.versions);
    store.versions.push(version);
    store.value = createStoreValue(store.init);
}
function resetStoreValue(stores, id) {
    var store = getStore(stores, id);
    store.value = createStoreValue(store.init);
}
function getStore(stores, id) {
    var moduleStore = stores[id.moduleName] = stores[id.moduleName] || {};
    return moduleStore[id.key] = moduleStore[id.key] || { versions: [], init: {} };
}
function createStoreValue(initialValue) {
    return __assign({}, initialValue);
}
function resolveCreators(moduleName, key, storeCreators, createStore) {
    sortByVersion(storeCreators).forEach(function (_a) {
        var version = _a.version, resolve = _a.resolve, initializer = _a.initializer;
        return resolve(createStore(moduleName, key, version, initializer));
    });
}
function sortByVersion(storeCreators) {
    return storeCreators.sort(function (a, b) { return compareVersion(toStringVersion(a.version), toStringVersion(b.version)); });
}
function toStringVersion(v) {
    return typeof v === 'number' ? "0.0." + v : v;
}
function compareVersion(a, b) {
    var v1 = a.split('.').map(function (v) { return Number(v); });
    var v2 = b.split('.').map(function (v) { return Number(v); });
    return v1[0] !== v2[0] ? v1[0] - v2[0] :
        v1[1] !== v2[1] ? v1[1] - v2[1] :
            v1[2] - v2[2];
}

var readonlyStores = {};
/**
 * Creates a readonly store of type T.
 * @param moduleName Name of your module. This will be used during reporting.
 * @param key Specific key of the store scoped to your module. This will not appear in reporting.
 * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
 *
 * It is recommend that the key contains the purpose as well as a random value such as GUID.
 * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
 * This key should not change across versions.
 * @param initializer Initializing function for the store.
 */
function createReadonlyStore(moduleName, key, version, initializer) {
    initStoreValue(readonlyStores, { moduleName: moduleName, key: key }, version, initializer);
    var isLocked = false;
    var testing = false;
    return {
        disableProtection: function () {
            if (isLocked)
                throw new Prohibited(moduleName, 'enable testing');
            testing = true;
        },
        get: function () {
            if (!testing && !isLocked)
                throw new AccessedBeforeLock(moduleName);
            return getStoreValue(readonlyStores, { moduleName: moduleName, key: key });
        },
        getWritable: function () {
            if (!testing && isLocked)
                throw new Prohibited(moduleName, 'ReadonlyStore#getWritable');
            return getStoreValue(readonlyStores, { moduleName: moduleName, key: key });
        },
        lock: function (finalizer) {
            if (!testing && !isLocked) {
                if (finalizer) {
                    updateStoreValue(readonlyStores, { moduleName: moduleName, key: key }, finalizer);
                }
                freezeStoreValue(readonlyStores, { moduleName: moduleName, key: key });
                isLocked = true;
                testing = false;
            }
            return this;
        },
        reset: function () {
            if (!testing && isLocked)
                throw new Prohibited(moduleName, 'ReadonlyStore#reset');
            resetStoreValue(readonlyStores, { moduleName: moduleName, key: key });
        }
    };
}
function updateStoreValue(stores, id, finalizer /* Record<any, (value: any) => any> */) {
    var current = getStoreValue(stores, id);
    Object.keys(finalizer).forEach(function (k) { return current[k] = finalizer[k](current[k]); });
}
function freezeStoreValue(stores, id) {
    var store = getStore(stores, id);
    store.value = freezeValue(store.value);
}
function freezeValue(storeValue) {
    Object.keys(storeValue).forEach(function (k) { return freezeArray(storeValue, k); });
    // istanbul ignore next
    if (Object.getOwnPropertySymbols) {
        Object.getOwnPropertySymbols(storeValue).forEach(function (k) { return freezeArray(storeValue, k); });
    }
    return Object.freeze(storeValue);
}
function freezeArray(storeValue, k) {
    var value = storeValue[k];
    if (Array.isArray(value)) {
        storeValue[k] = Object.freeze(value);
    }
}

var asyncReadonlyStoreCreators = {};
/**
 * Creates a readonly store of type T.
 * @param moduleName Name of your module. This will be used during reporting.
 * @param key Specific key of the store scoped to your module. This will not appear in reporting.
 * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
 *
 * It is recommend that the key contains the purpose as well as a random value such as GUID.
 * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
 * This key should not change across versions.
 * @param version Version of the store. It can be numeric or string in the format of "major.minor.patch".
 * No other string format is accepted.
 * When it is numeric, it is compare to the patch number of the string version,
 * if there is a mix of number and string versions.
 * @param initializer Initializing function for the store.
 */
function createAsyncReadonlyStore(moduleName, key, version, initializer) {
    return new Promise(function (resolve) {
        var creatorsOfModules = asyncReadonlyStoreCreators[moduleName] = asyncReadonlyStoreCreators[moduleName] || {};
        var storeCreators = creatorsOfModules[key] = creatorsOfModules[key] || [];
        storeCreators.push({ version: version, resolve: resolve, initializer: initializer });
    });
}
/**
 * Initializes the stores for `createAsyncStore()`.
 */
function initializeAsyncReadonlyStore(moduleName, key) {
    var creatorsOfModules = asyncReadonlyStoreCreators[moduleName];
    if (!creatorsOfModules)
        return;
    if (key) {
        var storeCreators = creatorsOfModules[key];
        resolveCreators(moduleName, key, storeCreators, createReadonlyStore);
    }
    else {
        Object.keys(creatorsOfModules).forEach(function (k) {
            var storeCreators = creatorsOfModules[k];
            resolveCreators(moduleName, k, storeCreators, createReadonlyStore);
        });
    }
}

var stores = {};
/**
 * Creates a store of type T.
 * @param moduleName Name of your module. This will be used during reporting.
 * @param key Specific key of the store scoped to your module. This will not appear in reporting.
 * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
 *
 * It is recommend that the key contains the purpose as well as a random value such as GUID.
 * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
 * This key should not change across versions.
 * @param initializer Initializing function for the store
 */
function createStore(moduleName, key, version, initializer) {
    initStoreValue(stores, { moduleName: moduleName, key: key }, version, initializer);
    return {
        get: function () { return getStoreValue(stores, { moduleName: moduleName, key: key }); },
        reset: function () { return resetStoreValue(stores, { moduleName: moduleName, key: key }); }
    };
}

var asyncStoreCreators = {};
/**
 * Creates a store of type T asychronously.
 * @param moduleName Name of your module. This will be used during reporting.
 * @param key Specific key of the store scoped to your module. This will not appear in reporting.
 * You can use `Symbol.for(<some key>)` to make the store accessible accross service workers and iframes.
 *
 * It is recommend that the key contains the purpose as well as a random value such as GUID.
 * e.g. `some-purpose:c0574313-5f6c-4c02-a875-ad793d47b695`
 * This key should not change across versions.
 * @param version Version of the store. It can be numeric or string in the format of "major.minor.patch".
 * No other string format is accepted.
 * When it is numeric, it is compare to the patch number of the string version,
 * if there is a mix of number and string versions.
 * @param initializer Initializing function for the store
 */
function createAsyncStore(moduleName, key, version, initializer) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var creatorsOfModules = asyncStoreCreators[moduleName] = asyncStoreCreators[moduleName] || {};
                    var storeCreators = creatorsOfModules[key] = creatorsOfModules[key] || [];
                    storeCreators.push({ version: version, resolve: resolve, initializer: initializer });
                })];
        });
    });
}
/**
 * Initializes the stores for `createAsyncStore()`.
 */
function initializeAsyncStore(moduleName, key) {
    var creatorsOfModules = asyncStoreCreators[moduleName];
    if (!creatorsOfModules)
        return;
    if (key) {
        var storeCreators = creatorsOfModules[key];
        resolveCreators(moduleName, key, storeCreators, createStore);
    }
    else {
        Object.keys(creatorsOfModules).forEach(function (k) {
            var storeCreators = creatorsOfModules[k];
            resolveCreators(moduleName, k, storeCreators, createStore);
        });
    }
}

export default createStore;
export { AccessedBeforeLock, Prohibited, createAsyncReadonlyStore, createAsyncStore, createReadonlyStore, createStore, initializeAsyncReadonlyStore, initializeAsyncStore };
//# sourceMappingURL=global-store.es.js.map
