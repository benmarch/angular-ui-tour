module Tour {
    export class TourHelper {
        $state

        constructor(private $templateCache: ng.ITemplateCacheService, private $http: ng.IHttpService, private $compile: ng.ICompileService, private $location: ng.ILocationService, private TourConfig: ITourConfig, private $q: ng.IQService, private $injector) {
            if ($injector.has('$state')) {
                this.$state = $injector.get('$state');
            }
        }

        /**
        * Helper function that calls scope.$apply if a digest is not currently in progress
        * Borrowed from: https://coderwall.com/p/ngisma
        *
        * @param {$rootScope.Scope} scope
        * @param {Function} fn
        */
        safeApply(scope: ng.IScope, fn: () => any) {
            var phase = scope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        }

        /**
         * Converts a stringified boolean to a JS boolean
         *
         * @param string
         * @returns {*}
         */
        stringToBoolean(string) {
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
        attachTourConfigProperties(scope, attrs, step, properties) {
            angular.forEach(properties, (property) => {
                if (!attrs[this.getAttrName(property)] && angular.isDefined(step.config(property))) {
                    attrs.$set(this.getAttrName(property), String(step.config(property)));
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
        attachEventHandlers(scope, attrs, options, events, prefix?) {

            angular.forEach(events, (eventName) => {
                var attrName = this.getAttrName(eventName, prefix);
                if (attrs[attrName]) {
                    options[eventName] = () => {
                        return this.$q((resolve) => {
                            this.safeApply(scope, () => {
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
        attachInterpolatedValues(attrs, options, keys, prefix?) {

            angular.forEach(keys, (key) => {
                var attrName = this.getAttrName(key, prefix);
                if (attrs[attrName]) {
                    options[key] = this.stringToBoolean(attrs[attrName]);
                    attrs.$observe(attrName, (newValue) => {
                        options[key] = this.stringToBoolean(newValue);
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
        setRedirect(step, ctrl, direction, path, targetName) {
            var oldHandler = step[direction];
            step[direction] = (tour) => {
                return this.$q((resolve) => {
                    if (oldHandler) {
                        oldHandler(tour);
                    }
                    ctrl.waitFor(targetName);
                    if (step.config('useUiRouter')) {
                        this.$state.transitionTo(path).then(resolve);
                    } else {
                        this.$location.path(path);
                        resolve();
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
        getAttrName(option, prefix?) {
            return (prefix || 'tourStep') + option.charAt(0).toUpperCase() + option.substr(1);
        };
        static factory($templateCache: ng.ITemplateCacheService, $http: ng.IHttpService, $compile: ng.ICompileService, $location: ng.ILocationService, TourConfig: ITourConfig, $q: ng.IQService, $injector: ng.IInjectStatic) {
            return new TourHelper($templateCache, $http, $compile, $location, TourConfig, $q, $injector);
        }
    }
}