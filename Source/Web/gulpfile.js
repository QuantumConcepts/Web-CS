/// <binding Clean='clean' />
'use strict';

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    project = require("./project.json");

var paths = function () {
  var webroot = "./" + project.webroot + "/";
  
  return {
    webroot: webroot,
    js: paths.webroot + "js/**/*.js",
    minJs: paths.webroot + "js/**/*.min.js",
    css: paths.webroot + "css/**/*.css",
    minCss: paths.webroot + "css/**/*.min.css",
    concatJsDest: paths.webroot + "js/site.min.js",
    concatCssDest: paths.webroot + "css/site.min.css"
  };
}();

gulp.task("clean:js", function(cb) {
  rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function(cb) {
  rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function() {
  gulp.src([paths.js, "!" + paths.minJs], {
      base: "."
    })
    .pipe(concat(paths.concatJsDest))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task("min:css", function() {
  gulp.src([paths.css, "!" + paths.minCss])
    .pipe(concat(paths.concatCssDest))
    .pipe(cssmin())
    .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);