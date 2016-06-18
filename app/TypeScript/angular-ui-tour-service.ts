
module Tour {
    export class uiTourService {
        private tours: Array<TourController>

        constructor(private $controller: ng.IControllerService) {
            this.tours = [];
        }

        /**
         * If there is only one tour, returns the tour
         */
        getTour() {
            return this.tours[0];
        }

        /**
         * Look up a specific tour by name
         *
         * @param {string} name Name of tour
         */
        getTourByName(name: string) {
            return this.tours.filter((tour) => {
                return tour.options.name === name;
            })[0];
        }

        /**
         * Finds the tour available to a specific element
         *
         * @param {jqLite | HTMLElement} element Element to use to look up tour
         * @returns {*}
         */
        getTourByElement(element) {
            return angular.element(element).controller('uiTour');
        };

        /**
         * Creates a tour that is not attached to a DOM element (experimental)
         *
         * @param {string} name Name of the tour (required)
         * @param {{}=} config Options to override defaults
         */
        createDetachedTour(name: string, config: ITourConfigProperties) {
            if (!name) {
                throw {
                    name: 'ParameterMissingError',
                    message: 'A unique tour name is required for creating a detached tour.'
                };
            }

            config = config || <any>{};

            config.name = name;
            return (<any>this.$controller('uiTourController')).init(config);
        };

        /**
         * Used by uiTourController to register a tour
         *
         * @protected
         * @param tour
         */
        _registerTour(tour) {
            this.tours.push(tour);
        };

        /**
         * Used by uiTourController to remove a destroyed tour from the registry
         *
         * @protected
         * @param tour
         */
        _unregisterTour(tour) {
            this.tours.splice(this.tours.indexOf(tour), 1);
        };

        static factory($controller: ng.IControllerService) {
            return new uiTourService($controller);
        }
    }
}
