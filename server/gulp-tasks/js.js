/** Build JS files */

var gulp = require('gulp'),
    rjs = require('gulp-requirejs'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream')
;
var requirejsOptimize = require('gulp-requirejs-optimize');

var conf = require('../conf').conf;

var js_all = require('../conf').js_all; 
var js_vendor = require('../conf').js_vendor; 

/** requere optimizer */
gulp.task('roptimize', ['test_js'], function() {
    rjs({
        mainConfigFile : conf.app_cwd+"js/init.js",
        baseUrl: conf.app_cwd+'js',
        name: "init",
        optimizeAllPluginResources: false,
        removeCombined: false,
        out: js_all,
    })
    .pipe(gulp.dest(conf.opt_requerejs))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(conf.dest+'js'));
});

/** build js */
gulp.task('js',['roptimize'], function () {

    var vendor = gulp.src([
        'lib/requirejs/require.js'
        ], { cwd: conf.app_cwd })
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(js_vendor))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(conf.dest+'lib'));

    // return merge(all,vendor);
    return vendor;
});
