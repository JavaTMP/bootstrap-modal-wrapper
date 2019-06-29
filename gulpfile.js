/*!
 * bootstrap-modal-wrapper v1.0.0 (http://javatmp.com)
 * Bootstrap modal wrapper factory for creating dynamic and nested stacked dialog instances.
 * Copyright 2018 JavaTMP
 * Licensed under MIT (https://github.com/JavaTMP/bootstrap-modal-wrapper/blob/master/LICENSE)
 */

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var eslint = require('gulp-eslint');
var header = require('gulp-header');
var pkg = require('./package.json');

var banner = ['/*!',
    ' * <%= pkg.name %> (http://javatmp.com)',
    ' * <%= pkg.description %>',
    ' *',
    ' * @version <%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @copyright 2018 JavaTMP',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

gulp.task('clean', function (cb) {
    return del.sync(['./dist'], cb());
});

gulp.task('dist', gulp.series("clean", function (cb) {
    return gulp.src('./js/bootstrap-modal-wrapper-factory.js')
            .pipe(eslint({
                "env": {"browser": true, "node": true, "jquery": true},
                "rules": {
                    "semi": 2,
                    "eqeqeq": 1,
                    "quotes": 0,
                    "no-trailing-spaces": 1,
                    "eol-last": 1,
                    "no-unused-vars": 0,
                    "no-underscore-dangle": 0,
                    "no-alert": 1,
                    "no-lone-blocks": 1
                },
                "globals": ["jQuery", "$"]
            }))
            .pipe(eslint.format())
            .pipe(uglify({output: {comments: /^!/}}))
            .pipe(header(banner, {pkg: pkg}))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('./dist/'))
            .on('end', function () {
                cb();
            });
}));

gulp.task('default', gulp.series("dist", function (cb) {
    // place code for your default task here
    cb();
}));
