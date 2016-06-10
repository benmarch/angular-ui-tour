/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/* global Tour: false */

module Tour {
    export interface ITourScope extends ng.IScope {
        tour: TourController;
        tourStep: ITourStep;

        originScope: () => ITourScope;
        isOpen: () => boolean;
    }

    export interface ITourStep {
        nextPath?;
        prevPath?;
        backdrop?;
        stepId?;
        trustedContent?;
        content?: string;
        order?: number;
        templateUrl?: string;
        element?: ng.IRootElementService;
        enabled?: boolean;
        preventScrolling?: boolean;
        fixed?: boolean;
        isNext?: boolean;
        isPrev?: boolean;
        redirectNext?: boolean;
        redirectPrev?: boolean;
        nextStep?: ITourStep;
        prevStep?: ITourStep;
        show?: () => PromiseLike<any>;
        hide?: () => PromiseLike<any>;
        onNext?: () => PromiseLike<any>;
        onPrev?: () => PromiseLike<any>;
        onShow?: () => PromiseLike<any>;
        onHide?: () => PromiseLike<any>;
        onShown?: () => PromiseLike<any>;
        onHidden?: () => PromiseLike<any>;
        config?: (string) => any;
    }

    export interface ITourConfig {
        get: (option: string) => any;
        getAll: () => ITourConfigProperties;
    }

    export interface ITourConfigProperties {
        name?: string;
        placement: string;
        animation: boolean;
        popupDelay: number;
        closePopupDelay: number;
        enable: boolean;
        appendToBody: boolean;
        popupClass: string;
        orphan: boolean;
        backdrop: boolean;
        backdropZIndex: number;
        scrollOffset: number;
        scrollIntoView: boolean;
        useUiRouter: boolean;
        useHotkeys: boolean;

        onStart: (any?) => any;
        onEnd: (any?) => any;
        onPause: (any?) => any;
        onResume: (any?) => any;
        onNext: (any?) => any;
        onPrev: (any?) => any;
        onShow: (any?) => any;
        onShown: (any?) => any;
        onHide: (any?) => any;
        onHidden: (any?) => any;

    }

    export class TourBackdrop {
        private $body: ng.IRootElementService;
        private viewWindow: { top: ng.IRootElementService, bottom: ng.IRootElementService, left: ng.IRootElementService, right: ng.IRootElementService };

        private preventDefault(e) {
            e.preventDefault();
        }

        private preventScrolling() {
            this.$body.addClass('no-scrolling');
            this.$body.on('touchmove', this.preventDefault);
        }

        private allowScrolling() {
            this.$body.removeClass('no-scrolling');
            this.$body.off('touchmove', this.preventDefault);
        }

        private createNoScrollingClass() {
            var name = '.no-scrolling',
                rules = 'height: 100%; overflow: hidden;',
                style = document.createElement('style');
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);

            if (!style.sheet && !(<any>style.sheet).insertRule) {
                ((<any>style).styleSheet || style.sheet).addRule(name, rules);
            } else {
                (<any>style.sheet).insertRule(name + '{' + rules + '}', 0);
            }
        }

        private createBackdropComponent(backdrop) {
            backdrop.addClass('tour-backdrop').addClass('not-shown').css({
                //display: 'none',
                zIndex: this.TourConfig.get('backdropZIndex')
            });
            this.$body.append(backdrop);
        }

        private showBackdrop() {
            this.viewWindow.top.removeClass('hidden');
            this.viewWindow.bottom.removeClass('hidden');
            this.viewWindow.left.removeClass('hidden');
            this.viewWindow.right.removeClass('hidden');

            setTimeout(() => {
                this.viewWindow.top.removeClass('not-shown');
                this.viewWindow.bottom.removeClass('not-shown');
                this.viewWindow.left.removeClass('not-shown');
                this.viewWindow.right.removeClass('not-shown');
            }, 33);
        }

        private hideBackdrop() {
            this.viewWindow.top.addClass('not-shown');
            this.viewWindow.bottom.addClass('not-shown');
            this.viewWindow.left.addClass('not-shown');
            this.viewWindow.right.addClass('not-shown');

            setTimeout(() => {
                this.viewWindow.top.addClass('hidden');
                this.viewWindow.bottom.addClass('hidden');
                this.viewWindow.left.addClass('hidden');
                this.viewWindow.right.addClass('hidden');
            }, 250);
        }

