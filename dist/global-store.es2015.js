(function (exports) {
'use strict';

const globalState = {};
/**
 * Gets a value.
 * @param id A unique identifier to the store.
 * It can be a symbol created from `Symbol.for(key)`,
 * or a runtime-wide unique string:
 * You should make it descriptive.
 * You should use your module's name or unique key as part of the id.
 * You can add some secret random string to it.
 * e.g. `my-module:some-purpose:some-random-string`
 * @param defaultValue Optional default value.
 */
function get(id, defaultValue) {
    return globalState[id] = globalState[id] || defaultValue;
}
/**
 * Set a value
 */
function set(id, value) {
    globalState[id] = value;
}
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
function create(id, defaultValue) {
    return {
        get() {
            return get(id, defaultValue);
        },
        set(value) {
            set(id, value);
        }
    };
}

exports.get = get;
exports.set = set;
exports['default'] = create;

}((this.GlobalStore = this.GlobalStore || {})));
//# sourceMappingURL=global-store.es2015.js.map
