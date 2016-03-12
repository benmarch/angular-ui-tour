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
            var current = getCurrentStep(),
                next = getNextStep();

            return !!(next || current.nextPath);
        }

        /**
         * is there a previous step
         *
         * @returns {boolean}
         */
        function isPrev() {
            var current = getCurrentStep(),
                prev = getPrevStep();

            return !!(prev || current.prevPath);
        }

        /**
         * show supplied step
         *
         * @
         * @param step
         * @returns {promise}
         */
        function showStep(step) {
            if (!step) {
                return $q.reject('No step.');
            }
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
        }

        /**
         * hides the supplied step
         * @param step
         * @returns {promise}
         */
        function hideStep(step) {
            if (!step) {
                return $q.reject('No step.');
            }
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
         */
        function setCurrentStep(step) {
            currentStep = step;
        }

        /**
         * return next step or null
         * @returns {step}
         */
        function getNextStep() {
            if (!getCurrentStep()) {
                return null;
            }
            return stepList[stepList.indexOf(getCurrentStep()) + 1];
        }

        /**
         * return previous step or null
         * @returns {step}
         */
        function getPrevStep() {
            if (!getCurrentStep()) {
                return null;
            }
            return stepList[stepList.indexOf(getCurrentStep()) - 1];
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
            if (options.onStart) {
                options.onStart();
            }
            setCurrentStep(stepList[0]);
            tourStatus = statuses.ON;
            showStep(getCurrentStep());
        };

        /**
         * ends the tour
         *
         * @public
         */
        self.end = function () {
            if (getCurrentStep()) {
                hideStep(getCurrentStep());
            }
            if (options.onEnd) {
                options.onEnd();
            }
            setCurrentStep(null);
            tourStatus = statuses.OFF;
        };

        /**
         * pauses the tour
         *
         * @public
         */
        self.pause = function () {
            if (options.onPause) {
                options.onPause();
            }
            tourStatus = statuses.PAUSED;
            hideStep(getCurrentStep());
        };

        /**
         * resumes a paused tour or starts it
         *
         * @public
         */
        self.resume = function () {
            if (options.onResume) {
                options.onResume();
            }
            tourStatus = statuses.ON;
            showStep(getCurrentStep());
        };

        /**
         * move to next step
         *
         * @public
         * @returns {promise}
         */
        self.next = function () {
            var step = getCurrentStep();
            return serial([
                step.config('onNext') || $q.resolve,
                function () {
                    return hideStep(step);
                },
                function () {
                    //check if redirect happened, if not, set the next step
                    if (!step.nextStep || getCurrentStep().stepId !== step.nextStep) {
                        setCurrentStep(getNextStep());
                    }
                },
                function () {
                    if (getCurrentStep()) {
                        return showStep(getCurrentStep());
                    } else {
                        self.end();
                    }
                }
            ]);
        };

        /**
         * move to previous step
         *
         * @public
         * @returns {promise}
         */
        self.prev = function () {
            var step = getCurrentStep();
            return serial([
                step.config('onPrev') || $q.resolve,
                function () {
                    return hideStep(step);
                },
                function () {
                    //check if redirect happened, if not, set the prev step
                    if (!step.prevStep || getCurrentStep().stepId !== step.prevStep) {
                        setCurrentStep(getPrevStep());
                    }
                },
                function () {
                    if (getCurrentStep()) {
                        return showStep(getCurrentStep());
                    } else {
                        self.end();
                    }
                }
            ]);
        };

        self.goToStep = function (stepOrIndex) {
            var stepToShow;

            if (angular.isNumber(stepOrIndex) && angular.isDefined(stepList[stepOrIndex])) {
                stepToShow = stepList[stepOrIndex];
            } else if (~stepList.indexOf(stepOrIndex)) {
                stepToShow = stepOrIndex;
            } else {
                return $q.reject('No step.');
            }

            return hideStep(getCurrentStep())
                .then(function () {
                    setCurrentStep(stepToShow);
                    return showStep(stepToShow);
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
    }]);

}(angular.module('bm.uiTour')));
