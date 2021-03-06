'use strict';

var gulp        = require ('gulp');
var path        = require ('path');
var fs          = require ('fs');
var $           = require ('gulp-load-plugins')();
var runSequence = require ('run-sequence');
var webserver   = require ('gulp-webserver');
var del         = require ('del');

var paths = {
    html   : './*.html',
    fonts  : [
        './font-awesome/fonts/*.*', 
        './bootstrap/fonts/*.*'
    ],
    css    : [
        './bootstrap/css/bootstrap.min.css',
        './font-awesome/css/font-awesome.min.css',
        'css/flexslider.css',
        'css/owl.carousel.css',
        'css/jquery-ui.min.css',
        'css/style.css',
        'css/custom.css'
    ],
    js     : [
        './js/jquery.min.js',
        './bootstrap/./js/bootstrap.min.js',
        './js/jquery.easing.1.3.min.js',
        './js/jquery.backstretch.min.js',
        './js/jquery.flexslider-min.js',
        './js/owl.carousel.min.js',
        './js/masonry.pkgd.min.js',
        './js/jquery-ui.min.js',
        './js/pace.min.js',
        './js/wow.min.js',
        './js/jqBootstrapValidation.js',
        './js/custom.js',
        './js/jquery.countdown.min.js'
    ],
    images : './img/**/*',
    dist   : './dist/'
};

gulp.task ('clean', function () {
    return del ([
        './dist/**',
    ]);
});

gulp.task ('images', function () {
    return gulp.src (paths.images)
        .pipe ($.imagemin ({ progressive: true }))
        .pipe (gulp.dest (paths.dist + '/img/'));
});

gulp.task ('js', function () {
    return gulp.src (paths.js)
        .pipe ($.concat ('main.js',{newLine: ';'}))
        .pipe ($.uglify ())
        .pipe (gulp.dest (paths.dist + '/js/'));
});

gulp.task ('css', function () {
    return gulp.src (paths.css)
        .pipe ($.concat ('main.css'))
        .pipe ($.cssmin ())
        .pipe (gulp.dest (paths.dist + '/css/'));
});

gulp.task ('fonts', function () {
    return gulp.src (paths.fonts)
        .pipe (gulp.dest(paths.dist + '/fonts'));
});

gulp.task ('build', ['images', 'fonts', 'js', 'css'], function () {
    return gulp.src ('index.html')
        .pipe ($.useref ())
        .pipe ($.minifyHtml ({
            quotes : true,
            empty  : true,
            spare  : true
    }))
    .pipe(gulp.dest ('dist'))
});

gulp.task ('server', function () {
    gulp.src ('.')
        .pipe (webserver ({
            port             : 5000,
            livereload       : false,
            directoryListing : {
                enable : false,
            },
            open             : 'index.html'
        }));
});

gulp.task ('server:dist', ['dist'], function () {
    gulp.src ('.')
        .pipe (webserver ({
            port             : 5000,
            livereload       : false,
            directoryListing : {
                enable : false,
            },
            open             : 'dist/index.html'
        }));
});

gulp.task ('dist', function (cb) {
    runSequence ('clean', 'build', cb);
})