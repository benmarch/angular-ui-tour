import angular from 'angular';
import './templates/tour-step-popup.html';
import './templates/tour-step-template.html';

export function tourStepDirective(TourConfig, TourHelpers, uiTourService, $uibTooltip, $q, $sce) {
    'ngInject';

    var tourStepDef = $uibTooltip('tourStep', 'tourStep', 'uiTourShow', {
        popupDelay: 1 //needs to be non-zero for popping up after navigation
    });

    return {
        restrict: 'EA',
        scope: true,
        require: '?^uiTour',
        compile: function (tElement, tAttrs) {

            if (!tAttrs.tourStep) {
                tAttrs.$set('tourStep', '\'PH\''); //a placeholder so popup will show
            }

            var tourStepLinker = tourStepDef.compile(tElement, tAttrs);

            return function (scope, element, attrs, uiTourCtrl) {

                var ctrl,
                //Assign required options
                    step = {
                        stepId: attrs.tourStep,
                        enabled: true,
                        config: function (option) {
                            if (angular.isDefined(step[option])) {
                                return step[option];
                            }
                            return ctrl.config(option);
                        }
                    },
                    events = 'onShow onShown onHide onHidden onNext onPrev onBackdropClick'.split(' '),
                    options = 'content title animation placement backdrop backdropBorderRadius orphan popupDelay popupCloseDelay popupClass fixed preventScrolling scrollIntoView nextStep prevStep nextPath prevPath scrollOffset'.split(' '),
                    tooltipAttrs = 'animation appendToBody placement popupDelay popupCloseDelay'.split(' '),
                    orderWatch,
                    enabledWatch;

                //check if this step belongs to another tour
                if (attrs[TourHelpers.getAttrName('belongsTo')]) {
                    ctrl = uiTourService.getTourByName(attrs[TourHelpers.getAttrName('belongsTo')]);
                } else if (uiTourCtrl) {
                    ctrl = uiTourCtrl;
                }

                if (!ctrl) {
                    throw {
                        name: 'DependencyMissingError',
                        message: 'No tour provided for tour step.'
                    };
                }

                //Will add values to pass to $uibTooltip
                function configureInheritedProperties() {
                    TourHelpers.attachTourConfigProperties(scope, attrs, step, tooltipAttrs, 'tourStep');
                    tourStepLinker(scope, element, attrs);
                }

                //Pass interpolated values through
                TourHelpers.attachInterpolatedValues(attrs, step, options);
                orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                    step.order = !isNaN(order * 1) ? order * 1 : 0;
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
                scope.tour = ctrl;
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
                    },
                    scope: {
                        value: scope
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

}

export function tourStepPopupDirective() {
    'ngInject';

    return {
        restrict: 'A',
        scope: {
            uibTitle: '@',
            contentExp: '&',
            originScope: '&'
        },
        templateUrl: 'tour-step-popup.html',
        link: function (scope, element, attrs) {
            //for arrow styles, unfortunately UI Bootstrap uses attributes for styling
            attrs.$set('uib-popover-popup', 'uib-popover-popup');
        }
    };
}
