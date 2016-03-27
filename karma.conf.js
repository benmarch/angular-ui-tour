// Karma configuration
// Generated on Fri Apr 25 2014 13:52:48 GMT-0400 (EDT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            //bower:js
            'bower_components/angular/angular.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/ngSmoothScroll/lib/angular-smooth-scroll.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/ez-ng/dist/ez-ng.js',
            'bower_components/angular-hotkeys/build/hotkeys.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-route/angular-route.js',
            //endbower
            'app/angular-ui-tour.js',
            'app/**/*.js',
            'lib/**/*.js',
            'test/spec/**/*.js',
            'tmp/test-templates.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/**/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots', 'junit', 'coverage', 'growl'],

        htmlReporter: {
            outputDir: 'test/results',
            templatePath: 'node_modules/karma-html-reporter/jasmine_template.html'
        },

        junitReporter: {
            outputFile: 'test/results/karma.xml'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
