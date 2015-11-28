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

            return !!((next && next.data.enabled) || current.nextPath);
        }

        /**
         * is there a previous step
         *
         * @returns {boolean}
         */
        function isPrev() {
            var current = self.getCurrentStep(),
                prev = self.getPrevStepElement();

            return !!((prev && prev.data.enabled) || current.prevPath);
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
         * hides the supplied step or step index
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
         * @returns {self}
         */
        self.init = function (opts) {
            options = opts;
            self.options = options;
            return self;
        };
    }]);

}(angular.module('bm.uiTour')));
