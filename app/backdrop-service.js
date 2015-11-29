(function (app) {
    'use strict';

    app.factory('uiTourBackdrop', ['TourConfig', '$document', '$uibPosition', '$window', function (TourConfig, $document, $uibPosition, $window) {

        var service = {},
            $body = angular.element($document[0].body),
            $backdrop = angular.element($document[0].createElement('div')),
            $clone,
            preventDefault = function (e) {
                e.preventDefault();
            };

        (function createNoScrollingClass() {
            var name = '.no-scrolling',
                rules = 'height: 100%; overflow: hidden;',
                style = document.createElement('style');
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);

            if(!style.sheet && !style.sheet.insertRule) {
                (style.styleSheet || style.sheet).addRule(name, rules);
            } else {
                style.sheet.insertRule(name + "{" + rules + "}", 0);
            }
        }());



        function preventScrolling() {
            $body.addClass('no-scrolling');
            $body.on('touchmove', preventDefault);
        }

        function allowScrolling() {
            $body.removeClass('no-scrolling');
            $body.off('touchmove', preventDefault);
        }

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

        service.createForElement = function (element, shouldPreventScrolling, isFixedElement) {
            var position;
            $clone = element.clone();
            $backdrop.css('display', 'block');
            $body.append($clone);
            $clone.css('zIndex', TourConfig.get('backdropZIndex') + 1);
            position = $uibPosition.offset(element);
            $clone.css({
                position: isFixedElement ? 'fixed': 'absolute',
                top: position.top + 'px',
                left: position.left + 'px',
                height: position.height + 'px',
                width: position.width + 'px',
                marginTop: 0,
                marginLeft: 0,
                backgroundColor: $body.css('backgroundColor') || '#FFFFFF'
            });
            if (shouldPreventScrolling) {
                preventScrolling();
            }
        };

        service.hide = function () {
            $backdrop.css('display', 'none');
            $clone.remove();
            allowScrolling();
        };

        return service;

    }]);

}(angular.module('bm.uiTour')));
