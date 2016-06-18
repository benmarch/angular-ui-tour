module Tour {
    export class TourController {
        stepList: Array<ITourStep>
        currentStep: ITourStep
        resumeWhenFound: (step: ITourStep) => void;
        tourStatus: number;
        options: ITourConfigProperties;
        initialized: boolean;
        emit: (string, any?) => any;
        once: (string, fn: () => void) => any;

        statuses = {
            OFF: 0,
            ON: 1,
            PAUSED: 2
        }

        constructor(private $timeout: ng.ITimeoutService, private $q: ng.IQService, private $filter: ng.IFilterService, TourConfig: ITourConfig, private uiTourBackdrop: TourBackdrop, private uiTourService: uiTourService, private EventEmitter, private hotkeys) {
            this.tourStatus = this.statuses.OFF;
            this.options = TourConfig.getAll();
            this.stepList = [];
            EventEmitter.mixin(this);
        }

        /**
         * Closer to $evalAsync, just resolves a promise
         * after the next digest cycle
         *
         * @returns {Promise}
         */
        digest() {
            return this.$q((resolve) => {
                this.$timeout(resolve);
            });
        }

        /**
         * return current step or null
         * @returns {step}
         */
        getCurrentStep() {
            return this.currentStep;
        }

        /**
         * set the current step (doesnt do anything else)
         * @param {step} step Current step
         */
        setCurrentStep(step) {
            this.currentStep = step;
        }

        /**
         * gets a step relative to current step
         *
         * @param {number} offset Positive integer to search right, negative to search left
         * @returns {step}
         */
        getStepByOffset(offset) {
            if (!this.getCurrentStep()) {
                return null;
            }
            return this.stepList[this.stepList.indexOf(this.getCurrentStep()) + offset];
        }

        /**
         * retrieves a step (if it exists in the step list) by index, ID, or identity
         * Note: I realize ID is short for identity, but ID is really the step name here
         *
         * @param {string | number | step} stepOrStepIdOrIndex Step to retrieve
         * @returns {step}
         */
        getStep(stepOrStepIdOrIndex) {
            //index
            if (angular.isNumber(stepOrStepIdOrIndex)) {
                return this.stepList[stepOrStepIdOrIndex];
            }

            //ID string
            if (angular.isString(stepOrStepIdOrIndex)) {
                return this.stepList.filter((step) => step.stepId === stepOrStepIdOrIndex)[0];
            }

            //object
            if (angular.isObject(stepOrStepIdOrIndex)) {
                //step identity
                if (~this.stepList.indexOf(stepOrStepIdOrIndex)) {
                    return stepOrStepIdOrIndex;
                }

                //step copy
                if (stepOrStepIdOrIndex.stepId) {
                    return this.stepList.filter((step) => step.stepId === stepOrStepIdOrIndex.stepId)[0];
                }
            }

            return null;
        }

        /**
         * return next step or null
         * @returns {step}
         */
        getNextStep() {
            return this.getStepByOffset(+1);
        }

        /**
         * return previous step or null
         * @returns {step}
         */
        getPrevStep() {
            return this.getStepByOffset(-1);
        }

        /**
        * is there a next step
        *
        * @returns {boolean}
        */
        isNext() {
            return !!(this.getNextStep() || this.getCurrentStep().nextPath);
        }

        /**
         * is there a previous step
         *
         * @returns {boolean}
         */
        isPrev() {
            return !!(this.getPrevStep() || this.getCurrentStep().prevPath);
        }

        /**
         * Used by showStep and hideStep to trigger popover events
         *
         * @param step
         * @param eventName
         * @returns {*}
         */
        dispatchEvent(step, eventName) {
            return this.$q((resolve) => {
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
        handleEvent(handler) {
            return (handler || this.$q.resolve)();
        }

        /**
         * Configures hot keys for controlling the tour with the keyboard
         */
        setHotKeys() {
            this.hotkeys.add({
                combo: 'esc',
                description: 'End tour',
                callback: () => {
                    this.end();
                }
            });

            this.hotkeys.add({
                combo: 'right',
                description: 'Go to next step',
                callback: () => {
                    if (this.isNext()) {
                        this.next();
                    }
                }
            });

            this.hotkeys.add({
                combo: 'left',
                description: 'Go to previous step',
                callback: () => {
                    if (this.isPrev()) {
                        this.prev();
                    }
                }
            });
        }

        /**
         * Turns off hot keys for when the tour isn't running
         */
        unsetHotKeys() {
            this.hotkeys.del('esc');
            this.hotkeys.del('right');
            this.hotkeys.del('left');
        }

        //---------------- Protected API -------------------
        /**
         * Adds a step to the tour in order
         *
         * @param {object} step
         */
        addStep(step: ITourStep) {
            if (~this.stepList.indexOf(step)) {
                return;
            }
            this.stepList.push(step);
            this.stepList = this.$filter('orderBy')(this.stepList, 'order');
            this.emit('stepAdded', step);
            if (this.resumeWhenFound) {
                this.resumeWhenFound(step);
            }
        }

        /**
         * Removes a step from the tour
         *
         * @param step
         */
        removeStep(step: ITourStep) {
            this.stepList.splice(this.stepList.indexOf(step), 1);
            this.emit('stepRemoved', step);
        }

        /**
         * if a step's order was changed, replace it in the list
         * @param step
         */
        reorderStep(step: ITourStep) {
            this.stepList = this.$filter('orderBy')(this.stepList, 'order');
            this.emit('stepsReordered', step);
        }

        /**
         * Checks to see if a step exists by ID, index, or identity
         *
         * @protected
         * @param {string | number | step} stepOrStepIdOrIndex Step to check
         * @returns {boolean}
         */
        protected hasStep(stepOrStepIdOrIndex) {
            return !!this.getStep(stepOrStepIdOrIndex);
        };

        /**
         * show supplied step
         * @param step
         * @returns {promise}
         */
        protected showStep(step: ITourStep) {
            if (!step) {
                return this.$q.reject('No step.');
            }

            return this.handleEvent(step.config('onShow')).then(() => {

                if (!step.config('backdrop')) {
                    return;
                }

                var delay = step.config('popupDelay');
                if (step.config('animation') && delay < 100)
                    delay = 250

                return this.$q((resolve) => {
                    this.$timeout(() => {
                        this.uiTourBackdrop.createForElement(step.element, step.config('preventScrolling'), step.config('fixed'), step.config('backdropPadding'));
                        this.uiTourBackdrop.hideTarget(false);
                        resolve();
                    }, delay);
                })
            }).then(() => {

                step.element.addClass('ui-tour-active-step');
                return this.dispatchEvent(step, 'uiTourShow');

            }).then(() => {

                return this.digest();

            }).then(() => {

                return this.handleEvent(step.config('onShown'));

            }).then(() => {

                this.emit('stepShown', step);
                step.isNext = this.isNext();
                step.isPrev = this.isPrev();

            });
        }

        /**
         * hides the supplied step
         * @param step
         * @returns {promise}
         */
        protected hideStep(step: ITourStep) {
            if (!step) {
                return this.$q.reject('No step.');
            }

            return this.handleEvent(step.config('onHide')).then(() => {

                step.element.removeClass('ui-tour-active-step');
                return this.dispatchEvent(step, 'uiTourHide');

            }).then(() => {

                return this.digest();

            }).then(() => {

                return this.handleEvent(step.config('onHidden'));

            }).then(() => {

                this.emit('stepHidden', step);

            });
        }

        //------------------ end Protected API ------------------


        //------------------ Public API ------------------

        /**
         * Returns the value for specified option
         *
         * @protected
         * @param {string} option Name of option
         * @returns {*}
         */
        public config(option) {
            return this.options[option];
        }

        /**
         * Tells the tour to pause while ngView loads
         *
         * @param waitForStep
         */
        waitFor(waitForStep) {
            this.pause();
            this.resumeWhenFound = (step) => {
                if (step.stepId === waitForStep) {
                    this.currentStep = this.stepList[this.stepList.indexOf(step)];
                    this.resume();
                    this.resumeWhenFound = null;
                }
            };
        }

        /**
         * pass options from directive
         * @param opts
         */
        init(opts) {
            this.options = angular.extend(this.options, opts);
            this.uiTourService._registerTour(this);
            this.initialized = true;
            this.emit('initialized');
            return this;
        }

        /**
         * Unregisters with the tour service when tour is destroyed
         *
         * @protected
         */

        destroy() {
            this.uiTourService._unregisterTour(self);
        }

        /**
         * starts the tour
         */
        start() {
            return this.startAt(0);
        }

        /**
         * starts the tour at a specified step, step index, or step ID
         *
         * @public
         */
        startAt(stepOrStepIdOrIndex) {
            return this.handleEvent(this.options.onStart).then(() => {

                var step = this.getStep(stepOrStepIdOrIndex);
                this.setCurrentStep(step);
                this.tourStatus = this.statuses.ON;
                this.emit('started', step);
                if (this.options.useHotkeys) {
                    this.setHotKeys();
                }
                return this.showStep(this.getCurrentStep());

            });
        };

        /**
         * ends the tour
         */
        end() {
            return this.handleEvent(this.options.onEnd).then(() => {
                var step = this.getCurrentStep();
                if (step) {
                    this.uiTourBackdrop.hide();
                    return this.hideStep(step);
                }

            }).then(() => {

                this.setCurrentStep(null);
                this.emit('ended');
                this.tourStatus = this.statuses.OFF;

                if (this.options.useHotkeys) {
                    this.unsetHotKeys();
                }

            });
        }

        /**
         * pauses the tour
         */
        pause() {
            return this.handleEvent(this.options.onPause).then(() => {
                this.tourStatus = this.statuses.PAUSED;
                return this.hideStep(this.getCurrentStep());
            }).then(() => {
                this.emit('paused', this.getCurrentStep());
            });
        }

        /**
         * resumes a paused tour or starts it
         */
        resume() {
            return this.handleEvent(this.options.onResume).then(() => {
                this.tourStatus = this.statuses.ON;
                this.emit('resumed', this.getCurrentStep());
                return this.showStep(this.getCurrentStep());
            });
        }

        /**
         * move to next step
         * @returns {promise}
         */
        next() {
            return this.goTo('$next');
        }

        /**
         * move to previous step
         * @returns {promise}
         */
        prev() {
            return this.goTo('$prev');
        }

        /**
         * Jumps to the provided step, step ID, or step index
         *
         * @param {step | string | number} goTo Step object, step ID string, or step index to jump to
         * @returns {promise} Promise that resolves once the step is shown
         */
        goTo(goTo) {
            var currentStep = this.getCurrentStep(),
                stepToShow = this.getStep(goTo),
                actionMap = {
                    $prev: {
                        getStep: () => this.getPrevStep(),
                        preEvent: 'onPrev',
                        navCheck: 'prevStep'
                    },
                    $next: {
                        getStep: () => this.getNextStep(),
                        preEvent: 'onNext',
                        navCheck: 'nextStep'
                    }
                };

            if (goTo === '$prev' || goTo === '$next') {
                //trigger either onNext or onPrev here
                //if next or previous requires a redirect, it will happen here
                //the tour will pause here until the next view loads and
                //the next/prev step is found
                return this.handleEvent(currentStep.config(actionMap[goTo].preEvent)).then(() => {
                    currentStep.backdrop && this.uiTourBackdrop.showTarget();
                    return this.hideStep(currentStep);

                }).then(() => {

                    //if the next/prev step does not have a backdrop, hide it
                    if (this.getCurrentStep().config('backdrop') && !actionMap[goTo].getStep().config('backdrop')) {
                        this.uiTourBackdrop.hide();
                    }

                    //if a redirect occurred during onNext or onPrev, getCurrentStep() !== currentStep
                    //this will only be true if no redirect occurred, since the redirect sets current step
                    if (!currentStep[actionMap[goTo].navCheck] || currentStep[actionMap[goTo].navCheck] !== this.getCurrentStep().stepId) {
                        this.setCurrentStep(actionMap[goTo].getStep());
                        this.emit('stepChanged', this.getCurrentStep());
                    }

                }).then(() => {

                    if (this.getCurrentStep()) {
                        return this.showStep(this.getCurrentStep());
                    } else {
                        this.end();
                    }

                });
            }

            //if no step found
            if (!stepToShow) {
                return this.$q.reject('No step.');
            }

            //take action
            return this.hideStep(this.getCurrentStep())
                .then(() => {
                    //if the next/prev step does not have a backdrop, hide it
                    if (this.getCurrentStep().config('backdrop') && !stepToShow.config('backdrop')) {
                        this.uiTourBackdrop.hide();
                    }
                    this.setCurrentStep(stepToShow);
                    this.emit('stepChanged', this.getCurrentStep());
                    return this.showStep(stepToShow);
                });
        };


        /**
         * @typedef number TourStatus
         */

        /**
         * Returns the current status of the tour
         * @returns {TourStatus}
         */
        getStatus() {
            return this.tourStatus;
        }

        status = this.statuses

        //some debugging functions
        private _getSteps() {
            return this.stepList;
        }
        private _getStatus() {
            return this.tourStatus;
        }
        private _getCurrentStep = this.getCurrentStep;
        private _setCurrentStep = this.setCurrentStep;
    }
}