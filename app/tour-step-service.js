import angular from 'angular';
/* eslint-disable */
export default function (Tether, $compile, $document, $templateCache, $rootScope, $window, $q, $timeout, positionMap) {
    'ngInject';

    const service = {};

    function createPopup(step) {
        const popupStub = angular.element($document[0].createElement('div')),
            parent = step.config('appendToBody') ? angular.element($document[0].body) : step.element.parent(),
            scope = $rootScope.$new();
        let popup;

        scope.originScope = () => step.scope;
        scope.uibTitle = step.config('title');

        popup = $compile(popupStub.html($templateCache.get('tour-step-popup.html')))(scope);
        popup.addClass(`tourStep ui-tour-popup popover ${step.config('popupClass')}`);
        //for arrow styles, unfortunately UI Bootstrap uses attributes for styling
        popup.attr('uib-popover-popup', 'uib-popover-popup');
        popup.css({
            visibility: 'hidden',
            zIndex: step.config('backdropZIndex') + 2
        });

        //fixed
        if (step.config('fixed')) {
            popup.css('position', 'fixed');
        }

        //orphan
        if (!step.config('orphan')) {
            popup.addClass(step.config('placement'));
        }

        parent.append(popup);
        return popup;
    }

    service.showPopup = function (step) {
        if (!step.popup) {
            step.popup = createPopup(step);
        }
        //first timeout to make sure popup content loads
        $timeout(() => {
            service.positionPopup(step);
            $window.scrollTo($window.scrollX, $window.scrollY + 1);
            //second timeout to make sure Tether is positioned
            $timeout(() => {
                step.popup.css({
                    visibility: 'visible',
                    display: 'block'
                });
                if (!step.config('orphan') && step.config('scrollIntoView')) {
                    $document.duScrollToElementAnimated(step.popup, step.config('scrollOffset'), 500, t => t<.5 ? 2*t*t : -1+(4-2*t)*t )
                        .catch(m => 'Failed to scroll.');
                }
            }, 100);
        });
    };

    service.hidePopup = function (step) {
        if (!step.popup) {
            step.popup = createPopup(step);
        }
        if (step.tether) {
            step.tether.disable();
        }
        step.popup[0].style.setProperty('display', 'none', 'important');
    };

    service.positionPopup = function (step) {
        //center an orphan
        if (step.config('orphan')) {
            step.popup.addClass('tour-step-orphan');
        } else if (!step.tether) {
            //create a tether
            step.tether = new Tether({
                element: step.popup[0],
                target: step.element[0],
                attachment: positionMap[step.config('placement')].popup,
                targetAttachment: positionMap[step.config('placement')].target
            });
            step.tether.position();
        } else {
            //just reposition the tether
            step.tether.enable();
            step.tether.position();
        }
    };

    return service;
}
