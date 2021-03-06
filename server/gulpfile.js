var gulp = require('gulp');

var requireDir = require('require-dir');
requireDir('./gulp-tasks'),
runSequence = require('run-sequence')
;

var conf = require('./conf').conf;


// default task
gulp.task('default', ['server']);

gulp.task('build', function() {
  
	runSequence(
		'clean_build',
		['roptimize', 'js', 'minify-css', 'copy'],
		function(){
			console.log("Build on ----> %s <---- ok!", conf.dest);
		})

});

