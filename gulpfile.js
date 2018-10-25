/**
  * gulpfile.js
  * Angry Blobs - Gulp Configuration
  *
  * @author Rhys Evans
  * @version 23/10/2018
*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Move all third party dependencies to the /vendor directory
gulp.task('vendor', function() {

  // Three.js
  gulp.src([
      './node_modules/three/build/three.min.js',
    ])
    .pipe(gulp.dest('./vendor/three'))

  // Physijs
  gulp.src([
    './node_modules/nodejs-physijs/nodejs/libs/*',
    '!./node_modules/nodejs-physijs/nodejs/libs/three.js'
  ])
  .pipe(gulp.dest('./vendor/physijs'))

  // Jquery
  gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
  .pipe(gulp.dest('./vendor/jquery'))
});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./src/css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp.src([
      './src/css/*.css',
      '!./src/css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./src/css'));
});

// CSS group task
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './src/js/*.js',
      '!./src/js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./src/js'));
});

// JS
gulp.task('js', ['js:minify']);

// Dist Task
gulp.task('dist', function() {
  // TODO: implement
});
