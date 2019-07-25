System.register([], function (exports) {
  'use strict';
  return {
    execute: function () {

      exports({
        createAsyncReadonlyStore: createAsyncReadonlyStore,
        createAsyncStore: createAsyncStore,
        createReadonlyStore: createReadonlyStore,
        createStore: createStore,
        default: createStore,
        initializeAsyncReadonlyStore: initializeAsyncReadonlyStore,
        initializeAsyncStore: initializeAsyncStore
      });

      class Prohibited extends Error {
          constructor(moduleName, action) {
              super(`Unable to perform '${action}' on a locked store from module '${moduleName}'`);
              this.moduleName = moduleName;
              this.action = action;
              Object.setPrototypeOf(this, new.target.prototype);
          }
      } exports('Prohibited', Prohibited);
      class AccessedBeforeLock extends Error {
          constructor(moduleName) {
              super(`A readonly store from '${moduleName}' is being accessed before it is locked. Please call the approprate function in '${moduleName}' to lock the store.`);
              this.moduleName = moduleName;
              Object.setPrototypeOf(this, new.target.prototype);
          }
      } exports('AccessedBeforeLock', AccessedBeforeLock);

      function getStoreValue(stores, id) {
          return getStore(stores, id).value;
      }
      function initStoreValue(stores, id, version, initializer) {
          const store = getStore(stores, id);
          store.init = initializer(store.init, store.versions);
          store.versions.push(version);
          store.value = createStoreValue(store.init);
      }
      function resetStoreValue(stores, id) {
          const store = getStore(stores, id);
          store.value = createStoreValue(store.init);
      }
      function getStore(stores, id) {
          const moduleStore = stores[id.moduleName] = stores[id.moduleName] || {};
          return moduleStore[id.key] = moduleStore[id.key] || { versions: [], init: {} };
      }
      function createStoreValue(initialValue) {
          return { ...initialValue };
      }
      function resolveCreators(moduleName, key, storeCreators, createStore) {
          sortByVersion(storeCreators).forEach(({ version, resolve, initializer }) => resolve(createStore(moduleName, key, version, initializer)));
      }
      function sortByVersion(storeCreators) {
          return storeCreators.sort((a, b) => compareVersion(toStringVersion(a.version), toStringVersion(b.version)));
      }
      function toStringVersion(v) {
          return typeof v === 'number' ? `0.0.${v}` : v;
      }
      function compareVersion(a, b) {
          const v1 = a.split('.').map(v => Number(v));
          const v2 = b.split('.').map(v => Number(v));
          return v1[0] !== v2[0] ? v1[0] - v2[0] :
              v1[1] !== v2[1] ? v1[1] - v2[1] :
                  v1[2] - v2[2];
      }

      const readonlyStores = {};
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
          initStoreValue(readonlyStores, { moduleName, key }, version, initializer);
          let isLocked = false;
          let disabled = false;
          return {
              disableProtection() {
                  if (isLocked)
                      throw new Prohibited(moduleName, 'ReadonlyStore#disableProtection');
                  disabled = true;
              },
              get() {
                  if (!disabled && !isLocked)
                      throw new AccessedBeforeLock(moduleName);
                  return getStoreValue(readonlyStores, { moduleName, key });
              },
              getWritable() {
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
      function updateStoreValue(stores, id, finalizer /* Record<any, (value: any) => any> */) {
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
          return new Promise(resolve => {
              const creatorsOfModules = asyncReadonlyStoreCreators[moduleName] = asyncReadonlyStoreCreators[moduleName] || {};
              const storeCreators = creatorsOfModules[key] = creatorsOfModules[key] || [];
              storeCreators.push({ version, resolve, initializer });
          });
      }
      /**
       * Initializes the stores for `createAsyncStore()`.
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
          initStoreValue(stores, { moduleName, key }, version, initializer);
          return {
              get: () => getStoreValue(stores, { moduleName, key }),
              reset: () => resetStoreValue(stores, { moduleName, key })
          };
      }

      const asyncStoreCreators = {};
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
      async function createAsyncStore(moduleName, key, version, initializer) {
          return new Promise(resolve => {
              const creatorsOfModules = asyncStoreCreators[moduleName] = asyncStoreCreators[moduleName] || {};
              const storeCreators = creatorsOfModules[key] = creatorsOfModules[key] || [];
              storeCreators.push({ version, resolve, initializer });
          });
      }
      /**
       * Initializes the stores for `createAsyncStore()`.
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

    }
  };
});
//# sourceMappingURL=global-store.systemjs.js.map
