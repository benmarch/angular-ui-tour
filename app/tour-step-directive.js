/* global angular: false */

(function (app) {
    'use strict';

    app.directive('tourStep', ['TourConfig', 'TourHelpers', 'uiTourService', '$uibTooltip', '$q', '$sce', function (TourConfig, TourHelpers, TourService, $uibTooltip, $q, $sce) {

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
                    var step = {
                            stepId: attrs.tourStep,
                            enabled: true,
                            config: function (option) {
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
                    function configureInheritedProperties() {
                        TourHelpers.attachTourConfigProperties(scope, attrs, step, tooltipAttrs, 'tourStep');
                        tourStepLinker(scope, element, attrs);
                    }

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
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

    }]);

    app.directive('tourStepPopup', ['TourConfig', 'smoothScroll', 'ezComponentHelpers', function (TourConfig, smoothScroll, ezComponentHelpers) {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@', uibTitle: '@uibTitle', content: '@', placement: '@', animation: '&', isOpen: '&', originScope: '&'},
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
                        ':scope {' +
                        '   position: fixed;' +
                        '   top: 50% !important;' +
                        '   left: 50% !important;' +
                        '   margin: 0 !important;' +
                        '   -ms-transform: translateX(-50%) translateY(-50%);' +
                        '   -moz-transform: translateX(-50%) translateY(-50%);' +
                        '   -webkit-transform: translateX(-50%) translateY(-50%);' +
                        '   transform: translateX(-50%) translateY(-50%);' +
                        '}' +
                        '' +
                        '.arrow {' +
                        '   display: none;' +
                        '}'
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
    }]);

}(angular.module('bm.uiTour')));