        createForElement(element: ng.IRootElementService, shouldPreventScrolling: boolean, isFixedElement: boolean) {
            var position,
                viewportPosition,
                bodyPosition;

            if (shouldPreventScrolling) {
                this.preventScrolling();
            }

            position = this.$uibPosition.offset(element);
            viewportPosition = this.$uibPosition.viewportOffset(element);
            bodyPosition = this.$uibPosition.offset(this.$body);

            if (isFixedElement) {
                angular.extend(position, viewportPosition);
            }

            this.viewWindow.top.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: Math.floor(position.top) + 'px'
            });
            this.viewWindow.bottom.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                left: 0,
                width: '100%',
                height: Math.floor(bodyPosition.top + bodyPosition.height - position.top - position.height) + 'px',
                top: (Math.floor(position.top + position.height)) + 'px'
            });
            this.viewWindow.left.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                left: 0,
                top: Math.floor(position.top) + 'px',
                width: position.left + 'px',
                height: Math.floor(position.height) + 'px'
            });
            this.viewWindow.right.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                top: Math.floor(position.top) + 'px',
                width: (bodyPosition.left + bodyPosition.width - position.left - position.width) + 'px',
                height: Math.floor(position.height) + 'px',
                left: (position.left + position.width) + 'px'
            });

            this.showBackdrop();

            if (shouldPreventScrolling) {
                this.preventScrolling();
            }
        }

        hide() {
            this.hideBackdrop();
            this.allowScrolling();
        }

        constructor(private TourConfig: ITourConfig, private $document: ng.IDocumentService, private $uibPosition: angular.ui.bootstrap.IPositionService, private $window: ng.IWindowService) {
            var service = this;
            var document = <HTMLDocument>(<any>$document[0])
            this.$body = angular.element(document.body);
            this.viewWindow = {
                top: angular.element(document.createElement('div')),
                bottom: angular.element(document.createElement('div')),
                left: angular.element(document.createElement('div')),
                right: angular.element(document.createElement('div'))
            }

            this.createNoScrollingClass();

            this.createBackdropComponent(this.viewWindow.top);
            this.createBackdropComponent(this.viewWindow.bottom);
            this.createBackdropComponent(this.viewWindow.left);
            this.createBackdropComponent(this.viewWindow.right);

        }

        static factory(TourConfig: ITourConfig, $document: ng.IDocumentService, $uibPosition: angular.ui.bootstrap.IPositionService, $window: ng.IWindowService) {
            return new TourBackdrop(TourConfig, $document, $uibPosition, $window);
        }
    }

    export class TourConfigProvider {
        config: ITourConfigProperties = {
            placement: 'top',
            animation: true,
            popupDelay: 1,
            closePopupDelay: 0,
            enable: true,
            appendToBody: false,
            popupClass: '',
            orphan: false,
            backdrop: false,
            backdropZIndex: 10000,
            scrollOffset: 100,
            scrollIntoView: true,
            useUiRouter: false,
            useHotkeys: false,

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

        set(option, value) {
            this.config[option] = value;
        }

        $get(): ITourConfig {

            return {
                get: (option) => {
                    return this.config[option];
                },
                getAll: () => {
                    return angular.copy(this.config);
                }
            };
        }

        constructor($q: ng.IQService) {
            angular.forEach(this.config, function (value, key) {
                if (key.indexOf('on') === 0 && angular.isFunction(value)) {
                    this.config[key] = function () {
                        return $q.resolve(value());
                    };
                }
            });
        }
    }

    export class TourController {
        stepList: Array<ITourStep>
        currentStep: ITourStep
        resumeWhenFound: (step: ITourStep) => void;
        tourStatus: number;
        options: ITourConfigProperties;
        initialized: boolean;
        emit: (string, any?) => any;

        statuses = {
            OFF: 0,
            ON: 1,
            PAUSED: 2
        }

        constructor(private $timeout: ng.ITimeoutService, private $q: ng.IQService, private $filter: ng.IFilterService, TourConfig: ITourConfig, private uiTourBackdrop: TourBackdrop, private uiTourService: uiTourService, private EventEmitter, private hotkeys) {
            this.tourStatus = this.statuses.OFF;
            this.options = TourConfig.getAll();
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
            this.removeStep(step);
            this.addStep(step);
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
                return this.$q((resolve) => {
                    this.$timeout(() => {
                        this.uiTourBackdrop.createForElement(step.element, step.config('preventScrolling'), step.config('fixed'));
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

        /**
         * Returns the value for specified option
         *
         * @protected
         * @param {string} option Name of option
         * @returns {*}
         */
        protected config(option) {
            return this.options[option];
        }

        //------------------ end Protected API ------------------


        //------------------ Public API ------------------

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
            this.uiTourService._registerTour(self);
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

                if (this.getCurrentStep()) {
                    this.uiTourBackdrop.hide();
                    return this.hideStep(this.getCurrentStep());
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
                        getStep: this.getPrevStep,
                        preEvent: 'onPrev',
                        navCheck: 'prevStep'
                    },
                    $next: {
                        getStep: this.getNextStep,
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

    export class TourHelper {
        $state

        constructor(private $templateCache: ng.ITemplateCacheService, private $http: ng.IHttpService, private $compile: ng.ICompileService, private $location: ng.ILocationService, private TourConfig: ITourConfig, private $q: ng.IQService, private $injector) {
            if ($injector.has('$state')) {
                this.$state = $injector.get('$state');
            }
        }

        /**
        * Helper function that calls scope.$apply if a digest is not currently in progress
        * Borrowed from: https://coderwall.com/p/ngisma
        *
        * @param {$rootScope.Scope} scope
        * @param {Function} fn
        */
        safeApply(scope: ng.IScope, fn: () => any) {
            var phase = scope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        }

        /**
         * Converts a stringified boolean to a JS boolean
         *
         * @param string
         * @returns {*}
         */
        stringToBoolean(string) {
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
        attachTourConfigProperties(scope, attrs, step, properties) {
            angular.forEach(properties, (property) => {
                if (!attrs[this.getAttrName(property)] && angular.isDefined(step.config(property))) {
                    attrs.$set(this.getAttrName(property), String(step.config(property)));
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
        attachEventHandlers(scope, attrs, options, events, prefix?) {

            angular.forEach(events, (eventName) => {
                var attrName = this.getAttrName(eventName, prefix);
                if (attrs[attrName]) {
                    options[eventName] = () => {
                        return this.$q((resolve) => {
                            this.safeApply(scope, () => {
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
        attachInterpolatedValues(attrs, options, keys, prefix?) {

            angular.forEach(keys, (key) => {
                var attrName = this.getAttrName(key, prefix);
                if (attrs[attrName]) {
                    options[key] = this.stringToBoolean(attrs[attrName]);
                    attrs.$observe(attrName, (newValue) => {
                        options[key] = this.stringToBoolean(newValue);
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
        setRedirect(step, ctrl, direction, path, targetName) {
            var oldHandler = step[direction];
            step[direction] = (tour) => {
                return this.$q((resolve) => {
                    if (oldHandler) {
                        oldHandler(tour);
                    }
                    ctrl.waitFor(targetName);
                    if (step.config('useUiRouter')) {
                        this.$state.transitionTo(path).then(resolve);
                    } else {
                        this.$location.path(path);
                        resolve();
                    }
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
        getAttrName(option, prefix?) {
            return (prefix || 'tourStep') + option.charAt(0).toUpperCase() + option.substr(1);
        };
        static factory($templateCache: ng.ITemplateCacheService, $http: ng.IHttpService, $compile: ng.ICompileService, $location: ng.ILocationService, TourConfig: ITourConfig, $q: ng.IQService, $injector: ng.IInjectStatic) {
            return new TourHelper($templateCache, $http, $compile, $location, TourConfig, $q, $injector);
        }
    }

    export class uiTourService {
        private tours: Array<TourController>

        constructor(private $controller: ng.IControllerService) { }

        /**
         * If there is only one tour, returns the tour
         */
        getTour() {
            return this.tours[0];
        }

        /**
         * Look up a specific tour by name
         *
         * @param {string} name Name of tour
         */
        getTourByName(name: string) {
            return this.tours.filter((tour) => {
                return tour.options.name === name;
            })[0];
        }

        /**
         * Finds the tour available to a specific element
         *
         * @param {jqLite | HTMLElement} element Element to use to look up tour
         * @returns {*}
         */
        getTourByElement(element) {
            return angular.element(element).controller('uiTour');
        };

        /**
         * Creates a tour that is not attached to a DOM element (experimental)
         *
         * @param {string} name Name of the tour (required)
         * @param {{}=} config Options to override defaults
         */
        createDetachedTour(name: string, config: ITourConfigProperties) {
            if (!name) {
                throw {
                    name: 'ParameterMissingError',
                    message: 'A unique tour name is required for creating a detached tour.'
                };
            }

            config = config || <any>{};

            config.name = name;
            return (<any>this.$controller('uiTourController')).init(config);
        };

        /**
         * Used by uiTourController to register a tour
         *
         * @protected
         * @param tour
         */
        _registerTour(tour) {
            this.tours.push(tour);
        };

        /**
         * Used by uiTourController to remove a destroyed tour from the registry
         *
         * @protected
         * @param tour
         */
        _unregisterTour(tour) {
            this.tours.splice(this.tours.indexOf(tour), 1);
        };

        static factory($controller: ng.IControllerService) {
            return new uiTourService($controller);
        }
    }
}

((app: ng.IModule) => {
    'use strict';

    app.config(['$uibTooltipProvider', ($uibTooltipProvider: angular.ui.bootstrap.ITooltipProvider) => {
        $uibTooltipProvider.setTriggers({
            'uiTourShow': 'uiTourHide'
        });
    }]);

})(angular.module('bm.uiTour', ['ngSanitize', 'ui.bootstrap', 'smoothScroll', 'ezNg', 'cfp.hotkeys']));

(function (app: ng.IModule) {
    'use strict';

    app.factory('uiTourBackdrop', ['TourConfig', '$document', '$uibPosition', '$window', Tour.TourBackdrop.factory])
        .factory('TourHelpers', ['$templateCache', '$http', '$compile', '$location', 'TourConfig', '$q', '$injector', Tour.TourHelper.factory])
        .factory('uiTourService', ['$controller', Tour.uiTourService.factory])
        .provider('TourConfig', ['$q', Tour.TourConfigProvider])
        .controller('uiTourController', ['$timeout', '$q', '$filter', 'TourConfig', 'uiTourBackdrop', 'uiTourService', 'ezEventEmitter', 'hotkeys', Tour.TourController])
        .directive('uiTour', ['TourHelpers', (TourHelpers: Tour.TourHelper) => {

            return {
                restrict: 'EA',
                scope: true,
                controller: 'uiTourController',
                link: (scope: Tour.ITourScope, element: ng.IRootElementService, attrs, ctrl: Tour.TourController) => {

                    //Pass static options through or use defaults
                    var tour = { onReady: null },
                        events = 'onReady onStart onEnd onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        properties = 'placement animation popupDelay closePopupDelay trigger enable appendToBody tooltipClass orphan backdrop'.split(' ');

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

        }])
        .directive('tourStep', ['TourConfig', 'TourHelpers', 'uiTourService', '$uibTooltip', '$q', '$sce', (TourConfig: Tour.ITourConfig, TourHelpers: Tour.TourHelper, TourService: Tour.uiTourService, $uibTooltip, $q: ng.IQService, $sce: ng.ISCEService) => {

            var tourStepDef = $uibTooltip('tourStep', 'tourStep', 'uiTourShow', {
                popupDelay: 1 //needs to be non-zero for popping up after navigation
            });

            return {
                restrict: 'EA',
                scope: true,
                require: '?^uiTour',
                compile: (tElement, tAttrs) => {

                    if (!tAttrs.tourStep) {
                        tAttrs.$set('tourStep', '\'PH\''); //a placeholder so popup will show
                    }

                    var tourStepLinker = tourStepDef.compile(tElement, tAttrs);

                    return (scope: Tour.ITourScope, element: ng.IRootElementService, attrs: ng.IAttributes, uiTourCtrl: Tour.TourController) => {

                        var ctrl;

                        //check if this step belongs to another tour
                        if (attrs[TourHelpers.getAttrName('belongsTo')]) {
                            ctrl = TourService.getTourByName(attrs[TourHelpers.getAttrName('belongsTo')]);
                        } else if (uiTourCtrl) {
                            ctrl = uiTourCtrl;
                        }

                        if (!ctrl) {
                            throw {
                                name: 'DependencyMissingError',
                                message: 'No tour provided for tour step.'
                            };
                        }

                        //Assign required options
                        var step = <Tour.ITourStep>{
                            stepId: (<any>attrs).tourStep,
                            enabled: true,
                            config: (option) => {
                                if (angular.isDefined(step[option])) {
                                    return step[option];
                                }
                                return ctrl.config(option);
                            }
                        },
                            events = 'onShow onShown onHide onHidden onNext onPrev'.split(' '),
                            options = 'content title animation placement backdrop orphan popupDelay popupCloseDelay popupClass fixed preventScrolling scrollIntoView nextStep prevStep nextPath prevPath scrollOffset'.split(' '),
                            tooltipAttrs = 'animation appendToBody placement popupDelay popupCloseDelay'.split(' '),
                            orderWatch,
                            enabledWatch;

                        //Will add values to pass to $uibTooltip
                        var configureInheritedProperties = () => {                            
                            TourHelpers.attachTourConfigProperties(scope, attrs, step, tooltipAttrs/*, 'tourStep'*/);
                            tourStepLinker(scope, element, attrs);
                        }

                        //Pass interpolated values through
                        TourHelpers.attachInterpolatedValues(attrs, step, options);
                        orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), (order: number) => {
                            step.order = !isNaN(order * 1) ? order * 1 : 0;
                            ctrl.reorderStep(step);
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

                        //on show and on hide
                        step.show = () => {
                            element.triggerHandler('uiTourShow');
                            return $q((resolve) => {
                                element[0].dispatchEvent(new CustomEvent('uiTourShow'));
                                resolve();
                            });
                        };
                        step.hide = () => {
                            return $q((resolve) => {
                                element[0].dispatchEvent(new CustomEvent('uiTourHide'));
                                resolve();
                            });
                        };

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

                        Object.defineProperties(step, {
                            element: {
                                value: element
                            }
                        });

                        //clean up when element is destroyed
                        scope.$on('$destroy', function () {
                            ctrl.removeStep(step);
                            orderWatch();
                            enabledWatch();
                        });
                    };
                }
            };

        }])
        .directive('tourStepPopup', ['TourConfig', 'smoothScroll', 'ezComponentHelpers', (TourConfig: Tour.ITourConfig, smoothScroll, ezComponentHelpers) => {
            return {
                restrict: 'EA',
                replace: true,
                scope: { title: '@', uibTitle: '@uibTitle', content: '@', placement: '@', animation: '&', isOpen: '&', originScope: '&' },
                templateUrl: 'tour-step-popup.html',
                link: function (scope, element, attrs) {
                    var step = scope.originScope().tourStep,
                        ch = ezComponentHelpers.apply(null, arguments),
                        scrollOffset = step.config('scrollOffset');

                    //UI Bootstrap name changed in 1.3.0
                    if (!scope.title && scope.uibTitle) {
                        scope.title = scope.uibTitle;
                    }

                    //for arrow styles, unfortunately UI Bootstrap uses attributes for styling
                    attrs.$set('uib-popover-popup', 'uib-popover-popup');

                    element.css({
                        zIndex: TourConfig.get('backdropZIndex') + 2,
                        display: 'block'
                    });

                    element.addClass(step.config('popupClass'));

                    if (step.config('fixed')) {
                        element.css('position', 'fixed');
                    }

                    if (step.config('orphan')) {
                        ch.useStyles(
                            `:scope {
                               position: fixed;
                               top: 50% !important;
                               left: 50% !important;
                               margin: 0 !important;
                               -ms-transform: translateX(-50%) translateY(-50%);
                               -moz-transform: translateX(-50%) translateY(-50%);
                               -webkit-transform: translateX(-50%) translateY(-50%);
                               transform: translateX(-50%) translateY(-50%);
                            }
                            
                            .arrow
                               display: none;
                            }`
                        );
                    }

                    scope.$watch('isOpen', function (isOpen) {
                        if (isOpen() && !step.config('orphan') && step.config('scrollIntoView')) {
                            smoothScroll(element[0], {
                                offset: scrollOffset
                            });
                        }
                    });
                }
            };
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put("tour-step-popup.html",
                `<div class="popover tour-step"
                     tooltip-animation-class="fade"
                     uib-tooltip-classes
                     ng-class="{ in: isOpen() }">
                    <div class="arrow"></div>
                
                    <div class="popover-inner tour-step-inner">
                        <h3 class="popover-title tour-step-title" ng-bind="title" ng-if="title"></h3>
                        <div class="popover-content tour-step-content"
                             uib-tooltip-template-transclude="originScope().tourStep.config('templateUrl') || 'tour-step-template.html'"
                             tooltip-template-transclude-scope="originScope()"></div>
                    </div>
                </div>
                `);
            $templateCache.put("tour-step-template.html",
                `<div>
                    <div class="popover-content tour-step-content" ng-bind-html="tourStep.trustedContent"></div>
                    <div class="popover-navigation tour-step-navigation">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-default" ng-if="tourStep.isPrev" ng-click="tour.prev()">&laquo; Prev</button>
                            <button class="btn btn-sm btn-default" ng-if="tourStep.isNext" ng-click="tour.next()">Next &raquo;</button>
                            <button class="btn btn-sm btn-default" data-role="pause-resume" data-pause-text="Pause"
                                    data-resume-text="Resume" ng-click="tour.pause()">Pause
                            </button>
                        </div>
                        <button class="btn btn-sm btn-default" data-role="end" ng-click="tour.end()">End tour</button>
                    </div>
                </div>
                `);
        }]);
} (angular.module('bm.uiTour')));

(function (window) {
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})(window);
