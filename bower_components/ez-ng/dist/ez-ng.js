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
    module.factory('ezComponentHelpers', ['$http', '$templateCache', '$compile', '$document', '$window', function ($http, $templateCache, $compile, $document, $window) {

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
             * thanks to a fantastic script by PM5544 (https://github.com/PM5544/scoped-polyfill). Note that the element itself
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
                var el = $document[0].createElement('style'),
                    wrapper = angular.element($document[0].createElement('scopedstylewrapper'));

                el.type = 'text/css';
                el.scoped = true;
                el.setAttribute('scoped', 'scoped');

                if (el.styleSheet){
                    el.styleSheet.cssText = styles;
                } else {
                    el.appendChild($document[0].createTextNode(styles));
                }

                element.after(wrapper);
                wrapper.append(element);
                wrapper.append(el);
                $window.scopedPolyFill(el);
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
     * See [Angular's Component documentation](https://docs.angularjs.org/api/ng/provider/$compileProvider#component)
     * for all options.
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

var scopedPolyFill = (function (doc, undefined) {

    // check for support of scoped and certain option
    var compat = (function () {
        var check = doc.createElement('style')
            , DOMStyle = 'undefined' !== typeof check.sheet ? 'sheet' : 'undefined' !== typeof check.getSheet ? 'getSheet' : 'styleSheet'
            , scopeSupported = undefined !== check.scoped
            , testSheet
            , DOMRules
            , testStyle
            ;

        // we need to append it to the DOM because the DOM element at least FF keeps NULL as a sheet utill appended
        // and we can't check for the rules / cssRules and changeSelectorText untill we have that
        doc.body.appendChild(check);
        testSheet = check[DOMStyle];

        // add a test styleRule to be able to test selectorText changing support
        // IE doesn't allow inserting of '' as a styleRule
        testSheet.addRule ? testSheet.addRule('c', 'blink') : testSheet.insertRule('c{}', 0);

        // store the way to get to the list of rules
        DOMRules = testSheet.rules ? 'rules' : 'cssRules';

        // cache the test rule (its allways the first since we didn't add any other thing inside this <style>
        testStyle = testSheet[DOMRules][0];

        // try catch it to prevent IE from throwing errors
        // can't check the read-only flag since IE just throws errors when setting it and Firefox won't allow setting it (and has no read-only flag
        try {
            testStyle.selectorText = 'd';
        } catch (e) { }

        // check if the selectorText has changed to the value we tried to set it to
        // toLowerCase() it to account for browsers who change the text
        var changeSelectorTextAllowed = 'd' === testStyle.selectorText.toLowerCase();

        // remove the <style> to clean up
        check.parentNode.removeChild(check);

        // return the object with the appropriate flags
        return {
            scopeSupported: scopeSupported
            , rules: DOMRules
            , sheet: DOMStyle
            , changeSelectorTextAllowed: changeSelectorTextAllowed
        };
    })();

    // scope is supported? just return a function which returns "this" when scoped support is found to make it chainable for jQuery
    if (compat.scopeSupported)
        return function () { return this };

    //window.console && console.log( "No support for <style scoped> found, commencing jumping through hoops in 3, 2, 1..." );

    // this was called so we "scope" all the <style> nodes which need to be scoped now
    var scopedSheets
        , i
        , idCounter = 0
        ;

    if (doc.querySelectorAll) {

        scopedSheets = doc.querySelectorAll('style[scoped]');

    } else {

        var tempSheets = [], scopedAttr;
        scopedSheets = doc.getElementsByTagName('style');
        i = scopedSheets.length;

        while (i--) {
            scopedAttr = scopedSheets[i].getAttribute('scoped');

            if ("scoped" === scopedAttr || "" === scopedAttr)
                tempSheets.push(scopedSheets[i]);
            // Array.prototype.apply doen't work in the browsers this is eecuted for so we have to use array.push()

        }

        scopedSheets = tempSheets;

    }

    i = scopedSheets.length;
    while (i--)
        scopeIt(scopedSheets[i]);

    // make a function so we can return it to enable the "scoping" of other <styles> which are inserted later on for instance
    function scopeIt(styleNode, jQueryItem) {

        // catch the second argument if this was called via the $.each
        if (jQueryItem)
            styleNode = jQueryItem;

        // check if we received a <style> node
        // if not chcek if it's a jQuery object and go from there
        // if no <style> and no jQuery? return to avoid errors
        if (!styleNode.nodeName) {

            if (!styleNode.jquery)
                return;
            else
                return styleNode.each(scopeIt);

        }

        if ('STYLE' !== styleNode.nodeName)
            return;

        // init some vars
        var parentSheet = styleNode[compat.sheet]
            , allRules = parentSheet[compat.rules]
            , par = styleNode.parentNode
            , id = par.id || (par.id = 'scopedByScopedPolyfill_' + ++idCounter)
            , glue = ''
            , index = allRules.length || 0
            , rule
            ;

        // get al the ids from the parents so we are as specific as possible
        // if no ids are found we always have the id which is placed on the <style>'s parentNode
        while (par) {

            if (par.id)
            //if id begins with a number, we have to apply css escaping
                if (parseInt(par.id.slice(0, 1))) {
                    glue = '#\\3' + par.id.slice(0, 1) + ' ' + par.id.slice(1) + ' ' + glue;
                } else {
                    glue = '#' + par.id + ' ' + glue;
                }

            par = par.parentNode;

        }

        // iterate over the collection from the end back to account for IE's inability to insert a styleRule at a certain point
        // it can only add them to the end...
        while (index--) {

            rule = allRules[index];
            processCssRules(rule, index);

        }

        //recursively process cssRules
        function processCssRules(parentRule, index) {
            var sheet = parentRule.cssRules ? parentRule : parentSheet
                , allRules = parentRule.cssRules || [parentRule]
                , i = allRules.length || 0
                , ruleIndex = parentRule.cssRules ? i : index
                , rule
                , selector
                , styleRule
                ;

            // iterate over the collection from the end back to account for IE's inability to insert a styleRule at a certain point
            // it can only add them to the end...
            while (i--) {

                rule = allRules[i];
                if (rule.selectorText) {

                    selector = glue + ' ' + rule.selectorText.split(',').join(', ' + glue);

                    // replace :root by the scoped element
                    selector = selector.replace(/[\ ]+:root/gi, '');

                    // we can just change the selectorText for this one
                    if (compat.changeSelectorTextAllowed) {

                        rule.selectorText = selector;

                    } else {// or we need to remove the rule and add it back in if we cant edit the selectorText

                        /*
                         * IE only adds the normal rules to the array (no @imports, @page etc)
                         * and also does not have a type attribute so we check if that exists and execute the old IE part if it doesn't
                         * all other browsers have the type attribute to show the type
                         *  1 : normal style rules  <---- use these ones
                         *  2 : @charset
                         *  3 : @import
                         *  4 : @media
                         *  5 : @font-face
                         *  6 : @page rules
                         *
                         */
                        if (!rule.type || 1 === rule.type) {

                            styleRule = rule.style.cssText;
                            // IE doesn't allow inserting of '' as a styleRule
                            if (styleRule) {
                                sheet.removeRule ? sheet.removeRule(ruleIndex) : sheet.deleteRule(ruleIndex);
                                sheet.addRule ? sheet.addRule(selector, styleRule, ruleIndex) : sheet.insertRule(selector + '{' + styleRule + '}', ruleIndex);
                            }
                        }
                    }
                } else if (rule.cssRules) {
                    processCssRules(rule, ruleIndex);
                }
            }

        }
    }

    // Expose it as a jQuery function for convenience
    if (typeof jQuery === "function" && typeof jQuery.fn === "object") {
        jQuery.fn.scopedPolyFill = function () {
            return this.each(scopeIt);
        }
    }

    return scopeIt;

})(document);

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
