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

    function preventScrolling() {
        $body.addClass('no-scrolling');
        $body.on('touchmove', preventDefault);
    }

    function allowScrolling() {
        $body.removeClass('no-scrolling');
        $body.off('touchmove', preventDefault);
    }

    service.createForElement = function (element, backdropOptions) {
        hone.setOptions(backdropOptions);
        hone.position(element[0]);
        hone.show();

        if (backdropOptions.preventScrolling) {
            service.shouldPreventScrolling(true);
        } else {
            service.shouldPreventScrolling(false);
        }
    };

    service.hide = function () {
        hone.hide();
        service.shouldPreventScrolling(false);
    };

    service.shouldPreventScrolling = function (shouldPreventScrolling = true) {
        if (shouldPreventScrolling) {
            preventScrolling();
        } else {
            allowScrolling();
        }
    };

    return service;

}
