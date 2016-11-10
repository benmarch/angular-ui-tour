/* global jasmine: false, beforeEach: false, inject: false, describe: false, it: false, spyOn: false, angular: false*/

'use strict';

describe('Tour Controller', function () {
    var TourController,
        $q,
        $rootScope,
        $timeout,
        digestAfter = function (fn, argumentArray) {
            fn.apply(null, argumentArray);
            $rootScope.$digest();
            $timeout.flush();
        },
        simpleStep;

    beforeEach(module('bm.uiTour', 'test.templates'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _$timeout_) {
        var $scope = _$rootScope_.$new();
        TourController = _$controller_('uiTourController', {$scope: $scope});
        $q = _$q_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;

        simpleStep = {
            element: angular.element(document.body),
            stepId: 1,
            enabled: true,
            config: function (option) {
                if (angular.isDefined(this[option])) {
                    return this[option];
                }
                return TourController.config(option);
            }
        };
    }));

    describe('#addStep()', function () {

        it('should add a new step to the step list', function () {

            //given
            var step = {};

            //when
            TourController.addStep(step);

            //then
            expect(TourController.hasStep(step)).toBe(true);

        });

        it('should not add an existing step to the step list', function () {

            //given
            var step = {};

            //when
            TourController.addStep(step);
            TourController.addStep(step);

            //then
            expect(TourController._getSteps().length).toBe(1);

        });

    });

    describe('#removeStep()', function () {

        it('should remove a new step to the step list', function () {

            //given
            var step = {};

            //when
            TourController.addStep(step);
            TourController.removeStep(step);

            //then
            expect(TourController.hasStep(step)).toBe(false);

        });

    });

    describe('#reorderStep()', function () {

        it('should move a step to the correct location based on order', function () {

            //given
            var step1 = {
                    order: 1
                },
                step2 = {
                    order: 2
                },
                step3 = {
                    order: 3
                };
            TourController.addStep(step1);
            TourController.addStep(step2);
            TourController.addStep(step3);

            //when
            step2.order = 5;
            TourController.reorderStep(step2);

            //then
            expect(TourController._getSteps().indexOf(step2)).toBe(2);

        });

    });

    //--------------------------------------


    describe('#start()', function () {

        it('should call onStart if it is defined', function () {

            //given
            var options = {
                onStart: $q.resolve
            };
            spyOn(options, 'onStart').and.callThrough();
            TourController.init(options);

            //when
            TourController.addStep({});
            TourController.start();

            //then
            expect(options.onStart).toHaveBeenCalled();

        });

        it('should show the first step', function () {

            //given
            var step = {};
            spyOn(TourController, 'showStep');

            //when
            TourController.addStep(step);
            digestAfter(TourController.start);

            //then
            expect(TourController._getCurrentStep()).toBe(step);
            expect(TourController.showStep).toHaveBeenCalledWith(step);

        });

    });

    describe('#startAt()', function () {

        it('should show the provided step', function () {

            //given
            var step = {};
            spyOn(TourController, 'showStep');

            //when
            TourController.addStep(angular.copy(step));
            TourController.addStep(angular.copy(step));
            TourController.addStep(step);
            digestAfter(function () {
                TourController.startAt(step);
            });

            //then
            expect(TourController._getCurrentStep()).toBe(step);
            expect(TourController.showStep).toHaveBeenCalledWith(step);

        });

    });

    describe('#end()', function () {

        it('should call onEnd if it is defined', function () {

            //given
            var options = {
                onEnd: $q.resolve
            };
            spyOn(options, 'onEnd').and.callThrough();
            TourController.init(options);

            //when
            TourController.addStep(simpleStep);
            digestAfter(TourController.start);
            digestAfter(TourController.end);

            //then
            expect(options.onEnd).toHaveBeenCalled();

        });
        it('should hide the current step', function () {

            //given
            spyOn(TourController, 'hideStep');

            //when
            TourController.addStep(simpleStep);
            digestAfter(TourController.start);
            digestAfter(TourController.end);

            //then
            expect(TourController._getCurrentStep()).toBe(null);
            expect(TourController.hideStep).toHaveBeenCalledWith(simpleStep);

        });

    });

    describe('#pause()', function () {

        it('should call onPause if it is defined', function () {

            //given
            var options = {
                onPause: $q.resolve
            };
            spyOn(options, 'onPause').and.callThrough();
            TourController.init(options);

            //when
            TourController.addStep(simpleStep);
            digestAfter(TourController.start);
            digestAfter(TourController.pause);

            //then
            expect(options.onPause).toHaveBeenCalled();

        });

        it('should hide the current step', function () {

            //given
            spyOn(TourController, 'hideStep');

            //when
            TourController.addStep(simpleStep);
            digestAfter(TourController.start);
            digestAfter(TourController.pause);

            //then
            expect(TourController._getCurrentStep()).toBe(simpleStep);
            expect(TourController.hideStep).toHaveBeenCalledWith(simpleStep);

        });

    });

    describe('#resume()', function () {

        it('should call onResume if it is defined', function () {

            //given
            var options = {
                onResume: $q.resolve
            };
            spyOn(options, 'onResume').and.callThrough();
            TourController.init(options);

            //when
            TourController.addStep(simpleStep);
            digestAfter(TourController.start);
            digestAfter(TourController.pause);
            digestAfter(TourController.resume);

            //then
            expect(options.onResume).toHaveBeenCalled();

        });

        it('should show the current step', function () {

            //given
            spyOn(TourController, 'showStep');

            //when
            TourController.addStep(simpleStep);
            digestAfter(TourController.start);
            digestAfter(TourController.pause);
            digestAfter(TourController.resume);

            //then
            expect(TourController._getCurrentStep()).toBe(simpleStep);
            expect(TourController.showStep).toHaveBeenCalledWith(simpleStep);

        });

    });

    describe('#next()', function () {

        it('should call onNext if it is defined on the tour', function () {

            //given
            var options = {
                onNext: $q.resolve
            };
            spyOn(options, 'onNext').and.callThrough();
            TourController.init(options);

            //when
            TourController.addStep(simpleStep);
            digestAfter(TourController.start);
            digestAfter(TourController.next);

            //then
            expect(options.onNext).toHaveBeenCalled();

        });

        it('should call onNext if it is defined on the step', function () {

            //given
            simpleStep.onNext = jasmine.createSpy('onNext').and.returnValue($q.resolve());

            //when
            TourController.addStep(simpleStep);
            digestAfter(TourController.start);
            digestAfter(TourController.next);

            //then
            expect(simpleStep.onNext).toHaveBeenCalled();


        });

        it('should hide the current step', function () {

            //given
            spyOn(TourController, 'hideStep');

            //when
            TourController.addStep(simpleStep);
            digestAfter(TourController.start);
            digestAfter(TourController.next);

            //then
            expect(TourController.hideStep).toHaveBeenCalledWith(simpleStep);

        });

        it('should show the next step', function () {

            //given
            var nextStep = angular.copy(simpleStep);
            spyOn(TourController, 'showStep').and.callThrough();

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(nextStep);
            digestAfter(TourController.start);
            digestAfter(TourController.next);

            //then
            expect(TourController.showStep).toHaveBeenCalledWith(nextStep);

        });

        it('should show the next step if current step was removed', function () {
            //given
            var nextStep = angular.copy(simpleStep);
            nextStep.stepId = 2;
            nextStep.order = 2;
            spyOn(TourController, 'showStep').and.callThrough();

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(nextStep);
            digestAfter(TourController.start);
            TourController.removeStep(simpleStep);
            digestAfter(TourController.next);

            //then
            expect(TourController.showStep).toHaveBeenCalledWith(nextStep);
        });

    });

    describe('#prev()', function () {

        it('should call onPrev if it is defined on the tour', function () {

            //given
            var options = {
                onPrev: $q.resolve
            };
            spyOn(options, 'onPrev').and.callThrough();
            TourController.init(options);

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(angular.copy(simpleStep));
            digestAfter(TourController.start);
            digestAfter(TourController.next);
            digestAfter(TourController.prev);

            //then
            expect(options.onPrev).toHaveBeenCalled();

        });

        it('should call onPrev if it is defined on the step', function () {

            //given
            var otherStep = angular.copy(simpleStep);
            otherStep.onPrev = jasmine.createSpy('onPrev').and.returnValue($q.resolve());

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(otherStep);
            digestAfter(TourController.start);
            digestAfter(TourController.next);
            digestAfter(TourController.prev);

            //then
            expect(otherStep.onPrev).toHaveBeenCalled();

        });
        it('should hide the current step', function () {

            //given
            var otherStep = angular.copy(simpleStep);
            spyOn(TourController, 'hideStep');

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(otherStep);
            digestAfter(TourController.start);
            digestAfter(TourController.next);
            digestAfter(TourController.prev);

            //then
            expect(TourController.hideStep).toHaveBeenCalledWith(otherStep);

        });
        it('should show the previous step', function () {

            //given
            var otherStep = angular.copy(simpleStep);
            spyOn(TourController, 'showStep');

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(otherStep);
            digestAfter(TourController.start);
            digestAfter(TourController.next);
            TourController.showStep.calls.reset();
            digestAfter(TourController.prev);

            //then
            expect(TourController.showStep).toHaveBeenCalledWith(simpleStep);

        });

        it('should show the previous step if current step was removed', function () {
            //given

            var nextStep = angular.copy(simpleStep),
                prevStep = angular.copy(simpleStep);
            nextStep.stepId = 2;
            nextStep.order = 2;
            prevStep.stepId = 1;
            prevStep.order = 1;
            spyOn(TourController, 'showStep');

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(prevStep);
            TourController.addStep(nextStep);


            digestAfter(TourController.start);
            digestAfter(TourController.next);
            digestAfter(TourController.next);
            TourController.removeStep(nextStep);
            TourController.showStep.calls.reset();
            digestAfter(TourController.prev);

            //then
            expect(TourController.showStep).toHaveBeenCalledWith(prevStep);
        });

    });

    describe('#goTo()', function () {

        it('should hide the current step', function () {

            //given
            var otherStep = angular.copy(simpleStep);
            spyOn(TourController, 'showStep').and.callThrough();

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(otherStep);
            digestAfter(TourController.start);
            digestAfter(function () {
                TourController.goTo(1);
            });

            //then
            expect(TourController.showStep).toHaveBeenCalledWith(otherStep);

        });

        it('should show the provided step', function () {

            //given
            var otherStep = angular.copy(simpleStep);
            spyOn(TourController, 'showStep').and.callThrough();

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(otherStep);
            digestAfter(TourController.start);
            digestAfter(function () {
                TourController.goTo(otherStep);
            });

            //then
            expect(TourController.showStep).toHaveBeenCalledWith(otherStep);

        });

        it('should show the step with index', function () {

            //given
            var otherStep = angular.copy(simpleStep);
            spyOn(TourController, 'showStep').and.callThrough();

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(otherStep);
            digestAfter(TourController.start);
            digestAfter(function () {
                TourController.goTo(1);
            });

            //then
            expect(TourController.showStep).toHaveBeenCalledWith(otherStep);

        });

        it('should show the step with ID', function () {

            //given
            var otherStep = angular.copy(simpleStep);
            otherStep.stepId = 'other';
            spyOn(TourController, 'showStep').and.callThrough();

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(otherStep);
            digestAfter(TourController.start);
            digestAfter(function () {
                TourController.goTo('other');
            });

            //then
            expect(TourController.showStep).toHaveBeenCalledWith(otherStep);

        });

        it('should reject if no step found', function () {

            //given
            var rejected = false;
            var otherStep = angular.copy(simpleStep);
            spyOn(TourController, 'showStep').and.callThrough();

            //when
            TourController.addStep(simpleStep);
            TourController.addStep(otherStep);
            digestAfter(TourController.start);
            TourController.goTo().catch(function () {
                rejected = true;
            });
            $rootScope.$digest();

            //then
            expect(rejected).toBe(true);

        });

    });
});
