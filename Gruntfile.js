/*globals module, require*/
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    open: {
      demo: {
        path: './demo/index.html',
      },
      test: {
        path: './_SpecRunner.html',
      },
    },
    concat: {
      options: {
        banner: '(function () {',
        footer: '}());',
        separator: '\n',
      },
      dist: {
        src: [
          'src/utils/utils.js',
          'src/utils/*.js',
          'src/**/*.js',
        ],
        dest: 'dist/fl-form-builder.js',
      },
    },
    sass: {
      dist: {
        options: {
          style: 'expanded',
        },
        files: {
          'dist/fl-form-builder.css': 'src/**/*.scss',
        },
      },
    },
    uglify: {
      main: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/fl-form-builder.map',
        },
        files: {
          'dist/fl-form-builder.min.js': ['dist/fl-form-builder.js'],
        },
      },
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions']
          })
        ]
      },
      dist: {
        src: 'dist/fl-form-builder.css'
      },
    },
    watch: {
      css: {
        files: 'src/**/*.scss',
        tasks: ['css-build'],
        options: {
          livereload: true,
        },
      },
      js: {
        files: 'src/**/*.js',
        tasks: ['js-build'],
        options: {
          livereload: true,
        },
      },
      demo: {
        files: 'demo/**/*.*',
        options: {
          livereload: true,
        },
      },
      tests: {
        files: 'tests/**/*.*',
        options: {
          livereload: true,
        },
      },
    },
    jasmine: {
      functional: {
        src: 'dist/fl-form-builder.js',
        options: {
          specs: 'tests/functional/**/*-specs.js',
          helpers: ['./tests/common-helpers/*.js', './tests/functional/helpers/*.js'],
          vendor: [
            'bower_components/x-div/js/x-div-tester.js'
          ]
        },
      },
      unit: {
        src: [
          'src/utils/utils.js',
          'src/utils/*.js',
          'src/**/*.js',
        ],
        options: {
          specs: 'tests/unit/**/*-specs.js',
          helpers: ['./tests/common-helpers/*.js', './tests/unit/helpers/*.js'],
          vendor: [
            'bower_components/x-div/js/x-div-tester.js'
          ]
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.registerTask('default', []);
  grunt.registerTask('demo', ['open:demo']);

  //Building
  grunt.registerTask('js-build', ['concat', 'uglify']);
  grunt.registerTask('css-build', ['sass', 'postcss']);
  grunt.registerTask('build', ['js-build', 'css-build']);

  //Developing
  grunt.registerTask('dev', ['build', 'jasmine:functional:build', 'open', 'watch']);
  grunt.registerTask('test-functional', ['dev']);
  grunt.registerTask('test-unit', ['build', 'jasmine:unit:build', 'open', 'watch']);

  //Test
  grunt.registerTask('test', ['jasmine']);

};
