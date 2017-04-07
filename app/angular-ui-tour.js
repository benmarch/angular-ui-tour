import angular from 'angular';
import 'angular-sanitize';
import 'angular-scroll';
import 'ez-ng';
import 'angular-hotkeys';
import 'tether';
import './styles/angular-ui-tour.css';

function run(uiTourService, $rootScope, $injector) {
    //when the user navigates via browser button, kill tours
    function checkAndKillToursOnNavigate() {
        if (!uiTourService.isTourWaiting()) {
            uiTourService.endAllTours();
        }
    }

    $rootScope.$on('$locationChangeStart', checkAndKillToursOnNavigate);
    $rootScope.$on('$stateChangeStart', checkAndKillToursOnNavigate);

    //for UIRouter 1.0, not sure if it works
    if ($injector.has('$transitions')) {
        $injector.get('$transitions').onStart({}, checkAndKillToursOnNavigate);
    }
}

export default angular.module('bm.uiTour', [
    'ngSanitize',
    'ui.bootstrap',
    'duScroll',
    'ezNg',
    'cfp.hotkeys'
])
    .run(run)
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
