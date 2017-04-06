import angular from 'angular';
import 'angular-sanitize';
import 'angular-bootstrap';
import 'angular-scroll';
import 'ez-ng';
import 'angular-hotkeys';
import 'tether';
import '../lib/custom-event-polyfill';
import './styles/angular-ui-tour.css';

function config($uibTooltipProvider) {
    'ngInject';

    $uibTooltipProvider.setTriggers({
        uiTourShow: 'uiTourHide'
    });
}

export default angular.module('bm.uiTour', [
    'ngSanitize',
    'ui.bootstrap',
    'duScroll',
    'ezNg',
    'cfp.hotkeys'
])
    .config(config)
    .value('Tether', window.Tether)
    .constant('positionMap', require('./tether-position-map'))
    .provider('TourConfig', require('./tour-config-provider'))
    .factory('uiTourBackdrop', require('./backdrop-service'))
    .factory('TourHelpers', require('./tour-helpers'))
    .factory('uiTourService', require('./tour-service'))
    .factory('TourStepService', require('./tour-step-service'))
    .controller('uiTourController', require('./tour-controller'))
    .directive('uiTour', require('./tour-directive'))
    .directive('tourStep', require('./tour-step-directive').tourStepDirective)
    .directive('tourStepPopup', require('./tour-step-directive').tourStepPopupDirective)
    .name;
