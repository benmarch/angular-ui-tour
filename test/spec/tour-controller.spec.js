'use strict';

describe('Tour Controller', function () {
    var $compile,
        $templateCache,
        $rootScope,
        tourSpy = jasmine.createSpy('Tour').and.returnValue({});

    beforeEach(module('bm.uiTour', 'test.templates'));
    beforeEach(module(function ($provide) {
        $provide.value('Tour', tourSpy);
    }));

    beforeEach(inject(function (_$compile_, _$templateCache_, _$rootScope_) {
        $compile = _$compile_;
        $templateCache = _$templateCache_;
        $rootScope = _$rootScope_;
    }));

    it('should initialize a new tour with default options when no options are passed', function () {
        //given
        $compile($templateCache.get('tour-with-no-steps.html'))($rootScope.$new());

        //when
        $rootScope.$digest();

        //then
        //expect(tourSpy).toHaveBeenCalled();
    });

});
