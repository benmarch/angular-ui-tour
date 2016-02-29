'use strict';

var path = require('path');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({

        wiredep: {
            pages: {
                src: 'index.html'
            }
        },


        'bower_main': {
            pages: {
                options: {
                    method: 'prune'
                }
            }
        },


        connect: {
            demo: {
                options: {
                    port: 8000,
                    base: '.',
                    keepalive: true,
                    open: true,
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('build', [
        'wiredep',
        'bower_main'
    ]);

    grunt.registerTask('default', [
        'build',
        'connect'
    ]);
};
