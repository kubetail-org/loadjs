var del = require('del'),
    streamqueue = require('streamqueue'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    pkg = require('./package.json');




// ============================================================================
// CONFIG
// ============================================================================

var taskName = process.argv[process.argv.length - 1],
    dirName = null;

if (taskName === 'build-dist') {
  dirName = 'dist';
} else if (taskName === 'build-examples' || taskName === 'watch') {
  dirName = 'examples/assets/' + pkg.name;
} else if (taskName === 'build-test') {
  dirName = 'test/assets/' + pkg.name
} else {
  throw 'Did not understand task "' + taskName + '"';
}




// ============================================================================
// RECIPES
// ============================================================================

gulp.task('clean', function(callback) {
  del([dirName], callback);
});


gulp.task('js', function() {
  return gulp.src('src/loadjs.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(rename(pkg.name + '.js'))
    .pipe(gulp.dest(dirName));
});


gulp.task('uglify', ['js'], function() {
  return gulp.src(dirName + '/' + pkg.name + '.js')
    .pipe(uglify())
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(gulp.dest(dirName));
});


function build() {
  gulp.start('js', 'uglify');
}


// ===========================================================================
// PUBLIC TASKS
// ============================================================================
gulp.task('build-dist', ['clean'], function() {
  build()
});


gulp.task('build-examples', ['clean'], function() {
  build()
});


gulp.task('watch', function() {
  // watch .js files
  gulp.watch('src/js/**/*.js', ['js', 'uglify']);
});


gulp.task('build-test', ['clean'], function() {
  build()
});
