var gulp = require('gulp');
var jshint = require('gulp-jshint');
var bower = require('gulp-bower');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var jasmine = require('gulp-jasmine');
var typedoc = require("gulp-typedoc");


gulp.task('bower', function() {
  return bower();
});

gulp.task('lint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task("default", ['bower'], function () {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("./dist"));
});

gulp.task("test", ['default'], function () {
    gulp.src('src/spec/**/*.js')
      // gulp-jasmine works on filepaths so you can't have any plugins before it 
      .pipe(jasmine())
});

gulp.task("doc", ['default'], function() {
    return gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            out: "docs/",
            name: "Biomass"
        }))
    ;
});