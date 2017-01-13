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
            onReady: jasmine.createSpy('onReady').and.returnValue($q.resolve()),
            onStart: jasmine.createSpy('onStart').and.returnValue($q.resolve()),
            onEnd: jasmine.createSpy('onEnd').and.returnValue($q.resolve()),
            onPause: jasmine.createSpy('onPause').and.returnValue($q.resolve()),
            onResume: jasmine.createSpy('onResume').and.returnValue($q.resolve()),
            onNext: jasmine.createSpy('onNext').and.returnValue($q.resolve()),
            onPrev: jasmine.createSpy('onPrev').and.returnValue($q.resolve()),
            onShow: jasmine.createSpy('onShow').and.returnValue($q.resolve()),
            onShown: jasmine.createSpy('onShown').and.returnValue($q.resolve()),
            onHide: jasmine.createSpy('onHide').and.returnValue($q.resolve()),
            onHidden: jasmine.createSpy('onHidden').and.returnValue($q.resolve())
        });

        $compile($templateCache.get('tour-with-all-events-overridden.html'))(tourScope);
        tourHandle = tourScope.$$childTail.tour;
        spyOn(tourHandle, 'emit').and.callThrough();
    }));

    it('should call onReady when tour is initialized', function () {
        //tour is initialized in beforeEach

        //then
        expect(tourScope.onReady).toHaveBeenCalledWith(tourScope.$$childTail.tour);
    });

    it('should call onStart when tour is started', function () {
        //when
        digestAfter(tourHandle.start);

        //then
        expect(tourScope.onStart).toHaveBeenCalled();
        expect(tourHandle.emit).toHaveBeenCalledWith('started', jasmine.any(Object));
    });

    it('should call onNext, onShow, onShown when next step is shown', function () {
        //when
        digestAfter(tourHandle.start);
        digestAfter(tourHandle.next);

        //then
        expect(tourScope.onNext).toHaveBeenCalled();
        expect(tourScope.onShow).toHaveBeenCalled();
        expect(tourScope.onShown).toHaveBeenCalled();
        expect(tourHandle.emit).toHaveBeenCalledWith('stepShown', jasmine.any(Object));
        expect(tourHandle.emit).toHaveBeenCalledWith('stepChanged', jasmine.any(Object));
    });

    it('should call onNext, onHide, onHidden, onShow, onShown when third step is shown', function () {
        //when
        digestAfter(tourHandle.start);
        digestAfter(function () {
            tourHandle.next()
                .then(tourHandle.next);
        });

        //then
        expect(tourScope.onNext).toHaveBeenCalled();
        expect(tourScope.onShow).toHaveBeenCalled();
        expect(tourScope.onShown).toHaveBeenCalled();
        expect(tourScope.onHide).toHaveBeenCalled();
        expect(tourScope.onHidden).toHaveBeenCalled();
        expect(tourHandle.emit).toHaveBeenCalledWith('stepHidden', jasmine.any(Object));
    });

    it('should call onPrev, onHide, onHidden, onShow, onShown when first step is re-shown', function () {
        //given
        digestAfter(tourHandle.start);
        digestAfter(tourHandle.next);
        tourScope.onShow.calls.reset();
        tourScope.onShown.calls.reset();
        tourScope.onHide.calls.reset();
        tourScope.onHidden.calls.reset();

        //when
        tourHandle.prev();
        tourScope.$digest();

        //then
        expect(tourScope.onPrev).toHaveBeenCalled();
        expect(tourScope.onShow).toHaveBeenCalled();
        expect(tourScope.onShown).toHaveBeenCalled();
        expect(tourScope.onHide).toHaveBeenCalled();
        expect(tourScope.onHidden).toHaveBeenCalled();
    });

    it('should call onPause when tour is paused', function () {
        //when
        digestAfter(tourHandle.start);
        digestAfter(tourHandle.pause);

        //then
        expect(tourScope.onPause).toHaveBeenCalled();
        expect(tourHandle.emit).toHaveBeenCalledWith('paused', jasmine.any(Object));
    });

    it('should call onResume when tour is resumed', function () {
        //when
        digestAfter(tourHandle.start);
        digestAfter(tourHandle.pause);
        digestAfter(tourHandle.resume);

        //then
        expect(tourScope.onResume).toHaveBeenCalled();
        expect(tourHandle.emit).toHaveBeenCalledWith('resumed', jasmine.any(Object));
    });

    it('should call onEnd when tour is explicitly ended', function () {
        //when
        digestAfter(tourHandle.start);
        digestAfter(tourHandle.end);

        //then
        expect(tourScope.onEnd).toHaveBeenCalled();
        expect(tourHandle.emit).toHaveBeenCalledWith('ended');
    });

    it('should call onEnd when tour is implicitly ended', function () {
        //when
        digestAfter(tourHandle.start);
        digestAfter(function () {
            tourHandle.next()
                .then(tourHandle.next)
                .then(tourHandle.next);
        });

        //then
        expect(tourScope.onEnd).toHaveBeenCalled();
        expect(tourHandle.emit).toHaveBeenCalledWith('ended');
    });
});
