module Tour {
    export interface IPadding {
        top: number;
        left: number;
        bottom: number;
        right: number;
    }

    export interface ITourScope extends ng.IScope {
        tour: TourController;
        tourStep: ITourStep;

        originScope: () => ITourScope;
        isOpen: () => boolean;
    }

    export interface ITourStep {
        nextPath?;
        prevPath?;
        backdrop?;
        stepId?;
        trustedContent?;
        content?: string;
        order?: number;
        templateUrl?: string;
        element?: ng.IRootElementService;
        enabled?: boolean;
        preventScrolling?: boolean;
        fixed?: boolean;
        isNext?: boolean;
        isPrev?: boolean;
        redirectNext?: boolean;
        redirectPrev?: boolean;
        nextStep?: ITourStep;
        prevStep?: ITourStep;
        show?: () => PromiseLike<any>;
        hide?: () => PromiseLike<any>;
        onNext?: () => PromiseLike<any>;
        onPrev?: () => PromiseLike<any>;
        onShow?: () => PromiseLike<any>;
        onHide?: () => PromiseLike<any>;
        onShown?: () => PromiseLike<any>;
        onHidden?: () => PromiseLike<any>;
        config?: (string) => any;
    }

    export interface ITourConfig {
        get: (option: string) => any;
        getAll: () => ITourConfigProperties;
    }

    export interface ITourConfigProperties {
        name?: string;
        placement: string;
        animation: boolean;
        popupDelay: number;
        closePopupDelay: number;
        enable: boolean;
        appendToBody: boolean;
        popupClass: string;
        orphan: boolean;
        backdrop: boolean;
        backdropZIndex: number;
        scrollOffset: number;
        scrollIntoView: boolean;
        useUiRouter: boolean;
        useHotkeys: boolean;

        onStart: (any?) => any;
        onEnd: (any?) => any;
        onPause: (any?) => any;
        onResume: (any?) => any;
        onNext: (any?) => any;
        onPrev: (any?) => any;
        onShow: (any?) => any;
        onShown: (any?) => any;
        onHide: (any?) => any;
        onHidden: (any?) => any;

    }
}