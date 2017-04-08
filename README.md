# angular-ui-tour
[![Bower Version][bower-image]][bower-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Code Climate][gpa-image]][gpa-url]

## About

Angular UI Tour is a plugin that uses Angular UI Bootstrap's popovers to display a guided product tour. This was
originally inspired by [Bootstrap Tour](http://www.bootstraptour.com) as [Angular Bootstrap Tour](http://github.com/benmarch/angular-bootstrap-tour),
but after much feedback to remove the jQuery dependency, Angular UI Tour was born. It uses many of the features from
Bootstrap Tour, but plays nicely with Angular, **and does not have any dependency on Twitter Bootstrap or jQuery!**

Check out the live demo [here](http://benmarch.github.io/angular-ui-tour). (The demo is _not_ up-to-date documentation)

## Versions 

**Breaking changes in 0.8.0:**
- Dependencies have changed. If you are not using NPM or Bower, please take note of the changes.
- Backdrop class changed from `.tour-backdrop` to `.ui-tour-backdrop`
- `Tour#status` changed to `Tour#Status`
- The following tour step options have been removed: `popupDelay`, `popupCloseDelay`, `animation`

## Getting Started
*It is highly recommended that you use a package manager like NPM or Bower to install Angular UI Tour in order to ensure that its dependencies are installed correctly.*
 
Get the package:

```sh
npm i -S angular-ui-tour

# or

bower i -S angular-ui-tour
```

Add the script tags:

```html
<!--dependencies:js-->
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
<script src="bower_components/ez-ng/dist/ez-ng.js"></script>
<script src="bower_components/angular-hotkeys/build/hotkeys.js"></script>
<script src="bower_components/hone/dist/hone.js"></script>
<script src="bower_components/tether/dist/js/tether.js"></script>
<script src="bower_components/angular-scroll/angular-scroll.js"></script>
<!--end dependencies-->

<!--Angular UI Tour-->
<script src="bower_components/angular-ui-tour/dist/angular-ui-tour.js"></script>
```

Then add the module to your app:

```js
angular.module('myApp', ['bm.uiTour']);
``` 
    
Add some styles for the backdrop (feel free to style it however you want):

```css
.ui-tour-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    fill: rgba(0, 0, 0, 0.5);
}
```
**Note:** if you give the backdrop a background color, also give it a fill color because it uses SVG for rounded corners

If your app is a SPA, tours will not end by default when the user clicks the forward or back buttons of the browser
because tours are allowed to span multiple views. To fix this behavior (and still allow tours to span multiple views)
enable the navigation interceptors:

```js
module.config(function (TourConfigProvider) {
    TourConfigProvider.enableNavigationInterceptors();
});
```

That will listen for navigation events from ngRoute and UIRouter, and if the event was not caused by Angular UI Tour,
it will end any active tours.
    
## Tour Configuration

Tours can be configured either programatically in a config block, or declaratively as part of the uiTour directive declaration.

To configure in a config block, use TourConfigProvider.set(optionName, optionValue);

To configure on a tour declaration, use `ui-tour-<option-name>="optionValue"`

### Options

|      Name            |   Type   | Default Value             |                     Description                                                                                                                                                                                                              |
| -------------------  | -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| placement            | string   | "top"                     | Where the popup should display relative to the element.                                                                                                                                                                                      |
| appendToBody         | boolean  | false                     | Should popups be appended to body (true) or the parent element (false).                                                                                                                                                                      |
| scrollOffset         | number   | 100                       | Number of pixels between the top of the viewport and the top of tour step after scrolling                                                                                                                                                    |
| popupClass           | string   | ""                        | Adds additional classes to the popup.                                                                                                                                                                                                        |
| orphan               | boolean  | false                     | Should the popup display in the center of the viewport (true) or by the element (false).                                                                                                                                                     |
| backdrop             | boolean  | false                     | Should there be a backdrop behind the element. **Note** this can be flaky, I recommend using appendToBody with this to prevent unexpected stacking issues. As of 0.5.0, it is up to you to style the backdrop (class name "tour-backdrop")   |
| backdropZIndex       | number   | 10000                     | Z-index of the backdrop. Popups will be positioned relative to this.                                                                                                                                                                         |
| backdropBorderRadius | number   | 0                         | If your target element has a border radius, add it here so that the backdrop conforms to it.                                                                                                                                                 |
| templateUrl          | string   | "tour-step-template.html" | Used as the template for the contents of the popup (see Angular UI Tooltip docs).                                                                                                                                                            |
| useUiRouter          | boolean  | false                     | When navigating with nextPath and prevPath (see below), use UI Router states instead of Angular paths.                                                                                                                                       |
| useHotkeys           | boolean  | false                     | Allows the use of right/left keyboard keys to navigate through steps, and esc key to end the tour.                                                                                                                                           |
| scrollParentId       | string   | $document                 | By default, the window will scroll to bring the tour step into view. For steps that are in a scrollable element, this option can be set to use the scrollable element instead. Note: this does not scroll the scrollable element into view.  |
|                      |          |                           |                                                                                                                                                                                                                                              |    
| onReady              | function | null                      | Called when tour is initialized and attached to the scope                                                                                                                                                                                    |
| onStart              | function | null                      | Called when tour is started, before first popup is shown                                                                                                                                                                                     |
| onEnd                | function | null                      | Called when tour is ended, after last popup is hidden                                                                                                                                                                                        |
| onPause              | function | null                      | Called when tour is paused, before current popup is hidden                                                                                                                                                                                   |
| onResume             | function | null                      | Called when tour is resumed, before current popup is shown                                                                                                                                                                                   |
| onNext               | function | null                      | Called when next step is requested, before current popup is hidden                                                                                                                                                                           |
| onPrev               | function | null                      | Called when previous step is requested, before current popup is hidden                                                                                                                                                                       |
| onShow               | function | null                      | Called just before popup is shown                                                                                                                                                                                                            |
| onShown              | function | null                      | Called just after popup is shown                                                                                                                                                                                                             |
| onHide               | function | null                      | Called just before popup is hidden                                                                                                                                                                                                           |
| onHidden             | function | null                      | Called just after popup is hidden                                                                                                                                                                                                            |
| onBackdropClick      | function | null                      | Called when user clicks on the backdrop. Useful for ending the tour early.                                                                                                                                                                   |

**Important:** If a lifecycle hook event is overridden in a config block, the function **must** return a promise.
 If it is overridden in the directive declaration, it will be wrapped in a promise automatically. If the function returns
 a promise, it will wait until it is resolved before moving on.

## Tour Steps

Tour steps are extensions of [Angular UI's Tooltips](https://angular-ui.github.io/bootstrap/#/tooltip) and therefore all
options are available. Although there are 3 types of Tooltips, there is only one type of Tour Step. In addition, almost
all of the Tour options can be overridden by individual tour steps, as well as additional options that can be changed.

As a convenience for developers, tour steps can be given IDs by supplying a value to the `tour-step` attribute: `tour-step="myStep"`.
Please note that the element ID will **not** be used as the step ID. See the multi-page tour example below for example.

To configure on a tour step declaration, use `tour-step-<option-name>="optionValue"`

### Additional Options

| Name             | Type     | Default Value             | Description                                                                                                                                                 |
| --------------   | -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title            | string   | ""                        | The title of the popup                                                                                                                                      |
| content          | string   | ""                        | The content of the popup. **Note:** can contain HTML                                                                                                        |
| order            | number   | null                      | The order in which the step will be displayed. Although it is optional, the behavior is undefined if this is not explicitly set.                            |
| enabled          | boolean  | true                      | This will enable or disable the tour step.                                                                                                                  |
| fixed            | boolean  | false                     | Is the element fixed (does not discover automatically ATM).                                                                                                 |      
| scrollIntoView   | boolean  | true                      | Should the tour scroll the page so that the tour step is visible once it is shown. Set to false when you don't want any scrolling to occur.                 |
| templateUrl      | string   | "tour-step-template.html" | Used as the template for the contents of the popup (see Angular UI Tooltip docs).                                                                           |
| **Deprecated:**  |          |                           | Will be removed in 1.0                                                                                                                                      |
| preventScrolling | boolean  | false                     | Should page scrolling be prevented when popup is shown (Deprecated, far too buggy. Feel free to implement this yourself). Only works with a backdrop.       |
| nextStep         | string   | ""                        | If the next step is on a different page, set this to declare the name of the next step.                                                                     |
| nextPath         | string   | ""                        | If the next step is on a different page, set this to the path of the next page. If useUiRouter is true, this will be the state name.                        |
| prevStep         | string   | ""                        | If the previous step is on a different page, set this to declare the name of the previous step.                                                             |
| prevPath         | string   | ""                        | If the previous step is on a different page, set this to the path of the previous page. If useUiRouter is true, this will be the state name.                |

**Best practice:** always set the order so that the steps display in the expected order. Steps with the same order will 
display consecutively, but the order among them is unpredictable. At first, use increments of 10 so that if you need to add steps
in the middle later you won't have to reorder everything.... Remember when code needed line numbers??? :)

## Directives

### uiTour

uiTour is the container for the tour steps; all tour steps must be declared as descendants of uiTour. 
The declaration can be as simple as adding ui-tour to an element, or can include one or more options (shown above).

Examples:

```html
<body ui-tour>
    ... <!-- page content and tour steps -->
</body>


<div ui-tour ui-tour-on-start="onTourStart()" ui-tour-placement="bottom">
    ... <!-- page content and tour steps -->
</div>
```
    
### tourStep

tourSteps declare which elements should have a popup during the tour. They can be declared on any element, but some consideration
should be taken when deciding which element on which to declare them.

Examples:

```html
<body ui-tour>
    <div id="mainMenu" tour-step tour-step-title="Main Menu" tour-step-content="Navigate the site using this menu." tour-step-order="0" tour-step-placement="right">...</div>
    ...
    <div id="settings" tour-step tour-step-title="Settings" tour-step-content="Click here to change your settings." tour-step-order="1">...</div>
    <div id="finalTourMessage" tour-step tour-step-title="Welcome!" tour-step-content="Enjoy using the app!" tour-step-order="1000" tour-step-orphan="true" tour-step-backdrop="true">...</div>
</body>


<!-- fixed element -->
<body ui-tour>
    <header style="position: fixed;" tour-step tour-step-title="Header" tour-step-content="This header is fixed at the top." tour-step-order="0" tour-step-fixed="true">...</header>
</body>


<!-- THIS EXAMPLE IS DEPRECATED AS OF 0.7.0. PLEASE SEE MULTI-PAGE TOURS SECTION BELOW -->
<!-- multi-page tour -->
<!-- layout -->
<body ui-tour>
    <!-- page 1: included using ngView (/page1) -->
    <div tour-step="page1step1" ... tour-step-next-path="page2" tour-step-next-step="page2step1">...</div>
    <!-- /page 1 -->
    
    <!-- page 2: ngView is populated when next step is requested after page1step1 -->
    <div tour-step="page2step1" ... tour-step-prev-path="page1" tour-step-prev-step="page1step1">...</div>
</body>
```

## Tour API

The tour itself has a small API that can be used to control the flow of the tour. The tour object is available on the
scope of the uiTour directive, and can be required as `TourController` in directives on or in the uiTour's subtree.

| Method       | Description                                                                                                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start()      | Starts the tour by showing the first tour step. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after step is shown.                                                                                                     |
| startAt()    | Starts the tour by showing the provided step. <br> **Parameters:** _step_ Can be step object, step ID string, or step index <br> **Returns:** _Promise_ Resolves after step is shown.                                                       |
| end()        | Ends the tour, calling start() again will start from the beginning. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after step is hidden.                                                                                |
| pause()      | Pauses the tour by hiding the current step. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after step is hidden.                                                                                                        |
| resume()     | Resumes the tour from the last shown step if it is paused. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after step is shown.                                                                                          |
| waitFor()    | Pauses the tour and resumes it once the provided step is registered. <br> **Parameters:** _stepId_ ID of the awaited step.  <br> **Returns:** _Promise_ Rejects immediately so that execution stops.                                        |
| next()       | Hides the current step and shows the next one. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after next step is shown.                                                                                                 |
| prev()       | Hides the current step and shows the previous one. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after previous step is shown.                                                                                         |
| goTo()       | Hides the current step and jumps to the provided one. <br> **Parameters:** _step_ Can be step object, step ID string, or step index <br> **Returns:** _Promise_ Resolved when provided step is shown, rejects if no step provided or found. |
| getStatus()  | Returns the current status of the tour based on TourStatus enum. <br> **Parameters:** \<none\> <br> **Returns:** TourStatus (ON, OFF, PAUSED, WAITING). Usage example: after tour starts: `tour.getStatus() === tour.Status.ON; //true`     |
| createStep() | Adds a step via a step configuration object. <br> **Parameters:** _step_ - a step config object: must contain an `element` (jQLite object) or `elementId` (string) attribute. `elementId` is resolved the first time a step is shown.       |

### `createStep()` Example

```js

//somewhere that you have access to a `tour`:

tour.createStep({
    elementId: 'adHocStepTarget',
    stepId: 'optionalUniqueId',
    order: 15,
    title: 'Ad Hoc Step!',
    content: 'Only plain text allowed here',
    trustedContent: $sce.trustAsHtml('<strong>This can contain HTML, and will override `step.content` if set.</strong>')
});

//...all other tour step options can be set, but none of them are dynamic!

```

## Tour Service

The `uiTourService` can be used for retrieving a reference to a tour object. There are three methods to retrieve the reference (note that they are all synchronous):

| Method                            | Description                                                                                                                                                                                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getTour()                         | If you have a single tour on your page, this is the easiest way to get the reference to it from a service or controller.                                                                                                                              |
| getTourByName(name)               | If you have multiple tours you can name them by supplying a value to the `ui-tour` attribute. This method allows you to retrieve a tour by name.                                                                                                      |
| getTourByElement(element)         | If you want to know which tour is available to a specific element (in order to create a tour step, for example) you can pass the element into this method to retrieve the appropriate tour. This can be a DOM element, or jqLite object.              |
| createDetachedTour(name, config)  | Creates a tour that is not associated with a DOM subtree. Steps can be added the detached tour by setting the `tour-step-belongs-to` attribute to the name of the tour. The config object will override global tour options just like a regular tour. |
| isTourWaiting()                   | Returns `true` if any tour has the WAITING status, otherwise `false`. To check if a specific tour is waiting, use `tour.getStatus() === tour.Status.WAITING`.                                                                                         |
| endAllTours()                     | Calls `tour.end()` for all tours and returns a promise that resolves once all tours end.                                                                                                                                                              |

## Tour Notifications

The tour itself is an event emitter that emits the following notifications. The difference between listening for notifications and setting
lifecycle hook handlers as shown above is that these notifications are outside of the lifecycle of the tour. That means that the notification events are
emitted, and then the tour moves on without waiting for any handlers to finish. By setting a lifecyle hook handler, the tour will
wait for a handler to complete before moving on. If you simply need to know when something happened, use an event notification listener,
but if you need to execute code before the tour moves continues, set an lifecycle hook handler.

Listen for the following events using this pattern:

```js
tour.on('<notificationName>', function (data) {
    //your logic here
});
```

| Notification Name | Timing                                                   | Data          |
| ----------------- | -------------------------------------------------------- | ------------- |
| initialized       | After config is set                                      | null          |
| started           | Before the first step is shown                           | first step    |
| paused            | After current step is hidden                             | current step  |
| resumed           | Before current step is shown                             | current step  |
| ended             | After last step is hidden                                | null          |
| stepAdded         | After step is added to step list                         | added step    |
| stepRemoved       | After step is removed from step list                     | removed step  |
| stepsReordered    | After all steps have been ordered properly               | null          |
| stepChanged       | After previous step is hidden, before next step is shown | next step     |

## Multi-page Tours

As of 0.7.0, the strong integration with ngRoute and UIRouter is deprecated, and the navigation API has been significantly simplified.
If you want to create a tour that spans multiple pages (in reality these are multiple _views_ as there is no built-in way to
resume a tour after a page reload) there is a very simple API. In fact, this API can be used to asynchronously load more tour
steps on demand, even if no navigation occurs.

Using a step's onNext or onPrev lifecycle hook, you can implement your navigation logic, and just return `tour.waitFor('stepOnAnotherPage')'`.

Example:
```js
function MyTourController($scope, $location) {
    $scope.navigateToAndWaitFor = function (tour, path, stepId) {
        $location.path(path);
        return tour.waitFor(stepId);
    }
}
```
```html
<!-- index.html -->
<body ui-tour ng-controller="MyTourController">
    <ng-view></ng-view>
</body>

<!-- page1.html -->
<div tour-step="stepOne" tour-step-on-next="navigateToAndWaitFor(tour, 'page2', 'stepTwo')"></div>

<!-- page2.html -->
<div tour-step="stepTwo" tour-step-on-prev="navigateToAndWaitFor(tour, 'page1', 'stepOne')"></div>
```

If you are using UIRouter, you would just replace `$location.path()` with `$state.go()` (or whatever works best).

Effectively, this pauses the tour and waits for a step with the provided step ID to be registered, and then resumes the
tour starting at that step. It does not care where the step comes from or how it is loaded, as long as it is loaded _after_
`tour.waitFor()` is called.

It is important to either return `tour.waitFor()` or return `$q.reject()`, otherwise, if there is another step on the current
page, it will show instead of the intended one.

## Multiple Tours

If you need to have separate tours on your site there are a couple ways to achieve it. One way is to use separate `ui-tour` directives, and any tour steps
defined within each subtree will belong to the respective tour. This is a fairly idealistic approach because it assumes that you can cleanly separate your tours.
If you need to create multiple tours on the same subtree you have two options: use `tour-step-enabled` and set flags to enable/disable steps when the appropriate
tour is running, or create one or more detached tours and assign steps to them. A detached tour is not associated with a DOM subtree, and steps must be explicitly
assigned to it for them to display. Here is an example of how to set up a detached tour and assign steps:

```js
angular.module('myModule', ['bm.uiTour']).run(['uiTourService', function (uiTourService) {
    uiTourService.createDetachedTour('myDetachedTour', {backdrop: true});
    //the second argument is a map that will override individual global tour options
});
```

```html
<body ui-tour="myTour" ui-tour-backdrop="false">

    <div tour-step tour-step-title="Attached Step" tour-step-content="I belong to 'myTour' because I don't have a 'belongsTo' attribute.">
        This step belongs to it's ancestral tour, not the detached tour.
    </div>
    
    <div tour-step tour-step-belongs-to="myDetachedTour" tour-step-title="Detached Step" tour-step-content="I belong to 'myDetachedTour' because I have specified my tour">
        This step belongs to "myDetachedTour" because it is specified, otherwise it would also belong to "myTour".
    </div>
 
</body>
```

Setting a tour name for detached tours is required, but by adding a name to regular tours you can specify belongsTo for those as well. **Any step that has a belongsTo
attribute will ignore its ancestral tour, and a step can only belong to one tour.**


## Build It Yourself

```sh
npm install

npm run build
```    

**Thanks and enjoy!**

## License

(The MIT License)

Copyright (c) 2014  

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[build-url]: https://travis-ci.org/benmarch/angular-ui-tour
[build-image]: http://img.shields.io/travis/benmarch/angular-ui-tour.png

[gpa-url]: https://codeclimate.com/github/benmarch/angular-ui-tour
[gpa-image]: https://codeclimate.com/github/benmarch/angular-ui-tour/badges/gpa.svg

[coverage-url]: https://codeclimate.com/github/benmarch/angular-ui-tour/code?sort=covered_percent&sort_direction=desc
[coverage-image]: https://codeclimate.com/github/benmarch/angular-ui-tour/coverage.png

[depstat-url]: https://gemnasium.com/benmarch/angular-ui-tour
[depstat-image]: https://gemnasium.com/benmarch/angular-ui-tour.svg

[bower-url]: http://bower.io/search/?q=angular-ui-tour
[bower-image]: https://badge.fury.io/bo/angular-ui-tour.png
