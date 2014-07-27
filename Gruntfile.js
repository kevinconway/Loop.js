/*jslint node: true, indent: 2, passfail: true */
"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jslint: {
      all: {
        src: ['loop/*'],
        exclude: ['test/*', 'Gruntfile.js'],
        directives: {
          node: true,
          browser: true,
          indent: 2,
          passfail: true
        },
        options: {
          edition: 'latest'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },
    mocha: {
      test: {
        src: ['test/runner.html']
      }
    },
    browserify: {
      dist: {
        files: {
          'build/loop.browser.js': ['loop/*']
        },
        options: {
          bundleOptions: {
            "standalone": "loopjs"
          }
        },
      },
      tests: {
        files: {
          'build/loop.tests.browser.js': ['test/*.spec.js']
        },
        options: {}
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'build/loop.browser.min.js': ['build/loop.browser.js'],
          'build/loop.tests.browser.min.js': ['build/loop.tests.browser.js']
        },
      }
    },
    shell: {
      prepareBrowserTests: {
        command: 'test/install_libs'
      }
    },
    watch: {
      files: [
        'loop/*.js',
        '!node_modules/*'
      ],
      tasks: ['default'],
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-shell');

  // Automated browser tests work locally but fail in Travis. Use the
  // runner.html until the PhantomJS issue is worked out.
  grunt.registerTask('default', ['jslint', 'mochaTest', 'browserify', 'uglify', 'shell']);

};
