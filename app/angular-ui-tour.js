import angular from 'angular';
import 'angular-sanitize';
import 'angular-scroll';
import 'ez-ng';
import 'angular-hotkeys';
import 'tether';
import './styles/angular-ui-tour.css';

export default angular.module('bm.uiTour', [
    'ngSanitize',
    'ui.bootstrap',
    'duScroll',
    'ezNg',
    'cfp.hotkeys'
])
    .value('Tether', window.Tether)
    .constant('positionMap', require('./tether-position-map'))
    .provider('TourConfig', require('./tour-config-provider'))
    .factory('uiTourBackdrop', require('./backdrop-service'))
    .factory('TourHelpers', require('./tour-helpers'))
    .factory('uiTourService', require('./tour-service'))
    .factory('TourStepService', require('./tour-step-service'))
    .controller('uiTourController', require('./tour-controller'))
    .directive('uiTour', require('./tour-directive'))
    .directive('tourStep', require('./tour-step-directive'))
    .name;
