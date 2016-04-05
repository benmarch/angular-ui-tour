/* global angular: false */

(function (app) {
    'use strict';

    app.directive('uiTour', ['TourHelpers', function (TourHelpers) {

        return {
            restrict: 'EA',
            scope: true,
            controller: 'uiTourController',
            link: function (scope, element, attrs, ctrl) {

                //Pass static options through or use defaults
                var tour = {
                        name: attrs.uiTour
                    },
                    events = 'onReady onStart onEnd onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                    properties = 'placement animation popupDelay closePopupDelay enable appendToBody popupClass orphan backdrop scrollOffset scrollIntoView useUiRouter useHotkeys'.split(' ');

                //Pass interpolated values through
                TourHelpers.attachInterpolatedValues(attrs, tour, properties, 'uiTour');

                //Attach event handlers
                TourHelpers.attachEventHandlers(scope, attrs, tour, events, 'uiTour');

                //override the template url
                if (attrs[TourHelpers.getAttrName('templateUrl', 'uiTour')]) {
                    tour.templateUrl = scope.$eval(attrs[TourHelpers.getAttrName('templateUrl', 'uiTour')]);
                }

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

    }]);

}(angular.module('bm.uiTour')));
