module Tour {
    export class TourStepCompiler {
        private ctrl: TourController
        private step: ITourStep
        private events: Array<string>
        private options: Array<string>
        private tooltipAttrs: Array<string>
        private orderWatch
        private enabledWatch

        public TourHelpers: TourHelper
        public TourService: uiTourService
        public $q: ng.IQService
        public $sce: ng.ISCEService
        public tourStepLinker

        constructor(private scope: Tour.ITourScope, private element: ng.IRootElementService, private attrs: ng.IAttributes, private uiTourCtrl: Tour.TourController) {
            this.initializeVariables();
            if (attrs[this.TourHelpers.getAttrName('if')] !== undefined && attrs[this.TourHelpers.getAttrName('if')] === "false") {
                return;
            }

            this.addWatches();
            this.finalizeStep();
            this.addStepToScope();
            Object.defineProperties(this.step, {
                element: {
                    value: element
                }
            });

            //clean up when element is destroyed
            scope.$on('$destroy', function () {
                this.ctrl.removeStep(this.step);
                this.orderWatch();
                this.enabledWatch();
            });
        }

        public static Factory() {

            var compiler = (scope: Tour.ITourScope, element: ng.IRootElementService, attrs: ng.IAttributes, uiTourCtrl: Tour.TourController) => {
                return new TourStepCompiler(scope, element, attrs, uiTourCtrl);
            };

            compiler['$inject'] = ['scope', 'element', 'attrs', 'uiTourCtrl'];

            return compiler;
        }

        private initializeVariables() {
            this.ctrl = this.getCtrl(this.attrs, this.uiTourCtrl);
            this.step = {
                show: () => {
                    this.element.triggerHandler('uiTourShow');
                    return this.$q((resolve) => {
                        this.element[0].dispatchEvent(new CustomEvent('uiTourShow'));
                        resolve();
                    });
                },
                hide: () => {
                    return this.$q((resolve) => {
                        this.element[0].dispatchEvent(new CustomEvent('uiTourHide'));
                        resolve();
                    });
                },
                stepId: (<any>this.attrs).tourStep,
                enabled: true,
                config: (option) => {
                    if (angular.isDefined(this.step[option])) {
                        return this.step[option];
                    }
                    return this.ctrl.config(option);
                }
            };
            this.events = 'onShow onShown onHide onHidden onNext onPrev'.split(' ');
            this.options = 'content title animation placement backdrop orphan popupDelay popupCloseDelay popupClass fixed preventScrolling scrollIntoView nextStep prevStep nextPath prevPath scrollOffset'.split(' ');
            this.tooltipAttrs = 'animation appendToBody placement popupDelay popupCloseDelay'.split(' ');
        }

        private addWatches() {
            this.TourHelpers.attachInterpolatedValues(this.attrs, this.step, this.options);
            this.orderWatch = this.attrs.$observe(this.TourHelpers.getAttrName('order'), (order: number) => {
                this.step.order = !isNaN(order * 1) ? order * 1 : 0;
                this.ctrl.reorderStep(this.step);
            });
            this.enabledWatch = this.attrs.$observe(this.TourHelpers.getAttrName('enabled'), function (isEnabled) {
                this.step.enabled = isEnabled !== 'false';
                if (this.step.enabled) {
                    this.ctrl.addStep(this.step);
                } else {
                    this.ctrl.removeStep(this.step);
                }
            });
        }

        private finalizeStep() {
            //Attach event handlers
            this.TourHelpers.attachEventHandlers(this.scope, this.attrs, this.step, this.events);

            if (this.attrs[this.TourHelpers.getAttrName('templateUrl')]) {
                this.step.templateUrl = this.scope.$eval(this.attrs[this.TourHelpers.getAttrName('templateUrl')]);
            }

            //If there is an options argument passed, just use that instead
            if (this.attrs[this.TourHelpers.getAttrName('options')]) {
                angular.extend(this.step, this.scope.$eval(this.attrs[this.TourHelpers.getAttrName('options')]));
            }

            //set up redirects
            if (this.step.nextPath) {
                this.step.redirectNext = true;
                this.TourHelpers.setRedirect(this.step, this.ctrl, 'onNext', this.step.nextPath, this.step.nextStep);
            }
            if (this.step.prevPath) {
                this.step.redirectPrev = true;
                this.TourHelpers.setRedirect(this.step, this.ctrl, 'onPrev', this.step.prevPath, this.step.prevStep);
            }

            //for HTML content
            this.step.trustedContent = this.$sce.trustAsHtml(this.step.content);
        }

