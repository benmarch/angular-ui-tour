/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/* global Tour: false */

module Tour {
    export class TourDirective {
        public restrict = 'EA';
        public scope = true;
        public controller = 'uiTourController';
        public link: (scope: Tour.ITourScope, element: ng.IRootElementService, attrs, ctrl: Tour.TourController) => void;

        constructor(private TourHelpers: Tour.TourHelper) {
            TourDirective.prototype.link = (scope: Tour.ITourScope, element: ng.IRootElementService, attrs, ctrl: Tour.TourController) => {
                //Pass static options through or use defaults
                var tour = {
                    name: attrs.uiTour,
                    templateUrl: null,
                    onReady: null
                }

                this.interpolateValues(scope, attrs, tour);
                this.finalizeTour(scope, attrs, tour);
                this.finalizeScope(scope, tour, ctrl);
            };
        }

        public static Factory() {

            var directive = (TourHelpers: Tour.TourHelper) => {
                return new TourDirective(TourHelpers);
            };

            directive['$inject'] = ['TourHelpers'];

            return directive;
        }

        private interpolateValues(scope, attrs, tour) {
            var events = 'onReady onStart onEnd onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                properties = 'placement animation popupDelay closePopupDelay enable appendToBody popupClass orphan backdrop scrollOffset scrollIntoView useUiRouter useHotkeys'.split(' ');

            //Pass interpolated values through
            this.TourHelpers.attachInterpolatedValues(attrs, tour, properties, 'uiTour');

            //Attach event handlers
            this.TourHelpers.attachEventHandlers(scope, attrs, tour, events, 'uiTour');

        }

        private finalizeTour(scope, attrs, tour) {
            //override the template url
            if (attrs[this.TourHelpers.getAttrName('templateUrl', 'uiTour')]) {
                tour.templateUrl = scope.$eval(attrs[this.TourHelpers.getAttrName('templateUrl', 'uiTour')]);
            }

            //If there is an options argument passed, just use that instead
            if (attrs[this.TourHelpers.getAttrName('options')]) {
                angular.extend(tour, scope.$eval(attrs[this.TourHelpers.getAttrName('options')]));
            }
        }

        private finalizeScope(scope, tour, ctrl) {
            //Initialize tour
            scope.tour = ctrl.init(tour);
            if (typeof tour.onReady === 'function') {
                tour.onReady();
            }

            scope.$on('$destroy', function () {
                ctrl.destroy();
            });
        }
    }
}

((app: ng.IModule) => {
    'use strict';

    app.config(['$uibTooltipProvider', ($uibTooltipProvider: angular.ui.bootstrap.ITooltipProvider) => {
        $uibTooltipProvider.setTriggers({
            'uiTourShow': 'uiTourHide'
        });
    }]);

})(angular.module('bm.uiTour', ['ngSanitize', 'ui.bootstrap', 'smoothScroll', 'ezNg', 'cfp.hotkeys']));

(function (app: ng.IModule) {
    'use strict';

    app.factory('uiTourBackdrop', ['TourConfig', '$document', '$uibPosition', '$window', Tour.TourBackdrop.factory])
        .factory('TourHelpers', ['$templateCache', '$http', '$compile', '$location', 'TourConfig', '$q', '$injector', Tour.TourHelper.factory])
        .factory('uiTourService', ['$controller', Tour.uiTourService.factory])
        .provider('TourConfig', [Tour.TourConfigProvider])
        .controller('uiTourController', ['$timeout', '$q', '$filter', 'TourConfig', 'uiTourBackdrop', 'uiTourService', 'ezEventEmitter', 'hotkeys', Tour.TourController])
        .directive('uiTour', ['TourHelpers', Tour.TourDirective.Factory()])
        .directive('tourStepPopup', ['TourConfig', 'smoothScroll', 'ezComponentHelpers', Tour.TourStepPopupDirective.Factory()])
        .directive('tourStep', ['TourConfig', 'TourHelpers', 'uiTourService', '$uibTooltip', '$q', '$sce', Tour.TourStepDirective.Factory()])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put("tour-step-popup.html",
                `<div class="popover tour-step"
                     tooltip-animation-class="fade"
                     uib-tooltip-classes
                     ng-class="{ in: isOpen() }">
                    <div class="arrow"></div>
                
                    <div class="popover-inner tour-step-inner">
                        <h3 class="popover-title tour-step-title" ng-bind="title" ng-if="title"></h3>
                        <div class="popover-content tour-step-content"
                             uib-tooltip-template-transclude="originScope().tourStep.config('templateUrl') || 'tour-step-template.html'"
                             tooltip-template-transclude-scope="originScope()"></div>
                    </div>
                </div>
                `);
            $templateCache.put("tour-step-template.html",
                `<div>
                    <div class="popover-content tour-step-content" ng-bind-html="tourStep.trustedContent"></div>
                    <div class="popover-navigation tour-step-navigation">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-default" ng-if="tourStep.isPrev" ng-click="tour.prev()">&laquo; Prev</button>
                            <button class="btn btn-sm btn-default" ng-if="tourStep.isNext" ng-click="tour.next()">Next &raquo;</button>
                            <button class="btn btn-sm btn-default" data-role="pause-resume" data-pause-text="Pause"
                                    data-resume-text="Resume" ng-click="tour.pause()">Pause
                            </button>
                        </div>
                        <button class="btn btn-sm btn-default" data-role="end" ng-click="tour.end()">End tour</button>
                    </div>
                </div>
                `);
        }]);
} (angular.module('bm.uiTour')));

(function (window) {
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})(window);
