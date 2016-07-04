var gulp = require('gulp');
var jshint = require('gulp-jshint');
var bower = require('gulp-bower');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var jasmine = require('gulp-jasmine');

gulp.task('bower', function() {
  return bower();
});

gulp.task('lint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task("default", function () {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("./dist"));
});

gulp.task("test", ['default'], function () {
    gulp.src('src/spec/**/*.js')
      // gulp-jasmine works on filepaths so you can't have any plugins before it 
      .pipe(jasmine())
});

