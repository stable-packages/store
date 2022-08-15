/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"store\": () => (/* binding */ store)\n/* harmony export */ });\n/* harmony import */ var global_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! global-store */ \"../../packages/global-store/lib/index.js\");\n\nvar store = (0,global_store__WEBPACK_IMPORTED_MODULE_0__.createStore)({\n    moduleName: 'webpack-lib',\n    version: '1.0.0',\n    initializer: function () { return ({ a: 1 }); }\n});\n\n\n//# sourceURL=webpack://my-webpack-project/./src/index.ts?");

/***/ }),

/***/ "../../packages/global-store/lib/compareVersion.js":
/*!*********************************************************!*\
  !*** ../../packages/global-store/lib/compareVersion.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"compareVersion\": () => (/* binding */ compareVersion)\n/* harmony export */ });\n/* harmony import */ var _toVersionArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toVersionArray.js */ \"../../packages/global-store/lib/toVersionArray.js\");\n\n/**\n * Compare version.\n * Positive when processed > current\n * Negative when processed < current\n */\nfunction compareVersion(processed, current) {\n    const v1 = (0,_toVersionArray_js__WEBPACK_IMPORTED_MODULE_0__.toVersionArray)(processed);\n    const v2 = (0,_toVersionArray_js__WEBPACK_IMPORTED_MODULE_0__.toVersionArray)(current);\n    return v1[0] !== v2[0] ? v1[0] - v2[0] :\n        v1[1] !== v2[1] ? v1[1] - v2[1] : v1[2] - v2[2];\n}\n//# sourceMappingURL=compareVersion.js.map\n\n//# sourceURL=webpack://my-webpack-project/../../packages/global-store/lib/compareVersion.js?");

/***/ }),

/***/ "../../packages/global-store/lib/createAsyncStore.js":
/*!***********************************************************!*\
  !*** ../../packages/global-store/lib/createAsyncStore.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createAsyncStore\": () => (/* binding */ createAsyncStore),\n/* harmony export */   \"initializeAsyncStore\": () => (/* binding */ initializeAsyncStore)\n/* harmony export */ });\n/* harmony import */ var _createStore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createStore.js */ \"../../packages/global-store/lib/createStore.js\");\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ \"../../packages/global-store/lib/util.js\");\n\n\nconst asyncStoreCreators = Object.create(null);\n/**\n * Creates a store of type T asynchronously.\n * @see https://github.com/unional/global-store#createAsyncStore\n */\nasync function createAsyncStore({ moduleName, key, version, initializer }) {\n    return new Promise(resolve => {\n        const creatorsOfModules = asyncStoreCreators[moduleName] = asyncStoreCreators[moduleName] || Object.create(null);\n        const k = key ?? 'default';\n        const storeCreators = creatorsOfModules[k] = creatorsOfModules[k] || [];\n        storeCreators.push({ version, resolve, initializer });\n    });\n}\n/**\n * Initializes the stores for `createAsyncStore()`.\n * @see https://github.com/unional/global-store#initializeAsyncStore\n */\nfunction initializeAsyncStore(moduleName, key) {\n    const creatorsOfModules = asyncStoreCreators[moduleName];\n    if (!creatorsOfModules)\n        return;\n    const keys = key ? [key] : Object.keys(creatorsOfModules);\n    keys.forEach(key => (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.resolveCreators)(moduleName, key, creatorsOfModules[key], _createStore_js__WEBPACK_IMPORTED_MODULE_0__.createStore));\n}\n//# sourceMappingURL=createAsyncStore.js.map\n\n//# sourceURL=webpack://my-webpack-project/../../packages/global-store/lib/createAsyncStore.js?");

/***/ }),

