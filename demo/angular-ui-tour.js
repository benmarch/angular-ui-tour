/* global Tour: false */

(function angularUITour(app) {
    'use strict';

    app.config(['$tooltipProvider', function ($tooltipProvider) {
        $tooltipProvider.setTriggers({
            'uiTourShow': 'uiTourHide'
        });
    }]);

}(angular.module('bm.uiTour', ['ui.bootstrap', 'smoothScroll'])));

/* global angular: false */

(function (app) {
    'use strict';

    app.provider('TourConfig', [function () {

        var config = {
            prefixOptions: false,
            prefix: 'uiTour'
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

    app.controller('TourController', ['$q', '$injector', 'LinkedList', function ($q, $injector, LinkedList) {

        window.ij = $injector;

        var self = this,
            stepList = LinkedList.create(true),
            currentStep = null,
            newStepFound = angular.noop,
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
            newStepFound(step);
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
                    return self.hideStep(self.getCurrentStep());
                },
                function () {
                    currentStep = currentStep.next;
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
                    return self.hideStep(self.getCurrentStep());
                },
                function () {
                    currentStep = currentStep.prev;
                    if (self.getCurrentStep()) {
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
        self.getNextStep = function () {
            if (!currentStep) {
                return null;
            }
            return currentStep.next ? currentStep.next.data : null;
        };

        /**
         * return previous step or null
         * @returns {step}
         */
        self.getPrevStep = function () {
            if (!currentStep) {
                return null;
            }
            return currentStep.prev ? currentStep.prev.data : null;
        };

        /**
         * Tells the tour to pause while ngView loads
         *
         * @param waitForStep
         */
        self.waitFor = function (waitForStep) {
            newStepFound = function (step) {
                if (step.stepId === waitForStep) {
                    currentStep = stepList.get(step);
                    self.showStep(step);
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
                        templateReady,
                        events = 'onStart onEnd afterGetState afterSetState afterRemoveState onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'name container keyboard storage debug redirect duration basePath backdrop orphan'.split(' ');

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, tour, options);

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, tour, events);

                    //Compile template
                    templateReady = TourHelpers.attachTemplate(scope, attrs, tour);

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
                    templateReady.then(function () {
                        scope.tour = ctrl.init(tour);
                    });

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

    app.factory('TourHelpers', ['$templateCache', '$http', '$compile', 'TourConfig', '$q', function ($templateCache, $http, $compile, TourConfig, $q) {

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
         * Compiles and links a template to the provided scope
         *
         * @param {String} template
         * @param {$rootScope.Scope} scope
         * @returns {Function}
         */
        function compileTemplate(template, scope) {
            return function (/*index, step*/) {
                var $template = angular.element(template); //requires jQuery
                return $compile($template)(scope);
            };

        }

        /**
         * Looks up a template by URL and passes it to {@link helpers.compile}
         *
         * @param {String} templateUrl
         * @param {$rootScope.Scope} scope
         * @returns {Promise}
         */
        function lookupTemplate(templateUrl, scope) {

            return $http.get(templateUrl, {
                cache: $templateCache
            }).success(function (template) {
                if (template) {
                    return compileTemplate(template, scope);
                }
                return '';
            });

        }

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
         * Helper function that attaches proper compiled template to options
         *
         * @param {$rootScope.Scope} scope
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         */
        helpers.attachTemplate = function (scope, attrs, options) {

            var deferred = $q.defer(),
                template;

            if (attrs[helpers.getAttrName('template')]) {
                template = compileTemplate(scope.$eval(attrs[helpers.getAttrName('template')]), scope);
                options.template = template;
                deferred.resolve(template);
            } else if (attrs[helpers.getAttrName('templateUrl')]) {
                lookupTemplate(attrs[helpers.getAttrName('templateUrl')], scope).then(function (template) {
                    if (template) {
                        options.template = template.data;
                        deferred.resolve(template);
                    }
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;

        };

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

    function directive() {
        return ['TourHelpers', '$location', 'uibPopoverTemplateDirective', '$q', '$timeout', 'smoothScroll', function (TourHelpers, $location, uibPopoverDirective, $q, $timeout, smoothScroll) {

            var uibPopover = uibPopoverDirective[0];
            function isHidden(elem) {
                return !( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
            }

            return {
                restrict: 'EA',
                scope: true,
                require: '^tour',
                link: function (scope, element, attrs, ctrl) {

                    //Assign required options
                    var step = {
                            element: element,
                            stepId: attrs.tourStep
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'content title path animation container placement backdrop redirect orphan reflex duration nextStep prevStep nextPath prevPath'.split(' '),
                        orderWatch,
                        skipWatch,
                        templateReady;

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
                        //ctrl.refreshTour();
                    });

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, step, events);

                    //Compile templates
                    templateReady = TourHelpers.attachTemplate(scope, attrs, step);

                    //Check whether or not the step should be skipped
                    function stepIsSkipped() {
                        var skipped;
                        if (attrs[TourHelpers.getAttrName('skip')]) {
                            skipped = scope.$eval(attrs[TourHelpers.getAttrName('skip')]);
                        }
                        if (!skipped) {
                            skipped = !!step.path || (isHidden(element[0]) && !attrs.availableWhenHidden);
                        }
                        return skipped;
                    }
                    skipWatch = scope.$watch(stepIsSkipped, function (skip) {
                        if (skip) {
                            ctrl.removeStep(step);
                        } else {
                            ctrl.addStep(step);
                        }
                    });

                    scope.$on('$destroy', function () {
                        ctrl.removeStep(step);
                        orderWatch();
                        skipWatch();
                    });

                    //If there is an options argument passed, just use that instead
                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(step, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }

                    //set up redirects
                    function setRedirect(direction, path, targetName) {
                        var oldHandler = step[direction];
                        step[direction] = function (tour) {
                            if (oldHandler) {
                                oldHandler(tour);
                            }
                            ctrl.waitFor(targetName);

                            TourHelpers.safeApply(scope, function () {
                                $location.path(path);
                            });
                            return $q.resolve();
                        };
                    }
                    if (step.nextPath) {
                        step.redirectNext = true;
                        setRedirect('onNext', step.nextPath, step.nextStep);
                    }
                    if (step.prevPath) {
                        step.redirectPrev = true;
                        setRedirect('onPrev', step.prevPath, step.prevStep);
                    }

                    //set Popover attributes
                    function setPopoverAttributeIfExists(tourStepAttr, popoverAttr, alternative) {
                        if (angular.isDefined(attrs[TourHelpers.getAttrName(tourStepAttr)])) {
                            attrs.$set(popoverAttr, attrs[TourHelpers.getAttrName(tourStepAttr)]);
                        } else if (alternative) {
                            attrs.$set(popoverAttr, alternative)
                        }
                    }
                    setPopoverAttributeIfExists('title', 'popoverTitle');
                    setPopoverAttributeIfExists('placement', 'popoverPlacement');
                    //setPopoverAttributeIfExists('animation', 'popoverAnimation');
                    setPopoverAttributeIfExists('templateUrl', 'uibPopoverTemplate', '\'tour-step-template.html\'');

                    var tooltipName = 'tour-step-' + Math.floor(Math.random() * 10000);

                    attrs.$set('popoverIsOpen', 'isOpen');
                    attrs.$set('popoverAnimation', 'false');
                    attrs.$set('popoverTrigger', 'uiTourShow');
                    attrs.$set('popoverClass', tooltipName);
                    attrs.$set('popoverAppendToBody', 'true');

                    var isOpenResolver;
                    scope.$watch('isOpen', function (isOpen) {
                        if (isOpen) {
                            var tooltip = document.getElementsByClassName(tooltipName)[0];
                            tooltip.style.visibility = 'hidden';
                            smoothScroll(tooltip, {
                                offset: 100,
                                callbackAfter: function () {
                                    tooltip.style.visibility = 'visible';
                                    isOpenResolver();
                                }
                            });
                        }
                    });

                    step.show = function () {
                        return $q(function (resolve) {
                            isOpenResolver = resolve;
                            element[0].dispatchEvent(new Event('uiTourShow'));
                        });
                    };
                    step.hide = function () {
                        return $q(function (resolve) {
                            element[0].dispatchEvent(new Event('uiTourHide'));
                            resolve();
                        });
                    };

                    //Add step to tour
                    templateReady.then(function () {
                        ctrl.addStep(step);
                        scope.tourStep = step;
                        scope.tour = scope.tour || ctrl;
                        uibPopover.compile()(scope, element, attrs);
                    });

                }
            };

        }];
    }

    app.directive('tourStep', directive());
    app.directive('uiTourStep', directive());

}(angular.module('bm.uiTour')));

angular.module('bm.uiTour').run(['$templateCache', function($templateCache) {
  $templateCache.put("tour-step-template.html",
    "<div>\n" +
    "    <div class=\"popover-content\">{{tourStep.content}}</div>\n" +
    "    <div class=\"popover-navigation\">\n" +
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

                            length -=1;
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
                }

            }
        };

        return LinkedList;

    }]);

}(angular.module('bm.uiTour')));