        private addStepToScope() {

            //Add step to tour
            this.scope.tourStep = this.step;
            this.scope.tour = this.scope.tour || this.ctrl;
            if (this.ctrl.initialized) {
                this.configureInheritedProperties();
                this.ctrl.addStep(this.step);
            } else {
                this.ctrl.once('initialized', () => {
                    this.configureInheritedProperties();
                    this.ctrl.addStep(this.step);
                });
            }
        }

        private configureInheritedProperties() {
            this.TourHelpers.attachTourConfigProperties(this.scope, this.attrs, this.step, this.tooltipAttrs/*, 'tourStep'*/);
            this.tourStepLinker(this.scope, this.element, this.attrs);
        }

        private getCtrl(attrs, uiTourCtrl) {
            var ctrl: Tour.TourController;

            if (attrs[this.TourHelpers.getAttrName('belongsTo')]) {
                ctrl = this.TourService.getTourByName(attrs[this.TourHelpers.getAttrName('belongsTo')]);
            } else if (uiTourCtrl) {
                ctrl = uiTourCtrl;
            }

            if (!ctrl) {
                throw {
                    name: 'DependencyMissingError',
                    message: 'No tour provided for tour step.'
                };
            }

            return ctrl;
        }
    }

    export class TourStepDirective {
        private tourStepDef;

        public restrict: string;
        public scope: boolean;
        public require: string;
        public compile: (element: ng.IAugmentedJQuery, attr: ng.IAttributes) => (...any) => TourStepCompiler;

        constructor(private TourConfig: Tour.ITourConfig, private TourHelpers: Tour.TourHelper, private TourService: Tour.uiTourService, private $uibTooltip, private $q: ng.IQService, private $sce: ng.ISCEService) {
            this.restrict = 'EA';
            this.scope = true;
            this.require = '?^uiTour';
            this.tourStepDef = $uibTooltip('tourStep', 'tourStep', 'uiTourShow', {
                popupDelay: 1 //needs to be non-zero for popping up after navigation
            });

            Tour.TourStepDirective.prototype.compile = (tElement, tAttrs) => {
                TourStepCompiler.prototype.$q = $q;
                TourStepCompiler.prototype.$sce = $sce;
                TourStepCompiler.prototype.TourHelpers = TourHelpers;
                TourStepCompiler.prototype.TourService = TourService;
                TourStepCompiler.prototype.tourStepLinker = this.tourStepDef.compile(tElement, tAttrs);

                if (!(<any>tAttrs).tourStep) {
                    tAttrs.$set('tourStep', '\'PH\''); //a placeholder so popup will show
                }

                return TourStepCompiler.Factory();
            }
        }

        public static Factory() {

            var directive = (TourConfig: Tour.ITourConfig, TourHelpers: Tour.TourHelper, TourService: Tour.uiTourService, $uibTooltip, $q: ng.IQService, $sce: ng.ISCEService) => {
                return new TourStepDirective(TourConfig, TourHelpers, TourService, $uibTooltip, $q, $sce);
            };

            directive['$inject'] = ['TourConfig', 'TourHelpers', 'uiTourService', '$uibTooltip', '$q', '$sce'];

            return directive;
        }

        private getCtrl(attrs, uiTourCtrl) {
            var ctrl: Tour.TourController;

            if (attrs[this.TourHelpers.getAttrName('belongsTo')]) {
                ctrl = this.TourService.getTourByName(attrs[this.TourHelpers.getAttrName('belongsTo')]);
            } else if (uiTourCtrl) {
                ctrl = uiTourCtrl;
            }

            if (!ctrl) {
                throw {
                    name: 'DependencyMissingError',
                    message: 'No tour provided for tour step.'
                };
            }

            return ctrl;
        }
    }
}