/***/ "../../packages/global-store/lib/createStore.js":
/*!******************************************************!*\
  !*** ../../packages/global-store/lib/createStore.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createStore\": () => (/* binding */ createStore)\n/* harmony export */ });\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ \"../../packages/global-store/lib/util.js\");\n\nconst stores = Object.create(null);\n/**\n * Creates a store of type T.\n * @see https://www.npmjs.com/package/global-store\n */\nfunction createStore({ moduleName, key, version, initializer }) {\n    const id = { moduleName, key };\n    (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.initStoreValue)(stores, id, version, initializer);\n    return {\n        get value() { return (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.getStoreValue)(stores, id); },\n        freeze(value) { return (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.freezeStoreValue)(stores, id, value); },\n        reset() { return (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.resetStoreValue)(stores, id); }\n    };\n}\n//# sourceMappingURL=createStore.js.map\n\n//# sourceURL=webpack://my-webpack-project/../../packages/global-store/lib/createStore.js?");

/***/ }),

/***/ "../../packages/global-store/lib/index.js":
/*!************************************************!*\
  !*** ../../packages/global-store/lib/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createAsyncStore\": () => (/* reexport safe */ _createAsyncStore_js__WEBPACK_IMPORTED_MODULE_0__.createAsyncStore),\n/* harmony export */   \"createStore\": () => (/* reexport safe */ _createStore_js__WEBPACK_IMPORTED_MODULE_1__.createStore),\n/* harmony export */   \"default\": () => (/* reexport safe */ _createStore_js__WEBPACK_IMPORTED_MODULE_1__.createStore),\n/* harmony export */   \"initializeAsyncStore\": () => (/* reexport safe */ _createAsyncStore_js__WEBPACK_IMPORTED_MODULE_0__.initializeAsyncStore)\n/* harmony export */ });\n/* harmony import */ var _createAsyncStore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createAsyncStore.js */ \"../../packages/global-store/lib/createAsyncStore.js\");\n/* harmony import */ var _createStore_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createStore.js */ \"../../packages/global-store/lib/createStore.js\");\n/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types.js */ \"../../packages/global-store/lib/types.js\");\n\n\n\n\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack://my-webpack-project/../../packages/global-store/lib/index.js?");

/***/ }),

/***/ "../../packages/global-store/lib/shouldInvokeInitializer.js":
/*!******************************************************************!*\
  !*** ../../packages/global-store/lib/shouldInvokeInitializer.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"shouldInvokeInitializer\": () => (/* binding */ shouldInvokeInitializer)\n/* harmony export */ });\n/* harmony import */ var _toVersionArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toVersionArray.js */ \"../../packages/global-store/lib/toVersionArray.js\");\n\nfunction shouldInvokeInitializer(versions, version) {\n    const vs = versions.map(_toVersionArray_js__WEBPACK_IMPORTED_MODULE_0__.toVersionArray);\n    const v = (0,_toVersionArray_js__WEBPACK_IMPORTED_MODULE_0__.toVersionArray)(version);\n    return noMatchMajor(vs, v) || hasNewVersion(vs, v);\n}\nfunction noMatchMajor(versions, version) {\n    return !versions.some(v => v[0] === version[0]);\n}\nfunction hasNewVersion(versions, version) {\n    return versions.filter(v => v[0] === version[0])\n        .some(v => version[1] > v[1] || (version[1] === v[1] && version[2] > v[2]));\n}\n//# sourceMappingURL=shouldInvokeInitializer.js.map\n\n//# sourceURL=webpack://my-webpack-project/../../packages/global-store/lib/shouldInvokeInitializer.js?");

/***/ }),

/***/ "../../packages/global-store/lib/toVersionArray.js":
/*!*********************************************************!*\
  !*** ../../packages/global-store/lib/toVersionArray.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"toVersionArray\": () => (/* binding */ toVersionArray)\n/* harmony export */ });\nfunction toVersionArray(v) {\n    return typeof v === 'number' ? [0, 0, v] :\n        v.split('.').map(v => parseInt(v, 10));\n}\n//# sourceMappingURL=toVersionArray.js.map\n\n//# sourceURL=webpack://my-webpack-project/../../packages/global-store/lib/toVersionArray.js?");

/***/ }),

