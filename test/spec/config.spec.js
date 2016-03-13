/* global jasmine: false, inject: false, angular: false*/

'use strict';

describe('Tour Config', function () {
    var $compile,
        $templateCache,
        $rootScope,
        TourConfig,
        digestAfter = function (fn, argumentArray) {
            fn.apply(null, argumentArray || []);
            $rootScope.$digest();
        };

    beforeEach(module('bm.uiTour', 'test.templates'));

    beforeEach(inject(function (_$compile_, _$templateCache_, _$rootScope_, _TourConfig_) {
        $compile = _$compile_;
        $templateCache = _$templateCache_;
        $rootScope = _$rootScope_;
        TourConfig = _TourConfig_;
    }));

    it('should initialize a new tour with default options when no options are passed', function () {
        //given
        var scope = $rootScope.$new();
        $compile($templateCache.get('tour-with-no-config.html'))(scope);

        //when
        $rootScope.$digest();
        var config = TourConfig.getAll();
        config.name = '';

        //then
        expect(scope.$$childTail.tour.options).toEqual(config);
    });

    it('should initialize a new tour with onStart overridden', function () {
        //given
        var scope = $rootScope.$new();
        var started = false;
        scope.onStart = function () {
            started = true;
        };
        $compile($templateCache.get('tour-with-on-start-function.html'))(scope);
        var tour = scope.$$childTail.tour;

        //when
        digestAfter(tour.start);

        //then
        expect(started).toBe(true);
    });

    it('should initialize a new tour with placement overridden', function () {
        //given
        var scope = $rootScope.$new();
        $compile($templateCache.get('tour-with-placement-override.html'))(scope);
        var tour = scope.$$childTail.tour;

        //when
        $rootScope.$digest();

        //then
        expect(tour.options.placement).toEqual('bottom');
    });

    it('should initialize a new tour step with onNext overridden', inject(function ($q) {
        //given
        var scope = $rootScope.$new();
        var called = false;
        scope.onNext = function () {
            called = true;
            return $q.resolve();
        };
        $compile($templateCache.get('tour-step-with-on-next-function.html'))(scope);
        var tour = scope.$$childTail.tour;

        //when
        digestAfter(tour.start);
        digestAfter(tour.next);

        //then
        expect(called).toBe(true);
    }));

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
