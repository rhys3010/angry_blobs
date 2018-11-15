/**
  * gulpfile.js
  * Angry Blobs - Gulp Configuration
  *
  * @author Rhys Evans
  * @version 1.0
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
    .pipe(gulp.dest('./vendor/three'));

  // Bootstrap
  gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
    './node_modules/bootstrap/dist/css/bootstrap.min.css.map'
  ])
  .pipe(gulp.dest('./vendor/bootstrap'));

  // Jquery
  gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
  .pipe(gulp.dest('./vendor/jquery'));
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
  // Index file
  gulp.src([
      './index.html',
    ])
    .pipe(gulp.dest('./dist/'));

  // favicon
  gulp.src([
    './favicon.ico',
  ])
  .pipe(gulp.dest('./dist/'));

  // Javascript files
  gulp.src([
    './src/js/*',
  ])
  .pipe(gulp.dest('./dist/src/js/'));

  // CSS
  gulp.src([
    './src/css/*.css',
  ])
  .pipe(gulp.dest('./dist/src/css/'));

  // Assets - Fonts
  gulp.src([
    './src/assets/fonts/*',
  ])
  .pipe(gulp.dest('./dist/src/assets/fonts/'));

  // Assets - Images
  gulp.src([
    './src/assets/img/*',
  ])
  .pipe(gulp.dest('./dist/src/assets/img/'));

  // Assets - Textures
  gulp.src([
    './src/assets/textures/*',
  ])
  .pipe(gulp.dest('./dist/src/assets/textures/'));

  // Vendor
  gulp.src([
    './vendor/**/*.*',
  ])
  .pipe(gulp.dest('./dist/vendor/'));

});
