import angular from 'angular';
import tourWithNoConfig from '../templates/tour-with-no-config.html';
import tourWithStartFunction from '../templates/tour-with-on-start-function.html';
import tourWithPlacementOverride from '../templates/tour-with-placement-override.html';
import tourStepWithOnNextFunction from '../templates/tour-step-with-on-next-function.html';
import tourStepWithPlacementOverride from '../templates/tour-step-with-placement-override.html';

describe('Tour Config', function () {
    var $compile,
        $rootScope,
        $q,
        TourConfig,
        digestAfter = function (fn, argumentArray) {
            fn.apply(null, argumentArray || []);
            $rootScope.$digest();
        };

    beforeEach(angular.mock.module('bm.uiTour'));

    beforeEach(angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _TourConfig_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        TourConfig = _TourConfig_;
    }));

    it('should initialize a new tour with default options when no options are passed', function () {
        //given
        var scope = $rootScope.$new(),
            config;

        $compile(tourWithNoConfig)(scope);

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
        $compile(tourWithStartFunction)(scope);
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

        $compile(tourWithPlacementOverride)(scope);
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
        $compile(tourStepWithOnNextFunction)(scope);
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

        $compile(tourStepWithPlacementOverride)(scope);

        //when
        $rootScope.$digest();

        //then
        expect(scope.$$childTail.$$childTail.tourStep.placement).toEqual('bottom');
    });

});
