'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    gopen = require('gulp-open');

var config = {
    port: 8000,
    base: 'http://localhost',
    fallback: 'dist/index.html',
    browser: '/Applications/Google\ Chrome.app'
}

// setting up and local environment with live reload
gulp.task('connect', ['build'], function () {
    connect.server({
        root: 'dist',
        port: config.port,
        base: config.base,
        livereload: true,
        fallback: config.fallback
    });
});

gulp.task('open', ['connect'], function () {
    return gulp.src(config.fallback)
        .pipe(gopen({
            uri: config.base + ':' + config.port,
            app: config.browser
        }));
});

// style tasks
gulp.task('scss', ['cleanCss'], function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', function (error) {
            gutil.log(error);
        }))
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie >= 10']
        }))
        .pipe(cssnano({
            autoprefixer: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('cleanCss', function () {
    cleanDirectory('dist/css');
});

// markup tasks
gulp.task('markUp', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

// delete file or folder at path
function cleanDirectory (directoryPath) {
    return gulp.src(directoryPath, {read: false})
        .pipe(clean());
}

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/**/*.html', ['markUp']);
});

gulp.task('build', ['scss', 'markUp']);
gulp.task('default', ['open', 'watch']);
