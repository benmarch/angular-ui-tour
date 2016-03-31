(function (module) {
    'use strict';

    module.factory('uiTourService', ['$controller', function ($controller) {

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
         * Creates a tour that is not attached to a DOM element (experimental)
         *
         * @param {string} name Name of the tour (required)
         * @param {{}=} config Options to override defaults
         */
        service.createDetachedTour = function (name, config) {
            if (!name) {
                throw {
                    name: 'ParameterMissingError',
                    message: 'A unique tour name is required for creating a detached tour.'
                };
            }

            config = config || {};

            config.name = name;
            return $controller('uiTourController').init(config);
        };

        /**
         * Used by uiTourController to register a tour
         *
         * @protected
         * @param tour
         */
        service._registerTour = function (tour) {
            tours.push(tour);
        };

        /**
         * Used by uiTourController to remove a destroyed tour from the registry
         *
         * @protected
         * @param tour
         */
        service._unregisterTour = function (tour) {
            tours.splice(tours.indexOf(tour), 1);
        };

        return service;

    }]);

}(angular.module('bm.uiTour')));
