import angular from 'angular';

describe('Tour Config', function () {
    var tourScope,
        tourHandle,
        $timeout,
        digestAfter = function (fn, argumentArray) {
            fn.apply(null, argumentArray || []);
            tourScope.$digest();
        };

    beforeEach(angular.mock.module('bm.uiTour'));

    beforeEach(angular.mock.inject(function ($compile, $templateCache, $rootScope, $q, _$timeout_) {
        tourScope = $rootScope.$new();
        $timeout = _$timeout_;

        //ensure timers fire
        tourScope.$digest = function () {
            $rootScope.$digest();
            $timeout.flush();
        };

        angular.extend(tourScope, {
            onNext: jasmine.createSpy('onNext').and.returnValue($q.resolve()),
            onPrev: jasmine.createSpy('onPrev').and.returnValue($q.resolve()),
            onShow: jasmine.createSpy('onShow').and.returnValue($q.resolve()),
            onShown: jasmine.createSpy('onShown').and.returnValue($q.resolve()),
            onHide: jasmine.createSpy('onHide').and.returnValue($q.resolve()),
            onHidden: jasmine.createSpy('onHidden').and.returnValue($q.resolve())
        });

        $compile($templateCache.get('tour-step-with-all-events-overridden.html'))(tourScope);
        tourHandle = tourScope.$$childTail.tour;
        tourHandle.emit('initialized');
    }));

    it('should not call any event handlers when started', function () {
        //when
        digestAfter(tourHandle.start);

        //then
        expect(tourScope.onNext).not.toHaveBeenCalled();
        expect(tourScope.onPrev).not.toHaveBeenCalled();
        expect(tourScope.onShow).not.toHaveBeenCalled();
        expect(tourScope.onShown).not.toHaveBeenCalled();
        expect(tourScope.onHide).not.toHaveBeenCalled();
        expect(tourScope.onHidden).not.toHaveBeenCalled();
    });

    it('should call onShow, onShown when next step is shown', function () {
        //when
        digestAfter(tourHandle.start);
        digestAfter(tourHandle.next);

        //then
        expect(tourScope.onShow).toHaveBeenCalled();
        expect(tourScope.onShown).toHaveBeenCalled();

        expect(tourScope.onNext).not.toHaveBeenCalled();
        expect(tourScope.onPrev).not.toHaveBeenCalled();
        expect(tourScope.onHide).not.toHaveBeenCalled();
        expect(tourScope.onHidden).not.toHaveBeenCalled();
    });

    it('should call onNext, onHide, onHidden when third step is shown', function () {
        //given
        digestAfter(tourHandle.start);
        digestAfter(tourHandle.next);
        tourScope.onShow.calls.reset();
        tourScope.onShown.calls.reset();

        //when
        tourHandle.next();
        tourScope.$digest();

        //then
        expect(tourScope.onNext).toHaveBeenCalled();
        expect(tourScope.onHide).toHaveBeenCalled();
        expect(tourScope.onHidden).toHaveBeenCalled();

        expect(tourScope.onPrev).not.toHaveBeenCalled();
        expect(tourScope.onShow).not.toHaveBeenCalled();
        expect(tourScope.onShown).not.toHaveBeenCalled();
    });

    it('should call onPrev, onHide, onHidden when first step is re-shown', function () {
        //given
        digestAfter(tourHandle.start);
        digestAfter(tourHandle.next);
        tourScope.onShow.calls.reset();
        tourScope.onShown.calls.reset();

        //when
        tourHandle.prev();
        tourScope.$digest();

        //then
        expect(tourScope.onPrev).toHaveBeenCalled();
        expect(tourScope.onHide).toHaveBeenCalled();
        expect(tourScope.onHidden).toHaveBeenCalled();

        expect(tourScope.onNext).not.toHaveBeenCalled();
        expect(tourScope.onShow).not.toHaveBeenCalled();
        expect(tourScope.onShown).not.toHaveBeenCalled();
    });

});
