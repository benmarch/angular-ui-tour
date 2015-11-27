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
