/*global angular:false*/
(function () {
  'use strict';

    /**
     * @ngdoc module
     * @module ezNg
     * @name ezNg
     *
     * @description
     * A collection of very simple utilities that make developing AngularJS apps much easier.
     *
     */

}(angular.module('ezNg', [])));

/* global angular:false */
(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @kind service
     * @name module:ezNg.ezComponentHelpers
     *
     * @description
     * Provides a few functions that can be used with directives to provide easy access to templates and styles.
     * Use in a directive's link function or component's controller. The factory function takes the same arguments
     * as a link function.
     *
     * @example
     * ```js
     * //in a link function:
     * //...
     * link: function (scope, element, attrs, ctrl, transclude) {
     *     let ch = ezComponentHelpers.apply(null, arguments); //or just invoke directly like ezComponentHelpers(scope, element...)
     *
     *     ch.useTemplate('<span>Hello, World!</span');
     * }
     * //...
     *
     * //in a controller:
     * //...
     * controller: ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude) {
     *     let ch = ezComponentHelpers($scope, $element, $attrs, this, $transclude);
     *
     *     ch.useTemplate('<span>Hello, World!</span');
     * }
     * //...
     * ```
     */
    module.factory('ezComponentHelpers', ['$http', '$templateCache', '$compile', '$document', function ($http, $templateCache, $compile, $document) {

        return function (scope, element, attrs, ctrl, transclude) {

            var helpers = {};

            /**
             * @ngdoc method
             * @name module:ezNg.ezComponentHelpers#useTemplate
             * @method
             *
             * @description
             * Takes a HTML template string and replaces the contents of element with a compiled and linked DOM tree
             *
             * @example
             * ```js
             * let ch = ezComponentHelpers.apply(null, arguments);
             *
             * ch.useTemplate('<span>Hello, World!</span>');
             * ```
             *
             * ```html
             * <!-- Result: -->
             * <my-component>
             *     <span>Hello, World!</span>
             * </my-component>
             * ```
             */
            helpers.useTemplate = function (template) {
                var newElement = $compile(template, transclude)(scope);

                element.empty();
                element.append(newElement);
            };

            /**
             * @ngdoc method
             * @name module:ezNg.ezComponentHelpers#useTemplateUrl
             * @method
             *
             * @description
             * Takes a URL that resolves to a HTML template string and replaces the contents of element with a compiled and linked DOM tree.
             * The result is the same as using {@link module:ezNg.ezComponentHelpers#useTemplate} but does not require and inline template.
             *
             * @example
             * ```js
             * let ch = ezComponentHelpers.apply(null, arguments);
             *
             * ch.useTemplateUrl('/components/my-component/template.html'); //<span>Hello, World!</span>
             * ```
             *
             * ```html
             * <!-- Result: -->
             * <my-component>
             *     <span>Hello, World!</span>
             * </my-component>
             * ```
             *
             * @returns {Promise} Resolves after contents have been compile, linked, and appended to the element
             */
            helpers.useTemplateUrl = function (url) {
                return $http.get(url, {
                    cache: $templateCache
                }).success(function (template) {
                    helpers.useTemplate(template);
                });
            };

            /**
             * @ngdoc method
             * @name module:ezNg.ezComponentHelpers#useStyles
             * @method
             *
             * @description
             * Takes a string of CSS styles and adds them to the element. The styles become scoped to the element
             * thanks to a fantastic script by Rich Tibbett (http://github.com/richtr). Note that the element itself
             * will also be affected by the scoped styles. Styles are applied after a browser event cycle.
             *
             * @example
             * ```js
             * let ch = ezComponentHelpers.apply(null, arguments);
             *
             * ch.useStyles('.my-class { color: red; }');
             * ```
             *
             * ```html
             * <!-- Result: -->
             * <span class="my-class">This text is black</span>
             * <my-component>
             *     <span class="my-class">This text is red</span>
             * </my-component>
             * ```
             */
            helpers.useStyles = function (styles) {
                var el = $document[0].createElement('style');

                el.type = 'text/css';
                el.scoped = true;
                el.setAttribute('scoped', 'scoped');

                if (el.styleSheet){
                    el.styleSheet.cssText = styles;
                } else {
                    el.appendChild($document[0].createTextNode(styles));
                }

                element.append(el);
            };

            /**
             * @ngdoc method
             * @name module:ezNg.ezComponentHelpers#useStylesUrl
             * @method
             *
             * @description
             * Takes a URL that resolves to CSS styles and adds them to the element. The results are the same as
             * {@link module:ezNg.ezComponentHelpers#useStyles}.
             *
             * @example
             * ```js
             * let ch = ezComponentHelpers.apply(null, arguments);
             *
             * ch.useStylesUrl('/components/my-component/styles.css'); //.my-class { color: red; }
             * ```
             *
             * ```html
             * <!-- Result: -->
             * <span class="my-class">This text is black</span>
             * <my-component>
             *     <span class="my-class">This text is red</span>
             * </my-component>
             * ```
             *
             * @returns {Promise} resolves after styles have been added but before they have been applied
             */
            helpers.useStylesUrl = function (url) {
                return $http.get(url, {
                    cache: $templateCache
                }).success(function (styles) {
                    helpers.useStyles(styles);
                });
            };

            return helpers;

        };

    }]);

}(angular.module('ezNg')));

