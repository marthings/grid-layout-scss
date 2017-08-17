var gulp        = require('gulp');
var path        = require('path');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var reload      = browserSync.reload;
var twig        = require('gulp-twig');
var data        = require('gulp-data');
var prefix      = require('gulp-autoprefixer');
var filesize    = require('gulp-filesize');
var minifyCss   = require('gulp-minify-css');
var plumber     = require('gulp-plumber');

// Static Server + watching scss/html files
gulp.task('serve', ['sass','compile'], function() {

    browserSync.init({
        server: "./public"
    });

    gulp.watch("./scss/**/*.scss", ['sass']);
    gulp.watch("public/*.html").on('change', reload);
    gulp.watch("./views/**/*.twig", ['compile']);
});

// Compile twig

gulp.task('compile', function () {
  return gulp.src('./views/**/*.twig')
    .pipe(data(function(file) {
      return require('./models/data.json');
    }))
    .pipe(twig({
      base:'./views/layouts'
    }))
    .pipe(gulp.dest('./public'));
});

// Compile sass into CSS
gulp.task('sass', function() {
    gulp.src('./scss/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(prefix(
            'last 2 version', 'safari 5', 'ios 6', 'android 4'
        ))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./public/css/'))
        .pipe(filesize());
});

gulp.task('default', ['serve']);
