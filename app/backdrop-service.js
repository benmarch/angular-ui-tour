/*global angular: false*/
(function (app) {
    'use strict';

    app.factory('uiTourBackdrop', ['TourConfig', '$document', '$uibPosition', function (TourConfig, $document, $uibPosition) {

        var service = {},
            $body = angular.element($document[0].body),
            viewWindow = {
                top: angular.element($document[0].createElement('div')),
                bottom: angular.element($document[0].createElement('div')),
                left: angular.element($document[0].createElement('div')),
                right: angular.element($document[0].createElement('div'))
            },
            preventDefault = function (e) {
                e.preventDefault();
            };

        (function createNoScrollingClass() {
            var name = '.no-scrolling',
                rules = 'height: 100%; overflow: hidden;',
                style = $document[0].createElement('style');
            style.type = 'text/css';
            $document[0].getElementsByTagName('head')[0].appendChild(style);

            if(!style.sheet && !style.sheet.insertRule) {
                (style.styleSheet || style.sheet).addRule(name, rules);
            } else {
                style.sheet.insertRule(name + '{' + rules + '}', 0);
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

        function createBackdropComponent(backdrop) {
            backdrop.addClass('tour-backdrop').css({
                display: 'none',
                zIndex: TourConfig.get('backdropZIndex')
            });
            $body.append(backdrop);
        }

        function showBackdrop() {
            viewWindow.top.css('display', 'block');
            viewWindow.bottom.css('display', 'block');
            viewWindow.left.css('display', 'block');
            viewWindow.right.css('display', 'block');
        }
        function hideBackdrop() {
            viewWindow.top.css('display', 'none');
            viewWindow.bottom.css('display', 'none');
            viewWindow.left.css('display', 'none');
            viewWindow.right.css('display', 'none');
        }

        createBackdropComponent(viewWindow.top);
        createBackdropComponent(viewWindow.bottom);
        createBackdropComponent(viewWindow.left);
        createBackdropComponent(viewWindow.right);

        service.createForElement = function (element, shouldPreventScrolling, isFixedElement) {
            var position,
                viewportPosition,
                bodyPosition;

            if (shouldPreventScrolling) {
                preventScrolling();
            }

            position = $uibPosition.offset(element);
            viewportPosition = $uibPosition.viewportOffset(element);
            bodyPosition = $uibPosition.offset($body);

            if (isFixedElement) {
                angular.extend(position, viewportPosition);
            }

            viewWindow.top.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: position.top + 'px'
            });
            viewWindow.bottom.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                left: 0,
                width: '100%',
                height: (bodyPosition.top + bodyPosition.height - position.top - position.height) + 'px',
                top: (position.top + position.height) + 'px'
            });
            viewWindow.left.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                top: position.top + 'px',
                width: position.left + 'px',
                height: position.height + 'px'
            });
            viewWindow.right.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                top: position.top + 'px',
                width: (bodyPosition.left + bodyPosition.width - position.left - position.width) + 'px',
                height: position.height + 'px',
                left: (position.left + position.width) + 'px'
            });

            showBackdrop();

            if (shouldPreventScrolling) {
                preventScrolling();
            }
        };

        service.hide = function () {
            hideBackdrop();
            allowScrolling();
        };

        return service;

    }]);

}(angular.module('bm.uiTour')));
