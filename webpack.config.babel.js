'use strict';

//IMPORTS
const path = require('path'),
    webpack = require('webpack'),
    CleanPlugin = require('clean-webpack-plugin'),
    nodeExternals = require('webpack-node-externals'),
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
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: [nodeExternals()],
    module: {
        loaders: [
            {
                //Load all JavaScript modules except external dependencies
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    'ng-annotate?' + JSON.stringify({
                        add: true,
                        map: false
                    }),
                    'babel?' + JSON.stringify({})
                ]
            },
            {
                //Load all templates into $templateCache
                test: /(\.html)$/,
                loaders: [`ng-cache?module=${moduleName}`]
            }
        ],
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules|dist/,
                loaders: ['eslint']
            }
        ]
    },
    plugins: [
        //clean dist directory
        new CleanPlugin([
            `${__dirname}/dist`,
            `${__dirname}/.tmp`
        ])
    ],
    eslint: {
        failOnError: true,
        emitError: true
    }
};

module.exports = config;
