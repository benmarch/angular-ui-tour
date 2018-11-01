module Tour {
    export class TourStepPopupDirective {
        public restrict = 'EA';
        public replace = true;
        public scope = { title: '@', uibTitle: '@uibTitle', content: '@', placement: '@', animation: '&', isOpen: '&', originScope: '&' };
        public templateUrl = 'tour-step-popup.html';
        public link: (scope, element: ng.IRootElementService, attrs, ctrl: Tour.TourController) => void;

        constructor(TourConfig: Tour.ITourConfig, smoothScroll, ezComponentHelpers) {
            TourStepPopupDirective.prototype.link = function (scope, element: ng.IRootElementService, attrs, ctrl: Tour.TourController) {
                var step = scope.originScope().tourStep,
                    ch = ezComponentHelpers.apply(null, arguments),
                    scrollOffset = step.config('scrollOffset');

                //UI Bootstrap name changed in 1.3.0
                if (!scope.title && scope.uibTitle) {
                    scope.title = scope.uibTitle;
                }

                //for arrow styles, unfortunately UI Bootstrap uses attributes for styling
                attrs.$set('uib-popover-popup', 'uib-popover-popup');

                element.css({
                    zIndex: TourConfig.get('backdropZIndex') + 2,
                    display: 'block'
                });

                element.addClass(step.config('popupClass'));

                if (step.config('fixed')) {
                    element.css('position', 'fixed');
                }

                if (step.config('orphan')) {
                    ch.useStyles(
                        `:scope {
                               position: fixed;
                               top: 50% !important;
                               left: 50% !important;
                               margin: 0 !important;
                               -ms-transform: translateX(-50%) translateY(-50%);
                               -moz-transform: translateX(-50%) translateY(-50%);
                               -webkit-transform: translateX(-50%) translateY(-50%);
                               transform: translateX(-50%) translateY(-50%);
                            }
                            
                            .arrow
                               display: none;
                            }`
                    );
                }

                scope.$watch('isOpen', (isOpen: () => boolean) => {
                    if (isOpen() && !step.config('orphan') && step.config('scrollIntoView')) {
                        smoothScroll(element[0], {
                            offset: scrollOffset
                        });
                    }
                });
            };
        }

        public static Factory() {

            var directive = (TourConfig: Tour.ITourConfig, smoothScroll, ezComponentHelpers) => {
                return new TourStepPopupDirective(TourConfig, smoothScroll, ezComponentHelpers);
            };

            directive['$inject'] = ['TourConfig', 'smoothScroll', 'ezComponentHelpers'];

            return directive;
        }
    }
}