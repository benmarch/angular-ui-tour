/* global jasmine: false, inject: false, angular: false*/

'use strict';

describe('Tour Service', function () {
    var uiTourService,
        $compile,
        $rootScope,
        mockTour = {
            options: {
                name: 'mock'
            }
        };

    beforeEach(module('bm.uiTour', 'test.templates'));

    beforeEach(inject(function (_uiTourService_, _$compile_, _$rootScope_) {

        uiTourService = _uiTourService_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        uiTourService._registerTour({
            options: {
                name: 'first'
            }
        });
        uiTourService._registerTour({
            options: {
                name: 'second'
            }
        });

    }));

    it('should return the first tour', function () {

        //when
        var tour = uiTourService.getTour();

        //then
        expect(tour.options.name).toBe('first');

    });

    it('should return a tour by name', function () {

        //when
        var tour = uiTourService.getTourByName('second');

        //then
        expect(tour.options.name).toBe('second');

    });

    it('should return a tour by element', function () {

        //given
        var scope = $rootScope.$new();
        var innerTemplate = '<div></div>';
        var outerTemplate = '<div ui-tour="third"></div>';
        var outerElement = $compile(outerTemplate)(scope);
        var innerElement = $compile(innerTemplate)(scope);
        outerElement.append(innerElement);
        scope.$digest();

        //when
        var tour = uiTourService.getTourByElement(innerElement);

        //then
        expect(tour.options.name).toBe('third');

    });

    it('should remove a tour from the registry', function () {

        //given
        uiTourService._registerTour(mockTour);

        //when
        uiTourService._unregisterTour(mockTour);

        //then
        expect(uiTourService.getTourByName('mock')).toBe(undefined);

    });

});
