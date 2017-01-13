import angular from 'angular';

describe('Tour Config', function () {
    var $compile,
        $templateCache,
        $rootScope,
        $q,
        TourConfig,
        digestAfter = function (fn, argumentArray) {
            fn.apply(null, argumentArray || []);
            $rootScope.$digest();
        };

    beforeEach(angular.mock.module('bm.uiTour'));

    beforeEach(angular.mock.inject(function (_$compile_, _$templateCache_, _$rootScope_, _$q_, _TourConfig_) {
        $compile = _$compile_;
        $templateCache = _$templateCache_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        TourConfig = _TourConfig_;
    }));

    it('should initialize a new tour with default options when no options are passed', function () {
        //given
        var scope = $rootScope.$new(),
            config;

        $compile($templateCache.get('tour-with-no-config.html'))(scope);

        //when
        $rootScope.$digest();
        config = TourConfig.getAll();

        config.name = '';

        //then
        expect(scope.$$childTail.tour.options).toEqual(config);
    });

    it('should initialize a new tour with onStart overridden', function () {
        //given
        var scope = $rootScope.$new(),
            started = false,
            tour;

        scope.onStart = function () {
            started = true;
        };
        $compile($templateCache.get('tour-with-on-start-function.html'))(scope);
        tour = scope.$$childTail.tour;

        //when
        digestAfter(tour.start);

        //then
        expect(started).toBe(true);
    });

    it('should initialize a new tour with placement overridden', function () {
        //given
        var scope = $rootScope.$new(),
            tour;

        $compile($templateCache.get('tour-with-placement-override.html'))(scope);
        tour = scope.$$childTail.tour;

        //when
        $rootScope.$digest();

        //then
        expect(tour.options.placement).toEqual('bottom');
    });

    it('should initialize a new tour step with onNext overridden', function () {
        //given
        var scope = $rootScope.$new(),
            called = false,
            tour;

        scope.onNext = function () {
            called = true;
            return $q.resolve();
        };
        $compile($templateCache.get('tour-step-with-on-next-function.html'))(scope);
        tour = scope.$$childTail.tour;

        //when
        digestAfter(tour.start);
        digestAfter(tour.next);

        //then
        expect(called).toBe(true);
    });

    it('should initialize a new tour step with placement overridden', function () {
        //given
        var scope = $rootScope.$new();

        $compile($templateCache.get('tour-step-with-placement-override.html'))(scope);

        //when
        $rootScope.$digest();

        //then
        expect(scope.$$childTail.$$childTail.tourStep.placement).toEqual('bottom');
    });

});
