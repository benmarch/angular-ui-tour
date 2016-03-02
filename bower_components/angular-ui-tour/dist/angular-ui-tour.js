/* global Tour: false */

(function angularUITour(app) {
    'use strict';

    app.config(['$uibTooltipProvider', function ($uibTooltipProvider) {
        $uibTooltipProvider.setTriggers({
            'uiTourShow': 'uiTourHide'
        });
    }]);

}(angular.module('bm.uiTour', ['ngSanitize', 'ui.bootstrap', 'smoothScroll', 'ezNg'])));

(function (app) {
    'use strict';

    app.factory('uiTourBackdrop', ['TourConfig', '$document', '$uibPosition', '$window', function (TourConfig, $document, $uibPosition, $window) {

        var service = {},
            $body = angular.element($document[0].body),
            $backdrop = angular.element($document[0].createElement('div')),
            $clone,
            preventDefault = function (e) {
                e.preventDefault();
            };

        (function createNoScrollingClass() {
            var name = '.no-scrolling',
                rules = 'height: 100%; overflow: hidden;',
                style = document.createElement('style');
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);

            if(!style.sheet && !style.sheet.insertRule) {
                (style.styleSheet || style.sheet).addRule(name, rules);
            } else {
                style.sheet.insertRule(name + '{' + rules + '}', 0);
            }
        }());



        function preventScrolling() {
            $body.addClass('no-scrolling');
            $body.on('touchmove', preventDefault);
        }

        function allowScrolling() {
            $body.removeClass('no-scrolling');
            $body.off('touchmove', preventDefault);
        }

        $backdrop.css({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: TourConfig.get('backdropZIndex'),
            backgroundColor: 'rgba(0, 0, 0, .5)',
            display: 'none'
        });

        $body.append($backdrop);

        service.createForElement = function (element, shouldPreventScrolling, isFixedElement) {
            var position;
            $clone = element.clone();
            $backdrop.css('display', 'block');
            $body.append($clone);
            $clone.css('zIndex', TourConfig.get('backdropZIndex') + 1);
            position = $uibPosition.offset(element);
            $clone.css({
                position: isFixedElement ? 'fixed': 'absolute',
                top: position.top + 'px',
                left: position.left + 'px',
                height: position.height + 'px',
                width: position.width + 'px',
                marginTop: 0,
                marginLeft: 0,
                backgroundColor: $body.css('backgroundColor') || '#FFFFFF'
            });
            if (shouldPreventScrolling) {
                preventScrolling();
            }
        };

        service.hide = function () {
            $backdrop.css('display', 'none');
            $clone.remove();
            allowScrolling();
        };

        return service;

    }]);

}(angular.module('bm.uiTour')));

/* global angular: false */

(function (app) {
    'use strict';

    app.provider('TourConfig', [function () {

        var config = {
            placement: 'top',
            animation: true,
            popupDelay: 1,
            closePopupDelay: 0,
            enable: true,
            appendToBody: false,
            tooltipClass: '',
            orphan: false,
            backdrop: false,
            backdropZIndex: 10000,
            scrollOffset: 100,

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
                return angular.copy(config);
            };

            //wrap functions with promises
            (function () {
                angular.forEach(config, function (value, key) {
                    if (key.indexOf('on') === 0 && angular.isFunction(value)) {
                        config[key] = function () {
                            return $q.resolve(value());
                        };
                    }
                });
            }());

            return service;

        }];

    }]);

}(angular.module('bm.uiTour')));

/* global angular: false, Tour: false */

