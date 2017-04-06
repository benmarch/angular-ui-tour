'use strict';

//IMPORTS
const path = require('path'),
    webpack = require('webpack'),
    CleanPlugin = require('clean-webpack-plugin'),
    nodeExternals = require('webpack-node-externals'),
    bowerExternals = require('webpack-bower-externals'),
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
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components']
    },
    externals: [bowerExternals()],
    module: {
        loaders: [
            {
                //Load all JavaScript modules except external dependencies
                test: /\.js$/,
                exclude: /node_modules|bower_components/,
                loaders: [
                    'string-replace?' + JSON.stringify({
                        search: 'Promise\\.resolve\\(\\)',
                        replace: '$q.resolve()',
                        flags: 'g'
                    }),
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
            },
            {
                test: /(\.css)$/,
                loaders: ['style', 'css']
            }
        ],
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules|bower_components|dist/,
                loaders: ['eslint']
            }
        ]
    },
    plugins: [
        //allow external dependencies from Bower
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ),
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
