var TestMain = (function (exports, globalStore) {
    'use strict';

    const store = globalStore.createStore({
        moduleName: 'webpack-lib',
        version: '1.0.0',
        initializer: () => ({ a: 1 })
    });

    exports.store = store;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, GlobalStore);
//# sourceMappingURL=main.js.map
