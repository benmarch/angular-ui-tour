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

Check out the live demo [here](http://benmarch.github.io/angular-ui-tour).

## Getting Started
Get the package:

    bower install angular-ui-tour

Add the script tags:

    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <script src="bower_components/angular-ui-tour/dist/angular-ui-tour.js"></script>

Then add the module to your app:

    angular.module('myApp', ['bm.uiTour']);
    
## Tour Configuration

Tours can be configured either programatically in a config block, or declaratively as part of the uiTour directive declaration.

To configure in a config block, use TourConfigProvider.set(optionName, optionValue);

To configure on a tour declaration, use `ui-tour-<option-name>="optionValue"`

### Options

|      Name       |   Type   | Default Value             |                     Description                                                                                                                 |
| --------------  | -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| placement       | string   | "top"                     | Where the popup should display relative to the element.                                                                                         |
| animation       | boolean  | true                      | Should the popup fade in/out.                                                                                                                   |
| popupDelay      | number   | 1                         | Time to delay (in ms) between when the popup is requested to show and when it is shown. **Note** must be positive for multi-page tours to work. |
| closePopupDelay | number   | 0                         | Time to delay (in ms) between when the popup is requested to hide and when it is hidden.                                                        |
| appendToBody    | boolean  | false                     | Should popups be appended to body (true) or the parent element (false).                                                                         |
| tooltipClass    | string   | ""                        | Adds additional classes to the popup.                                                                                                           |
| orphan          | boolean  | false                     | Should the popup display in the center of the viewport (true) or by the element (false).                                                        |
| backdrop        | boolean  | false                     | Should there be a backdrop behind the element. **Note** this can be flaky, I recommend using appendToBody with this.                            |
| backdropZIndex  | number   | 10000                     | Z-index of the backdrop. Popups will be positioned relative to this.                                                                            |
| templateUrl     | string   | "tour-step-template.html" | Used as the template for the contents of the popup (see Angular UI Tooltip docs).                                                               |
|                 |          |                           |                                                                                                                                                 |    
| onReady         | function | null                      | Called when tour is initialized and attached to the scope                                                                                       |
| onStart         | function | null                      | Called when tour is started, before first popup is shown                                                                                        |
| onEnd           | function | null                      | Called when tour is ended, after last popup is hidden                                                                                           |
| onPause         | function | null                      | Called when tour is paused, before current popup is hidden                                                                                      |
| onResume        | function | null                      | Called when tour is resumed, before current popup is shown                                                                                      |
| onNext          | function | null                      | Called when next step is requested, before current popup is hidden                                                                              |
| onPrev          | function | null                      | Called when previous step is requested, before current popup is hidden                                                                          |
| onShow          | function | null                      | Called just before popup is shown                                                                                                               |
| onShown         | function | null                      | Called just after popup is shown                                                                                                                |
| onHide          | function | null                      | Called just before popup is hidden                                                                                                              |
| onHidden        | function | null                      | Called just after popup is hidden                                                                                                               |

**Important:** If an event is overridden in a config block, the function **must** return a promise.
 If it is overridden in the directive declaration, it will be wrapped in a promise automatically. If the function returns
 a promise, it will wait until it is resolved before moving on.

## Tour Steps

Tour steps are extensions of [Angular UI's Tooltips](https://angular-ui.github.io/bootstrap/#/tooltip) and therefore all
options are available. Although there are 3 types of Tooltips, there is only one type of Tour Step. In addition, almost
all of the Tour options can be overridden by individual tour steps, as well as additional options that can be changed.

To configure on a tour step declaration, use `tour-step-<option-name>="optionValue"`

### Additional Options

|      Name        |   Type   | Default Value             |                     Description                                                                                                                             |
| --------------   | -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title            | string   | ""                        | The title of the popup                                                                                                                                      |
| content          | string   | ""                        | The content of the popup. **Note:** can contain HTML                                                                                                        |
| order            | number   | null                      | The order in which the step will be displayed. Although it is optional, the behavior is undefined if this is not explicitly set.                            |
| enabled          | boolean  | true                      | This will enable or disable the tour step.                                                                                                                  |
| fixed            | boolean  | false                     | Is the element fixed (does not discover automatically ATM).                                                                                                 |      
| preventScrolling | boolean  | false                     | Should page scrolling be prevented when popup is shown (I don't recommend using this, but there are times when it is useful). Only works with a backdrop.   |
| nextStep         | string   | ""                        | If the next step is on a different page, set this to declare the name of the next step.                                                                     |
| nextPath         | string   | ""                        | If the next step is on a different page, set this to the path of the next page.                                                                             |
| prevStep         | string   | ""                        | If the previous step is on a different page, set this to declare the name of the previous step.                                                             |
| prevPath         | string   | ""                        | If the previous step is on a different page, set this to the path of the previous page.                                                                     |
| templateUrl      | string   | "tour-step-template.html" | Used as the template for the contents of the popup (see Angular UI Tooltip docs).                                                                           |

**Best practice:** always set the order so that the steps display in the expected order. Steps with the same order will 
display consecutively, but the order among them is unpredictable.

## Tour API

The tour itself has a small API that can be used to control the flow of the tour. The tour object is available on the
scope of the uiTour directive, and can be required as `TourController` in directives on or in the uiTour's subtree.

| Method  | Description                                                                                                                                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start() | Starts the tour by showing the first tour step. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after step is shown.                                                                                                     |
| end()   | Ends the tour, calling start() again will start from the beginning. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after step is hidden.                                                                                |
| pause() | Pauses the tour by hiding the current step. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after step is hidden.                                                                                                        |
| resume()| Resumes the tour from the last shown step if it is paused. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after step is shown.                                                                                          |
| next()  | Hides the current step and shows the next one. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after next step is shown.                                                                                                 |
| prev()  | Hides the current step and shows the previous one. <br> **Parameters:** \<none\> <br> **Returns:** _Promise_ Resolves after previous step is shown.                                                                                         |
| goTo()  | Hides the current step and jumps to the provided one. <br> **Parameters:** _step_ Can be step object, step ID string, or step index <br> **Returns:** _Promise_ Resolved when provided step is shown, rejects if no step provided or found. |

## Tour Service

The `uiTourService` can be used for retrieving a reference to a tour object. There are three methods to retrieve the reference (note that they are all synchronous):

| Method                    | Description                                                                                                                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getTour()                 | If you have a single tour on your page, this is the easiest way to get the reference to it from a service or controller.                                                                                                                 |
| getTourByName(name)       | If you have multiple tours you can name them by supplying a value to the `ui-tour` attribute. This method allows you to retrieve a tour by name.                                                                                         |
| getTourByElement(element) | If you want to know which tour is available to a specific element (in order to create a tour step, for example) you can pass the element into this method to retrieve the appropriate tour. This can be a DOM element, or jqLite object. |

## Tour Events

The tour itself is an event emitter that emits the following events. The difference between listening for events and setting
handlers as shown above is that these events are outside of the lifecycle of the tour. That means that the events are
emitted and then the tour moves on without waiting for any handlers to finish. By setting an above handler, the tour will
wait for a handler to complete before moving on. If you simply need to know when something happened, use an event listener,
but if you need to execute code before the tour moves continues, set an event handler.

Listen for the following events using this pattern:

```js
tour.on('<eventName>', function (data) {
    //your logic here
});
```

| Event Name     | Timing                                                   | Data          |
| -------------- | -------------------------------------------------------- | ------------- |
| initialized    | After config is set                                      | null          |
| started        | Before the first step is shown                           | first step    |
| paused         | After current step is hidden                             | current step  |
| resumed        | Before current step is shown                             | current step  |
| ended          | After last step is hidden                                | null          |
| stepAdded      | After step is added to step list                         | added step    |
| stepRemoved    | After step is removed from step list                     | removed step  |
| stepsReordered | After all steps have been ordered properly               | null          |
| stepChanged    | After previous step is hidden, before next step is shown | next step     |



## Directives

### uiTour

uiTour is the container for the tour steps; all tour steps must be declared as descendants of uiTour. 
The declaration can be as simple as adding ui-tour to an element, or can include one or more options (shown above).

Examples:

    <body ui-tour>
        ... <!-- page content and tour steps -->
    </body>
    
    
    <div ui-tour ui-tour-on-start="onTourStart()" ui-tour-placement="bottom">
        ... <!-- page content and tour steps -->
    </div>
    
### tourStep

tourSteps declare which elements should have a popup during the tour. They can be declared on any element, but some consideration
should be taken when deciding which element on which to declare them.

Examples:

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
    
    
    <!-- multi-page tour -->
    <!-- layout -->
    <body ui-tour>
        <!-- page 1: included using ngView (/page1) -->
        <div tour-step="page1step1" ... tour-step-next-path="page2" tour-step-next-step="page2step1">...</div>
        <!-- /page 1 -->
        
        <!-- page 2: ngView is populated when next step is requested after page1step1 -->
        <div tour-step="page2step1" ... tour-step-prev-path="page1" tour-step-prev-step="page1step1">...</div>
    </body>

## Build It Yourself

Assuming you have Node, grunt, and bower installed:

    npm install

    bower install

    grunt
    

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
