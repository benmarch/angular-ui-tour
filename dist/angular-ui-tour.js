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
            backgroundColor: 'transparent',
            display: 'none'
        });

        $body.append($backdrop);

        service.createForElement = function (element, shouldPreventScrolling, isFixedElement) {
            if (shouldPreventScrolling) {
                preventScrolling();
            }
            var position;
            $clone = angular.element($document[0].createElement('div'));
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
                backgroundColor: $body.css('backgroundColor') || '#FFFFFF',
                boxShadow: '0px 0px 0px 200vw rgba(0, 0, 0, 0.5)'
            });
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

    app.controller('uiTourController', ['$timeout', '$q', '$filter', 'TourConfig', 'uiTourBackdrop', 'uiTourService', 'ezEventEmitter', function ($timeout, $q, $filter, TourConfig, uiTourBackdrop, uiTourService, EventEmitter) {

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

        EventEmitter.mixin(self);

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
            if (angular.isNumber(stepOrStepIdOrIndex)) {
                return stepList[stepOrStepIdOrIndex];
            }

            //ID string
            if (angular.isString(stepOrStepIdOrIndex)) {
                return stepList.filter(function (step) {
                    return step.stepId === stepOrStepIdOrIndex;
                })[0];
            }

            //object
            if (angular.isObject(stepOrStepIdOrIndex)) {
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
            return !!(getNextStep() || getCurrentStep().nextPath);
        }

        /**
         * is there a previous step
         *
         * @returns {boolean}
         */
        function isPrev() {
            return !!(getPrevStep() || getCurrentStep().prevPath);
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
            self.emit('stepAdded', angular.copy(step));
            if (resumeWhenFound) {
                resumeWhenFound(step);
            }
        };

        /**
         * Removes a step from the tour
         *
         * @protected
         * @param step
         */
        self.removeStep = function (step) {
            stepList.splice(stepList.indexOf(step), 1);
            self.emit('stepRemoved', angular.copy(step));
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
            self.emit('stepsReordered', angular.copy(step));
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
        self.showStep = function(step) {
            if (!step) {
                return $q.reject('No step.');
            }

            return handleEvent(step.config('onShow')).then(function () {

                if (step.config('backdrop')) {
                    uiTourBackdrop.createForElement(step.element, step.preventScrolling, step.fixed);
                }

            }).then(function () {

                return dispatchEvent(step, 'uiTourShow');

            }).then(function () {

                return digest();

            }).then(function () {

                return handleEvent(step.config('onShown'));

            }).then(function () {

                self.emit('stepShown', angular.copy(step));
                step.isNext = isNext();
                step.isPrev = isPrev();

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

                return dispatchEvent(step, 'uiTourHide');

            }).then(function () {

                if (step.config('backdrop')) {
                    uiTourBackdrop.hide();
                }

            }).then(function () {

                return digest();

            }).then(function () {

                return handleEvent(step.config('onHidden'));

            }).then(function () {

                self.emit('stepHidden', angular.copy(step));

            });
        };

        /**
         * Tells the tour to pause while ngView loads
         *
         * @protected
         * @param waitForStep
         */
        self.waitFor = function (waitForStep) {
            self.pause();
            resumeWhenFound = function (step) {
                if (step.stepId === waitForStep) {
                    setCurrentStep(stepList[stepList.indexOf(step)]);
                    self.resume();
                    resumeWhenFound = null;
                }
            };
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
            options = angular.extend(options, opts);
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
                self.emit('started', angular.copy(step));
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
                    return self.hideStep(getCurrentStep());
                }

            }).then(function () {

                setCurrentStep(null);
                self.emit('ended');
                tourStatus = statuses.OFF;

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
                return self.hideStep(getCurrentStep());
            }).then(function () {
                self.emit('paused', angular.copy(getCurrentStep()));
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
                self.emit('resumed', angular.copy(getCurrentStep()));
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
                        self.emit('stepChanged', angular.copy(getCurrentStep()));
                    }

                }).then(function () {

                    if (getCurrentStep()) {
                        return self.showStep(getCurrentStep());
                    } else {
                        self.end();
                    }

                });
            }

            //if no step found
            if (!stepToShow) {
                return $q.reject('No step.');
            }

            //take action
            return self.hideStep(getCurrentStep())
                .then(function () {
                    setCurrentStep(stepToShow);
                    self.emit('stepChanged', angular.copy(getCurrentStep()));
                    return self.showStep(stepToShow);
                });
        };

        /**
         * returns a copy of the current step (copied to avoid breaking internal functions)
         *
         * @returns {step}
         */
        self.getCurrentStep = function () {
            return angular.copy(getCurrentStep());
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
    }]);

}(angular.module('bm.uiTour')));

/* global angular: false */

(function (app) {
    'use strict';

    app.directive('uiTour', ['TourHelpers', function (TourHelpers) {

        return {
            restrict: 'EA',
            scope: true,
            controller: 'uiTourController',
            link: function (scope, element, attrs, ctrl) {

                //Pass static options through or use defaults
                var tour = {
                        name: attrs.uiTour
                    },
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

                scope.$on('$destroy', function () {
                    ctrl.destroy();
                });
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
         * This will attach the properties native to Angular UI Tooltips. If there is a tour-level value set
         * for any of them, this passes that value along to the step
         *
         * @param {$rootScope.Scope} scope The tour step's scope
         * @param {Attributes} attrs The tour step's Attributes
         * @param {Object} step Represents the tour step object
         * @param {Array} properties The list of Tooltip properties
         */
        helpers.attachTourConfigProperties = function (scope, attrs, step, properties) {
            angular.forEach(properties, function (property) {
                if (!attrs[helpers.getAttrName(property)] && angular.isDefined(step.config(property))) {
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

(function (module) {
    'use strict';

    module.factory('uiTourService', [function () {

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
            return angular.element(element).controller('uiTour');
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
                        tooltipAttrs = 'animation appendToBody placement popupDelay popupCloseDelay'.split(' '),
                        orderWatch,
                        enabledWatch;

                    //Will add values to pass to $uibTooltip
                    function configureInheritedProperties() {
                        TourHelpers.attachTourConfigProperties(scope, attrs, step, tooltipAttrs, 'tourStep');
                        tourStepLinker(scope, element, attrs);
                    }

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
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
                    scope.tourStep = step;
                    scope.tour = scope.tour || ctrl;
                    if (ctrl.initialized) {
                        configureInheritedProperties();
                        ctrl.addStep(step);
                    } else {
                        ctrl.once('initialized', function () {
                            configureInheritedProperties();
                            ctrl.addStep(step);
                        });
                    }

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

                element.css({
                    zIndex: TourConfig.get('backdropZIndex') + 2,
                    display: 'block'
                });
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
