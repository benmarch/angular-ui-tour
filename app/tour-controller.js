/* global angular: false, Tour: false */

(function (app) {
    'use strict';

    app.controller('uiTourController', ['$timeout', '$q', '$filter', 'TourConfig', 'uiTourBackdrop', 'uiTourService', function ($timeout, $q, $filter, TourConfig, uiTourBackdrop, uiTourService) {

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
        function getStepByIdentityOrIdOrIndex(stepOrStepIdOrIndex) {
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

            //step object
            return ~stepList.indexOf(stepOrStepIdOrIndex) ? stepOrStepIdOrIndex : null;
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
        };

        /**
         * Checks to see if a step exists by ID, index, or identity
         *
         * @protected
         * @param {string | number | step} stepOrStepIdOrIndex Step to check
         * @returns {boolean}
         */
        self.hasStep = function (stepOrStepIdOrIndex) {
            return !!getStepByIdentityOrIdOrIndex(stepOrStepIdOrIndex);
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
            return self;
        };
        //------------------ end Protected API ------------------


        //------------------ Public API ------------------
        /**
         * starts the tour
         *
         * @public
         */
        self.start = function () {
            return handleEvent(options.onStart).then(function () {

                setCurrentStep(stepList[0]);
                tourStatus = statuses.ON;

            }).then(function () {

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
                stepToShow = getStepByIdentityOrIdOrIndex(goTo),
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
                    return self.showStep(stepToShow);
                });
        };
        //------------------ end Public API ------------------

        //some debugging functions
        //all are private
        self._getSteps = function () {
            return stepList;
        };
        self._getStatus = function () {
            return tourStatus;
        };
        self._getCurrentStep = getCurrentStep;
        self._setCurrentStep = setCurrentStep;
    }]);

}(angular.module('bm.uiTour')));
