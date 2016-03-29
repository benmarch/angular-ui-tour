/* global Tour: false */

(function angularUITour(app) {
    'use strict';

    app.config(['$uibTooltipProvider', function ($uibTooltipProvider) {
        $uibTooltipProvider.setTriggers({
            'uiTourShow': 'uiTourHide'
        });
    }]);

}(angular.module('bm.uiTour', ['ngSanitize', 'ui.bootstrap', 'smoothScroll', 'ezNg', 'cfp.hotkeys'])));
