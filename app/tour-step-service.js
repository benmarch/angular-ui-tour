import angular from 'angular';

export default function (Tether, $compile, $document, $templateCache, $rootScope, $window, $q, $timeout, positionMap, uiTourBackdrop) {
    'ngInject';

    const service = {},
        /* eslint-disable */
        easeInOutQuad = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
        /* eslint-enable */

    function isInDOM(element) {
        return $document[0].documentElement.contains(element);
    }

    function createPopup(step, tour) {
        const scope = angular.extend($rootScope.$new(), {
                tourStep: step,
                tour: tour
            }),
            popup = $compile($templateCache.get('tour-step-popup.html'))(scope),
            parent = step.config('appendToBody') ? angular.element($document[0].body) : step.element.parent();

        parent.append(popup);
        return popup;
    }

    function focusPopup(step) {
        if (!step.config('orphan') && step.config('scrollIntoView')) {
            const scrollParent = step.config('scrollParentId') === '$document' ? $document : angular.element($document[0].getElementById(step.config('scrollParentId')));

            scrollParent.duScrollToElementAnimated(step.popup, step.config('scrollOffset'), 500, easeInOutQuad)
                .then(() => {
                    step.popup[0].focus();
                }, () => 'Failed to scroll.');
        } else {
            step.popup[0].focus();
        }
    }

    function positionPopup(step) {
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
    }

    /**
     * Initializes a step from a config object
     *
     * @param {{}} step - Step options
     * @param {{}} tour - The tour to which the step belongs
     * @returns {*} configured step
     */
    service.createStep = function (step, tour) {
        if (!step.element && !step.elementId && !step.selector) {
            throw {
                name: 'PropertyMissingError',
                message: 'Steps require an element, ID, or selector to be specified'
            };
        }

        //for getting inherited options
        step.config = function (option) {
            if (angular.isDefined(step[option])) {
                return step[option];
            }
            return tour.config(option);
        };

        //forces Tether to reposition
        step.reposition = function () {
            if (step.tether) {
                step.tether.position();
            }
        };

        //ensure it is enabled by default
        if (!angular.isDefined(step.enabled)) {
            step.enabled = true;
        }

        return step;
    };

    /**
     * Activates the popup for a given step
     *
     * @param step
     */
    service.showPopup = function (step, tour) {
        //select the element
        if (!step.element || !isInDOM(step.element[0])) {
            if (step.elementId) {
                step.element = angular.element($document[0].getElementById(step.elementId));
            }
            if (step.selector) {
                step.element = angular.element($document[0].querySelector(step.selector));
            }

            //no step target found
            if (!step.element) {
                throw `No element found for step: '${step}'.`;
            }
        }

        //create the popup
        if (!step.popup) {
            step.popup = createPopup(step, tour);
        }

        //create the backdrop
        if (step.config('backdrop')) {
            uiTourBackdrop.createForElement(step.element, {
                preventScrolling: step.config('preventScrolling'),
                fixed: step.config('fixed'),
                borderRadius: step.config('backdropBorderRadius'),
                padding: step.config('backdropPadding'),
                fullScreen: step.config('orphan'),
                events: {
                    click: step.config('onBackdropClick')
                }
            });
        } else {
            uiTourBackdrop.hide();
        }

        //set prevent scrolling (deprecated)
        uiTourBackdrop.shouldPreventScrolling(step.config('preventScrolling') || false);

        //activate Tether
        positionPopup(step);

        //activate step
        step.element.addClass('ui-tour-active-step');

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
            focusPopup(step);

        }, 100); //ensures size and position are correct
    };

    /**
     * Hides the popup for a given step
     *
     * @param step
     */
    service.hidePopup = function (step) {
        //deactivate Tether
        if (step.tether) {
            step.tether.disable();
        }

        //deactivate step
        step.element.removeClass('ui-tour-active-step');

        //hide the popup
        step.popup[0].style.setProperty('display', 'none', 'important');
    };

    return service;
}
