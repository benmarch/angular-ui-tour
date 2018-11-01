module Tour {
    export class TourBackdrop {
        private $body: ng.IRootElementService;
        private viewWindow: { top: ng.IRootElementService, bottom: ng.IRootElementService, left: ng.IRootElementService, right: ng.IRootElementService, target: ng.IRootElementService };

        private preventDefault(e) {
            e.preventDefault();
        }

        private preventScrolling() {
            this.$body.addClass('no-scrolling');
            this.$body.on('touchmove', this.preventDefault);
        }

        private allowScrolling() {
            this.$body.removeClass('no-scrolling');
            this.$body.off('touchmove', this.preventDefault);
        }

        private createNoScrollingClass() {
            var name = '.no-scrolling',
                rules = 'height: 100%; overflow: hidden;',
                style = document.createElement('style');
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);

            if (!style.sheet && !(<any>style.sheet).insertRule) {
                ((<any>style).styleSheet || style.sheet).addRule(name, rules);
            } else {
                (<any>style.sheet).insertRule(name + '{' + rules + '}', 0);
            }
        }

        private createBackdropComponent(backdrop) {
            backdrop.addClass('tour-backdrop').addClass('not-shown').css({
                //display: 'none',
                zIndex: this.TourConfig.get('backdropZIndex')
            });
            this.$body.append(backdrop);
        }

        private showBackdrop() {
            this.viewWindow.top.removeClass('hidden');
            this.viewWindow.bottom.removeClass('hidden');
            this.viewWindow.left.removeClass('hidden');
            this.viewWindow.right.removeClass('hidden');

            setTimeout(() => {
                this.viewWindow.top.removeClass('not-shown');
                this.viewWindow.bottom.removeClass('not-shown');
                this.viewWindow.left.removeClass('not-shown');
                this.viewWindow.right.removeClass('not-shown');
            }, 33);
        }

        private hideBackdrop() {
            this.viewWindow.top.addClass('not-shown');
            this.viewWindow.bottom.addClass('not-shown');
            this.viewWindow.left.addClass('not-shown');
            this.viewWindow.right.addClass('not-shown');
            this.hideTarget();

            setTimeout(() => {
                this.viewWindow.top.addClass('hidden');
                this.viewWindow.bottom.addClass('hidden');
                this.viewWindow.left.addClass('hidden');
                this.viewWindow.right.addClass('hidden');
            }, 250);
        }

        createForElement(element: ng.IRootElementService, shouldPreventScrolling: boolean, isFixedElement: boolean, padding: IPadding) {
            var position,
                viewportPosition,
                bodyPosition;

            if (shouldPreventScrolling) {
                this.preventScrolling();
            }

            position = this.$uibPosition.offset(element);
            viewportPosition = this.$uibPosition.viewportOffset(element);
            bodyPosition = this.$uibPosition.offset(this.$body);

            if (isFixedElement) {
                angular.extend(position, viewportPosition);
            }

            padding = this._processPadding(padding);

            var pTop = Math.floor(position.top) - padding.top;
            var pLeft = Math.floor(position.left) - padding.left;
            var pHeight = Math.floor(position.height) + padding.top + padding.bottom;
            var pWidth = Math.floor(position.width) + padding.left + padding.right;

            var bTop = Math.floor(bodyPosition.top);
            var bLeft = Math.floor(bodyPosition.left);
            var bHeight = Math.floor(bodyPosition.height);
            var bWidth = Math.floor(bodyPosition.width);

            this.viewWindow.top.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: (pTop) + 'px'
            });
            this.viewWindow.bottom.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                left: 0,
                width: '100%',
                height: (bTop + bHeight - pTop - pHeight) + 'px',
                top: (pTop + pHeight) + 'px'
            });
            this.viewWindow.left.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                left: 0,
                top: pTop + 'px',
                width: (pLeft) + 'px',
                height: pHeight + 'px'
            });
            this.viewWindow.right.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                top: pTop + 'px',
                width: (bLeft + bWidth - pLeft - pWidth) + 'px',
                height: pHeight + 'px',
                left: (pLeft + pWidth) + 'px'
            });
            this.viewWindow.target.css({
                position: isFixedElement ? 'fixed' : 'absolute',
                top: pTop + 'px',
                width: pWidth + 'px',
                height: pHeight + 'px',
                left: pLeft + 'px'
            });

            this.showBackdrop();

            if (shouldPreventScrolling) {
                this.preventScrolling();
            }
        }

        hide() {
            this.hideBackdrop();
            this.hideTarget();
            this.allowScrolling();
        }

        hideTarget(removeNotShow = true) {
            this.viewWindow.target.addClass('not-shown');

            if (!removeNotShow)
                return;

            setTimeout(() => {
                this.viewWindow.target.addClass('hidden');
            }, 250);
        }

        showTarget() {
            this.viewWindow.target.removeClass('hidden');

            setTimeout(() => {
                this.viewWindow.target.removeClass('not-shown');
            }, 33);
        }

        constructor(private TourConfig: ITourConfig, private $document: ng.IDocumentService, private $uibPosition: angular.ui.bootstrap.IPositionService, private $window: ng.IWindowService) {
            var service = this;
            var document = <HTMLDocument>(<any>$document[0])
            this.$body = angular.element(document.body);
            this.viewWindow = {
                top: angular.element(document.createElement('div')),
                bottom: angular.element(document.createElement('div')),
                left: angular.element(document.createElement('div')),
                right: angular.element(document.createElement('div')),
                target: angular.element(document.createElement('div'))
            }

            this.createNoScrollingClass();

            this.createBackdropComponent(this.viewWindow.top);
            this.createBackdropComponent(this.viewWindow.bottom);
            this.createBackdropComponent(this.viewWindow.left);
            this.createBackdropComponent(this.viewWindow.right);
            this.createBackdropComponent(this.viewWindow.target);

        }

        static factory(TourConfig: ITourConfig, $document: ng.IDocumentService, $uibPosition: angular.ui.bootstrap.IPositionService, $window: ng.IWindowService) {
            return new TourBackdrop(TourConfig, $document, $uibPosition, $window);
        }

        _processPadding(padding: IPadding) {
            if (!padding)
                padding = { top: 0, left: 0, right: 0, bottom: 0 }

            padding.top = padding.top || 0;
            padding.left = padding.left || 0;
            padding.right = padding.right || 0;
            padding.bottom = padding.bottom || 0;

            return padding;
        }
    }
}