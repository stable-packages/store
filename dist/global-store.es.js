var storeMap = {};
/**
 * Creates a store of type T.
 * @param id A unique identifier to the store.
 * It can be a symbol created from `Symbol.for(key)`,
 * or a runtime-wide unique string:
 * You should make it descriptive.
 * You should use your module's name or unique key as part of the id.
 * You can add some secret random string to it.
 * e.g. `my-module:some-purpose:some-random-string`
 * @param defaultValue Optional default value.
 */
function createStore(id, defaultValue) {
    getStoreValue(id, defaultValue);
    return {
        get: function () {
            return getStoreValue(id);
        },
        set: function (value) {
            setStoreValue(id, value);
        }
    };
}
/**
 * Gets a global store value.
 * @param id A unique identifier to the store.
 * It can be a symbol created from `Symbol.for(key)`,
 * or a runtime-wide unique string:
 * You should make it descriptive.
 * You should use your module's name or unique key as part of the id.
 * You can add some secret random string to it.
 * e.g. `my-module:some-purpose:some-random-string`
 * @param defaultValue Optional default value.
 */
function getStoreValue(id, defaultValue) {
    return storeMap[id] = storeMap[id] || defaultValue;
}
/**
 * Sets a global store value.
 * @param id The unique identifier of the store.
 * @param value Any value you want to save.
 */
function setStoreValue(id, value) {
    storeMap[id] = value;
}

export default createStore;
export { createStore, getStoreValue, setStoreValue };
//# sourceMappingURL=global-store.es.js.map