/* global angular: false */
(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @name module:ezNg.ezComponent
     *
     * @function
     * @param {object} options Options to pass into directive definition
     *
     * @description
     * Shim for angular 1.5's component service (copied from AngularJs source)
     * https://github.com/angular/angular.js/blob/master/src/ng/compile.js
     *
     * Additionally provides styles and stylesUrl options for injecting "scoped" styles. See component-helpers.js
     *
     * Does not support the one-way binding operator ('<') in versions < 1.5
     *
     * @example
     * ```js
     * module.directive('myComponent', ['ezComponent', function (ezComponent) {
     *
     *     return ezComponent({
     *         bindings: {
     *             watched: '=',
     *             input: '@',
     *             output: '&'
     *         },
     *         styles: '.my-component { color: red; }',
     *         //OR
     *         stylesUrl: 'components/my-component/my-component.css'
     *     });
     *
     * }]);
     * ```
     */
    module.factory('ezComponent', ['$injector', 'ezComponentHelpers', function ($injector, ch) {

        var CNTRL_REG = /^(\S+)(\s+as\s+([\w$]+))?$/;
        function identifierForController(controller, ident) {
            if (ident && angular.isString(ident)) {
                return ident;
            }
            if (angular.isString(controller)) {
                var match = CNTRL_REG.exec(controller);
                if (match) {
                    return match[3];
                }
            }
        }

        return function (options) {
            var controller = options.controller || function() {},
                template = (!options.template && !options.templateUrl ? '' : options.template);

            function makeInjectable(fn) {
                if (angular.isFunction(fn) || angular.isArray(fn)) {
                    return function(tElement, tAttrs) {
                        return $injector.invoke(fn, this, {$element: tElement, $attrs: tAttrs});
                    };
                } else {
                    return fn;
                }
            }

            return {
                controller: controller,
                controllerAs: identifierForController(options.controller) || options.controllerAs || '$ctrl',
                template: makeInjectable(template),
                templateUrl: makeInjectable(options.templateUrl),
                transclude: options.transclude,
                scope: {},
                bindToController: options.bindings || {},
                restrict: 'E',
                require: options.require,
                compile: function (tElement, tAttrs) {
                    if (options.styles) {
                        ch(null, tElement).useStyles(options.styles);
                    } else if (options.stylesUrl) {
                        ch(null, tElement).useStylesUrl(options.stylesUrl);
                    }
                    if (options.compile) {
                        options.compile.apply(this, arguments);
                    }
                }
            };

        };

    }]);
}(angular.module('ezNg')));

