/* global Tour: false */

(function angularUITour(app) {
    'use strict';

    app.config(['$uibTooltipProvider', function ($uibTooltipProvider) {
        $uibTooltipProvider.setTriggers({
            'uiTourShow': 'uiTourHide'
        });
    }]);

}(angular.module('bm.uiTour', ['ngSanitize', 'ui.bootstrap', 'smoothScroll'])));

/* global angular: false */

(function (app) {
    'use strict';

    app.provider('TourConfig', [function () {

        var config = {
            placement: 'top',
            animation: true,
            popupDelay: 1,
            closePopupDelay: 0,
            trigger: 'uiTourShow',
            enable: true,
            appendToBody: false,
            tooltipClass: '',
            orphan: false,
            backdrop: false,

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

        this.$get = [function () {

            var service = {};

            service.get = function (option) {
                return config[option];
            };

            service.getAll = function () {
                return angular.copy(config);
            };

            return service;

        }];

    }]);

}(angular.module('bm.uiTour')));

/* global angular: false, Tour: false */

(function (app) {
    'use strict';

    app.controller('TourController', ['$q', 'TourConfig', function ($q, TourConfig) {

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
                next = self.getNextStepElement();

            return !!((next && next.enabled) || current.nextPath);
        }

        /**
         * is there a previous step
         *
         * @returns {boolean}
         */
        function isPrev() {
            var current = self.getCurrentStep(),
                prev = self.getPrevStepElement();

            return !!((prev && prev.enabled) || current.prevPath);
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
            var insertBeforeIndex = 0;
            stepList.forEach(function (stepElement, index) {
                if (step.order >= stepElement.order) {
                    insertBeforeIndex = index;
                }
            });
            stepList.splice(insertBeforeIndex + 1, 0, step);
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
            currentStep = stepList[0];
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
            currentStep = null;
            tourStatus = statuses.OFF;
        };

        /**
         * pauses the tour
         */
        self.pause = function () {
            tourStatus = statuses.PAUSED;
            self.hideStep(self.getCurrentStep());
        };

        /**
         * resumes a paused tour or starts it
         */
        self.resume = function () {
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
                step.onNext || options.onNext || $q.resolve,
                function () {
                    return self.hideStep(step);
                },
                function () {
                    currentStep = self.getNextStepElement();
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
                step.onPrev || options.onPrev || $q.resolve,
                function () {
                    return self.hideStep(step);
                },
                function () {
                    currentStep = self.getPrevStepElement();
                    if (resumeWhenFound) {
                        return $q.resolve();
                    } else if (self.getCurrentStep()) {
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
                step.onShow || options.onShow || $q.resolve,
                step.show,
                step.onShown || options.onShown || $q.resolve,
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
                step.onHide || options.onHide || $q.resolve,
                step.hide,
                step.onHidden || options.onHidden || $q.resolve
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
         * return next step or null
         * @returns {step}
         */
        self.getNextStepElement = function () {
            if (!currentStep) {
                return null;
            }
            return stepList[stepList.indexOf(currentStep) + 1];
        };

        /**
         * return previous step or null
         * @returns {step}
         */
        self.getPrevStepElement = function () {
            if (!currentStep) {
                return null;
            }
            return stepList[stepList.indexOf(currentStep) - 1];
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
                    currentStep = stepList[stepList.indexOf(step)];
                    self.resume();
                    resumeWhenFound = null;
                }
            };
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
        self._getCurrentStep = function () {
            return currentStep;
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
                    events = 'onStart onEnd onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                    properties = 'placement animation popupDelay closePopupDelay trigger enable appendToBody tooltipClass orphan backdrop'.split(' ');

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
                        safeApply(scope, function () {
                            scope.$eval(attrs[attrName]);
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

    app.directive('tourStep', ['TourHelpers', '$uibTooltip', '$q', '$sce', function (TourHelpers, $uibTooltip, $q, $sce) {

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
                            enabled: true
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev'.split(' '),
                        options = 'content title enabled path animation container placement backdrop redirect orphan reflex duration nextStep prevStep nextPath prevPath'.split(' '),
                        orderWatch;

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
                        ctrl.reorderStep(step);
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

                    //on show and on hide
                    step.show = function () {
                        element.triggerHandler('uiTourShow');
                        return $q(function (resolve) {
                            element[0].dispatchEvent(new CustomEvent('uiTourShow'));
                            resolve();
                        });
                    };
                    step.hide = function () {
                        return $q(function (resolve) {
                            element[0].dispatchEvent(new CustomEvent('uiTourHide'));
                            resolve();
                        });
                    };

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
                    });
                }
            }
        };

    }]);

    app.directive('tourStepPopup', ['TourConfig', 'smoothScroll', function (TourConfig, smoothScroll) {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&', originScope: '&'},
            templateUrl: 'tour-step-popup.html',
            link: function (scope, element) {
                scope.$watch('isOpen', function (isOpen) {
                    if (isOpen()) {
                        smoothScroll(element[0], {
                            offset: 100
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
    "             uib-tooltip-template-transclude=\"'tour-step-template.html'\"\n" +
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

(function (app) {
    'use strict';

    app.factory('Tour', [function () {
        return function () {
            return {};
        };
    }]);

}(angular.module('bm.uiTour')));

(function (app) {
    'use strict';

    app.factory('LinkedList', [function () {

        var LinkedList = {};

        LinkedList.create = function (isDouble) {
            var head = null,
                tail = null,
                length = 0;

            function createNode(data) {
                var node = {
                    data: data,
                    next: null
                };

                if (isDouble) {
                    node.prev = null;
                }

                return node;
            }

            return {
                getHead: function () {
                    return head;
                },
                getTail: function () {
                    return tail;
                },
                size: function () {
                    return length;
                },
                push: function (data) {
                    var newNode = createNode(data);
                    if (tail) {
                        tail.next = newNode;
                        if (isDouble) {
                            newNode.prev = tail;
                        }
                        tail = newNode;
                    } else {
                        head = tail = newNode;
                    }
                    length += 1;
                    return true;
                },
                pop: function () {
                    if (!head) return;

                    //only 1 item
                    if (!head.next) {
                        head = null;

                        length -= 1;
                        return true;
                    }

                    var current = head;

                    do {
                        if (current.next.next) {
                            current = current.next;
                        } else {
                            current.next = null;
                            tail = current;

                            length -= 1;
                            return true;
                        }
                    } while (current.next);
                },
                unshift: function (data) {
                    var newNode = createNode(data);
                    if (head) {
                        newNode.next = head;
                        if (isDouble) {
                            head.prev = newNode;
                        }
                        head = newNode;
                    } else {
                        head = tail = newNode;
                    }
                    length += 1;
                    return true;
                },
                shift: function () {
                    if (!head) return;

                    if (!head.next) {
                        head = tail = null;
                    } else {
                        if (isDouble) {
                            head.next.prev = null;
                        }
                        head = head.next;
                    }

                    length -= 1;
                    return true;
                },
                insertAt: function (index, data) {
                    if (index === 0 || length === 0) {
                        return this.unshift(data);
                    }
                    if (index >= length) {
                        return this.push(data);
                    }

                    var nodeBefore = head,
                        newNode = createNode(data);
                    for (var i = 1; i < index; ++i) {
                        nodeBefore = nodeBefore.next;
                    }
                    if (isDouble) {
                        if (nodeBefore.next) {
                            nodeBefore.next.prev = newNode;
                        }
                        newNode.prev = nodeBefore;
                    }
                    newNode.next = nodeBefore.next;
                    nodeBefore.next = newNode;

                    length += 1;
                    return true;
                },
                forEach: function (iterator) {
                    var index = 0,
                        current = head,
                        stopped = false;

                    while (current && !stopped) {
                        iterator(current, index, function () { stopped = true; });
                        index += 1;
                        current = current.next;
                    }
                },
                remove: function (data) {
                    if (!head) return false;
                    var current = head;

                    //if first element
                    if (head.data === data) {
                        return this.shift();
                    }

                    while (current.next) {
                        if (current.next.data === data) {
                            //if last item
                            if (current.next === tail) {
                                return this.pop();
                            }

                            if (isDouble) {
                                current.next.next.prev = current;
                            }
                            current.next = current.next.next;

                            length -= 1;
                            return true;
                        }
                        current = current.next;
                    }

                    return false;
                },
                get: function (data) {
                    var current = head;

                    while (current) {
                        if (current.data === data) {
                            return current;
                        }
                        current = current.next;
                    }

                    return null;
                },
                contains: function (data) {
                    var match = false;
                    this.forEach(function (node) {
                        if (node.data === data) {
                            match = true;
                        }
                    });
                    return match;
                },
                toArray: function () {
                    var arr = [],
                        current = head;

                    while (current) {
                        arr.push(current.data);
                        current = current.next;
                    }

                    return arr;
                }
            }
        };

        return LinkedList;

    }]);

}(angular.module('bm.uiTour')));
