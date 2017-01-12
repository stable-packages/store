var GlobalStore =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Store implementation.
 * The Store interface and StoreImpl is separated so that
 * consumer cannot get access to the StoreImpl class to instantiate it directly.
 */
var StoreImpl = (function () {
    /**
     * `defaultValue` is default to `{}` to support simple hash.
     * If consumer use this is simple type store (`string`, `number` etc),
     * this `{}` is wasted but it is a trade off to be made.
     */
    function StoreImpl(id, defaultValue) {
        if (defaultValue === void 0) { defaultValue = {}; }
        this.id = id;
        this.value = defaultValue;
    }
    return StoreImpl;
}());
var globalState = {};
/**
 * Gets or creates a store.
 * @param id A unique identifier to the store.
 * This id MUST be unique across all modules in an application.
 * You should make it descriptive.
 * You should use your module's name or unique key as part of the id.
 * @param defaultValue Optional, but most of the time you will specify it.
 * You can skip the defaultValue for very basic use cases: basic types and hash.
 */
function getStore(id, defaultValue) {
    return globalState[id] = globalState[id] || new StoreImpl(id, defaultValue);
}
exports.getStore = getStore;
/**
 * Remove a store from the global state.
 * Internal for testing only
 */
function removeStore(store) {
    if (store) {
        delete globalState[store.id];
    }
}
exports.removeStore = removeStore;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getStore_1 = __webpack_require__(0);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getStore_1.getStore;


/***/ })
/******/ ]);
//# sourceMappingURL=global-store.js.map