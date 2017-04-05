import angular from 'angular';
import Hone from 'hone';

export default function uiTourBackdrop(TourConfig, $document) {
    'ngInject';

    var service = {},
        $body = angular.element($document[0].body),
        preventDefault = function (e) {
            e.preventDefault();
        },
        hone = new Hone();

    function createStyles(styles) {
        const styleElement = document.createElement('style');

        styleElement.type = 'text/css';
        styleElement.innerHTML = styles;

        angular.element($document[0].head).append(styleElement);

        return function cleanup() {
            angular.element(styleElement).remove();
        };
    }

    function preventScrolling() {
        $body.addClass('no-scrolling');
        $body.on('touchmove', preventDefault);
    }

    function allowScrolling() {
        $body.removeClass('no-scrolling');
        $body.off('touchmove', preventDefault);
    }

    function showBackdrop() {
        hone.show();
    }
    function hideBackdrop() {
        hone.hide();
    }

    service.createForElement = function (element, backdropOptions) {
        hone.setOptions(backdropOptions);
        hone.position(element[0]);
        showBackdrop();

        if (backdropOptions.preventScrolling) {
            service.shouldPreventScrolling(true);
        } else {
            service.shouldPreventScrolling(false);
        }
    };

    service.hide = function () {
        hideBackdrop();
        service.shouldPreventScrolling(false);
    };

    service.shouldPreventScrolling = function (shouldPreventScrolling = true) {
        if (shouldPreventScrolling) {
            preventScrolling();
        } else {
            allowScrolling();
        }
    };

    createStyles('.no-scrolling { height: 100%; overflow: hidden; }');

    return service;

}
