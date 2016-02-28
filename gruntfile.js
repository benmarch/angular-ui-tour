'use strict';

var path = require('path');

module.exports = function (grunt) {
    var config = {
        app: 'app',
        dist: 'dist'
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        config: config,

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: {
                options: {
                    ignores: [
                        '<%= config.app %>/tour-templates.js'
                    ]
                },
                files: {
                    src: [
                        'Gruntfile.js',
                        '<%= config.app %>/**/*.js',
                        'test/spec/**/*.js'
                    ]
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        concat: {
            angular: {
                src: ['<%= config.app %>/angular-ui-tour.js', '<%= config.app %>/**/*.js', 'lib/*.js'],
                dest: '<%= config.dist %>/angular-ui-tour.js'
            }
        },

        uglify: {
            angular: {
                src: '<%= config.dist %>/angular-ui-tour.js',
                dest: '<%= config.dist %>/angular-ui-tour.min.js'
            }
        },

        copy: {
            demo: {
                files: [
                    {
                        src: 'dist/angular-ui-tour.js',
                        dest: 'demo/angular-ui-tour.js'
                    }
                ]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            test: {
                src: 'karma.conf.js',
                devDependencies: true,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            },

            demo: {
                src: 'demo/index.html',
                devDependencies: true,
                ignorePath: '../'
            }
        },


        html2js: {
            options: {
                base: 'app',
                rename: function (moduleName) {
                    return path.basename(moduleName);
                }
            },
            app: {
                options: {
                    module: 'bm.uiTour',
                    singleModule: true,
                    existingModule: true
                },
                src: ['<%= config.app %>/**/*.html'],
                dest: '<%= config.app %>/tour-templates.js'
            },
            test: {
                options: {
                    module: 'test.templates'
                },
                src: ['test/**/*.html'],
                dest: 'tmp/test-templates.js'
            }
        },


        'bower_main': {
            demo: {
                options: {
                    dest: 'demo/bower_components'
                }
            }
        },


        connect: {
            demo: {
                options: {
                    port: 8000,
                    base: 'demo',
                    keepalive: true,
                    open: true,
                    livereload: true
                }
            }
        },

        release: {
            options: {
                additionalFiles: ['bower.json'],
                npm: false,
                indentation: '    ',
                commitMessage: 'Bumped version to <%= version %>',
                tagMessage: 'Committing release tag <%= version %>'
            }
        }
    });

    grunt.registerTask('test', [
        'html2js:test',
        'karma:unit'
    ]);

    grunt.registerTask('build', [
        'html2js:app',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('demo', [
        'build',
        'bower_main:demo',
        'wiredep:demo',
        'copy:demo'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build',
        'test'
    ]);
};
