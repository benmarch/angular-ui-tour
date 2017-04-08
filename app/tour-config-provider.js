import angular from 'angular';

export default function TourConfig() {
    'ngInject';

    var navigationInterceptorsEnabled = false,
        config = {
            placement: 'top',
            animation: true,
            popupDelay: 1,
            closePopupDelay: 0,
            enable: true,
            appendToBody: false,
            popupClass: '',
            orphan: false,
            backdrop: false,
            backdropZIndex: 10000,
            scrollOffset: 100,
            scrollIntoView: true,
            useUiRouter: false,
            useHotkeys: false,
            scrollParentId: '$document',

            onStart: null,
            onEnd: null,
            onPause: null,
            onResume: null,
            onNext: null,
            onPrev: null,
            onShow: null,
            onShown: null,
            onHide: null,
            onHidden: null
        };

    this.set = function (option, value) {
        config[option] = value;
    };

    this.enableNavigationInterceptors = function () {
        navigationInterceptorsEnabled = true;
    };

    this.$get = ['$q', function ($q) {

        var service = {};

        service.get = function (option) {
            return config[option];
        };

        service.getAll = function () {
            return angular.copy(config);
        };

        service.areNavigationInterceptorsEnabled = function () {
            return navigationInterceptorsEnabled;
        };

        //wrap functions with promises
        (function () {
            angular.forEach(config, function (value, key) {
                if (key.indexOf('on') === 0 && angular.isFunction(value)) {
                    config[key] = function () {
                        return $q.resolve(value());
                    };
                }
            });
        }());

        return service;

    }];

}
