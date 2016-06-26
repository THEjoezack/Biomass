var gulp = require('gulp');
var jshint = require('gulp-jshint');
var bower = require('gulp-bower');
 
gulp.task('bower', function() {
  return bower();
});

gulp.task('lint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});