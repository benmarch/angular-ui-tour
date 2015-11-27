/* global angular: false */

(function (app) {
    'use strict';

    function directive() {
        return ['TourHelpers', '$location', 'uibPopoverTemplateDirective', '$q', '$timeout', 'smoothScroll', function (TourHelpers, $location, uibPopoverDirective, $q, $timeout, smoothScroll) {

            var uibPopover = uibPopoverDirective[0];
            function isHidden(elem) {
                return !( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
            }

            return {
                restrict: 'EA',
                scope: true,
                require: '^tour',
                link: function (scope, element, attrs, ctrl) {

                    //Assign required options
                    var step = {
                            element: element,
                            stepId: attrs.tourStep
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'content title path animation container placement backdrop redirect orphan reflex duration nextStep prevStep nextPath prevPath'.split(' '),
                        orderWatch,
                        skipWatch,
                        templateReady;

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
                        //ctrl.refreshTour();
                    });

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, step, events);

                    //Compile templates
                    templateReady = TourHelpers.attachTemplate(scope, attrs, step);

                    //Check whether or not the step should be skipped
                    function stepIsSkipped() {
                        var skipped;
                        if (attrs[TourHelpers.getAttrName('skip')]) {
                            skipped = scope.$eval(attrs[TourHelpers.getAttrName('skip')]);
                        }
                        if (!skipped) {
                            skipped = !!step.path || (isHidden(element[0]) && !attrs.availableWhenHidden);
                        }
                        return skipped;
                    }
                    skipWatch = scope.$watch(stepIsSkipped, function (skip) {
                        if (skip) {
                            ctrl.removeStep(step);
                        } else {
                            ctrl.addStep(step);
                        }
                    });

                    scope.$on('$destroy', function () {
                        ctrl.removeStep(step);
                        orderWatch();
                        skipWatch();
                    });

                    //If there is an options argument passed, just use that instead
                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(step, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }

                    //set up redirects
                    function setRedirect(direction, path, targetName) {
                        var oldHandler = step[direction];
                        step[direction] = function (tour) {
                            if (oldHandler) {
                                oldHandler(tour);
                            }
                            ctrl.waitFor(targetName);

                            TourHelpers.safeApply(scope, function () {
                                $location.path(path);
                            });
                            return $q.resolve();
                        };
                    }
                    if (step.nextPath) {
                        step.redirectNext = true;
                        setRedirect('onNext', step.nextPath, step.nextStep);
                    }
                    if (step.prevPath) {
                        step.redirectPrev = true;
                        setRedirect('onPrev', step.prevPath, step.prevStep);
                    }

                    //set Popover attributes
                    function setPopoverAttributeIfExists(tourStepAttr, popoverAttr, alternative) {
                        if (angular.isDefined(attrs[TourHelpers.getAttrName(tourStepAttr)])) {
                            attrs.$set(popoverAttr, attrs[TourHelpers.getAttrName(tourStepAttr)]);
                        } else if (alternative) {
                            attrs.$set(popoverAttr, alternative)
                        }
                    }
                    setPopoverAttributeIfExists('title', 'popoverTitle');
                    setPopoverAttributeIfExists('placement', 'popoverPlacement');
                    //setPopoverAttributeIfExists('animation', 'popoverAnimation');
                    setPopoverAttributeIfExists('templateUrl', 'uibPopoverTemplate', '\'tour-step-template.html\'');

                    var tooltipName = 'tour-step-' + Math.floor(Math.random() * 10000);

                    attrs.$set('popoverIsOpen', 'isOpen');
                    attrs.$set('popoverAnimation', 'false');
                    attrs.$set('popoverTrigger', 'uiTourShow');
                    attrs.$set('popoverClass', tooltipName);
                    attrs.$set('popoverAppendToBody', 'true');

                    var isOpenResolver;
                    scope.$watch('isOpen', function (isOpen) {
                        if (isOpen) {
                            var tooltip = document.getElementsByClassName(tooltipName)[0];
                            tooltip.style.visibility = 'hidden';
                            smoothScroll(tooltip, {
                                offset: 100,
                                callbackAfter: function () {
                                    tooltip.style.visibility = 'visible';
                                    isOpenResolver();
                                }
                            });
                        }
                    });

                    step.show = function () {
                        return $q(function (resolve) {
                            isOpenResolver = resolve;
                            element[0].dispatchEvent(new Event('uiTourShow'));
                        });
                    };
                    step.hide = function () {
                        return $q(function (resolve) {
                            element[0].dispatchEvent(new Event('uiTourHide'));
                            resolve();
                        });
                    };

                    //Add step to tour
                    templateReady.then(function () {
                        ctrl.addStep(step);
                        scope.tourStep = step;
                        scope.tour = scope.tour || ctrl;
                        uibPopover.compile()(scope, element, attrs);
                    });

                }
            };

        }];
    }

    app.directive('tourStep', directive());
    app.directive('uiTourStep', directive());

}(angular.module('bm.uiTour')));