/*global angular:false*/
(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @kind service
     * @name module:ezNg.ezEventEmitter
     *
     * @description
     * Provides a simple event emitter that is *not* hooked into the Scope digest cycle.
     *
     */
    module.factory('ezEventEmitter', ['$log', function ($log) {

        var factory = {};

        /**
         * @name module:ezNg.ezEventEmitter~EventEmitter
         * @alias EventEmitter
         * @kind interface
         *
         * @description
         * Describes a simple event emitter
         */

        function createEmitter(name) {

            var handlers = {},
                emitter = {
                    _name: name
                };

            /**
             * @name module:ezNg.ezEventEmitter~EventEmitter#on
             * @function
             *
             * @param {string} events Space-separated of events to listen for
             * @param {function} handler Function to invoke when event is triggered
             *
             * @description
             * Registers a listener for a specific event or multiple events
             *
             * @example
             * ```js
             * let emitter = ezEventEmitter.create();
             *
             * emitter.on('someEvent', function (arg1, arg2) {
             *     console.log(arg1); //hello
             *     console.log(arg2); //world
             * });
             *
             * emitter.emit('someEvent', 'hello', 'world');
             * ```
             */
            emitter.on = function (events, handler) {
                var eventNames = events.split(' ');
                angular.forEach(eventNames, function (eventName) {
                    if (!handlers[eventName]) {
                        handlers[eventName] = [];
                    }
                    handlers[eventName].push(handler);
                    $log.debug('Added handler for event '+ eventName + ' to emitter ' + emitter.name || '(anonymous)');
                });
            };


            /**
             * @name module:ezNg.ezEventEmitter~EventEmitter#once
             * @function
             *
             * @param {string} events Space-separated of events to listen for
             * @param {function} handler Function to invoke when event is triggered for the first time
             *
             * @description
             * Registers a listener for a specific event or multiple events, and immediately cancels the listener
             * after it is invoked the first time
             *
             * @example
             * ```js
             * let emitter = ezEventEmitter.create(),
             *     count = 0;
             *
             * emitter.once('inc', function () {
             *     console.log('Current count: ' + (++count));
             * });
             *
             * emitter.emit('inc'); // Current count: 1
             * emitter.emit('inc'); //
             * ```
             */
            emitter.once = function (events, handler) {
                $log.debug('Added one-time handler for event '+ events + ' to emitter ' + emitter.name || '(anonymous)');
                handler.onlyOnce = true;
                emitter.on(events, handler);
            };


            /**
             * @name module:ezNg.ezEventEmitter~EventEmitter#off
             * @function
             *
             * @param {string} events Space-separated of events to remove listeners for
             * @param {function} handler Reference to listener to cancel
             *
             * @description
             * Cancels listeners for specified event(s)
             *
             * @example
             * ```js
             * let emitter = ezEventEmitter.create(),
             *     count = 0,
             *     increment = function () {
             *        console.log('Current count: ' + (++count));
             *     };
             *
             * emitter.on('inc', increment);
             *
             * emitter.emit('inc'); // Current count: 1
             * emitter.emit('inc'); // Current count: 2
             * emitter.off('inc', increment);
             * emitter.emit('inc'); //
             * ```
             */
            emitter.off = function (events, handler) {
                var eventNames = events.split(' ');
                angular.forEach(eventNames, function (eventName) {
                    if (!handlers[eventName]) {
                        return;
                    }
                    handlers[eventName].splice(handlers[eventName].indexOf(handler), 1);
                    $log.debug('Removed handler for event '+ eventName + ' from emitter ' + emitter.name || '(anonymous)');
                });
            };


            /**
             * @name module:ezNg.ezEventEmitter~EventEmitter#emit
             * @function
             *
             * @param {string} eventName Name of event to trigger
             * @param {...any} arguments Arguments to pass to handlers
             *
             * @description
             * Triggers specified event with provided arguments
             *
             * @example
             * ```js
             * let emitter = ezEventEmitter.create();
             *
             * emitter.on('someEvent', function (arg1, arg2) {
             *     console.log(arg1); //hello
             *     console.log(arg2); //world
             * });
             *
             * emitter.emit('someEvent', 'hello', 'world');
             * ```
             */
            emitter.emit = function (eventName/*, arguments*/) {
                var args = Array.prototype.slice.call(arguments),
                    handlerCount = 0;

                args.shift();

                if (handlers[eventName]) {
                    handlerCount = handlers[eventName].length;
                    angular.forEach(handlers[eventName], function (handler) {
                        handler.apply(null, args);
                        if (handler.onlyOnce) {
                            emitter.off(eventName, handler);
                        }
                    });
                }
                $log.debug('Emitted event '+ eventName + ' with emitter ' + emitter.name || '(anonymous)' + '. Invoked ' + handlerCount + ' handlers.');
            };

            return emitter;

        }


        /**
         * @ngdoc method
         * @name module:ezNg.ezEventEmitter#create
         * @method
         *
         * @param {string=} name Optional name for debugging purposes
         * @returns {module:ezNg.ezEventEmitter~EventEmitter}
         *
         * @description
         * Returns a new event emitter with the provided name
         *
         * @example
         * ```js
         * let emitter = ezEventEmitter.create('myEmitter');
         * ```
         */
        factory.create = createEmitter;

        /**
         * @ngdoc method
         * @name module:ezNg.ezEventEmitter#mixin
         * @method
         *
         * @param {Object} object Object to extend with {@link EventEmitter} characteristics
         * @param {string=} name Optional name for debugging purposes
         * @returns {module:ezNg.ezEventEmitter~EventEmitter}
         *
         * @description
         * Returns a new event emitter with the provided name
         *
         * @example
         * ```js
         * let myObject = {},
         *     emitter = ezEventEmitter.mixin(myObject, 'myEmitter');
         *
         * myObject.on('myEvent', function () {});
         * myObject.emit('myEvent');
         * ```
         */
        factory.mixin = function (object, name) {
            return angular.extend(object, createEmitter(name));
        };

        return factory;

    }]);

}(angular.module('ezNg')));

