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
            prefixOptions: true,
            prefix: 'tourStep'
        };

        this.set = function (option, value) {
            config[option] = value;
        };

        this.$get = [function () {

            var service = {};

            service.get = function (option) {
                return config[option];
            };

            return service;

        }];

    }]);

}(angular.module('bm.uiTour')));

/* global angular: false, Tour: false */

(function (app) {
    'use strict';

    app.controller('TourController', ['$q', 'LinkedList', function ($q, LinkedList) {

        var self = this,
            stepList = LinkedList.create(true),
            currentStep = null,
            resumeWhenFound,
            statuses = {
                OFF: 0,
                ON: 1,
                PAUSED: 2
            },
            tourStatus = statuses.OFF,
            options = {};

        function serial(funcs) {
            var promise = funcs.shift()();
            funcs.forEach(function (func) {
                promise = promise.then(func);
            });
            return promise;
        }

        /**
         * Adds a step to the tour in order
         *
         * @param {object} step
         */
        self.addStep = function (step) {
            if (stepList.contains(step)) {
                return;
            }
            var insertBeforeIndex = 0;
            stepList.forEach(function (stepElement, index, stop) {
                if (step.order >= stepElement.data.order) {
                    insertBeforeIndex = index;
                } else {
                    stop();
                }
            });
            stepList.insertAt(insertBeforeIndex + 1, step);
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
            stepList.remove(step);
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
            currentStep = stepList.getHead();
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
         * show supplied step or step index
         * @param stepElement
         * @returns {promise}
         */
        self.showStep = function (step) {
            return serial([
                step.onShow || options.onShow || $q.resolve,
                step.show,
                step.onShown || options.onShown || $q.resolve
            ]);
        };

        /**
         * hides the supplied step or step index
         * @param stepElement
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
            if (!currentStep) {
                return null;
            }
            return currentStep.data;
        };

        /**
         * return next step or null
         * @returns {step}
         */
        self.getNextStepElement = function () {
            if (!currentStep) {
                return null;
            }
            return stepList.get(currentStep.data).next;
        };

        /**
         * return previous step or null
         * @returns {step}
         */
        self.getPrevStepElement = function () {
            if (!currentStep) {
                return null;
            }
            return stepList.get(currentStep.data).prev;
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
                    currentStep = stepList.get(step);
                    self.resume();
                    resumeWhenFound = null;
                }
            };
        };

        /**
         * pass options from directive
         * @param opts
         * @returns {tourController}
         */
        self.init = function (opts) {
            options = opts;
            self.options = options;
            return self;
        }
    }]);

}(angular.module('bm.uiTour')));

/* global angular: false */

(function (app) {
    'use strict';

    function directive () {
        return ['TourHelpers', function (TourHelpers) {

            return {
                restrict: 'EA',
                scope: true,
                controller: 'TourController',
                link: function (scope, element, attrs, ctrl) {

                    //Pass static options through or use defaults
                    var tour = {},
                        events = 'onStart onEnd afterGetState afterSetState afterRemoveState onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'name container keyboard storage debug redirect duration basePath backdrop orphan'.split(' ');

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, tour, options);

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, tour, events);

                    //Monitor number of steps
                    scope.$watchCollection(ctrl.getSteps, function (steps) {
                        if (!steps) return;
                        scope.stepCount = steps.length;
                    });

                    //If there is an options argument passed, just use that instead
                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(tour, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }

                    //Initialize tour
                    scope.tour = ctrl.init(tour);
                }
            };

        }];
    }

    app.directive('tour', directive());
    app.directive('uiTour', directive());

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
         */
        helpers.attachEventHandlers = function (scope, attrs, options, events) {

            angular.forEach(events, function (eventName) {
                if (attrs[helpers.getAttrName(eventName)]) {
                    options[eventName] = function (tour) {
                        safeApply(scope, function () {
                            scope.$eval(attrs[helpers.getAttrName(eventName)]);
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
         */
        helpers.attachInterpolatedValues = function (attrs, options, keys) {

            angular.forEach(keys, function (key) {
                if (attrs[helpers.getAttrName(key)]) {
                    options[key] = stringToBoolean(attrs[helpers.getAttrName(key)]);
                    attrs.$observe(helpers.getAttrName(key), function (newValue) {
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
         * @returns {string} potentially prefixed name of option, or just name of option
         */
        helpers.getAttrName = function (option) {
            if (TourConfig.get('prefixOptions')) {
                return TourConfig.get('prefix') + option.charAt(0).toUpperCase() + option.substr(1);
            } else {
                return option;
            }
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
            require: '^tour',
            compile: function (tElement, tAttrs) {

                if (!tAttrs.tourStep) {
                    tAttrs.$set('tourStep', '\'PH\''); //a placeholder so popup will show
                }

                var tourStepLinker = tourStepDef.compile(tElement, tAttrs);

                return function (scope, element, attrs, ctrl) {

                    //Assign required options
                    var step = {
                            element: element,
                            stepId: attrs.tourStep
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev'.split(' '),
                        options = 'content title path animation container placement backdrop redirect orphan reflex duration nextStep prevStep nextPath prevPath'.split(' '),
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
                        return $q(function (resolve) {
                            element[0].dispatchEvent(new Event('uiTourShow'));
                            resolve();
                        });
                    };
                    step.hide = function () {
                        return $q(function (resolve) {
                            element[0].dispatchEvent(new Event('uiTourHide'));
                            resolve();
                        });
                    };

                    //a couple mods
                    attrs.$set('tourStepAppendToBody', 'true');
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
            templateUrl: TourConfig.get('templateUrl') || 'tour-step-popup.html',
            link: function (scope, element) {
                scope.$watch('isOpen', function (isOpen) {
                    if (isOpen()) {
                        smoothScroll(element[0], {
                            offset: 100
                        });
                    }
                })
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
    "            <button class=\"btn btn-sm btn-default\" data-role=\"prev\" ng-click=\"tour.prev()\">&laquo; Prev</button>\n" +
    "            <button class=\"btn btn-sm btn-default\" data-role=\"next\" ng-click=\"tour.next()\">Next &raquo;</button>\n" +
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
