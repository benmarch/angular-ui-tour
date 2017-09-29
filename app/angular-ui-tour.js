import angular from 'angular';
import 'angular-sanitize';
import 'angular-scroll';
import 'angular-hotkeys';
import 'angular-bind-html-compile';
import Tether from 'tether';
import Hone from 'hone';
import './styles/angular-ui-tour.css';

function run(TourConfig, uiTourService, $rootScope, $injector) {
    'ngInject';

    //when the user navigates via browser button, kill tours
    function checkAndKillToursOnNavigate() {
        if (!uiTourService.isTourWaiting()) {
            uiTourService.endAllTours();
        }
    }

    if (TourConfig.areNavigationInterceptorsEnabled()) {
        $rootScope.$on('$locationChangeStart', checkAndKillToursOnNavigate);
        $rootScope.$on('$stateChangeStart', checkAndKillToursOnNavigate);

        //for UIRouter 1.0, not sure if it works
        if ($injector.has('$transitions')) {
            $injector.get('$transitions').onStart({}, checkAndKillToursOnNavigate);
        }
    }
}

export default angular.module('bm.uiTour', [
    'ngSanitize',
    'duScroll',
    'cfp.hotkeys',
    'angular-bind-html-compile'
])
    .run(run)
    .value('Tether', Tether)
    .value('Hone', Hone)
    .constant('positionMap', require('./tether-position-map').default)
    .provider('TourConfig', require('./tour-config-provider').default)
    .factory('uiTourBackdrop', require('./backdrop-service').default)
    .factory('TourHelpers', require('./tour-helpers').default)
    .factory('uiTourService', require('./tour-service').default)
    .factory('TourStepService', require('./tour-step-service').default)
    .controller('uiTourController', require('./tour-controller').default)
    .directive('uiTour', require('./tour-directive').default)
    .directive('tourStep', require('./tour-step-directive').default)
    .name;