/*!
 * <style scoped> shim
 * http://github.com/richtr
 *
 * Copyright 2012 Rich Tibbett
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date: 8th November 2012
 */

/*
 * DESCRIPTION:
 * ------------
 *
 * Javascript shim for <style scoped> elements.
 *
 * Reference specification ->
 *
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/semantics.html#attr-style-scoped
 *
 * Demo page ->
 *
 * http://fiddle.jshell.net/RZ99U/1/show/light/
 *
 * USAGE:
 * ------
 *
 * 1. Add this file anywhere in your web page (outside of any load event handlers):
 *
 * <script type="text/javascript" src="style_scoped_shim.js"></script>
 *
 *
 * 2. Use <style scoped> elements as normal
 *
 * See the test page linked above for a live example.
 *
 */

(function() {

    document.addEventListener('DOMContentLoaded', function() {

        // Don't run if the UA implicitly supports <style scoped>
        var testEl = document.createElement("style");
        if (testEl.scoped !== undefined && testEl.scoped !== null) return;

        var rewriteCSS = function(el) {

            el._scopedStyleApplied = true;

            var elName = "scopedstylewrapper";
            var elId = "s" + (Math.floor(Math.random() * 1e15) + 1);
            var uid = "." + elId;

            // Wrap a custom HTML container around style[scoped]'s parent node
            var container = el.parentNode;
            if(container == document.body) {
                uid = "body"; // scope CSS rules to <body>
            } else {
                var parent = container.parentNode;
                var wrapper = document.createElement(elName);
                wrapper.className = elId;
                parent.replaceChild(wrapper, container);
                wrapper.appendChild(container);
            }

            // Prefix all CSS rules with uid
            var rewrittenCSS = el.textContent.replace(/(((?:(?:[^,{]+),?)*?)\{(?:([^}:]*):?([^};]*);?)*?\};*)/img, uid + " $1");

            // <style scoped> @-directives rules from WHATWG specification

            // Remove added uid prefix from all CSS @-directives commands
            // since we have no way of scoping @-directives yet
            // e.g. .scopingClass @font-face { ... } does not currently work :(
            rewrittenCSS = rewrittenCSS.replace(new RegExp(uid + "\\s+(@[\\w|-]+)" , 'img'), "$1");
            // Remove @global (to make the @global CSS rule work globally)
            rewrittenCSS = rewrittenCSS.replace("@global", "");
            // Ignore @page directives (not allowed in <style scoped>)
            rewrittenCSS = rewrittenCSS.replace("@page", ".notAllowedInScopedCSS @page");

            el.textContent = rewrittenCSS;
        };

        var extractScopedStyles = function( root ) {
            // Obtain style[scoped] elements from page
            if(root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE)
                return;
            var els = root.querySelectorAll('style[scoped]');
            for (var i = 0, l = els.length; i < l; i++) {
                if(!els[i]._scopedStyleApplied)
                    rewriteCSS(els[i]);
            }
        };

        // Process scoped stylesheets from current page
        extractScopedStyles(document);

        // Listen for scoped stylesheet injection
        document.addEventListener('DOMNodeInserted', function(e) {
            var el = e.target;
            if (el.tagName === "STYLE" && (el.getAttribute("scoped") !== undefined &&
                el.getAttribute("scoped") !== null) && !el._scopedStyleApplied) {
                rewriteCSS(el);
            }
            // Process nested style[scope] elements (if any)
            extractScopedStyles(el);
        }, false);

    }, false);

}());

