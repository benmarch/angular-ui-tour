//import and modify webpack config
var webpackConfig = require('./webpack.config.babel');

webpackConfig.entry = {};
webpackConfig.externals = [];
webpackConfig.devtool = 'inline-source-map';
webpackConfig.module.loaders.push({
    //properly export angular since we are using an old version
    test: /node_modules.*\/angular\.js$/,
    loaders: [
        'exports?angular'
    ]
});
webpackConfig.module.postLoaders = [
    //delays coverage til after tests are run, fixing transpiled source coverage error
    {
        test: /\.js$/,
        exclude: /(test|node_modules)\//,
        loader: 'istanbul-instrumenter'
    }
];

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'source-map-support'],


        // list of files / patterns to load in the browser
        files: [
            //phantomjs is lacking features:
            './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
            './node_modules/es6-promise/dist/es6-promise.js',
            'app/angular-ui-tour.js',
            'test/webpack-test-context.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/angular-ui-tour.js': ['webpack', 'sourcemap'],
            'test/webpack-test-context.js': ['webpack', 'sourcemap']
        },

        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots'],

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
