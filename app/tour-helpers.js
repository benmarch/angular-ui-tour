/* global angular: false */

(function (app) {
    'use strict';

    app.factory('TourHelpers', ['$templateCache', '$http', '$compile', '$location', 'TourConfig', '$q', function ($templateCache, $http, $compile, $location, TourConfig, $q) {

        var helpers = {},
            safeApply;

        /**
         * Helper function that calls scope.$apply if a digest is not currently in progress
         * Borrowed from: https://coderwall.com/p/ngisma
         *
         * @param {$rootScope.Scope} scope
         * @param {Function} fn
         */
        safeApply = helpers.safeApply = function(scope, fn) {
            var phase = scope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        };

        /**
         * Converts a stringified boolean to a JS boolean
         *
         * @param string
         * @returns {*}
         */
        function stringToBoolean(string) {
            if (string === 'true') {
                return true;
            } else if (string === 'false') {
                return false;
            }

            return string;
        }

        /**
         * Helper function that attaches event handlers to options
         *
         * @param {$rootScope.Scope} scope
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         * @param {Array} events
         */
        helpers.attachEventHandlers = function (scope, attrs, options, events) {

            angular.forEach(events, function (eventName) {
                if (attrs[helpers.getAttrName(eventName)]) {
                    options[eventName] = function (tour) {
                        safeApply(scope, function () {
                            scope.$eval(attrs[helpers.getAttrName(eventName)]);
                        });
                    };
                }
            });

        };

        /**
         * Helper function that attaches observers to option attributes
         *
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         * @param {Array} keys attribute names
         */
        helpers.attachInterpolatedValues = function (attrs, options, keys) {

            angular.forEach(keys, function (key) {
                if (attrs[helpers.getAttrName(key)]) {
                    options[key] = stringToBoolean(attrs[helpers.getAttrName(key)]);
                    attrs.$observe(helpers.getAttrName(key), function (newValue) {
                        options[key] = stringToBoolean(newValue);
                    });
                }
            });

        };

        /**
         * sets up a redirect when the next or previous step is in a different view
         *
         * @param step - the current step (not the next or prev one)
         * @param ctrl - the tour controller
         * @param direction - enum (onPrev, onNext)
         * @param path - the url that the next step is on (will use $location.path())
         * @param targetName - the ID of the next or previous step
         */
        helpers.setRedirect = function (step, ctrl, direction, path, targetName) {
            var oldHandler = step[direction];
            step[direction] = function (tour) {
                return $q(function (resolve) {
                    if (oldHandler) {
                        oldHandler(tour);
                    }
                    ctrl.waitFor(targetName);
                    $location.path(path);
                    resolve();
                });
            };
        };

        /**
         * Returns the attribute name for an option depending on the prefix
         *
         * @param {string} option - name of option
         * @returns {string} potentially prefixed name of option, or just name of option
         */
        helpers.getAttrName = function (option) {
            if (TourConfig.get('prefixOptions')) {
                return TourConfig.get('prefix') + option.charAt(0).toUpperCase() + option.substr(1);
            } else {
                return option;
            }
        };

        return helpers;

    }]);

}(angular.module('bm.uiTour')));
