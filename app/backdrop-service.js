(function (app) {
    'use strict';

    app.factory('uiTourBackdrop', ['TourConfig', '$document', '$uibPosition', function (TourConfig, $document, $uibPosition) {

        var service = {},
            $body = angular.element($document[0].body),
            $backdrop = angular.element($document[0].createElement('div')),
            $clone;

        $backdrop.css({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: TourConfig.get('backdropZIndex'),
            backgroundColor: 'rgba(0, 0, 0, .5)',
            display: 'none'
        });

        $body.append($backdrop);

        service.createForElement = function (element) {
            var position;
            $clone = element.clone();
            $backdrop.css('display', 'block');
            $body.append($clone);
            $clone.css('zIndex', TourConfig.get('backdropZIndex') + 1);
            position = $uibPosition.offset(element);
            $clone.css({
                position: 'absolute',
                top: position.top + 'px',
                left: position.left + 'px',
                height: position.height + 'px',
                width: position.width + 'px',
                marginTop: 0,
                backgroundColor: $body.css('backgroundColor') || '#FFFFFF'
            });
        };

        service.hide = function () {
            $backdrop.css('display', 'none');
            $clone.remove();
        };

        return service;

    }]);

}(angular.module('bm.uiTour')));