(function (app) {
    'use strict';

    app.controller('TourController', ['$timeout', '$q', '$filter', 'TourConfig', 'uiTourBackdrop', function ($timeout, $q, $filter, TourConfig, uiTourBackdrop) {

        var self = this,
            stepList = [],
            currentStep = null,
            resumeWhenFound,
            statuses = {
                OFF: 0,
                ON: 1,
                PAUSED: 2
            },
            tourStatus = statuses.OFF,
            options = TourConfig.getAll();

        function digest() {
            return $q(function (resolve) {
                $timeout(resolve);
            });
        }

        /**
         * just some promise sugar
         * @param funcs - array of functions that return promises
         * @returns {promise}
         */
        function serial(funcs) {
            var promise = funcs.shift()();
            funcs.forEach(function (func) {
                promise = promise.then(func);
            });
            return promise;
        }

        /**
         * is there a next step
         *
         * @returns {boolean}
         */
        function isNext() {
            var current = self.getCurrentStep(),
                next = self.getNextStep();

            return !!(next || current.nextPath);
        }

        /**
         * is there a previous step
         *
         * @returns {boolean}
         */
        function isPrev() {
            var current = self.getCurrentStep(),
                prev = self.getPrevStep();

            return !!(prev || current.prevPath);
        }

        /**
         * Adds a step to the tour in order
         *
         * @param {object} step
         */
        self.addStep = function (step) {
            if (~stepList.indexOf(step)) {
                return;
            }
            stepList.push(step);
            stepList = $filter('orderBy')(stepList, 'order');
            if (resumeWhenFound) {
                resumeWhenFound(step);
            }
        };

        /**
         * Removes a step from the tour
         *
         * @param step
         */
        self.removeStep = function (step) {
            stepList.splice(stepList.indexOf(step), 1);
        };

        /**
         * if a step's order was changed, replace it in the list
         * @param step
         */
        self.reorderStep = function (step) {
            self.removeStep(step);
            self.addStep(step);
        };

        /**
         * starts the tour
         */
        self.start = function () {
            if (options.onStart) {
                options.onStart();
            }
            self.setCurrentStep(stepList[0]);
            tourStatus = statuses.ON;
            self.showStep(self.getCurrentStep());
        };

        /**
         * ends the tour
         */
        self.end = function () {
            if (self.getCurrentStep()) {
                self.hideStep(self.getCurrentStep());
            }
            if (options.onEnd) {
                options.onEnd();
            }
            self.setCurrentStep(null);
            tourStatus = statuses.OFF;
        };

        /**
         * pauses the tour
         */
        self.pause = function () {
            if (options.onPause) {
                options.onPause();
            }
            tourStatus = statuses.PAUSED;
            self.hideStep(self.getCurrentStep());
        };

        /**
         * resumes a paused tour or starts it
         */
        self.resume = function () {
            if (options.onResume) {
                options.onResume();
            }
            tourStatus = statuses.ON;
            self.showStep(self.getCurrentStep());
        };

        /**
         * move to next step
         * @returns {promise}
         */
        self.next = function () {
            var step = self.getCurrentStep();
            return serial([
                step.config('onNext') || $q.resolve,
                function () {
                    return self.hideStep(step);
                },
                function () {
                    //check if redirect happened, if not, set the next step
                    if (!step.nextStep || self.getCurrentStep().stepId !== step.nextStep) {
                        self.setCurrentStep(self.getNextStep());
                    }
                },
                function () {
                    if (self.getCurrentStep()) {
                        return self.showStep(self.getCurrentStep());
                    } else {
                        self.end();
                    }
                }
            ]);
        };

        /**
         * move to previous step
         * @returns {promise}
         */
        self.prev = function () {
            var step = self.getCurrentStep();
            return serial([
                step.config('onPrev') || $q.resolve,
                function () {
                    return self.hideStep(step);
                },
                function () {
                    //check if redirect happened, if not, set the prev step
                    if (!step.prevStep || self.getCurrentStep().stepId !== step.prevStep) {
                        self.setCurrentStep(self.getPrevStep());
                    }
                },
                function () {
                    if (self.getCurrentStep()) {
                        return self.showStep(self.getCurrentStep());
                    } else {
                        self.end();
                    }
                }
            ]);
        };

        /**
         * show supplied step
         * @param step
         * @returns {promise}
         */
        self.showStep = function (step) {
            return serial([
                step.config('onShow') || $q.resolve,
                function () {
                    if (step.config('backdrop')) {
                        uiTourBackdrop.createForElement(step.element, step.preventScrolling, step.fixed);
                    }
                    return $q.resolve();
                },
                function () {
                    return $q(function (resolve) {
                        step.element[0].dispatchEvent(new CustomEvent('uiTourShow'));
                        resolve();
                    });
                },
                digest,
                step.config('onShown') || $q.resolve,
                function () {
                    step.isNext = isNext();
                    step.isPrev = isPrev();
                    return $q.resolve();
                }
            ]);
        };

        /**
         * hides the supplied step
         * @param step
         * @returns {promise}
         */
        self.hideStep = function (step) {
            return serial([
                step.config('onHide') || $q.resolve,
                function () {
                    return $q(function (resolve) {
                        step.element[0].dispatchEvent(new CustomEvent('uiTourHide'));
                        resolve();
                    });
                },
                function () {
                    if (step.config('backdrop')) {
                        uiTourBackdrop.hide();
                    }
                    return $q.resolve();
                },
                digest,
                step.config('onHidden') || $q.resolve
            ]);
        };

        /**
         * return current step or null
         * @returns {step}
         */
        self.getCurrentStep = function () {
            return currentStep;
        };

        /**
         * set the current step (doesnt do anything else)
         */
        self.setCurrentStep = function (step) {
            currentStep = step;
        };

        /**
         * return next step or null
         * @returns {step}
         */
        self.getNextStep = function () {
            if (!self.getCurrentStep()) {
                return null;
            }
            return stepList[stepList.indexOf(self.getCurrentStep()) + 1];
        };

        /**
         * return previous step or null
         * @returns {step}
         */
        self.getPrevStep = function () {
            if (!self.getCurrentStep()) {
                return null;
            }
            return stepList[stepList.indexOf(self.getCurrentStep()) - 1];
        };

        /**
         * Tells the tour to pause while ngView loads
         *
         * @param waitForStep
         */
        self.waitFor = function (waitForStep) {
            self.pause();
            resumeWhenFound = function (step) {
                if (step.stepId === waitForStep) {
                    self.setCurrentStep(stepList[stepList.indexOf(step)]);
                    self.resume();
                    resumeWhenFound = null;
                }
            };
        };

        /**
         * Returns the value for specified option
         *
         * @param {string} option Name of option
         * @returns {*}
         */
        self.config = function (option) {
            return options[option];
        };

        /**
         * pass options from directive
         * @param opts
         * @returns {self}
         */
        self.init = function (opts) {
            options = angular.extend(options, opts);
            self.options = options;
            return self;
        };

        //some debugging functions
        self._getSteps = function () {
            return stepList;
        };
        self._getStatus = function () {
            return tourStatus;
        };
    }]);

}(angular.module('bm.uiTour')));

