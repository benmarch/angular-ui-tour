import angular from 'angular';
import './templates/tour-step-popup.html';
import './templates/tour-step-template.html';

export default function tourStepDirective(TourHelpers, uiTourService, $sce) {
    'ngInject';

    return {
        restrict: 'EA',
        scope: true,
        require: '?^uiTour',
        link: function (scope, element, attrs, uiTourCtrl) {
            var ctrl,
            //Assign required options
                step,
                events = 'onShow onShown onHide onHidden onNext onPrev onBackdropClick'.split(' '),
                options = 'content title animation placement backdrop backdropBorderRadius orphan popupDelay popupCloseDelay popupClass fixed preventScrolling scrollIntoView nextStep prevStep nextPath prevPath scrollOffset scrollParentId'.split(' '),
                orderWatch,
                enabledWatch,
                contentWatch;

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

            //initialize the step
            step = ctrl.createStep({
                stepId: attrs.tourStep,
                element
            });

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

            // watch for content updates
            contentWatch = attrs.$observe(TourHelpers.getAttrName('content'), function (content) {
                if (content) {
                    step.trustedContent = $sce.trustAsHtml(step.content);
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

            //set up redirects (deprecated)
            if (step.nextPath) {
                step.redirectNext = true;
                TourHelpers.setRedirect(step, ctrl, 'onNext', step.nextPath, step.nextStep);
            }
            if (step.prevPath) {
                step.redirectPrev = true;
                TourHelpers.setRedirect(step, ctrl, 'onPrev', step.prevPath, step.prevStep);
            }

            /**
             * for HTML content
             * @deprecated use `step.content` instead
             */
            step.trustedContent = $sce.trustAsHtml(step.content);

            //Add step and tour to scope
            scope.tourStep = step;
            scope.tour = ctrl;

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
                contentWatch();
            });
        }
    };

}
