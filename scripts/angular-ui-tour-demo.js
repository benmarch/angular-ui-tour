angular.module('uiTourDemo', ['bm.uiTour', 'ngRoute'])

    .config(['TourConfigProvider', '$routeProvider', function (TourConfigProvider, $routeProvider) {

        TourConfigProvider.set('scrollOffset', 50);

        TourConfigProvider.set('onStart', function () {
            console.log('Started Tour');
        });
        TourConfigProvider.set('onNext', function () {
            console.log('Moving on...');
        });


        $routeProvider
            .when('/docs', {
                templateUrl: 'partials/docs.html'
            })
            .when('/other', {
                templateUrl: 'partials/other.html'
            })
            .otherwise({
                redirectTo: '/docs'
            });

    }])

    .run(['uiTourService', function (TourService) {

        TourService.createDetachedTour('detachedDemoTour');

    }])

    .controller('TourDemoController', ['$scope', '$q', '$timeout', 'uiTourService', '$location', function ($scope, $q, $timeout, TourService, $location) {
        $scope.isEnabled = true;

        $scope.toggleEnabled = function () {
            $scope.isEnabled = !$scope.isEnabled;
        };

        $scope.onPrev = function (tour) {
            console.log('Moving back...', tour);
        };

        $scope.shouldMoveOn = function () {
            return $q(function (resolve, reject) {
                if (confirm('Click OK to go to the next step. Otherwise you can stay here...if you want.')) {
                    resolve();
                } else {
                    reject();
                }
            });
        };

        $scope.startDetached = function () {
            TourService.getTourByName('detachedDemoTour').start();
        };

        $scope.goToReviewTour = function() {
            // DemoState.goToDemo();
            TourService.getTourByName('demoTour').end();
            TourService.getTourByName('detachedDemoTour').start();
        };

        $scope.navigateToAndWaitFor = function (tour, path, step) {
            $location.path(path);
            return tour.waitFor(step);
        }

    }]);
