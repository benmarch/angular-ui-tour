/* global angular: false, Tour: false */

(function (app) {
    'use strict';

    app.controller('uiTourController', ['$timeout', '$q', '$filter', 'TourConfig', 'uiTourBackdrop', 'uiTourService', 'ezEventEmitter', 'hotkeys', function ($timeout, $q, $filter, TourConfig, uiTourBackdrop, uiTourService, EventEmitter, hotkeys) {

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

        /**
         * Configures hot keys for controlling the tour with the keyboard
         */
        function setHotKeys() {
            hotkeys.add({
                combo: 'esc',
                description: 'End tour',
                callback: function () {
                    self.end();
                }
            });

            hotkeys.add({
                combo: 'right',
                description: 'Go to next step',
                callback: function () {
                    if (isNext()) {
                        self.next();
                    }
                }
            });

            hotkeys.add({
                combo: 'left',
                description: 'Go to previous step',
                callback: function () {
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
            self.emit('stepRemoved', step);
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
        self.showStep = function(step) {
            if (!step) {
                return $q.reject('No step.');
            }

            return handleEvent(step.config('onShow')).then(function () {

                if (step.config('backdrop')) {
                    uiTourBackdrop.createForElement(step.element, step.config('preventScrolling'), step.config('fixed'));
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

                    //if the next/prev step does not have a backdrop, hide it
                    if (getCurrentStep().config('backdrop') && !actionMap[goTo].getStep().config('backdrop')) {
                        uiTourBackdrop.hide();
                    }

                    //if a redirect occurred during onNext or onPrev, getCurrentStep() !== currentStep
                    //this will only be true if no redirect occurred, since the redirect sets current step
                    if (!currentStep[actionMap[goTo].navCheck] || currentStep[actionMap[goTo].navCheck] !== getCurrentStep().stepId) {
                        setCurrentStep(actionMap[goTo].getStep());
                        self.emit('stepChanged', getCurrentStep());
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
                    //if the next/prev step does not have a backdrop, hide it
                    if (getCurrentStep().config('backdrop') && !stepToShow.config('backdrop')) {
                        uiTourBackdrop.hide();
                    }
                    setCurrentStep(stepToShow);
                    self.emit('stepChanged', getCurrentStep());
                    return self.showStep(stepToShow);
                });
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
    }]);

}(angular.module('bm.uiTour')));
