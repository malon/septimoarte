var gulp = require('gulp'),
	merge = require('merge-stream'),
	htmlreplace = require('gulp-html-replace'),
	minifyHTML = require('gulp-minify-html')
;
var conf = require('../conf').conf;

var js_all = require('../conf').js_all; 
var js_vendor = require('../conf').js_vendor; 
var css_file_min = require('../conf').css_file_min; 


gulp.task('copy', function () {
    var opts = {
        conditionals: true,
        spare:true
    };

    var html = gulp.src('*.html', { cwd: conf.app_cwd })
        .pipe(htmlreplace({
            js: {
                src: [['js/'+js_all, 'lib/'+js_vendor]],
                tpl: '<script data-main="%s" src="%s"></script>'
            },
            css: ['css/'+css_file_min]
        }))
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(conf.dest));
    
    var fonts = gulp.src('css/fonts/*', { cwd: conf.app_cwd })
        .pipe(gulp.dest(conf.dest+'css/fonts'));
    
    var favicon = gulp.src('favicon.ico', { cwd: conf.app_cwd })
        .pipe(gulp.dest(conf.dest));

    var img = gulp.src('img/*', { cwd: conf.app_cwd })
        .pipe(gulp.dest(conf.dest+'img'));

    var css_img = gulp.src(['css/images/*'], { cwd: conf.app_cwd })
        .pipe(gulp.dest(conf.dest+'css/images'));

    var data = gulp.src('data/*', { cwd: conf.app_cwd })
        .pipe(gulp.dest(conf.dest+'data'));

    return merge(html, fonts, favicon, img, css_img, data);
});