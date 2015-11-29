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
                next = self.getNextStep();

            return !!((next && next.enabled) || current.nextPath);
        }

        /**
         * is there a previous step
         *
         * @returns {boolean}
         */
        function isPrev() {
            var current = self.getCurrentStep(),
                prev = self.getPrevStep();

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
            if (options.onEnd) {
                options.onEnd();
            }
            currentStep = null;
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
                step.onNext || options.onNext || $q.resolve,
                function () {
                    return self.hideStep(step);
                },
                function () {
                    currentStep = self.getNextStep();
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
                    currentStep = self.getPrevStep();
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
        self.getNextStep = function () {
            if (!currentStep) {
                return null;
            }
            return stepList[stepList.indexOf(currentStep) + 1];
        };

        /**
         * return previous step or null
         * @returns {step}
         */
        self.getPrevStep = function () {
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
