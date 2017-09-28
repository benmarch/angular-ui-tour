(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("angular-sanitize"), require("angular-scroll"), require("ez-ng"), require("angular-hotkeys"), require("angular-bind-html-compile"), require("tether"), require("hone"));
	else if(typeof define === 'function' && define.amd)
		define("uiTour", ["angular", "angular-sanitize", "angular-scroll", "ez-ng", "angular-hotkeys", "angular-bind-html-compile", "tether", "hone"], factory);
	else if(typeof exports === 'object')
		exports["uiTour"] = factory(require("angular"), require("angular-sanitize"), require("angular-scroll"), require("ez-ng"), require("angular-hotkeys"), require("angular-bind-html-compile"), require("tether"), require("hone"));
	else
		root["uiTour"] = factory(root["angular"], root["angular-sanitize"], root["angular-scroll"], root["ez-ng"], root["angular-hotkeys"], root["angular-bind-html-compile"], root["tether"], root["hone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	run.$inject = ["TourConfig", "uiTourService", "$rootScope", "$injector"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	__webpack_require__(2);

	__webpack_require__(3);

	__webpack_require__(4);

	__webpack_require__(5);

	__webpack_require__(6);

	var _tether = __webpack_require__(7);

	var _tether2 = _interopRequireDefault(_tether);

	var _hone = __webpack_require__(8);

	var _hone2 = _interopRequireDefault(_hone);

	__webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function run(TourConfig, uiTourService, $rootScope, $injector) {
	    'ngInject';

	    //when the user navigates via browser button, kill tours

	    function checkAndKillToursOnNavigate() {
	        if (!uiTourService.isTourWaiting()) {
	            uiTourService.endAllTours();
	        }
	    }

	    if (TourConfig.areNavigationInterceptorsEnabled()) {
	        $rootScope.$on('$locationChangeStart', checkAndKillToursOnNavigate);
	        $rootScope.$on('$stateChangeStart', checkAndKillToursOnNavigate);

	        //for UIRouter 1.0, not sure if it works
	        if ($injector.has('$transitions')) {
	            $injector.get('$transitions').onStart({}, checkAndKillToursOnNavigate);
	        }
	    }
	}

	exports.default = _angular2.default.module('bm.uiTour', ['ngSanitize', 'duScroll', 'ezNg', 'cfp.hotkeys', 'angular-bind-html-compile']).run(run).value('Tether', _tether2.default || window.Tether).value('Hone', _hone2.default || window.Hone).constant('positionMap', __webpack_require__(18).default).provider('TourConfig', __webpack_require__(19).default).factory('uiTourBackdrop', __webpack_require__(20).default).factory('TourHelpers', __webpack_require__(21).default).factory('uiTourService', __webpack_require__(22).default).factory('TourStepService', __webpack_require__(23).default).controller('uiTourController', __webpack_require__(24).default).directive('uiTour', __webpack_require__(25).default).directive('tourStep', __webpack_require__(26).default).name;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/css-loader/index.js!./angular-ui-tour.css", function() {
				var newContent = require("!!../../node_modules/css-loader/index.js!./angular-ui-tour.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)(undefined);
	// imports


	// module
	exports.push([module.id, ".no-scrolling {\n    height: 100%;\n    overflow: hidden;\n}\n\n/*this might be an accessibility issue*/\n.ui-tour-popup:focus {\n    outline: none;\n}\n\n.ui-tour-popup-orphan {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    margin: 0;\n    transform: translateX(-50%) translateY(-50%);\n}\n\n/*improve popover arrows:*/\n.ui-tour-popup.popover.bottom-left > .arrow,\n.ui-tour-popup.popover.top-left > .arrow {\n    left: 25px;\n}\n\n.ui-tour-popup.popover.bottom-right > .arrow,\n.ui-tour-popup.popover.top-right > .arrow {\n    left: auto;\n    right: 25px;\n}\n\n.ui-tour-popup.popover.right-top > .arrow,\n.ui-tour-popup.popover.left-top > .arrow {\n    top: 25px;\n}\n\n.ui-tour-popup.popover.left-bottom > .arrow,\n.ui-tour-popup.popover.right-bottom > .arrow {\n    top: auto;\n    bottom: 25px;\n}", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function(useSourceMap) {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			return this.map(function (item) {
				var content = cssWithMappingToString(item, useSourceMap);
				if(item[2]) {
					return "@media " + item[2] + "{" + content + "}";
				} else {
					return content;
				}
			}).join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

	function cssWithMappingToString(item, useSourceMap) {
		var content = item[1] || '';
		var cssMapping = item[3];
		if (!cssMapping) {
			return content;
		}

		if (useSourceMap) {
			var sourceMapping = toComment(cssMapping);
			var sourceURLs = cssMapping.sources.map(function (source) {
				return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
			});

			return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
		}

		return [content].join('\n');
	}

	// Adapted from convert-source-map (MIT)
	function toComment(sourceMap) {
	  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
	  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	  return '/*# ' + data + ' */';
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).Buffer))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(13)
	var ieee754 = __webpack_require__(14)
	var isArray = __webpack_require__(15)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()

	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192 // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}

	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)

	  var actual = that.write(string, encoding)

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len)
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8'

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0

	  if (this === target) return 0

	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)

	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }

	  return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0

	  if (!val) val = 0

	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }

	  return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).Buffer, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict'

	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray

	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}

	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63

	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}

	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return (b64.length * 3 / 4) - placeHoldersCount(b64)
	}

	function toByteArray (b64) {
	  var i, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)

	  arr = new Arr((len * 3 / 4) - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0; i < l; i += 4) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }

	  parts.push(output)

	  return parts.join('')
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 15 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			// Test for IE <= 9 as proposed by Browserhacks
			// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
			// Tests for existence of standard globals is to allow style-loader 
			// to operate correctly into non-standard environments
			// @see https://github.com/webpack-contrib/style-loader/issues/177
			return window && document && document.all && !window.atob;
		}),
		getElement = (function(fn) {
			var memo = {};
			return function(selector) {
				if (typeof memo[selector] === "undefined") {
					memo[selector] = fn.call(this, selector);
				}
				return memo[selector]
			};
		})(function (styleTarget) {
			return document.querySelector(styleTarget)
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [],
		fixUrls = __webpack_require__(17);

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		options.attrs = typeof options.attrs === "object" ? options.attrs : {};

		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the <head> element
		if (typeof options.insertInto === "undefined") options.insertInto = "head";

		// By default, add <style> tags to the bottom of the target
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	};

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var styleTarget = getElement(options.insertInto)
		if (!styleTarget) {
			throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
		}
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				styleTarget.insertBefore(styleElement, styleTarget.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				styleTarget.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			styleTarget.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		options.attrs.type = "text/css";

		attachTagAttrs(styleElement, options.attrs);
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		options.attrs.type = "text/css";
		options.attrs.rel = "stylesheet";

		attachTagAttrs(linkElement, options.attrs);
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function attachTagAttrs(element, attrs) {
		Object.keys(attrs).forEach(function (key) {
			element.setAttribute(key, attrs[key]);
		});
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement, options);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, options, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
		*/
		var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

		if (options.convertToAbsoluteUrls || autoFixUrls){
			css = fixUrls(css);
		}

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	
	/**
	 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
	 * embed the css on the page. This breaks all relative urls because now they are relative to a
	 * bundle instead of the current page.
	 *
	 * One solution is to only use full urls, but that may be impossible.
	 *
	 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
	 *
	 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
	 *
	 */

	module.exports = function (css) {
	  // get current location
	  var location = typeof window !== "undefined" && window.location;

	  if (!location) {
	    throw new Error("fixUrls requires window.location");
	  }

		// blank or null?
		if (!css || typeof css !== "string") {
		  return css;
	  }

	  var baseUrl = location.protocol + "//" + location.host;
	  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

		// convert each url(...)
		/*
		This regular expression is just a way to recursively match brackets within
		a string.

		 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
		   (  = Start a capturing group
		     (?:  = Start a non-capturing group
		         [^)(]  = Match anything that isn't a parentheses
		         |  = OR
		         \(  = Match a start parentheses
		             (?:  = Start another non-capturing groups
		                 [^)(]+  = Match anything that isn't a parentheses
		                 |  = OR
		                 \(  = Match a start parentheses
		                     [^)(]*  = Match anything that isn't a parentheses
		                 \)  = Match a end parentheses
		             )  = End Group
	              *\) = Match anything and then a close parens
	          )  = Close non-capturing group
	          *  = Match anything
	       )  = Close capturing group
		 \)  = Match a close parens

		 /gi  = Get all matches, not the first.  Be case insensitive.
		 */
		var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
			// strip quotes (if they exist)
			var unquotedOrigUrl = origUrl
				.trim()
				.replace(/^"(.*)"$/, function(o, $1){ return $1; })
				.replace(/^'(.*)'$/, function(o, $1){ return $1; });

			// already a full url? no change
			if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			  return fullMatch;
			}

			// convert the url to a full url
			var newUrl;

			if (unquotedOrigUrl.indexOf("//") === 0) {
			  	//TODO: should we add protocol?
				newUrl = unquotedOrigUrl;
			} else if (unquotedOrigUrl.indexOf("/") === 0) {
				// path should be relative to the base url
				newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
			} else {
				// path should be relative to current directory
				newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
			}

			// send back the fixed url(...)
			return "url(" + JSON.stringify(newUrl) + ")";
		});

		// send back the fixed css
		return fixedCss;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    'top': {
	        target: 'top center',
	        popup: 'bottom center'
	    },
	    'top-left': {
	        target: 'top left',
	        popup: 'bottom left'
	    },
	    'top-right': {
	        target: 'top right',
	        popup: 'bottom right'
	    },
	    'bottom': {
	        target: 'bottom center',
	        popup: 'top center'
	    },
	    'bottom-left': {
	        target: 'bottom left',
	        popup: 'top left'
	    },
	    'bottom-right': {
	        target: 'bottom right',
	        popup: 'top right'
	    },
	    'left': {
	        target: 'middle left',
	        popup: 'middle right'
	    },
	    'left-top': {
	        target: 'top left',
	        popup: 'top right'
	    },
	    'left-bottom': {
	        target: 'bottom left',
	        popup: 'bottom right'
	    },
	    'right': {
	        target: 'middle right',
	        popup: 'middle left'
	    },
	    'right-top': {
	        target: 'top right',
	        popup: 'top left'
	    },
	    'right-bottom': {
	        target: 'bottom right',
	        popup: 'bottom left'
	    }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = TourConfig;

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function TourConfig() {
	    'ngInject';

	    var navigationInterceptorsEnabled = false,
	        config = {
	        placement: 'top',
	        animation: true,
	        popupDelay: 1,
	        closePopupDelay: 0,
	        enable: true,
	        appendToBody: false,
	        popupClass: '',
	        orphan: false,
	        backdrop: false,
	        backdropZIndex: 10000,
	        backdropPadding: '0px',
	        scrollOffset: 100,
	        scrollIntoView: true,
	        useUiRouter: false,
	        useHotkeys: false,
	        scrollParentId: '$document',

	        onStart: null,
	        onEnd: null,
	        onPause: null,
	        onResume: null,
	        onNext: null,
	        onPrev: null,
	        onShow: null,
	        onShown: null,
	        onHide: null,
	        onHidden: null
	    };

	    this.set = function (option, value) {
	        config[option] = value;
	    };

	    this.enableNavigationInterceptors = function () {
	        navigationInterceptorsEnabled = true;
	    };

	    this.$get = ['$q', function ($q) {

	        var service = {};

	        service.get = function (option) {
	            return config[option];
	        };

	        service.getAll = function () {
	            return _angular2.default.copy(config);
	        };

	        service.areNavigationInterceptorsEnabled = function () {
	            return navigationInterceptorsEnabled;
	        };

	        //wrap functions with promises
	        (function () {
	            _angular2.default.forEach(config, function (value, key) {
	                if (key.indexOf('on') === 0 && _angular2.default.isFunction(value)) {
	                    config[key] = function () {
	                        return $q.resolve(value());
	                    };
	                }
	            });
	        })();

	        return service;
	    }];
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	uiTourBackdrop.$inject = ["$document", "Hone"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = uiTourBackdrop;

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function uiTourBackdrop($document, Hone) {
	    'ngInject';

	    var service = {},
	        $body = _angular2.default.element($document[0].body),
	        preventDefault = function preventDefault(e) {
	        e.preventDefault();
	    },
	        hone = new Hone({
	        classPrefix: 'ui-tour-backdrop'
	    });

	    function preventScrolling() {
	        $body.addClass('no-scrolling');
	        $body.on('touchmove', preventDefault);
	    }

	    function allowScrolling() {
	        $body.removeClass('no-scrolling');
	        $body.off('touchmove', preventDefault);
	    }

	    service.createForElement = function (element, backdropOptions) {
	        hone.setOptions(backdropOptions);
	        hone.position(element[0]);
	        hone.show();

	        if (backdropOptions.preventScrolling) {
	            service.shouldPreventScrolling(true);
	        } else {
	            service.shouldPreventScrolling(false);
	        }
	    };

	    service.hide = function () {
	        hone.hide();
	        service.shouldPreventScrolling(false);
	    };

	    service.shouldPreventScrolling = function () {
	        var shouldPreventScrolling = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	        if (shouldPreventScrolling) {
	            preventScrolling();
	        } else {
	            allowScrolling();
	        }
	    };

	    service.reposition = function () {
	        if (hone.status === Hone.status.VISIBLE) {
	            hone.position();
	        }
	    };

	    return service;
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	TourHelpers.$inject = ["$http", "$compile", "$location", "TourConfig", "$q", "$injector", "$timeout"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = TourHelpers;

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function TourHelpers($http, $compile, $location, TourConfig, $q, $injector, $timeout) {
	    'ngInject';

	    var helpers = {},
	        safeApply,
	        $state;

	    if ($injector.has('$state')) {
	        $state = $injector.get('$state');
	    }

	    /**
	     * Helper function that calls scope.$apply if a digest is not currently in progress
	     * Borrowed from: https://coderwall.com/p/ngisma
	     *
	     * @param {$rootScope.Scope} scope
	     * @param {Function} fn
	     */
	    safeApply = helpers.safeApply = function (scope, fn) {
	        var phase = scope.$root.$$phase;

	        if (phase === '$apply' || phase === '$digest') {
	            if (fn && typeof fn === 'function') {
	                fn();
	            }
	        } else {
	            scope.$apply(fn);
	        }
	    };

	    /**
	     * Converts a stringified boolean to a JS boolean
	     *
	     * @param string
	     * @returns {*}
	     */
	    function stringToBoolean(string) {
	        if (string === 'true') {
	            return true;
	        } else if (string === 'false') {
	            return false;
	        }

	        return string;
	    }

	    /**
	     * This will attach the properties native to Angular UI Tooltips. If there is a tour-level value set
	     * for any of them, this passes that value along to the step
	     *
	     * @param {$rootScope.Scope} scope The tour step's scope
	     * @param {Attributes} attrs The tour step's Attributes
	     * @param {Object} step Represents the tour step object
	     * @param {Array} properties The list of Tooltip properties
	     */
	    helpers.attachTourConfigProperties = function (scope, attrs, step, properties) {
	        _angular2.default.forEach(properties, function (property) {
	            if (!attrs[helpers.getAttrName(property)] && _angular2.default.isDefined(step.config(property))) {
	                attrs.$set(helpers.getAttrName(property), String(step.config(property)));
	            }
	        });
	    };

	    /**
	     * Helper function that attaches event handlers to options
	     *
	     * @param {$rootScope.Scope} scope
	     * @param {Attributes} attrs
	     * @param {Object} options represents the tour or step object
	     * @param {Array} events
	     * @param {boolean} prefix - used only by the tour directive
	     */
	    helpers.attachEventHandlers = function (scope, attrs, options, events, prefix) {

	        _angular2.default.forEach(events, function (eventName) {
	            var attrName = helpers.getAttrName(eventName, prefix);

	            if (attrs[attrName]) {
	                options[eventName] = function () {
	                    return $q(function (resolve) {
	                        safeApply(scope, function () {
	                            resolve(scope.$eval(attrs[attrName]));
	                        });
	                    });
	                };
	            }
	        });
	    };

	    /**
	     * Helper function that attaches observers to option attributes
	     *
	     * @param {Attributes} attrs
	     * @param {Object} options represents the tour or step object
	     * @param {Array} keys attribute names
	     * @param {boolean} prefix - used only by the tour directive
	     */
	    helpers.attachInterpolatedValues = function (attrs, options, keys, prefix) {

	        _angular2.default.forEach(keys, function (key) {
	            var attrName = helpers.getAttrName(key, prefix);

	            if (attrs[attrName]) {
	                options[key] = stringToBoolean(attrs[attrName]);
	                attrs.$observe(attrName, function (newValue) {
	                    options[key] = stringToBoolean(newValue);
	                });
	            }
	        });
	    };

	    /**
	     * sets up a redirect when the next or previous step is in a different view
	     *
	     * @param step - the current step (not the next or prev one)
	     * @param ctrl - the tour controller
	     * @param direction - enum (onPrev, onNext)
	     * @param path - the url that the next step is on (will use $location.path())
	     * @param targetName - the ID of the next or previous step
	     */
	    helpers.setRedirect = function (step, ctrl, direction, path, targetName) {
	        var oldHandler = step[direction];

	        step[direction] = function (tour) {
	            return $q(function (resolve) {
	                if (oldHandler) {
	                    oldHandler(tour);
	                }
	                ctrl.waitFor(targetName);
	                if (step.config('useUiRouter')) {
	                    $state.go(path).then(resolve);
	                } else {
	                    $location.path(path);
	                    $timeout(resolve);
	                }
	            });
	        };
	    };

	    /**
	     * Returns the attribute name for an option depending on the prefix
	     *
	     * @param {string} option - name of option
	     * @param {string} prefix - should only be used by tour directive and set to 'uiTour'
	     * @returns {string} potentially prefixed name of option, or just name of option
	     */
	    helpers.getAttrName = function (option, prefix) {
	        return (prefix || 'tourStep') + option.charAt(0).toUpperCase() + option.substr(1);
	    };

	    return helpers;
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	uiTourService.$inject = ["$controller", "$q"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = uiTourService;

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function uiTourService($controller, $q) {
	    'ngInject';

	    var service = {},
	        tours = [];

	    /**
	     * If there is only one tour, returns the tour
	     */
	    service.getTour = function () {
	        return tours[0];
	    };

	    /**
	     * Look up a specific tour by name
	     *
	     * @param {string} name Name of tour
	     */
	    service.getTourByName = function (name) {
	        return tours.filter(function (tour) {
	            return tour.options.name === name;
	        })[0];
	    };

	    /**
	     * Finds the tour available to a specific element
	     *
	     * @param {jqLite | HTMLElement} element Element to use to look up tour
	     * @returns {*}
	     */
	    service.getTourByElement = function (element) {
	        return _angular2.default.element(element).controller('uiTour');
	    };

	    /**
	     * Creates a tour that is not attached to a DOM element (experimental)
	     *
	     * @param {string} name Name of the tour (required)
	     * @param {{}=} config Options to override defaults
	     */
	    service.createDetachedTour = function (name, config) {
	        if (!name) {
	            throw {
	                name: 'ParameterMissingError',
	                message: 'A unique tour name is required for creating a detached tour.'
	            };
	        }

	        config = config || {};

	        config.name = name;
	        return $controller('uiTourController').init(config);
	    };

	    /**
	     * Checks to see if there are any tours that are waiting.
	     * Useful when checking if navigation is due to tour or browser
	     *
	     * @returns {boolean} if there is one or more waiting tours
	     */
	    service.isTourWaiting = function () {
	        return tours.reduce(function (isWaiting, tour) {
	            return isWaiting || tour.getStatus() === tour.Status.WAITING;
	        }, false);
	    };

	    /**
	     * Ends all tours
	     *
	     * @returns {Promise} resolved once all tours have ended
	     */
	    service.endAllTours = function () {
	        return $q.all(tours.map(function (tour) {
	            return tour.end();
	        }));
	    };

	    /**
	     * Used by uiTourController to register a tour
	     *
	     * @protected
	     * @param tour
	     */
	    service._registerTour = function (tour) {
	        tours.push(tour);
	    };

	    /**
	     * Used by uiTourController to remove a destroyed tour from the registry
	     *
	     * @protected
	     * @param tour
	     */
	    service._unregisterTour = function (tour) {
	        tours.splice(tours.indexOf(tour), 1);
	    };

	    return service;
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = ["Tether", "$compile", "$document", "$templateCache", "$rootScope", "$window", "$q", "$timeout", "positionMap", function (Tether, $compile, $document, $templateCache, $rootScope, $window, $q, $timeout, positionMap) {
	    'ngInject';

	    var service = {},

	    /* eslint-disable */
	    easeInOutQuad = function easeInOutQuad(t) {
	        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	    };
	    /* eslint-enable */

	    function createPopup(step, tour) {
	        var scope = _angular2.default.extend($rootScope.$new(), {
	            tourStep: step,
	            tour: tour
	        }),
	            popup = $compile($templateCache.get('tour-step-popup.html'))(scope),
	            parent = step.config('appendToBody') ? _angular2.default.element($document[0].body) : step.element.parent();

	        parent.append(popup);
	        return popup;
	    }

	    function focusPopup(step) {
	        if (!step.config('orphan') && step.config('scrollIntoView')) {
	            var scrollParent = step.config('scrollParentId') === '$document' ? $document : _angular2.default.element($document[0].getElementById(step.config('scrollParentId')));

	            scrollParent.duScrollToElementAnimated(step.popup, step.config('scrollOffset'), 500, easeInOutQuad).then(function () {
	                step.popup[0].focus();
	            }, function () {
	                return 'Failed to scroll.';
	            });
	        } else {
	            step.popup[0].focus();
	        }
	    }

	    function positionPopup(step) {
	        //orphans are positioned via css
	        if (step.config('orphan')) {
	            return;
	        }

	        //otherwise create or reposition the Tether
	        if (!step.tether) {
	            //create a tether
	            step.tether = new Tether({
	                element: step.popup[0],
	                target: step.element[0],
	                attachment: positionMap[step.config('placement')].popup,
	                targetAttachment: positionMap[step.config('placement')].target
	            });
	            step.tether.position();
	        } else {
	            //just reposition the tether
	            step.tether.enable();
	            step.tether.position();
	        }
	    }

	    /**
	     * Destroy a step's popover
	     *
	     * @param {{}} step - Step options
	     */
	    service.destroyPopup = function (step) {
	        step.popup.remove();
	    };

	    /**
	       * Initializes a step from a config object
	       *
	       * @param {{}} step - Step options
	       * @param {{}} tour - The tour to which the step belongs
	       * @returns {*} configured step
	       */
	    service.createStep = function (step, tour) {
	        if (!step.element && !step.elementId && !step.selector) {
	            throw {
	                name: 'PropertyMissingError',
	                message: 'Steps require an element, ID, or selector to be specified'
	            };
	        }

	        //for getting inherited options
	        step.config = function (option) {
	            if (_angular2.default.isDefined(step[option])) {
	                return step[option];
	            }
	            return tour.config(option);
	        };

	        //forces Tether to reposition
	        step.reposition = function () {
	            if (step.tether) {
	                step.tether.position();
	            }
	        };

	        //ensure it is enabled by default
	        if (!_angular2.default.isDefined(step.enabled)) {
	            step.enabled = true;
	        }

	        //create the popup
	        step.popup = createPopup(step, tour);

	        return step;
	    };

	    /**
	     * Activates the popup for a given step
	     *
	     * @param step
	     */
	    service.showPopup = function (step) {
	        //activate Tether
	        positionPopup(step);

	        //nudge the screen to ensure that Tether is positioned properly
	        $window.scrollTo($window.scrollX, $window.scrollY + 1);

	        //wait until next digest
	        $timeout(function () {
	            //show the popup
	            step.popup.css({
	                visibility: 'visible',
	                display: 'block'
	            });

	            //scroll to popup
	            focusPopup(step);
	        }, 100); //ensures size and position are correct
	    };

	    /**
	     * Hides the popup for a given step
	     *
	     * @param step
	     */
	    service.hidePopup = function (step) {
	        if (step.tether) {
	            step.tether.disable();
	        }
	        step.popup[0].style.setProperty('display', 'none', 'important');
	    };

	    return service;
	}];

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	uiTourController.$inject = ["$timeout", "$q", "$filter", "$document", "TourConfig", "uiTourBackdrop", "uiTourService", "TourStepService", "ezEventEmitter", "hotkeys"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = uiTourController;

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function uiTourController($timeout, $q, $filter, $document, TourConfig, uiTourBackdrop, uiTourService, TourStepService, ezEventEmitter, hotkeys) {
	    'ngInject';

	    var self = this,
	        stepList = [],
	        currentStep = null,
	        _resumeWhenFound,
	        TourStatus = {
	        OFF: 0,
	        ON: 1,
	        PAUSED: 2,
	        WAITING: 3
	    },
	        tourStatus = TourStatus.OFF,
	        options = TourConfig.getAll();

	    ezEventEmitter.mixin(self);

	    /**
	     * Closer to $evalAsync, just resolves a promise
	     * after the next digest cycle
	     *
	     * @returns {Promise}
	     */
	    function digest() {
	        return $q.resolve();
	    }

	    /**
	     * return current step or null
	     * @returns {step}
	     */
	    function getCurrentStep() {
	        return currentStep;
	    }

	    /**
	     * set the current step (doesnt do anything else)
	     * @param {step} step Current step
	     */
	    function setCurrentStep(step) {
	        currentStep = step;
	    }

	    /**
	     * gets a step relative to current step
	     *
	     * @param {number} offset Positive integer to search right, negative to search left
	     * @returns {step}
	     */
	    function getStepByOffset(offset) {
	        if (!getCurrentStep()) {
	            return null;
	        }
	        if (getCurrentStep().config('nextPath') && offset > 0) {
	            return null;
	        }
	        if (getCurrentStep().config('prevPath') && offset < 0) {
	            return null;
	        }

	        return stepList[stepList.indexOf(getCurrentStep()) + offset];
	    }

	    /**
	     * retrieves a step (if it exists in the step list) by index, ID, or identity
	     * Note: I realize ID is short for identity, but ID is really the step name here
	     *
	     * @param {string | number | step} stepOrStepIdOrIndex Step to retrieve
	     * @returns {step}
	     */
	    function getStep(stepOrStepIdOrIndex) {
	        //index
	        if (_angular2.default.isNumber(stepOrStepIdOrIndex)) {
	            return stepList[stepOrStepIdOrIndex];
	        }

	        //ID string
	        if (_angular2.default.isString(stepOrStepIdOrIndex)) {
	            return stepList.filter(function (step) {
	                return step.stepId === stepOrStepIdOrIndex;
	            })[0];
	        }

	        //object
	        if (_angular2.default.isObject(stepOrStepIdOrIndex)) {
	            //step identity
	            if (~stepList.indexOf(stepOrStepIdOrIndex)) {
	                return stepOrStepIdOrIndex;
	            }

	            //step copy
	            if (stepOrStepIdOrIndex.stepId) {
	                return stepList.filter(function (step) {
	                    return step.stepId === stepOrStepIdOrIndex.stepId;
	                })[0];
	            }
	        }

	        return null;
	    }

	    /**
	     * return next step or null
	     * @returns {step}
	     */
	    function getNextStep() {
	        return getStepByOffset(+1);
	    }

	    /**
	     * return previous step or null
	     * @returns {step}
	     */
	    function getPrevStep() {
	        return getStepByOffset(-1);
	    }

	    /**
	     * is there a next step
	     *
	     * @returns {boolean}
	     */
	    function isNext() {
	        //not using .config('onNext') because we are looking only for config on the step and not the tour
	        return !!(getNextStep() || getCurrentStep() && (getCurrentStep().config('nextPath') || getCurrentStep().onNext));
	    }

	    /**
	     * is there a previous step
	     *
	     * @returns {boolean}
	     */
	    function isPrev() {
	        //not using .config('onPrev') because we are looking only for config on the step and not the tour
	        return !!(getPrevStep() || getCurrentStep() && (getCurrentStep().config('prevPath') || getCurrentStep().onPrev));
	    }

	    /**
	     * A safe way to invoke a possibly null event handler
	     *
	     * @param handler
	     * @returns {*}
	     */
	    function handleEvent(handler) {
	        return (handler || digest)();
	    }

	    /**
	     * Configures hot keys for controlling the tour with the keyboard
	     */
	    function setHotKeys() {
	        hotkeys.add({
	            combo: 'esc',
	            description: 'End tour',
	            callback: function callback() {
	                self.end();
	            }
	        });

	        hotkeys.add({
	            combo: 'right',
	            description: 'Go to next step',
	            callback: function callback() {
	                if (isNext()) {
	                    self.next();
	                }
	            }
	        });

	        hotkeys.add({
	            combo: 'left',
	            description: 'Go to previous step',
	            callback: function callback() {
	                if (isPrev()) {
	                    self.prev();
	                }
	            }
	        });
	    }

	    /**
	     * Turns off hot keys for when the tour isn't running
	     */
	    function unsetHotKeys() {
	        hotkeys.del('esc');
	        hotkeys.del('right');
	        hotkeys.del('left');
	    }

	    //---------------- Protected API -------------------
	    /**
	     * Adds a step to the tour in order
	     *
	     * @protected
	     * @param {object} step
	     */
	    self.addStep = function (step) {
	        if (~stepList.indexOf(step)) {
	            return;
	        }
	        stepList.push(step);
	        stepList = $filter('orderBy')(stepList, 'order');
	        self.emit('stepAdded', step);
	        if (_resumeWhenFound) {
	            _resumeWhenFound(step);
	        }
	    };

	    /**
	     * Removes a step from the tour
	     *
	     * @protected
	     * @param step
	     */
	    self.removeStep = function (step) {
	        var index = stepList.indexOf(step);

	        if (index !== -1) {
	            stepList.splice(index, 1);
	            self.emit('stepRemoved', step);
	        }
	    };

	    /**
	     * if a step's order was changed, replace it in the list
	     *
	     * @protected
	     * @param step
	     */
	    self.reorderStep = function (step) {
	        self.removeStep(step);
	        self.addStep(step);
	        self.emit('stepsReordered', step);
	    };

	    /**
	     * Checks to see if a step exists by ID, index, or identity
	     *
	     * @protected
	     * @param {string | number | step} stepOrStepIdOrIndex Step to check
	     * @returns {boolean}
	     */
	    self.hasStep = function (stepOrStepIdOrIndex) {
	        return !!getStep(stepOrStepIdOrIndex);
	    };

	    /**
	     * show supplied step
	     *
	     * @protected
	     * @param step
	     * @returns {promise}
	     */
	    self.showStep = function (step) {
	        return $q.resolve().then(function () {
	            if (!step) {
	                throw 'No step.';
	            }

	            return handleEvent(step.config('onShow'));
	        }).then(function () {

	            if (!step.element) {
	                if (step.elementId) {
	                    step.element = _angular2.default.element($document[0].getElementById(step.elementId));
	                }
	                if (step.selector) {
	                    step.element = _angular2.default.element($document[0].querySelector(step.selector));
	                }

	                if (!step.element) {
	                    throw 'No element found for step: \'' + step + '\'.';
	                }
	            }

	            if (step.config('backdrop')) {
	                uiTourBackdrop.createForElement(step.element, {
	                    preventScrolling: step.config('preventScrolling'),
	                    fixed: step.config('fixed'),
	                    borderRadius: step.config('backdropBorderRadius'),
	                    padding: step.config('backdropPadding'),
	                    fullScreen: step.config('orphan'),
	                    events: {
	                        click: step.config('onBackdropClick')
	                    }
	                });
	            }

	            step.element.addClass('ui-tour-active-step');

	            TourStepService.showPopup(step);
	            return digest();
	        }).then(function () {
	            return handleEvent(step.config('onShown'));
	        }).then(function () {

	            self.emit('stepShown', step);
	            step.isNext = isNext;
	            step.isPrev = isPrev;
	        });
	    };

	    /**
	     * hides the supplied step
	     *
	     * @protected
	     * @param step
	     * @returns {Promise}
	     */
	    self.hideStep = function (step) {
	        return $q.resolve().then(function () {
	            if (!step) {
	                throw 'No step.';
	            }

	            return handleEvent(step.config('onHide'));
	        }).then(function () {

	            step.element.removeClass('ui-tour-active-step');

	            TourStepService.hidePopup(step);
	            return digest();
	        }).then(function () {
	            return handleEvent(step.config('onHidden'));
	        }).then(function () {

	            self.emit('stepHidden', step);
	        });
	    };

	    /**
	     * Returns the value for specified option
	     *
	     * @protected
	     * @param {string} option Name of option
	     * @returns {*}
	     */
	    self.config = function (option) {
	        return options[option];
	    };

	    /**
	     * pass options from directive
	     *
	     * @protected
	     * @param opts
	     * @returns {self}
	     */
	    self.init = function (opts) {
	        options = _angular2.default.extend(options, opts);
	        self.options = options;
	        uiTourService._registerTour(self);
	        self.initialized = true;
	        self.emit('initialized');
	        return self;
	    };

	    /**
	     * Unregisters with the tour service when tour is destroyed
	     *
	     * @protected
	     */
	    self.destroy = function () {
	        uiTourService._unregisterTour(self);
	    };
	    //------------------ end Protected API ------------------


	    //------------------ Public API ------------------

	    /**
	     * starts the tour
	     *
	     * @returns {Promise}
	     */
	    self.start = function () {
	        return self.startAt(0);
	    };

	    /**
	     * starts the tour at a specified step, step index, or step ID
	     *
	     * @public
	     */
	    self.startAt = function (stepOrStepIdOrIndex) {
	        var step;
	        return $q.resolve().then(function () {
	            return handleEvent(options.onStart);
	        }).then(function () {
	            step = getStep(stepOrStepIdOrIndex);


	            setCurrentStep(step);
	            tourStatus = TourStatus.ON;
	            self.emit('started', step);

	            if (options.useHotkeys) {
	                setHotKeys();
	            }

	            return self.showStep(getCurrentStep());
	        });
	    };

	    /**
	     * ends the tour
	     *
	     * @public
	     */
	    self.end = function () {
	        return $q.resolve().then(function () {
	            return handleEvent(options.onEnd);
	        }).then(function () {

	            if (getCurrentStep()) {
	                uiTourBackdrop.hide();
	                return self.hideStep(getCurrentStep());
	            }
	        }).then(function () {
	            setCurrentStep(null);
	            self.emit('ended');
	            tourStatus = TourStatus.OFF;
	            _resumeWhenFound = null;

	            if (options.useHotkeys) {
	                unsetHotKeys();
	            }
	        });
	    };

	    /**
	     * pauses the tour
	     *
	     * @public
	     */
	    self.pause = function () {
	        return $q.resolve().then(function () {
	            return handleEvent(options.onPause);
	        }).then(function () {

	            tourStatus = TourStatus.PAUSED;

	            uiTourBackdrop.hide();
	            return self.hideStep(getCurrentStep());
	        }).then(function () {

	            self.emit('paused', getCurrentStep());
	        });
	    };

	    /**
	     * resumes a paused tour or starts it
	     *
	     * @public
	     */
	    self.resume = function () {
	        return $q.resolve().then(function () {
	            return handleEvent(options.onResume);
	        }).then(function () {

	            tourStatus = TourStatus.ON;
	            self.emit('resumed', getCurrentStep());
	            return self.showStep(getCurrentStep());
	        });
	    };

	    /**
	     * move to next step
	     *
	     * @public
	     * @returns {promise}
	     */
	    self.next = function () {
	        return self.goTo('$next');
	    };

	    /**
	     * move to previous step
	     *
	     * @public
	     * @returns {promise}
	     */
	    self.prev = function () {
	        return self.goTo('$prev');
	    };

	    /**
	     * Jumps to the provided step, step ID, or step index
	     *
	     * @param {step | string | number} goTo Step object, step ID string, or step index to jump to
	     * @returns {promise} Promise that resolves once the step is shown
	     */
	    self.goTo = function (goTo) {
	        var currentStep, stepToShow, actionMap, _test;

	        return $q.resolve().then(function () {
	            currentStep = getCurrentStep();
	            stepToShow = getStep(goTo);
	            actionMap = {
	                $prev: {
	                    getStep: getPrevStep,
	                    preEvent: 'onPrev',
	                    navCheck: 'prevStep'
	                },
	                $next: {
	                    getStep: getNextStep,
	                    preEvent: 'onNext',
	                    navCheck: 'nextStep'
	                }
	            };
	            _test = goTo === '$prev' || goTo === '$next';

	            if (_test) {
	                return $q.resolve().then(function () {
	                    return handleEvent(currentStep.config(actionMap[goTo].preEvent));
	                }).then(function () {
	                    return self.hideStep(currentStep);
	                });
	            }
	        }).then(function () {

	            //if a redirect occurred during onNext or onPrev, getCurrentStep() !== currentStep
	            //this will only be true if no redirect occurred, since the redirect sets current step
	            if (_test && (!currentStep[actionMap[goTo].navCheck] || currentStep[actionMap[goTo].navCheck] !== getCurrentStep().stepId)) {
	                setCurrentStep(actionMap[goTo].getStep());
	                self.emit('stepChanged', getCurrentStep());
	            }

	            //if the next/prev step does not have a backdrop, hide it
	            if (_test && getCurrentStep() && !getCurrentStep().config('backdrop')) {
	                uiTourBackdrop.hide();
	            }

	            //if the next/prev step does not prevent scrolling, allow it
	            if (_test && getCurrentStep() && !getCurrentStep().config('preventScrolling')) {
	                uiTourBackdrop.shouldPreventScrolling(false);
	            }

	            if (_test && getCurrentStep()) {
	                return self.showStep(getCurrentStep());
	            } else {
	                if (_test) {

	                    return self.end();
	                } else {
	                    return $q.resolve().then(function () {

	                        //if no step found
	                        if (!stepToShow) {
	                            throw 'No step.';
	                        }

	                        //take action
	                        return self.hideStep(getCurrentStep());
	                    }).then(function () {

	                        //if the next/prev step does not have a backdrop, hide it
	                        if (getCurrentStep().config('backdrop') && !stepToShow.config('backdrop')) {
	                            uiTourBackdrop.hide();
	                        }

	                        //if the next/prev step does not prevent scrolling, allow it
	                        if (getCurrentStep().config('backdrop') && !stepToShow.config('preventScrolling')) {
	                            uiTourBackdrop.shouldPreventScrolling(false);
	                        }

	                        setCurrentStep(stepToShow);
	                        self.emit('stepChanged', getCurrentStep());
	                        return self.showStep(stepToShow);
	                    });
	                }
	            }
	        }).then(function () {});
	    };

	    /**
	     * Tells the tour to pause until a specific step is added
	     *
	     * @public
	     * @param waitForStep
	     */
	    self.waitFor = function (waitForStep) {
	        function resumeWhenFound(step) {
	            if (step.stepId === waitForStep) {
	                setCurrentStep(stepList[stepList.indexOf(step)]);
	                self.resume();
	                _resumeWhenFound = null;
	            }
	        }return $q.resolve().then(function () {
	            _resumeWhenFound = resumeWhenFound;
	            //must reject so that when used in a lifecycle hook the execution stops
	            return self.pause();
	        }).then(function () {
	            tourStatus = TourStatus.WAITING;
	            return $q.reject();
	        });
	    };

	    /**
	     * Creates a step from a configuration object
	     *
	     * @param {{}} options - Step options, all are static
	     */
	    self.createStep = function (options) {
	        var step = TourStepService.createStep(options, self);

	        if (self.initialized) {
	            self.addStep(step);
	        } else {
	            self.once('initialized', function () {
	                self.addStep(step);
	            });
	        }

	        return step;
	    };

	    /**
	    * Destroy a step with destroying the created popup as well
	    *
	    * @protected
	    * @param step
	    */
	    self.destroyStep = function (step) {
	        var index = stepList.indexOf(step);

	        if (index !== -1) {
	            TourStepService.destroyPopup(stepList[index]);
	            self.removeStep(step);
	        }
	    };

	    /**
	     * returns a copy of the current step (copied to avoid breaking internal functions)
	     *
	     * @returns {step}
	     */
	    self.getCurrentStep = function () {
	        return getCurrentStep();
	    };

	    /**
	     * Forces the popover and backdrop to reposition
	     */
	    self.reposition = function () {
	        if (getCurrentStep()) {
	            getCurrentStep().reposition();
	            uiTourBackdrop.reposition();
	        }
	    };

	    /**
	     * @typedef number TourStatus
	     */

	    /**
	     * Returns the current status of the tour
	     * @returns {TourStatus}
	     */
	    self.getStatus = function () {
	        return tourStatus;
	    };
	    /**
	     * @enum TourStatus
	     */
	    self.Status = TourStatus;

	    //------------------ end Public API ------------------

	    //some debugging functions
	    //all are private, unsafe, subject to change
	    //strongly not recommended for production code

	    self._getSteps = function () {
	        return stepList;
	    };
	    self._getCurrentStep = getCurrentStep;
	    self._setCurrentStep = setCurrentStep;
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	uiTourDirective.$inject = ["TourHelpers"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = uiTourDirective;

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function uiTourDirective(TourHelpers) {
	    'ngInject';

	    return {
	        restrict: 'EA',
	        scope: true,
	        controller: 'uiTourController',
	        link: function link(scope, element, attrs, ctrl) {

	            //Pass static options through or use defaults
	            var tour = {
	                name: attrs.uiTour
	            },
	                events = 'onReady onStart onEnd onShow onShown onHide onHidden onNext onPrev onPause onResume onBackdropClick'.split(' '),
	                properties = 'placement animation popupDelay closePopupDelay enable appendToBody popupClass orphan backdrop backdropBorderRadius backdropPadding scrollParentId scrollOffset scrollIntoView useUiRouter useHotkeys'.split(' ');

	            //Pass interpolated values through
	            TourHelpers.attachInterpolatedValues(attrs, tour, properties, 'uiTour');

	            //Attach event handlers
	            TourHelpers.attachEventHandlers(scope, attrs, tour, events, 'uiTour');

	            //override the template url
	            if (attrs[TourHelpers.getAttrName('templateUrl', 'uiTour')]) {
	                tour.templateUrl = scope.$eval(attrs[TourHelpers.getAttrName('templateUrl', 'uiTour')]);
	            }

	            //If there is an options argument passed, just use that instead
	            if (attrs[TourHelpers.getAttrName('options')]) {
	                _angular2.default.extend(tour, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
	            }

	            //Initialize tour
	            scope.tour = ctrl.init(tour);
	            if (typeof tour.onReady === 'function') {
	                tour.onReady();
	            }

	            scope.$on('$destroy', function () {
	                ctrl.destroy();
	            });
	        }
	    };
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	tourStepDirective.$inject = ["TourHelpers", "uiTourService", "$sce"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = tourStepDirective;

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	__webpack_require__(27);

	__webpack_require__(28);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function tourStepDirective(TourHelpers, uiTourService, $sce) {
	    'ngInject';

	    return {
	        restrict: 'EA',
	        scope: true,
	        require: '?^uiTour',
	        link: function link(scope, element, attrs, uiTourCtrl) {
	            var ctrl,

	            //Assign required options
	            step,
	                events = 'onShow onShown onHide onHidden onNext onPrev onBackdropClick'.split(' '),
	                options = 'content title animation placement backdrop backdropBorderRadius backdropPadding orphan popupDelay popupCloseDelay popupClass fixed preventScrolling scrollIntoView nextStep prevStep nextPath prevPath scrollOffset scrollParentId'.split(' '),
	                orderWatch,
	                enabledWatch,
	                contentWatch;

	            //check if this step belongs to another tour
	            if (attrs[TourHelpers.getAttrName('belongsTo')]) {
	                ctrl = uiTourService.getTourByName(attrs[TourHelpers.getAttrName('belongsTo')]);
	            } else if (uiTourCtrl) {
	                ctrl = uiTourCtrl;
	            }

	            if (!ctrl) {
	                throw {
	                    name: 'DependencyMissingError',
	                    message: 'No tour provided for tour step.'
	                };
	            }

	            //initialize the step
	            step = ctrl.createStep({
	                stepId: attrs.tourStep,
	                element: element
	            });

	            //Pass interpolated values through
	            TourHelpers.attachInterpolatedValues(attrs, step, options);
	            orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
	                step.order = !isNaN(order * 1) ? order * 1 : 0;
	                if (ctrl.hasStep(step)) {
	                    ctrl.reorderStep(step);
	                }
	            });
	            enabledWatch = attrs.$observe(TourHelpers.getAttrName('enabled'), function (isEnabled) {
	                step.enabled = isEnabled !== 'false';
	                if (step.enabled) {
	                    ctrl.addStep(step);
	                } else {
	                    ctrl.removeStep(step);
	                }
	            });

	            // watch for content updates
	            contentWatch = attrs.$observe(TourHelpers.getAttrName('content'), function (content) {
	                if (content) {
	                    step.trustedContent = $sce.trustAsHtml(step.content);
	                }
	            });

	            //Attach event handlers
	            TourHelpers.attachEventHandlers(scope, attrs, step, events);

	            if (attrs[TourHelpers.getAttrName('templateUrl')]) {
	                step.templateUrl = scope.$eval(attrs[TourHelpers.getAttrName('templateUrl')]);
	            }

	            //If there is an options argument passed, just use that instead
	            if (attrs[TourHelpers.getAttrName('options')]) {
	                _angular2.default.extend(step, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
	            }

	            //set up redirects (deprecated)
	            if (step.nextPath) {
	                step.redirectNext = true;
	                TourHelpers.setRedirect(step, ctrl, 'onNext', step.nextPath, step.nextStep);
	            }
	            if (step.prevPath) {
	                step.redirectPrev = true;
	                TourHelpers.setRedirect(step, ctrl, 'onPrev', step.prevPath, step.prevStep);
	            }

	            /**
	             * for HTML content
	             * @deprecated use `step.content` instead
	             */
	            step.trustedContent = $sce.trustAsHtml(step.content);

	            //Add step and tour to scope
	            scope.tourStep = step;
	            scope.tour = ctrl;

	            Object.defineProperties(step, {
	                element: {
	                    value: element
	                },
	                scope: {
	                    value: scope
	                }
	            });

	            //clean up when element is destroyed
	            scope.$on('$destroy', function () {
	                ctrl.removeStep(step);
	                orderWatch();
	                enabledWatch();
	                contentWatch();
	            });
	        }
	    };
	}

/***/ },
/* 27 */
/***/ function(module, exports) {

	var angular=window.angular,ngModule;
	try {ngModule=angular.module(["bm.uiTour"])}
	catch(e){ngModule=angular.module("bm.uiTour",[])}
	var v1="<div class=\"tourStep ui-tour-popup popover {{ tourStep.config('popupClass') }} {{ tourStep.config('orphan') ? 'ui-tour-popup-orphan' : tourStep.config('placement').split('-')[0] + ' ' + tourStep.config('placement') }}\" ng-style=\"{\n        visibility: 'hidden',\n        display: 'block',\n        position: tourStep.config('fixed') || tourStep.config('orphan') ? 'fixed' : 'absolute',\n        zIndex: tourStep.config('backdropZIndex') + 2\n     }\" tabindex=\"0\" aria-hidden=\"{{ tour._getCurrentStep() !== tourStep }}\">\n<div class=\"arrow\"></div>\n<div class=\"popover-inner tour-step-inner\">\n<h3 class=\"popover-title tour-step-title\" ng-bind=\"tourStep.config('title')\" ng-if=\"tourStep.config('title')\"></h3>\n<div class=\"popover-content tour-step-content\" ng-include=\"tourStep.config('templateUrl') || 'tour-step-template.html'\"></div>\n</div>\n</div>\n";
	var id1="tour-step-popup.html";
	var inj=angular.element(window.document).injector();
	if(inj){inj.get("$templateCache").put(id1,v1);}
	else{ngModule.run(["$templateCache",function(c){c.put(id1,v1)}]);}
	module.exports=v1;

/***/ },
/* 28 */
/***/ function(module, exports) {

	var angular=window.angular,ngModule;
	try {ngModule=angular.module(["bm.uiTour"])}
	catch(e){ngModule=angular.module("bm.uiTour",[])}
	var v1="<div>\n<div class=\"popover-content tour-step-content\" bind-html-compile=\"tourStep.trustedContent || tourStep.content\"></div>\n<div class=\"popover-navigation tour-step-navigation\">\n<div class=\"btn-group\">\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-if=\"tourStep.isPrev()\" ng-click=\"tour.prev()\">&laquo; Prev</button>\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-if=\"tourStep.isNext()\" ng-click=\"tour.next()\">Next &raquo;</button>\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"tour.pause()\">Pause</button>\n</div>\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"tour.end()\">End tour</button>\n</div>\n</div>\n";
	var id1="tour-step-template.html";
	var inj=angular.element(window.document).injector();
	if(inj){inj.get("$templateCache").put(id1,v1);}
	else{ngModule.run(["$templateCache",function(c){c.put(id1,v1)}]);}
	module.exports=v1;

/***/ }
/******/ ])
});
;