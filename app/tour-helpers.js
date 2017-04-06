import angular from 'angular';

export default function TourHelpers($http, $compile, $location, TourConfig, $q, $injector, $timeout) {
    'ngInject';

    var helpers = {},
        safeApply,
        $state;

    if ($injector.has('$state')) {
        $state = $injector.get('$state');
    }

    /**
     * Helper function that calls scope.$apply if a digest is not currently in progress
     * Borrowed from: https://coderwall.com/p/ngisma
     *
     * @param {$rootScope.Scope} scope
     * @param {Function} fn
     */
    safeApply = helpers.safeApply = function (scope, fn) {
        var phase = scope.$root.$$phase;

        if (phase === '$apply' || phase === '$digest') {
            if (fn && typeof fn === 'function') {
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
     * This will attach the properties native to Angular UI Tooltips. If there is a tour-level value set
     * for any of them, this passes that value along to the step
     *
     * @param {$rootScope.Scope} scope The tour step's scope
     * @param {Attributes} attrs The tour step's Attributes
     * @param {Object} step Represents the tour step object
     * @param {Array} properties The list of Tooltip properties
     */
    helpers.attachTourConfigProperties = function (scope, attrs, step, properties) {
        angular.forEach(properties, function (property) {
            if (!attrs[helpers.getAttrName(property)] && angular.isDefined(step.config(property))) {
                attrs.$set(helpers.getAttrName(property), String(step.config(property)));
            }
        });
    };

    /**
     * Helper function that attaches event handlers to options
     *
     * @param {$rootScope.Scope} scope
     * @param {Attributes} attrs
     * @param {Object} options represents the tour or step object
     * @param {Array} events
     * @param {boolean} prefix - used only by the tour directive
     */
    helpers.attachEventHandlers = function (scope, attrs, options, events, prefix) {

        angular.forEach(events, function (eventName) {
            var attrName = helpers.getAttrName(eventName, prefix);

            if (attrs[attrName]) {
                options[eventName] = function () {
                    return $q(function (resolve) {
                        safeApply(scope, function () {
                            resolve(scope.$eval(attrs[attrName]));
                        });
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
     * @param {boolean} prefix - used only by the tour directive
     */
    helpers.attachInterpolatedValues = function (attrs, options, keys, prefix) {

        angular.forEach(keys, function (key) {
            var attrName = helpers.getAttrName(key, prefix);

            if (attrs[attrName]) {
                options[key] = stringToBoolean(attrs[attrName]);
                attrs.$observe(attrName, function (newValue) {
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
                if (step.config('useUiRouter')) {
                    $state.go(path).then(resolve);
                } else {
                    $location.path(path);
                    $timeout(resolve);
                }
            });
        };
    };

    /**
     * Returns the attribute name for an option depending on the prefix
     *
     * @param {string} option - name of option
     * @param {string} prefix - should only be used by tour directive and set to 'uiTour'
     * @returns {string} potentially prefixed name of option, or just name of option
     */
    helpers.getAttrName = function (option, prefix) {
        return (prefix || 'tourStep') + option.charAt(0).toUpperCase() + option.substr(1);
    };

    return helpers;

}
