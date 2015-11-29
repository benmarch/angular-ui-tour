/* global angular: false */

(function (app) {
    'use strict';

    app.directive('tourStep', ['TourHelpers', '$uibTooltip', '$q', '$sce', function (TourHelpers, $uibTooltip, $q, $sce) {

        var tourStepDef = $uibTooltip('tourStep', 'tourStep', 'uiTourShow', {
            popupDelay: 1 //needs to be non-zero for popping up after navigation
        });

        return {
            restrict: 'EA',
            scope: true,
            require: '^uiTour',
            compile: function (tElement, tAttrs) {

                if (!tAttrs.tourStep) {
                    tAttrs.$set('tourStep', '\'PH\''); //a placeholder so popup will show
                }

                var tourStepLinker = tourStepDef.compile(tElement, tAttrs);

                return function (scope, element, attrs, ctrl) {

                    //Assign required options
                    var step = {
                            element: element,
                            stepId: attrs.tourStep,
                            enabled: true
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev'.split(' '),
                        options = 'content title enabled animation placement backdrop orphan popupDelay popupCloseDelay fixed preventScrolling nextStep prevStep nextPath prevPath'.split(' '),
                        orderWatch;

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
                        ctrl.reorderStep(step);
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
                    step.show = function () {
                        element.triggerHandler('uiTourShow');
                        return $q(function (resolve) {
                            element[0].dispatchEvent(new CustomEvent('uiTourShow'));
                            resolve();
                        });
                    };
                    step.hide = function () {
                        return $q(function (resolve) {
                            element[0].dispatchEvent(new CustomEvent('uiTourHide'));
                            resolve();
                        });
                    };

                    //for HTML content
                    step.trustedContent = $sce.trustAsHtml(step.content);

                    //Add step to tour
                    ctrl.addStep(step);
                    scope.tourStep = step;
                    scope.tour = scope.tour || ctrl;
                    tourStepLinker(scope, element, attrs);

                    //clean up when element is destroyed
                    scope.$on('$destroy', function () {
                        ctrl.removeStep(step);
                        orderWatch();
                    });
                };
            }
        };

    }]);

    app.directive('tourStepPopup', ['TourConfig', 'smoothScroll', function (TourConfig, smoothScroll) {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&', originScope: '&'},
            templateUrl: 'tour-step-popup.html',
            link: function (scope, element) {
                element.css('zIndex', TourConfig.get('backdropZIndex') + 2);
                if (scope.originScope().tourStep.fixed) {
                    element.css('position', 'fixed');
                }
                scope.$watch('isOpen', function (isOpen) {
                    if (isOpen()) {
                        smoothScroll(element[0], {
                            offset: 100
                        });
                    }
                });
            }
        };
    }]);

}(angular.module('bm.uiTour')));
