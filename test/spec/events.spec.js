'use strict';

describe('Tour Config', function () {
    var tourScope,
        tourHandle;

    beforeEach(module('bm.uiTour', 'test.templates'));

    beforeEach(inject(function ($compile, $templateCache, $rootScope, $q) {
        tourScope = $rootScope.$new();

        angular.extend(tourScope, {
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
    }));

    it('should call onStart when tour is started', function () {
        //when
        tourHandle.start();

        //then
        expect(tourScope.onStart).toHaveBeenCalled();
    });

    it('should call onNext, onShow, onShown when next step is shown', function () {
        //when
        tourHandle.start();
        tourHandle.next();

        //then
        expect(tourScope.onNext).toHaveBeenCalled();
        expect(tourScope.onShow).toHaveBeenCalled();
        expect(tourScope.onShown).toHaveBeenCalled();

        expect(tourScope.onHide).not.toHaveBeenCalled();
        expect(tourScope.onHidden).not.toHaveBeenCalled();
    });

    it('should call onNext, onHide, onHidden, onShow, onShown when third step is shown', function () {
        //when
        tourHandle.start();
        tourHandle.next()
            .then(tourHandle.next);
        tourScope.$digest();

        //then
        expect(tourScope.onNext).toHaveBeenCalled();
        expect(tourScope.onShow).toHaveBeenCalled();
        expect(tourScope.onShown).toHaveBeenCalled();
        expect(tourScope.onHide).toHaveBeenCalled();
        expect(tourScope.onHidden).toHaveBeenCalled();
    });

    it('should call onPrev, onHide, onHidden, onShow, onShown when first step is re-shown', function () {
        //given
        tourHandle.start();
        tourHandle.next();
        tourScope.$digest();
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
        tourHandle.start();
        tourHandle.pause();

        //then
        expect(tourScope.onPause).toHaveBeenCalled();
    });

    it('should call onResume when tour is resumed', function () {
        //when
        tourHandle.start();
        tourHandle.pause();
        tourHandle.resume();

        //then
        expect(tourScope.onResume).toHaveBeenCalled();
    });

    it('should call onEnd when tour is explicitly ended', function () {
        //when
        tourHandle.start();
        tourHandle.end();

        //then
        expect(tourScope.onEnd).toHaveBeenCalled();
    });

    it('should call onEnd when tour is implicitly ended', function () {
        //when
        tourHandle.start();
        tourHandle.next()
            .then(tourHandle.next)
            .then(tourHandle.next);
        tourScope.$digest();

        //then
        expect(tourScope.onEnd).toHaveBeenCalled();
    });
});
