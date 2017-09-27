(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("angular-sanitize"), require("angular-scroll"), require("ez-ng"), require("angular-hotkeys"), require("angular-bind-html-compile"), require("tether"), require("hone"));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "angular-sanitize", "angular-scroll", "ez-ng", "angular-hotkeys", "angular-bind-html-compile", "Tether", "Hone"], factory);
	else if(typeof exports === 'object')
		exports["uiTour"] = factory(require("angular"), require("angular-sanitize"), require("angular-scroll"), require("ez-ng"), require("angular-hotkeys"), require("angular-bind-html-compile"), require("tether"), require("hone"));
	else
		root["uiTour"] = factory(root["angular"], root["angular-sanitize"], root["angular-scroll"], root["ez-ng"], root["angular-hotkeys"], root["angular-bind-html-compile"], root["Tether"], root["Hone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


run.$inject = ["TourConfig", "uiTourService", "$rootScope", "$injector"];
Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = __webpack_require__(0);

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

exports.default = _angular2.default.module('bm.uiTour', ['ngSanitize', 'duScroll', 'ezNg', 'cfp.hotkeys', 'angular-bind-html-compile']).run(run).value('Tether', _tether2.default).value('Hone', _hone2.default).constant('positionMap', __webpack_require__(14).default).provider('TourConfig', __webpack_require__(15).default).factory('uiTourBackdrop', __webpack_require__(16).default).factory('TourHelpers', __webpack_require__(17).default).factory('uiTourService', __webpack_require__(18).default).factory('TourStepService', __webpack_require__(19).default).controller('uiTourController', __webpack_require__(20).default).directive('uiTour', __webpack_require__(21).default).directive('tourStep', __webpack_require__(22).default).name;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
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

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(undefined);
// imports


// module
exports.push([module.i, ".no-scrolling {\n    height: 100%;\n    overflow: hidden;\n}\n\n/*this might be an accessibility issue*/\n.ui-tour-popup:focus {\n    outline: none;\n}\n\n.ui-tour-popup-orphan {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    margin: 0;\n    transform: translateX(-50%) translateY(-50%);\n}\n\n/*improve popover arrows:*/\n.ui-tour-popup.popover.bottom-left > .arrow,\n.ui-tour-popup.popover.top-left > .arrow {\n    left: 25px;\n}\n\n.ui-tour-popup.popover.bottom-right > .arrow,\n.ui-tour-popup.popover.top-right > .arrow {\n    left: auto;\n    right: 25px;\n}\n\n.ui-tour-popup.popover.right-top > .arrow,\n.ui-tour-popup.popover.left-top > .arrow {\n    top: 25px;\n}\n\n.ui-tour-popup.popover.left-bottom > .arrow,\n.ui-tour-popup.popover.right-bottom > .arrow {\n    top: auto;\n    bottom: 25px;\n}", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
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

	if (useSourceMap && typeof btoa === 'function') {
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
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(13);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
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

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

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

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {


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


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = TourConfig;

var _angular = __webpack_require__(0);

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

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


uiTourBackdrop.$inject = ["$document", "Hone"];
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uiTourBackdrop;

var _angular = __webpack_require__(0);

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

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


TourHelpers.$inject = ["$http", "$compile", "$location", "TourConfig", "$q", "$injector", "$timeout"];
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = TourHelpers;

var _angular = __webpack_require__(0);

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

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


uiTourService.$inject = ["$controller", "$q"];
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uiTourService;

var _angular = __webpack_require__(0);

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

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


uiTourController.$inject = ["$timeout", "$q", "$filter", "$document", "TourConfig", "uiTourBackdrop", "uiTourService", "TourStepService", "ezEventEmitter", "hotkeys"];
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uiTourController;

var _angular = __webpack_require__(0);

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

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


uiTourDirective.$inject = ["TourHelpers"];
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uiTourDirective;

var _angular = __webpack_require__(0);

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

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


tourStepDirective.$inject = ["TourHelpers", "uiTourService", "$sce"];
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = tourStepDirective;

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

__webpack_require__(23);

__webpack_require__(24);

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

/***/ }),
/* 23 */
/***/ (function(module, exports) {

var angular=window.angular,ngModule;
try {ngModule=angular.module(["bm.uiTour"])}
catch(e){ngModule=angular.module("bm.uiTour",[])}
var v1="<div class=\"tourStep ui-tour-popup popover {{ tourStep.config('popupClass') }} {{ tourStep.config('orphan') ? 'ui-tour-popup-orphan' : tourStep.config('placement').split('-')[0] + ' ' + tourStep.config('placement') }}\" ng-style=\"{\n        visibility: 'hidden',\n        display: 'block',\n        position: tourStep.config('fixed') || tourStep.config('orphan') ? 'fixed' : 'absolute',\n        zIndex: tourStep.config('backdropZIndex') + 2\n     }\" tabindex=\"0\" aria-hidden=\"{{ tour._getCurrentStep() !== tourStep }}\">\n<div class=\"arrow\"></div>\n<div class=\"popover-inner tour-step-inner\">\n<h3 class=\"popover-title tour-step-title\" ng-bind=\"tourStep.config('title')\" ng-if=\"tourStep.config('title')\"></h3>\n<div class=\"popover-content tour-step-content\" ng-include=\"tourStep.config('templateUrl') || 'tour-step-template.html'\"></div>\n</div>\n</div>\n";
var id1="tour-step-popup.html";
var inj=angular.element(window.document).injector();
if(inj){inj.get("$templateCache").put(id1,v1);}
else{ngModule.run(["$templateCache",function(c){c.put(id1,v1)}]);}
module.exports=v1;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

var angular=window.angular,ngModule;
try {ngModule=angular.module(["bm.uiTour"])}
catch(e){ngModule=angular.module("bm.uiTour",[])}
var v1="<div>\n<div class=\"popover-content tour-step-content\" bind-html-compile=\"tourStep.trustedContent || tourStep.content\"></div>\n<div class=\"popover-navigation tour-step-navigation\">\n<div class=\"btn-group\">\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-if=\"tourStep.isPrev()\" ng-click=\"tour.prev()\">&laquo; Prev</button>\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-if=\"tourStep.isNext()\" ng-click=\"tour.next()\">Next &raquo;</button>\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"tour.pause()\">Pause</button>\n</div>\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"tour.end()\">End tour</button>\n</div>\n</div>\n";
var id1="tour-step-template.html";
var inj=angular.element(window.document).injector();
if(inj){inj.get("$templateCache").put(id1,v1);}
else{ngModule.run(["$templateCache",function(c){c.put(id1,v1)}]);}
module.exports=v1;

/***/ })
/******/ ]);
});