/* global angular: false */

(function (app) {
    'use strict';

    app.directive('uiTour', ['TourHelpers', function (TourHelpers) {

        return {
            restrict: 'EA',
            scope: true,
            controller: 'TourController',
            link: function (scope, element, attrs, ctrl) {

                //Pass static options through or use defaults
                var tour = {},
                    events = 'onReady onStart onEnd onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                    properties = 'placement animation popupDelay closePopupDelay enable appendToBody tooltipClass orphan backdrop scrollOffset'.split(' ');

                //Pass interpolated values through
                TourHelpers.attachInterpolatedValues(attrs, tour, properties, 'uiTour');

                //Attach event handlers
                TourHelpers.attachEventHandlers(scope, attrs, tour, events, 'uiTour');

                //If there is an options argument passed, just use that instead
                if (attrs[TourHelpers.getAttrName('options')]) {
                    angular.extend(tour, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                }

                //Initialize tour
                scope.tour = ctrl.init(tour);
                if (typeof tour.onReady === 'function') {
                    tour.onReady();
                }
            }
        };

    }]);

}(angular.module('bm.uiTour')));

/* global angular: false */

(function (app) {
    'use strict';

    app.factory('TourHelpers', ['$templateCache', '$http', '$compile', '$location', 'TourConfig', '$q', function ($templateCache, $http, $compile, $location, TourConfig, $q) {

        var helpers = {},
            safeApply;

        /**
         * Helper function that calls scope.$apply if a digest is not currently in progress
         * Borrowed from: https://coderwall.com/p/ngisma
         *
         * @param {$rootScope.Scope} scope
         * @param {Function} fn
         */
        safeApply = helpers.safeApply = function(scope, fn) {
            var phase = scope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
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
         * Helper function that attaches event handlers to options
         *
         * @param {$rootScope.Scope} scope
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         * @param {Array} events
         * @param {boolean} prefix - used only by the tour directive
         */
        helpers.attachEventHandlers = function (scope, attrs, options, events, prefix) {

            angular.forEach(events, function (eventName) {
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

            angular.forEach(keys, function (key) {
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
                    $location.path(path);
                    resolve();
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

    }]);

}(angular.module('bm.uiTour')));

/* global angular: false */

(function (app) {
    'use strict';

    app.directive('tourStep', ['TourConfig', 'TourHelpers', '$uibTooltip', '$q', '$sce', function (TourConfig, TourHelpers, $uibTooltip, $q, $sce) {

        var tourStepDef = $uibTooltip('tourStep', 'tourStep', 'uiTourShow', {
            popupDelay: 1 //needs to be non-zero for popping up after navigation
        });

        return {
            restrict: 'EA',
            scope: true,
            require: '^uiTour',
            compile: function (tElement, tAttrs) {

                if (!tAttrs.tourStep) {
                    tAttrs.$set('tourStep', '\'PH\''); //a placeholder so popup will show
                }

                var tourStepLinker = tourStepDef.compile(tElement, tAttrs);

                return function (scope, element, attrs, ctrl) {

                    //Assign required options
                    var step = {
                            element: element,
                            stepId: attrs.tourStep,
                            enabled: true,
                            config: function (option) {
                                if (angular.isDefined(step[option])) {
                                    return step[option];
                                }
                                return ctrl.config(option);
                            }
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev'.split(' '),
                        options = 'content title animation placement backdrop orphan popupDelay popupCloseDelay fixed preventScrolling nextStep prevStep nextPath prevPath scrollOffset'.split(' '),
                        orderWatch,
                        enabledWatch;

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
                        ctrl.reorderStep(step);
                    });
                    enabledWatch = attrs.$observe(TourHelpers.getAttrName('enabled'), function (isEnabled) {
                        step.enabled = isEnabled === 'true';
                        if (isEnabled === 'true') {
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
                        angular.extend(step, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
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
                    ctrl.addStep(step);
                    scope.tourStep = step;
                    scope.tour = scope.tour || ctrl;
                    tourStepLinker(scope, element, attrs);

                    //clean up when element is destroyed
                    scope.$on('$destroy', function () {
                        ctrl.removeStep(step);
                        orderWatch();
                        enabledWatch();
                    });
                };
            }
        };

    }]);

    app.directive('tourStepPopup', ['TourConfig', 'smoothScroll', 'ezComponentHelpers', function (TourConfig, smoothScroll, ezComponentHelpers) {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&', originScope: '&'},
            templateUrl: 'tour-step-popup.html',
            link: function (scope, element) {
                var step = scope.originScope().tourStep,
                    ch = ezComponentHelpers.apply(null, arguments),
                    scrollOffset = step.config('scrollOffset');

                element.css('zIndex', TourConfig.get('backdropZIndex') + 2);
                if (step.fixed) {
                    element.css('position', 'fixed');
                }

                if (step.config('orphan')) {
                    ch.useStyles(
                        '.tour-step {' +
                        '   position: fixed;' +
                        '   top: 50% !important;' +
                        '   left: 50% !important;' +
                        '   margin: 0 !important;' +
                        '   -ms-transform: translateX(-50%) translateY(-50%);' +
                        '   -moz-transform: translateX(-50%) translateY(-50%);' +
                        '   -webkit-transform: translateX(-50%) translateY(-50%);' +
                        '   transform: translateX(-50%) translateY(-50%);' +
                        '}' +
                        '' +
                        '.arrow {' +
                        '   display: none;' +
                        '}'
                    );
                }

                scope.$watch('isOpen', function (isOpen) {
                    if (isOpen() && !step.config('orphan')) {
                        smoothScroll(element[0], {
                            offset: scrollOffset
                        });
                    }
                });
            }
        };
    }]);

}(angular.module('bm.uiTour')));

angular.module('bm.uiTour').run(['$templateCache', function($templateCache) {
  $templateCache.put("tour-step-popup.html",
    "<div class=\"popover tour-step\"\n" +
    "     tooltip-animation-class=\"fade\"\n" +
    "     uib-tooltip-classes\n" +
    "     ng-class=\"{ in: isOpen() }\">\n" +
    "    <div class=\"arrow\"></div>\n" +
    "\n" +
    "    <div class=\"popover-inner tour-step-inner\">\n" +
    "        <h3 class=\"popover-title tour-step-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
    "        <div class=\"popover-content tour-step-content\"\n" +
    "             uib-tooltip-template-transclude=\"originScope().tourStep.config('templateUrl') || 'tour-step-template.html'\"\n" +
    "             tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("tour-step-template.html",
    "<div>\n" +
    "    <div class=\"popover-content tour-step-content\" ng-bind-html=\"tourStep.trustedContent\"></div>\n" +
    "    <div class=\"popover-navigation tour-step-navigation\">\n" +
    "        <div class=\"btn-group\">\n" +
    "            <button class=\"btn btn-sm btn-default\" ng-if=\"tourStep.isPrev\" ng-click=\"tour.prev()\">&laquo; Prev</button>\n" +
    "            <button class=\"btn btn-sm btn-default\" ng-if=\"tourStep.isNext\" ng-click=\"tour.next()\">Next &raquo;</button>\n" +
    "            <button class=\"btn btn-sm btn-default\" data-role=\"pause-resume\" data-pause-text=\"Pause\"\n" +
    "                    data-resume-text=\"Resume\" ng-click=\"tour.pause()\">Pause\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-sm btn-default\" data-role=\"end\" ng-click=\"tour.end()\">End tour</button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

(function (window) {
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})(window);
