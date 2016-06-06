/* eslint-env node */
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('rollup-plugin-babel');
const rollup = require('gulp-rollup');
const sass = require('gulp-sass');
const DepLinker = require('dep-linker');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const jasmineBrowser = require('gulp-jasmine-browser');
const moduleName = 'fl-form-builder';
const watch = require('gulp-watch');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const open = require('gulp-open');

const paths = {
  demo: {
    src: './demo/index.html',
    dep: './demo/dependencies/',
  },
  js: {
    src: './src/',
    main: './src/main.js',
    dest: './dist/',
  },
  sass: {
    src: 'src/**/*.scss',
    main: './src/sass/main.scss',
    dest: 'dist/',
  },
  tests: {
    src: 'tests/src/**/*.*',
    main: './tests/build/**/*-specs.js',
    dest: './tests/build/',
  },
};

gulp.task('copy-dependencies', () => {
  return DepLinker.copyDependenciesTo(paths.demo.dep, true);
});

// -------------------------------------------------------
//            MODULE
// -------------------------------------------------------
gulp.task('build:src', () => {
  gulp.src(paths.js.main)
  .pipe(sourcemaps.init())
  .pipe(rollup({
    plugins: [
      nodeResolve({ jsnext: true, main: true }),
      commonjs(),
      babel({
        runtimeHelpers: true,
        exclude: 'node_modules/**',
        plugins: ['transform-async-to-generator', [
          'transform-runtime', {
            polyfill: false,
            regenerator: true,
          }]],
        presets: ['es2015-rollup'],
      }),
    ],
  }))
  .pipe(rename({ basename: moduleName }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.js.dest));
});

gulp.task('watch:build:src', () => {
  gulp.watch(paths.js.src, ['build']);
});


gulp.task('build:sass', () => {
  return gulp.src(paths.sass.main)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer({ browsers: ['last 15 versions'] })]))
  .pipe(rename({ basename: moduleName }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.sass.dest));
});

gulp.task('watch:build:sass', () => {
  gulp.watch(paths.sass.src, ['build']);
});


// -------------------------------------------------------
//            TESTS
// -------------------------------------------------------
gulp.task('build:tests', () => {
  gulp.src(paths.tests.src)
  .pipe(sourcemaps.init())
  .pipe(rollup({
    plugins: [
      nodeResolve({ jsnext: true, main: true }),
      commonjs(),
      babel({
        runtimeHelpers: true,
        exclude: 'node_modules/**',
        plugins: ['transform-async-to-generator', [
          'transform-runtime', {
            polyfill: false,
            regenerator: true,
          }]],
        presets: ['es2015-rollup'],
      }),
    ],
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.tests.dest));
});

gulp.task('test-headless', () => {
  return gulp.src([
    'node_modules/babel-polyfill/dist/polyfill.js',
    paths.tests.main,
  ])
  .pipe(jasmineBrowser.specRunner({ console: true }))
  .pipe(jasmineBrowser.headless());
});

gulp.task('test-browser', () => {
  gulp.src([
    paths.tests.main,
  ])
  .pipe(watch(paths.tests.main))
  .pipe(jasmineBrowser.specRunner())
  .pipe(jasmineBrowser.server({ port: 8888 }));
});

gulp.task('open:test-browser', () => {
  gulp.src(['./'])
  .pipe(open({
    uri: 'http://localhost:8888',
    app: 'google-chrome',
  }));
});

// -------------------------------------------------------
//            MAIN TASKS
// -------------------------------------------------------

gulp.task('build', [
  'build:src',
  'build:sass',
  'build:tests',
]);

gulp.task('watch', [
  'watch:build:sass',
  'watch:build:src',
]);

gulp.task('open', [
  'open:test-browser',
]);

gulp.task('test', ['build', 'copy-dependencies', 'test-headless']);
gulp.task('test-debug', ['build', 'copy-dependencies', 'open:test-browser', 'test-browser']);

gulp.task('build-watch', ['build', 'watch']);
gulp.task('demo', ['copy-dependencies', 'build-watch']);