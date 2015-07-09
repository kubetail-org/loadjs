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
} else if (taskName !== 'build-e2e-tests') {
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


gulp.task('build-e2e-tests', function() {
  var stream = streamqueue({objectMode: true}),
      files;

  files = [
    'test-loadjs.js'
  ];

  // build streams
  for (var i=0; i < files.length; i++) {
    stream.queue(gulp.src('test/' + files[i]));
  }

  // concat streams
  return stream.done()
    .pipe(concat('tests.js'))
    .pipe(browserify())
    .pipe(gulp.dest('e2e-tests'));
});
