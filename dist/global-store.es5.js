var GlobalStore=function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t,r){"use strict";var o,n=this&&this.__extends||(o=function(e,t){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var u=function(e){function t(t,r){var o=this.constructor,n=e.call(this,"Unable to '"+r+"' on a locked store used by module '"+t+"'")||this;return n.moduleName=t,n.action=r,Object.setPrototypeOf(n,o.prototype),n}return n(t,e),t}(Error);t.Prohibited=u;var i=function(e){function t(t){var r=this.constructor,o=e.call(this,"A readonly store from '"+t+"' is being accessed before it is locked. Please call the approprate function in '"+t+"' to lock the store.")||this;return o.moduleName=t,Object.setPrototypeOf(o,r.prototype),o}return n(t,e),t}(Error);t.AccessedBeforeLock=i},function(e,t,r){"use strict";var o=this&&this.__assign||function(){return(o=Object.assign||function(e){for(var t,r=1,o=arguments.length;r<o;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)};function n(e,t){return e[t]=e[t]||{}}function u(e){return o({},e)}Object.defineProperty(t,"__esModule",{value:!0}),t.getStoreValue=function(e,t){return n(e,t.moduleName)[t.key].value},t.initStoreValue=function(e,t,r){var o=n(e,t.moduleName),i=o[t.key],c=r(i&&i.init||{});o[t.key]={init:c,value:u(c)}},t.resetStoreValue=function(e,t){var r=n(e,t.moduleName);r[t.key].value=u(r[t.key].init)},t.getModuleStore=n,t.createStoreValue=u},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(1),n={};t.createStore=function(e,t){return o.initStoreValue(n,e,t),{get:function(){return o.getStoreValue(n,e)},reset:function(){return o.resetStoreValue(n,e)}}}},function(e,t,r){"use strict";function o(e){for(var r in e)t.hasOwnProperty(r)||(t[r]=e[r])}Object.defineProperty(t,"__esModule",{value:!0}),o(r(4)),o(r(2));var n=r(2);t.default=n.createStore,o(r(0)),o(r(5))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),n=r(1),u={};function i(e){return Object.keys(e).forEach(function(t){return c(e,t)}),Object.getOwnPropertySymbols&&Object.getOwnPropertySymbols(e).forEach(function(t){return c(e,t)}),Object.freeze(e)}function c(e,t){var r=e[t];Array.isArray(r)&&(e[t]=Object.freeze(r))}t.createReadonlyStore=function(e,t){n.initStoreValue(u,e,t);var r=!1,c=!1;return{openForTesting:function(){if(r)throw new o.Prohibited(e.moduleName,"enable testing");c=!0},get:function(){if(!c&&!r)throw new o.AccessedBeforeLock(e.moduleName);return n.getStoreValue(u,e)},getWritable:function(){if(!c&&r)throw new o.Prohibited(e.moduleName,"ReadonlyStore#getWritable");return n.getStoreValue(u,e)},lock:function(t){return r||(t&&function(e,t,r){var o=n.getModuleStore(e,t.moduleName)[t.key].value;Object.keys(r).forEach(function(e){return o[e]=r[e](o[e])})}(u,e,t),function(e,t){var r=n.getModuleStore(e,t.moduleName),o=r[t.key];r[t.key]={init:o.init,value:i(o.value)}}(u,e),r=!0,c=!1),this},reset:function(){if(!c&&r)throw new o.Prohibited(e.moduleName,"ReadonlyStore#reset");n.resetStoreValue(u,e)}}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0})}]);
//# sourceMappingURL=global-store.es5.js.map