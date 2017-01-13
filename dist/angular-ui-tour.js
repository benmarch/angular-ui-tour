(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("angular-sanitize"), require("angular-bootstrap"), require("ngSmoothScroll"), require("ez-ng"), require("angular-hotkeys"));
	else if(typeof define === 'function' && define.amd)
		define("uiTour", ["angular", "angular-sanitize", "angular-bootstrap", "ngSmoothScroll", "ez-ng", "angular-hotkeys"], factory);
	else if(typeof exports === 'object')
		exports["uiTour"] = factory(require("angular"), require("angular-sanitize"), require("angular-bootstrap"), require("ngSmoothScroll"), require("ez-ng"), require("angular-hotkeys"));
	else
		root["uiTour"] = factory(root["angular"], root["angular-sanitize"], root["angular-bootstrap"], root["ngSmoothScroll"], root["ez-ng"], root["angular-hotkeys"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	config.$inject = ["$uibTooltipProvider"];
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
	
	__webpack_require__(7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function config($uibTooltipProvider) {
	    'ngInject';
	
	    $uibTooltipProvider.setTriggers({
	        uiTourShow: 'uiTourHide'
	    });
	}
	
	exports.default = _angular2.default.module('bm.uiTour', ['ngSanitize', 'ui.bootstrap', 'smoothScroll', 'ezNg', 'cfp.hotkeys']).config(config).provider('TourConfig', __webpack_require__(8)).factory('uiTourBackdrop', __webpack_require__(9)).factory('TourHelpers', __webpack_require__(10)).factory('uiTourService', __webpack_require__(11)).controller('uiTourController', __webpack_require__(12)).directive('uiTour', __webpack_require__(13)).directive('tourStep', __webpack_require__(14).tourStepDirective).directive('tourStepPopup', __webpack_require__(14).tourStepPopupDirective).name;
	module.exports = exports['default'];

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

	'use strict';
	
	(function (window) {
	    function CustomEvent(event, params) {
	        params = params || {
	            bubbles: false,
	            cancelable: false,
	            detail: undefined
	        };
	        var evt = document.createEvent('CustomEvent');
	
	        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	        return evt;
	    }
	
	    CustomEvent.prototype = window.Event.prototype;
	
	    window.CustomEvent = CustomEvent;
	})(window);

/***/ },
/* 8 */
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
	
	    var config = {
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
	        scrollOffset: 100,
	        scrollIntoView: true,
	        useUiRouter: false,
	        useHotkeys: false,
	
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
	
	    this.$get = ['$q', function ($q) {
	
	        var service = {};
	
	        service.get = function (option) {
	            return config[option];
	        };
	
	        service.getAll = function () {
	            return _angular2.default.copy(config);
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
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	uiTourBackdrop.$inject = ["TourConfig", "$document", "$uibPosition", "$window"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = uiTourBackdrop;
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function uiTourBackdrop(TourConfig, $document, $uibPosition, $window) {
	    'ngInject';
	
	    var service = {},
	        $body = _angular2.default.element($document[0].body),
	        $backdrop = _angular2.default.element($document[0].createElement('div')),
	        viewWindow = {},
	        preventDefault = function preventDefault(e) {
	        e.preventDefault();
	    },
	        onResize;
	
	    function createStyles(styles) {
	        var styleElement = document.createElement('style');
	
	        styleElement.type = 'text/css';
	        styleElement.innerHTML = styles;
	
	        _angular2.default.element($document[0].head).append(styleElement);
	
	        return function cleanup() {
	            _angular2.default.element(styleElement).remove();
	        };
	    }
	
	    (function createSvgClipPath() {
	        var element = _angular2.default.element('\n            <svg width="100" height="100" viewBox="0 0 100 100" id="invertedCorner" fill="none" style="display: none;">\n                <path class="tour-backdrop"\n                      d="M100 0\n                         Q 0 0 0 100\n                         L0 0\n                         Z" />\n            </svg>\n        ');
	
	        $document[0].body.appendChild(element[0]);
	    })();
	
	    function preventScrolling() {
	        $body.addClass('no-scrolling');
	        $body.on('touchmove', preventDefault);
	    }
	
	    function allowScrolling() {
	        $body.removeClass('no-scrolling');
	        $body.off('touchmove', preventDefault);
	    }
	
	    function createBackdropComponent(name) {
	        var backdrop = _angular2.default.element($document[0].createElement('div'));
	
	        backdrop.addClass('tour-backdrop tour-backdrop-' + name).css({
	            display: 'none',
	            zIndex: TourConfig.get('backdropZIndex')
	        });
	
	        viewWindow[name] = backdrop;
	        $backdrop.append(backdrop);
	    }
	
	    function createBackdropCorner(name) {
	        var corner = _angular2.default.element($document[0].getElementById('invertedCorner')).clone();
	
	        corner.addClass('tour-backdrop-' + name).css({
	            display: 'none',
	            zIndex: TourConfig.get('backdropZIndex')
	        });
	
	        viewWindow[name] = corner;
	        $backdrop.append(corner);
	    }
	
	    function showBackdrop() {
	        _angular2.default.forEach(viewWindow, function (component) {
	            return component.css('display', 'block');
	        });
	    }
	    function hideBackdrop() {
	        _angular2.default.forEach(viewWindow, function (component) {
	            return component.css('display', 'none');
	        });
	    }
	
	    function positionBackdrop(element, isFixedElement) {
	        var borderRadius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	
	        var position,
	            viewportPosition,
	            bodyPosition,
	            vw = Math.max($document[0].documentElement.clientWidth, $window.innerWidth || 0),
	            vh = Math.max($document[0].documentElement.clientHeight, $window.innerHeight || 0);
	
	        position = $uibPosition.offset(element);
	        viewportPosition = $uibPosition.viewportOffset(element);
	        bodyPosition = $uibPosition.offset($body);
	
	        if (isFixedElement) {
	            _angular2.default.extend(position, viewportPosition);
	        }
	
	        //configure the main backdrop pieces
	        viewWindow.top.css({
	            position: isFixedElement ? 'fixed' : 'absolute',
	            top: 0,
	            left: 0,
	            width: '100%',
	            height: position.top + 'px'
	        });
	        viewWindow.bottom.css({
	            position: isFixedElement ? 'fixed' : 'absolute',
	            left: 0,
	            width: '100%',
	            height: Math.max(bodyPosition.top + bodyPosition.height - position.top - position.height, vh - position.top - position.height) + 'px',
	            top: position.top + position.height + 'px'
	        });
	        viewWindow.left.css({
	            position: isFixedElement ? 'fixed' : 'absolute',
	            top: position.top + 'px',
	            width: position.left + 'px',
	            height: position.height + 'px'
	        });
	        viewWindow.right.css({
	            position: isFixedElement ? 'fixed' : 'absolute',
	            top: position.top + 'px',
	            width: Math.max(bodyPosition.left + bodyPosition.width - position.left - position.width, vw - position.left - position.width) + 'px',
	            height: position.height + 'px',
	            left: position.left + position.width + 'px'
	        });
	
	        //if there are rounded corners, configure those
	        viewWindow.cornerTL.css({
	            position: isFixedElement ? 'fixed' : 'absolute',
	            top: position.top + 'px',
	            left: position.left + 'px',
	            height: borderRadius + 'px',
	            width: borderRadius + 'px'
	        });
	        viewWindow.cornerBL.css({
	            position: isFixedElement ? 'fixed' : 'absolute',
	            top: position.top + position.height - borderRadius + 'px',
	            left: position.left + 'px',
	            height: borderRadius + 'px',
	            width: borderRadius + 'px',
	            transform: 'rotate(-90deg)'
	        });
	        viewWindow.cornerTR.css({
	            position: isFixedElement ? 'fixed' : 'absolute',
	            top: position.top + 'px',
	            left: position.left + position.width - borderRadius + 'px',
	            height: borderRadius + 'px',
	            width: borderRadius + 'px',
	            transform: 'rotate(90deg)'
	        });
	        viewWindow.cornerBR.css({
	            position: isFixedElement ? 'fixed' : 'absolute',
	            top: position.top + position.height - borderRadius + 'px',
	            left: position.left + position.width - borderRadius + 'px',
	            height: borderRadius + 'px',
	            width: borderRadius + 'px',
	            transform: 'rotate(180deg)'
	        });
	    }
	
	    service.createForElement = function (element, shouldPreventScrolling, isFixedElement, onClick, borderRadius) {
	        positionBackdrop(element, isFixedElement, borderRadius);
	        showBackdrop();
	
	        onResize = function onResize() {
	            positionBackdrop(element, isFixedElement, borderRadius);
	        };
	        _angular2.default.element($window).on('resize', onResize);
	
	        if (shouldPreventScrolling) {
	            service.shouldPreventScrolling(true);
	        } else {
	            service.shouldPreventScrolling(false);
	        }
	
	        if (onClick) {
	            _angular2.default.element($backdrop).on('click', onClick);
	        } else {
	            _angular2.default.element($backdrop).off('click');
	        }
	    };
	
	    service.hide = function () {
	        hideBackdrop();
	        service.shouldPreventScrolling(false);
	        _angular2.default.element($backdrop).off('click');
	        _angular2.default.element($window).off('resize', onResize);
	    };
	
	    service.shouldPreventScrolling = function () {
	        var shouldPreventScrolling = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        if (shouldPreventScrolling) {
	            preventScrolling();
	        } else {
	            allowScrolling();
	        }
	    };
	
	    //init
	    _angular2.default.forEach('top right bottom left'.split(' '), function (component) {
	        createBackdropComponent(component);
	    });
	    _angular2.default.forEach('cornerTL cornerTR cornerBR cornerBL'.split(' '), function (corner) {
	        createBackdropCorner(corner);
	    });
	    $body.append($backdrop);
	    createStyles('.no-scrolling { height: 100%; overflow: hidden; }');
	
	    return service;
	}
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	TourHelpers.$inject = ["$templateCache", "$http", "$compile", "$location", "TourConfig", "$q", "$injector", "$timeout"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = TourHelpers;
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function TourHelpers($templateCache, $http, $compile, $location, TourConfig, $q, $injector, $timeout) {
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
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	uiTourService.$inject = ["$controller"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = uiTourService;
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function uiTourService($controller) {
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
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	uiTourController.$inject = ["$timeout", "$q", "$filter", "TourConfig", "uiTourBackdrop", "uiTourService", "ezEventEmitter", "hotkeys"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = uiTourController;
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function uiTourController($timeout, $q, $filter, TourConfig, uiTourBackdrop, uiTourService, ezEventEmitter, hotkeys) {
	    'ngInject';
	
	    var self = this,
	        stepList = [],
	        currentStep = null,
	        _resumeWhenFound,
	        statuses = {
	        OFF: 0,
	        ON: 1,
	        PAUSED: 2
	    },
	        tourStatus = statuses.OFF,
	        options = TourConfig.getAll();
	
	    ezEventEmitter.mixin(self);
	
	    /**
	     * Closer to $evalAsync, just resolves a promise
	     * after the next digest cycle
	     *
	     * @returns {Promise}
	     */
	    function digest() {
	        return $q(function (resolve) {
	            $timeout(resolve);
	        });
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
	     * Used by showStep and hideStep to trigger popover events
	     *
	     * @param step
	     * @param eventName
	     * @returns {*}
	     */
	    function dispatchEvent(step, eventName) {
	        return $q(function (resolve) {
	            step.element[0].dispatchEvent(new CustomEvent(eventName));
	            resolve();
	        });
	    }
	
	    /**
	     * A safe way to invoke a possibly null event handler
	     *
	     * @param handler
	     * @returns {*}
	     */
	    function handleEvent(handler) {
	        return (handler || $q.resolve)();
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
	        if (!step) {
	            return $q.reject('No step.');
	        }
	
	        return handleEvent(step.config('onShow')).then(function () {
	
	            if (step.config('backdrop')) {
	                uiTourBackdrop.createForElement(step.element, step.config('preventScrolling'), step.config('fixed'), step.config('onBackdropClick'), step.config('backdropBorderRadius'));
	            }
	        }).then(function () {
	
	            step.element.addClass('ui-tour-active-step');
	            return dispatchEvent(step, 'uiTourShow');
	        }).then(function () {
	
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
	        if (!step) {
	            return $q.reject('No step.');
	        }
	
	        return handleEvent(step.config('onHide')).then(function () {
	
	            step.element.removeClass('ui-tour-active-step');
	            return dispatchEvent(step, 'uiTourHide');
	        }).then(function () {
	
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
	        return handleEvent(options.onStart).then(function () {
	
	            var step = getStep(stepOrStepIdOrIndex);
	
	            setCurrentStep(step);
	            tourStatus = statuses.ON;
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
	        return handleEvent(options.onEnd).then(function () {
	
	            if (getCurrentStep()) {
	                uiTourBackdrop.hide();
	                return self.hideStep(getCurrentStep());
	            }
	        }).then(function () {
	
	            setCurrentStep(null);
	            self.emit('ended');
	            tourStatus = statuses.OFF;
	
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
	        return handleEvent(options.onPause).then(function () {
	            tourStatus = statuses.PAUSED;
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
	        return handleEvent(options.onResume).then(function () {
	            tourStatus = statuses.ON;
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
	        var currentStep = getCurrentStep(),
	            stepToShow = getStep(goTo),
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
	
	        if (goTo === '$prev' || goTo === '$next') {
	            //trigger either onNext or onPrev here
	            //if next or previous requires a redirect, it will happen here
	            //the tour will pause here until the next view loads and
	            //the next/prev step is found
	            return handleEvent(currentStep.config(actionMap[goTo].preEvent)).then(function () {
	
	                return self.hideStep(currentStep);
	            }).then(function () {
	
	                //if a redirect occurred during onNext or onPrev, getCurrentStep() !== currentStep
	                //this will only be true if no redirect occurred, since the redirect sets current step
	                if (!currentStep[actionMap[goTo].navCheck] || currentStep[actionMap[goTo].navCheck] !== getCurrentStep().stepId) {
	                    setCurrentStep(actionMap[goTo].getStep());
	                    self.emit('stepChanged', getCurrentStep());
	                }
	
	                //if the next/prev step does not have a backdrop, hide it
	                if (getCurrentStep() && !getCurrentStep().config('backdrop')) {
	                    uiTourBackdrop.hide();
	                }
	
	                //if the next/prev step does not prevent scrolling, allow it
	                if (getCurrentStep() && !getCurrentStep().config('preventScrolling')) {
	                    uiTourBackdrop.shouldPreventScrolling(false);
	                }
	            }).then(function () {
	
	                if (getCurrentStep()) {
	                    return self.showStep(getCurrentStep());
	                }
	
	                self.end();
	            });
	        }
	
	        //if no step found
	        if (!stepToShow) {
	            return $q.reject('No step.');
	        }
	
	        //take action
	        return self.hideStep(getCurrentStep()).then(function () {
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
	    };
	
	    /**
	     * Tells the tour to pause until a specific step is added
	     *
	     * @public
	     * @param waitForStep
	     */
	    self.waitFor = function (waitForStep) {
	        _resumeWhenFound = function resumeWhenFound(step) {
	            if (step.stepId === waitForStep) {
	                setCurrentStep(stepList[stepList.indexOf(step)]);
	                self.resume();
	                _resumeWhenFound = null;
	            }
	        };
	        //must reject so that when used in a lifecycle hook the execution stops
	        return self.pause().then($q.reject);
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
	    self.status = statuses;
	
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
	module.exports = exports['default'];

/***/ },
/* 13 */
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
	                properties = 'placement animation popupDelay closePopupDelay enable appendToBody popupClass orphan backdrop backdropBorderRadius scrollOffset scrollIntoView useUiRouter useHotkeys'.split(' ');
	
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
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	tourStepDirective.$inject = ["TourConfig", "TourHelpers", "uiTourService", "$uibTooltip", "$q", "$sce"];
	tourStepPopupDirective.$inject = ["TourConfig", "smoothScroll", "ezComponentHelpers", "$uibPosition"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.tourStepDirective = tourStepDirective;
	exports.tourStepPopupDirective = tourStepPopupDirective;
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	__webpack_require__(15);
	
	__webpack_require__(16);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function tourStepDirective(TourConfig, TourHelpers, uiTourService, $uibTooltip, $q, $sce) {
	    'ngInject';
	
	    var tourStepDef = $uibTooltip('tourStep', 'tourStep', 'uiTourShow', {
	        popupDelay: 1 //needs to be non-zero for popping up after navigation
	    });
	
	    return {
	        restrict: 'EA',
	        scope: true,
	        require: '?^uiTour',
	        compile: function compile(tElement, tAttrs) {
	
	            if (!tAttrs.tourStep) {
	                tAttrs.$set('tourStep', '\'PH\''); //a placeholder so popup will show
	            }
	
	            var tourStepLinker = tourStepDef.compile(tElement, tAttrs);
	
	            return function (scope, element, attrs, uiTourCtrl) {
	
	                var ctrl,
	
	                //Assign required options
	                step = {
	                    stepId: attrs.tourStep,
	                    enabled: true,
	                    config: function config(option) {
	                        if (_angular2.default.isDefined(step[option])) {
	                            return step[option];
	                        }
	                        return ctrl.config(option);
	                    }
	                },
	                    events = 'onShow onShown onHide onHidden onNext onPrev onBackdropClick'.split(' '),
	                    options = 'content title animation placement backdrop backdropBorderRadius orphan popupDelay popupCloseDelay popupClass fixed preventScrolling scrollIntoView nextStep prevStep nextPath prevPath scrollOffset'.split(' '),
	                    tooltipAttrs = 'animation appendToBody placement popupDelay popupCloseDelay'.split(' '),
	                    orderWatch,
	                    enabledWatch;
	
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
	
	                //Will add values to pass to $uibTooltip
	                function configureInheritedProperties() {
	                    TourHelpers.attachTourConfigProperties(scope, attrs, step, tooltipAttrs, 'tourStep');
	                    tourStepLinker(scope, element, attrs);
	                }
	
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
	
	                //Attach event handlers
	                TourHelpers.attachEventHandlers(scope, attrs, step, events);
	
	                if (attrs[TourHelpers.getAttrName('templateUrl')]) {
	                    step.templateUrl = scope.$eval(attrs[TourHelpers.getAttrName('templateUrl')]);
	                }
	
	                //If there is an options argument passed, just use that instead
	                if (attrs[TourHelpers.getAttrName('options')]) {
	                    _angular2.default.extend(step, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
	                }
	
	                //set up redirects
	                if (step.nextPath) {
	                    step.redirectNext = true;
	                    TourHelpers.setRedirect(step, ctrl, 'onNext', step.nextPath, step.nextStep);
	                }
	                if (step.prevPath) {
	                    step.redirectPrev = true;
	                    TourHelpers.setRedirect(step, ctrl, 'onPrev', step.prevPath, step.prevStep);
	                }
	
	                //for HTML content
	                step.trustedContent = $sce.trustAsHtml(step.content);
	
	                //Add step to tour
	                scope.tourStep = step;
	                scope.tour = ctrl;
	                if (ctrl.initialized) {
	                    configureInheritedProperties();
	                    ctrl.addStep(step);
	                } else {
	                    ctrl.once('initialized', function () {
	                        configureInheritedProperties();
	                        ctrl.addStep(step);
	                    });
	                }
	
	                Object.defineProperties(step, {
	                    element: {
	                        value: element
	                    }
	                });
	
	                //clean up when element is destroyed
	                scope.$on('$destroy', function () {
	                    ctrl.removeStep(step);
	                    orderWatch();
	                    enabledWatch();
	                });
	            };
	        }
	    };
	}
	
	function tourStepPopupDirective(TourConfig, smoothScroll, ezComponentHelpers, $uibPosition) {
	    'ngInject';
	
	    return {
	        restrict: 'A',
	        scope: {
	            uibTitle: '@',
	            contentExp: '&',
	            originScope: '&'
	        },
	        templateUrl: 'tour-step-popup.html',
	        link: function link(scope, element, attrs) {
	            var step = scope.originScope().tourStep,
	                ch = ezComponentHelpers.apply(null, arguments),
	                scrollOffset = step.config('scrollOffset'),
	                isScrolling = false;
	
	            //for arrow styles, unfortunately UI Bootstrap uses attributes for styling
	            attrs.$set('uib-popover-popup', 'uib-popover-popup');
	
	            element.css({
	                zIndex: TourConfig.get('backdropZIndex') + 2,
	                display: 'block'
	            });
	
	            element.addClass([step.config('popupClass'), 'popover'].join(' '));
	
	            if (step.config('fixed')) {
	                element.css('position', 'fixed');
	            }
	
	            if (step.config('orphan')) {
	                ch.useStyles(':scope {' + '   position: fixed;' + '   top: 50% !important;' + '   left: 50% !important;' + '   margin: 0 !important;' + '   -ms-transform: translateX(-50%) translateY(-50%);' + '   -moz-transform: translateX(-50%) translateY(-50%);' + '   -webkit-transform: translateX(-50%) translateY(-50%);' + '   transform: translateX(-50%) translateY(-50%);' + '}' + '' + '.arrow {' + '   display: none;' + '}');
	            }
	
	            scope.$watch(function () {
	                var offset = $uibPosition.offset(element),
	                    isOpen = offset.width && offset.height;
	
	                if (isOpen && !step.config('orphan') && step.config('scrollIntoView') && !isScrolling) {
	                    isScrolling = true;
	                    smoothScroll(element[0], {
	                        offset: scrollOffset,
	                        callbackAfter: function callbackAfter() {
	                            isScrolling = false;
	                        }
	                    });
	                }
	            });
	        }
	    };
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	var angular=window.angular,ngModule;
	try {ngModule=angular.module(["bm.uiTour"])}
	catch(e){ngModule=angular.module("bm.uiTour",[])}
	var v1="<div class=\"arrow\"></div>\n<div class=\"popover-inner tour-step-inner\">\n<h3 class=\"popover-title tour-step-title\" ng-bind=\"uibTitle\" ng-if=\"uibTitle\"></h3>\n<div class=\"popover-content tour-step-content\" uib-tooltip-template-transclude=\"originScope().tourStep.config('templateUrl') || 'tour-step-template.html'\" tooltip-template-transclude-scope=\"originScope()\"></div>\n</div>\n";
	var id1="tour-step-popup.html";
	var inj=angular.element(window.document).injector();
	if(inj){inj.get("$templateCache").put(id1,v1);}
	else{ngModule.run(["$templateCache",function(c){c.put(id1,v1)}]);}
	module.exports=v1;

/***/ },
/* 16 */
/***/ function(module, exports) {

	var angular=window.angular,ngModule;
	try {ngModule=angular.module(["bm.uiTour"])}
	catch(e){ngModule=angular.module("bm.uiTour",[])}
	var v1="<div>\n<div class=\"popover-content tour-step-content\" ng-bind-html=\"tourStep.trustedContent\"></div>\n<div class=\"popover-navigation tour-step-navigation\">\n<div class=\"btn-group\">\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-if=\"tourStep.isPrev()\" ng-click=\"tour.prev()\">&laquo; Prev</button>\n<button type=\"button\" class=\"btn btn-sm btn-default\" ng-if=\"tourStep.isNext()\" ng-click=\"tour.next()\">Next &raquo;</button>\n<button type=\"button\" class=\"btn btn-sm btn-default\" data-role=\"pause-resume\" data-pause-text=\"Pause\" data-resume-text=\"Resume\" ng-click=\"tour.pause()\">Pause\n</button>\n</div>\n<button type=\"button\" class=\"btn btn-sm btn-default\" data-role=\"end\" ng-click=\"tour.end()\">End tour</button>\n</div>\n</div>\n";
	var id1="tour-step-template.html";
	var inj=angular.element(window.document).injector();
	if(inj){inj.get("$templateCache").put(id1,v1);}
	else{ngModule.run(["$templateCache",function(c){c.put(id1,v1)}]);}
	module.exports=v1;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=angular-ui-tour.js.map