/* global angular: false */

(function (app) {
    'use strict';

    function directive () {
        return ['TourHelpers', function (TourHelpers) {

            return {
                restrict: 'EA',
                scope: true,
                controller: 'TourController',
                link: function (scope, element, attrs, ctrl) {

                    //Pass static options through or use defaults
                    var tour = {},
                        events = 'onStart onEnd afterGetState afterSetState afterRemoveState onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'name container keyboard storage debug redirect duration basePath backdrop orphan'.split(' ');

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, tour, options);

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, tour, events);

                    //Monitor number of steps
                    scope.$watchCollection(ctrl.getSteps, function (steps) {
                        if (!steps) return;
                        scope.stepCount = steps.length;
                    });

                    //If there is an options argument passed, just use that instead
                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(tour, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }

                    //Initialize tour
                    scope.tour = ctrl.init(tour);
                }
            };

        }];
    }

    app.directive('tour', directive());
    app.directive('uiTour', directive());

}(angular.module('bm.uiTour')));
