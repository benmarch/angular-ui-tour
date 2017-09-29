'use strict';

//IMPORTS
const path = require('path'),
    webpack = require('webpack'),
    CleanPlugin = require('clean-webpack-plugin'),
    moduleName = 'bm.uiTour',
    libraryName = 'uiTour';

//GENERAL CONFIG
let config = {
    context: `${__dirname}`,
    entry: __dirname + '/app/angular-ui-tour.js',
    output: {
        path: `${__dirname}/dist`,
        filename: 'angular-ui-tour.js',
        library: libraryName,
        libraryTarget: 'umd'
    },
    externals: {
        "angular": "angular",
        "angular-hotkeys": "angular-hotkeys",
        "angular-sanitize": "angular-sanitize",
        "angular-scroll": "angular-scroll",
        "angular-bind-html-compile": "angular-bind-html-compile",
        "hone": {
            commonjs: "hone",
            commonjs2: "hone",
            amd: "Hone",
            root: "Hone"
        },
        "tether": {
            commonjs: "tether",
            commonjs2: "tether",
            amd: "Tether",
            root: "Tether"
        }
    },
    module: {
        rules: [
            {
                //Load all JavaScript modules except external dependencies
                test: /\.js$/,
                exclude: /node_modules|bower_components/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: 'Promise\\.resolve\\(\\)',
                            replace: '$q.resolve()',
                            flags: 'g'
                        }
                    },
                    {
                        loader: 'ng-annotate-loader',
                        options: {
                            add: true,
                            map: false
                        }
                    },
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                //Load all templates into $templateCache
                test: /(\.html)$/,
                use: [`ng-cache-loader?module=${moduleName}`]
            },
            {
                test: /(\.css)$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules|bower_components|dist/,
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        failOnError: true,
                        emitError: true
                    }
                }]
            }
        ]
    },
    plugins: [
        //clean dist directory
        new CleanPlugin([
            `${__dirname}/dist`,
            `${__dirname}/.tmp`
        ])
    ]
};

module.exports = config;
