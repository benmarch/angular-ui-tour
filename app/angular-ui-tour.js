import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-bootstrap';
import 'ngSmoothScroll';
import 'ez-ng';
import 'angular-hotkeys';
import '../lib/custom-event-polyfill';

function config($uibTooltipProvider) {
    'ngInject';

    $uibTooltipProvider.setTriggers({
        uiTourShow: 'uiTourHide'
    });
}

export default angular.module('bm.uiTour', [
    'ngSanitize',
    'ui.bootstrap',
    'smoothScroll',
    'ezNg',
    'cfp.hotkeys'
])
    .config(config)
    .provider('TourConfig', require('./tour-config-provider'))
    .factory('uiTourBackdrop', require('./backdrop-service'))
    .factory('TourHelpers', require('./tour-helpers'))
    .factory('uiTourService', require('./tour-service'))
    .controller('uiTourController', require('./tour-controller'))
    .directive('uiTour', require('./tour-directive'))
    .directive('tourStep', require('./tour-step-directive').tourStepDirective)
    .directive('tourStepPopup', require('./tour-step-directive').tourStepPopupDirective)
    .name;