/*global angular:false*/
(function (module) {
    'use strict';

    /**
     * @name LogLevel
     * @enum {number}
     *
     * @property TRACE
     * @property DEBUG
     * @property INFO
     * @property WARN
     * @property ERROR
     * @property FATAL
     */
    var LogLevel = {
        TRACE: 1,
        DEBUG: 2,
        INFO: 3,
        WARN: 4,
        ERROR: 5,
        FATAL: 6
    };

    /**
     * @ngdoc value
     * @name module:ezNg.ezLoggerLevel
     * @type {LogLevel}
     * @default 'DEBUG'
     *
     * @description
     * Sets the log level for ezLogger
     */
    module.value('ezLoggerLevel', 'DEBUG');

    /**
     * @ngdoc value
     * @name module:ezNg.ezLoggerFormat
     * @type {string}
     * @default '{dateTime}\t{name}\t{level}\t{message}'
     *
     * @description
     * Sets the output format of log statements
     */
    module.value('ezLoggerFormat', '{dateTime}\t{name}\t{level}\t{message}');

    /**
     * @ngdoc value
     * @name module:ezNg.ezLoggerDateTimeFormatter
     * @type {function}
     * @default date.toString();
     *
     * @description
     * Sets the output format of date and time. Function takes the current date (new Date()) and returns a string.
     */
    module.value('ezLoggerDateTimeFormatter', function (date) {
        return date.toString();
    });


    /**
     * @ngdoc service
     * @kind service
     * @name module:ezNg.ezLogger
     *
     * @description
     * Provides a simple abstraction of $log that provides output formatting and level thresholds
     *
     */
    module.factory('ezLogger', ['$window', '$log', 'ezLoggerLevel', 'ezLoggerFormat', 'ezLoggerDateTimeFormatter', 'ezFormatter', function ($window, $log, ezLoggerLevel, ezLoggerFormat, ezLoggerDateTimeFormatter, ezFormatter) {

        var factory = {},
            format = ezFormatter.assoc();

        function getLogLevel(logger) {
            return LogLevel[$window.ezLoggerLevel] || logger.level;
        }

        function log(logger, method, levelName) {
            return function (/*message, args...*/) {
                var args = Array.prototype.slice.call(arguments),
                    message = '';

                if (typeof args[0] === 'string') {
                    message = args.shift();
                }

                if (LogLevel[levelName] >= getLogLevel(logger)) {
                    $log[method].apply($log, [format(logger.format || '', {
                        dateTime: logger.dateTimeFormatter(new Date()),
                        timeStamp: new Date().getTime(),
                        name: logger._name,
                        level: levelName,
                        message: message
                    })].concat(args));
                }
            };
        }


        /**
         * @ngdoc method
         * @name module:ezNg.ezLogger#create
         * @method
         * @returns {module:ezNg.ezLogger~Logger}
         *
         * @description
         * Factory function for creating a new logger with an optional name
         *
         */
        factory.create = function (name) {

            /**
             * @name module:ezNg.ezLogger~Logger
             *
             */
            var logger = {};

            angular.extend(logger, {
                _name: name,
                format: ezLoggerFormat,
                level: LogLevel[ezLoggerLevel],
                dateTimeFormatter: ezLoggerDateTimeFormatter,
                trace: log(logger, 'debug', 'TRACE'),
                debug: log(logger, 'debug', 'DEBUG'),
                info:  log(logger, 'info',  'INFO'),
                warn:  log(logger, 'warn',  'WARN'),
                error: log(logger, 'error', 'ERROR'),
                fatal: log(logger, 'error', 'FATAL'),
                log:   log(logger, 'log',   'INFO')
            });

            /**
             * @name module:ezNg.ezLogger~Logger#setFormat
             * @method
             *
             * @description
             * Sets the log message format for this logger. See {@link module:ezNg.ezLoggerLevel}
             *
             * @param {string} format String containing placeholders for log message properties
             */
            logger.setFormat = function (format) {
                logger.format = format;
            };

            /**
             * @name module:ezNg.ezLogger~Logger#setFormat
             * @method
             *
             * @description
             * Sets the output format of date and time for this logger. See {@link module:ezNg.ezLoggerDateTimeFormatter}
             *
             * @param {function} formatter Function takes the current date (new Date()) and returns a string.
             */
            logger.setDateTimeFormatter = function (formatter) {
                logger.dateTimeFormatter = formatter || ezLoggerDateTimeFormatter;
            };

            /**
             * @name module:ezNg.ezLogger~Logger#setFormat
             * @method
             *
             * @description
             * Sets the log level for this logger.
             *
             * @param {LogLevel} level Threshold log level. See {@link module:ezNg.ezLoggerLevel}
             */
            logger.setLevel = function (level) {
                logger.level = LogLevel[level];
            };

            return logger;
        };

        return factory;

    }]);

}(angular.module('ezNg')));

