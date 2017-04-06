import angular from 'angular';
/* eslint-disable */
export default function (Tether, $compile, $document, $templateCache, $rootScope, $window, $q, $timeout, positionMap) {
    'ngInject';

    const service = {};

    function createPopup(step) {
        const popup = $compile($templateCache.get('tour-step-popup.html'))(step.scope),
            parent = step.config('appendToBody') ? angular.element($document[0].body) : step.element.parent();

        parent.append(popup);
        return popup;
    }

    service.showPopup = function (step) {
        if (!step.popup) {
            step.popup = createPopup(step);
        }

        //activate Tether
        service.positionPopup(step);

        //nudge the screen to ensure that Tether is positioned properly
        $window.scrollTo($window.scrollX, $window.scrollY + 1);

        //wait until next digest
        $timeout(() => {
            //show the popup
            step.popup.css({
                visibility: 'visible',
                display: 'block'
            });

            //scroll to popup
            if (!step.config('orphan') && step.config('scrollIntoView')) {
                $document.duScrollToElementAnimated(step.popup, step.config('scrollOffset'), 500, t => t<.5 ? 2*t*t : -1+(4-2*t)*t )
                    .catch(m => 'Failed to scroll.');
            }
        }, 100); //ensures size and position are correct
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
        //orphans are positioned via css
        if (step.config('orphan')) {
            return;
        }

        //otherwise create or reposition the Tether
        if (!step.tether) {
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
