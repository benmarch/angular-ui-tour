/* global Tour: false */

(function angularUITour(app) {
    'use strict';

    app.config(['$tooltipProvider', function ($tooltipProvider) {
        $tooltipProvider.setTriggers({
            'uiTourShow': 'uiTourHide'
        });
    }]);

}(angular.module('bm.uiTour', ['ui.bootstrap', 'smoothScroll'])));