/*global angular:false*/
(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @kind service
     * @name module:ezNg.ezFormatter
     *
     * @description
     * Provides a simple, easy-to-use string formatter to avoid long string concatenations.
     *
     * There are two types of formatters: associative and indexed.
     *
     */
    module.factory('ezFormatter', [function () {
        var factory = {},
            assocCapture = new RegExp('\\{(.*?)\\}', 'g');

        function zip(arr1, arr2) {
            var newArr = [];
            while (arr1.length && arr2.length) {
                newArr.push(arr1.shift());
                newArr.push(arr2.shift());
            }
            return newArr.concat(arr1).concat(arr2);
        }

        /**
         * @name module:ezNg.ezFormatter~formatFunction
         * @alias formatFunction
         * @function
         *
         * @param {string} placeholders A string containing placeholders to replace
         * @param {array|object} replacements An array for indexed formatters, object for associative formatters
         *      containing replacement values for placeholders
         *
         * @returns {string} Formatted string with placeholders replaced.
         */

        /**
         * @ngdoc method
         * @name module:ezNg.ezFormatter#index
         * @method
         *
         * @description
         * Factory function to return an indexed formatter.
         *
         * The indexed formatter takes a string with unnamed placeholders, and an array whose elements replace each
         * unnamed placeholder in the order that they occur.
         *
         * @example
         * ```js
         * let format = ezFormatter.index(),
         *     placeholder = '{} on {}: {} star(s)!';
         *
         * console.log(format(placeholder, ['Narcos', 'Netflix', 5])); //Narcos on Netflix: 5 star(s)!
         * ```
         *
         * @returns {module:ezNg.ezFormatter~formatFunction} Formatter
         */
        factory.index = function () {
            return function (/*format, replacements...*/) {
                var args = Array.prototype.slice.call(arguments),
                    format = args.shift(),
                    segments = format.split('{}');

                return zip(segments, args).join('');
            };
        };


        /**
         * @ngdoc method
         * @name module:ezNg.ezFormatter#assoc
         * @method
         *
         * @description
         * Factory function to return an associative formatter.
         *
         * The associative formatter takes a string with named placeholders, and an object whose keys are the names
         * of the placeholders and value are the replacement values.
         *
         * @example
         * ```js
         * let format = ezFormatter.assoc(),
         *     placeholder = '{title} on {channel}: {rating} star(s)!';
         *
         * console.log(format(placeholder, {title: 'Narcos', channel: 'Netflix', rating: 5})); //Narcos on Netflix: 5 star(s)!
         * ```
         * @returns {module:ezNg.ezFormatter~formatFunction} Formatter
         */
        factory.assoc = function () {
            return function replace(format, replacements) {
                var captures = format.match(assocCapture);

                if (!captures || !captures.length) {
                    return format;
                }

                replacements = replacements || {};

                angular.forEach(captures, function (capture) {
                    var key = capture.substring(1, capture.length-1),
                        value = replacements[key];

                    format = format.replace(capture, value);
                });

                return replace(format, replacements);
            };
        };

        return factory;

    }]);

}(angular.module('ezNg')));
