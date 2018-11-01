module Tour {
    export class TourConfigProvider {
        config: ITourConfigProperties = {
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

        $get: [string, ($q: ng.IQService) => ITourConfig];

        set(option, value) {
            this.config[option] = value;
        }
        constructor() {
            this.$get = ['$q', ($q) => {
                angular.forEach(this.config, function (value, key) {
                    if (key.indexOf('on') === 0 && angular.isFunction(value)) {
                        this.config[key] = function () {
                            return $q.resolve(value());
                        };
                    }
                });

                return {
                    get: (option) => {
                        return this.config[option];
                    },
                    getAll: () => {
                        return angular.copy(this.config);
                    }
                };
            }];
        }
    }
}