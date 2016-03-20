'use strict';

var del = require('del'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');


// ============================================================================
// PUBLIC TASKS
// ============================================================================

gulp.task('examples:build', gulp.series(
  clean('./examples/assets/loadjs'),
  buildJs('./examples/assets/loadjs')
));


gulp.task('dist:build', gulp.series(
  clean('./dist'),
  buildJs('./dist')
));


gulp.task('test:build', gulp.series(
  clean('./test/assets/loadjs'),
  buildJs('./test/assets/loadjs')
));



// ============================================================================
// PRIVATE TASKS
// ============================================================================

function makeTask(displayName, fn) {
  if (displayName) fn.displayName = displayName;
  return fn;
}


function clean(dirname) {
  return makeTask('clean: ' + dirname, function(done) {
    return del(dirname, done);
  });
}


function buildJs(dirname) {
  return makeTask('build-js: ' + dirname, function() {
    return gulp.src('src/loadjs.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(rename('loadjs.js'))
      .pipe(gulp.dest(dirname))
      .pipe(uglify())
      .pipe(rename('loadjs.min.js'))
      .pipe(gulp.dest(dirname));
  });
}