/***/ "../../packages/global-store/lib/types.js":
/*!************************************************!*\
  !*** ../../packages/global-store/lib/types.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n//# sourceMappingURL=types.js.map\n\n//# sourceURL=webpack://my-webpack-project/../../packages/global-store/lib/types.js?");

/***/ }),

/***/ "../../packages/global-store/lib/util.js":
/*!***********************************************!*\
  !*** ../../packages/global-store/lib/util.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"freezeStoreValue\": () => (/* binding */ freezeStoreValue),\n/* harmony export */   \"getStore\": () => (/* binding */ getStore),\n/* harmony export */   \"getStoreValue\": () => (/* binding */ getStoreValue),\n/* harmony export */   \"initStoreValue\": () => (/* binding */ initStoreValue),\n/* harmony export */   \"resetStoreValue\": () => (/* binding */ resetStoreValue),\n/* harmony export */   \"resolveCreators\": () => (/* binding */ resolveCreators),\n/* harmony export */   \"sortByVersion\": () => (/* binding */ sortByVersion)\n/* harmony export */ });\n/* harmony import */ var _compareVersion_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./compareVersion.js */ \"../../packages/global-store/lib/compareVersion.js\");\n/* harmony import */ var _shouldInvokeInitializer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shouldInvokeInitializer.js */ \"../../packages/global-store/lib/shouldInvokeInitializer.js\");\n\n\nfunction getStoreValue(stores, id) {\n    return getStore(stores, id).value;\n}\nfunction initStoreValue(stores, id, version, initializer) {\n    const store = getStore(stores, id);\n    if ((0,_shouldInvokeInitializer_js__WEBPACK_IMPORTED_MODULE_1__.shouldInvokeInitializer)(store.versions, version)) {\n        store.initializers.push(initializer);\n        store.value = initializer(store.value, store.versions);\n        store.versions.push(version);\n    }\n}\nfunction resetStoreValue(stores, id) {\n    const store = getStore(stores, id);\n    const versions = store.versions;\n    store.versions = [];\n    store.value = store.initializers.reduce((value, initializer, i) => {\n        value = initializer(value, store.versions);\n        store.versions.push(versions[i]);\n        return value;\n    }, {});\n}\nfunction getStore(stores, id) {\n    const moduleStore = stores[id.moduleName] = stores[id.moduleName] || Object.create(null);\n    const key = id.key ?? 'default';\n    return moduleStore[key] = moduleStore[key] || { versions: [], value: {}, initializers: [] };\n}\nfunction resolveCreators(moduleName, key, storeCreators, cs) {\n    sortByVersion(storeCreators).forEach(({ version, resolve, initializer }) => resolve(cs({ moduleName, key, version, initializer })));\n}\nfunction sortByVersion(storeCreators) {\n    return storeCreators.sort((a, b) => (0,_compareVersion_js__WEBPACK_IMPORTED_MODULE_0__.compareVersion)(a.version, b.version));\n}\nfunction freezeStoreValue(stores, id, value) {\n    const store = getStore(stores, id);\n    store.value = value ?\n        Object.isFrozen(value) ? value : Object.freeze(value) :\n        freezeValue(store.value);\n}\nfunction freezeValue(storeValue) {\n    if (Object.isFrozen(storeValue))\n        throw TypeError('Frozen value cannot be freezed again');\n    Object.keys(storeValue).forEach(k => freezeIfIsArray(storeValue, k));\n    // istanbul ignore next\n    if (Object.getOwnPropertySymbols) {\n        Object.getOwnPropertySymbols(storeValue).forEach(k => freezeIfIsArray(storeValue, k));\n    }\n    return Object.freeze(storeValue);\n}\nfunction freezeIfIsArray(storeValue, k) {\n    const value = storeValue[k];\n    if (Array.isArray(value)) {\n        storeValue[k] = Object.freeze(value);\n    }\n}\n//# sourceMappingURL=util.js.map\n\n//# sourceURL=webpack://my-webpack-project/../../packages/global-store/lib/util.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;