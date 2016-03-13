(function (module) {
    'use strict';

    module.factory('uiTourService', [function () {

        var service = {},
            tours = [];

        /**
         * If there is only one tour, returns the tour
         */
        service.getTour = function () {
            return tours[0];
        };

        /**
         * Look up a specific tour by name
         *
         * @param {string} name Name of tour
         */
        service.getTourByName = function (name) {
            return tours.filter(function (tour) {
                return tour.options.name === name;
            })[0];
        };

        /**
         * Finds the tour available to a specific element
         *
         * @param {jqLite | HTMLElement} element Element to use to look up tour
         * @returns {*}
         */
        service.getTourByElement = function (element) {
            return angular.element(element).controller('uiTour');
        };

        /**
         * Used by uiTourController to register a tour
         *
         * @protected
         * @param tour
         * @private
         */
        service._registerTour = function (tour) {
            tours.push(tour);
        };

        return service;

    }]);

}(angular.module('bm.uiTour')));
