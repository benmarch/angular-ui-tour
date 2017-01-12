import angular from 'angular';

export default function uiTourBackdrop(TourConfig, $document, $uibPosition, $window) {
    'ngInject';

    var service = {},
        $body = angular.element($document[0].body),
        $backdrop = angular.element($document[0].createElement('div')),
        viewWindow = {},
        preventDefault = function (e) {
            e.preventDefault();
        },
        onResize;

    function createStyles(styles) {
        const styleElement = document.createElement('style');

        styleElement.type = 'text/css';
        styleElement.innerHTML = styles;

        angular.element($document[0].head).append(styleElement);

        return function cleanup() {
            angular.element(styleElement).remove();
        };
    }

    (function createSvgClipPath() {
        var element = angular.element(`
            <svg width="100" height="100" viewBox="0 0 100 100" id="invertedCorner" fill="none" style="display: none;">
                <path class="tour-backdrop"
                      d="M100 0
                         Q 0 0 0 100
                         L0 0
                         Z" />
            </svg>
        `);

        $document[0].body.appendChild(element[0]);
    }());

    function preventScrolling() {
        $body.addClass('no-scrolling');
        $body.on('touchmove', preventDefault);
    }

    function allowScrolling() {
        $body.removeClass('no-scrolling');
        $body.off('touchmove', preventDefault);
    }

    function createBackdropComponent(name) {
        const backdrop = angular.element($document[0].createElement('div'));

        backdrop.addClass(`tour-backdrop tour-backdrop-${name}`).css({
            display: 'none',
            zIndex: TourConfig.get('backdropZIndex')
        });

        viewWindow[name] = backdrop;
        $backdrop.append(backdrop);
    }

    function createBackdropCorner(name) {
        const corner = angular.element($document[0].getElementById('invertedCorner')).clone();

        corner.addClass(`tour-backdrop-${name}`).css({
            display: 'none',
            zIndex: TourConfig.get('backdropZIndex')
        });

        viewWindow[name] = corner;
        $backdrop.append(corner);
    }

    function showBackdrop() {
        angular.forEach(viewWindow, component => component.css('display', 'block'));
    }
    function hideBackdrop() {
        angular.forEach(viewWindow, component => component.css('display', 'none'));
    }

    function positionBackdrop(element, isFixedElement, borderRadius = 0) {
        var position,
            viewportPosition,
            bodyPosition,
            vw = Math.max($document[0].documentElement.clientWidth, $window.innerWidth || 0),
            vh = Math.max($document[0].documentElement.clientHeight, $window.innerHeight || 0);

        position = $uibPosition.offset(element);
        viewportPosition = $uibPosition.viewportOffset(element);
        bodyPosition = $uibPosition.offset($body);

        if (isFixedElement) {
            angular.extend(position, viewportPosition);
        }

        //configure the main backdrop pieces
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
            height: Math.max(bodyPosition.top + bodyPosition.height - position.top - position.height, vh - position.top - position.height) + 'px',
            top: position.top + position.height + 'px'
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
            width: Math.max(bodyPosition.left + bodyPosition.width - position.left - position.width, vw - position.left - position.width) + 'px',
            height: position.height + 'px',
            left: position.left + position.width + 'px'
        });

        //if there are rounded corners, configure those
        viewWindow.cornerTL.css({
            position: isFixedElement ? 'fixed' : 'absolute',
            top: position.top + 'px',
            left: position.left + 'px',
            height: borderRadius + 'px',
            width: borderRadius + 'px'
        });
        viewWindow.cornerBL.css({
            position: isFixedElement ? 'fixed' : 'absolute',
            top: position.top + position.height - borderRadius + 'px',
            left: position.left + 'px',
            height: borderRadius + 'px',
            width: borderRadius + 'px',
            transform: 'rotate(-90deg)'
        });
        viewWindow.cornerTR.css({
            position: isFixedElement ? 'fixed' : 'absolute',
            top: position.top + 'px',
            left: position.left + position.width - borderRadius + 'px',
            height: borderRadius + 'px',
            width: borderRadius + 'px',
            transform: 'rotate(90deg)'
        });
        viewWindow.cornerBR.css({
            position: isFixedElement ? 'fixed' : 'absolute',
            top: position.top + position.height - borderRadius + 'px',
            left: position.left + position.width - borderRadius + 'px',
            height: borderRadius + 'px',
            width: borderRadius + 'px',
            transform: 'rotate(180deg)'
        });
    }

    service.createForElement = function (element, shouldPreventScrolling, isFixedElement, onClick, borderRadius) {
        positionBackdrop(element, isFixedElement, borderRadius);
        showBackdrop();

        onResize = function () {
            positionBackdrop(element, isFixedElement, borderRadius);
        };
        angular.element($window).on('resize', onResize);

        if (shouldPreventScrolling) {
            service.shouldPreventScrolling(true);
        } else {
            service.shouldPreventScrolling(false);
        }

        if (onClick) {
            angular.element($backdrop).on('click', onClick);
        } else {
            angular.element($backdrop).off('click');
        }
    };

    service.hide = function () {
        hideBackdrop();
        service.shouldPreventScrolling(false);
        angular.element($backdrop).off('click');
        angular.element($window).off('resize', onResize);
    };

    service.shouldPreventScrolling = function (shouldPreventScrolling = true) {
        if (shouldPreventScrolling) {
            preventScrolling();
        } else {
            allowScrolling();
        }
    };

    //init
    angular.forEach('top right bottom left'.split(' '), component => {
        createBackdropComponent(component);
    });
    angular.forEach('cornerTL cornerTR cornerBR cornerBL'.split(' '), corner => {
        createBackdropCorner(corner);
    });
    $body.append($backdrop);
    createStyles('.no-scrolling { height: 100%; overflow: hidden; }');

    return service;

}
