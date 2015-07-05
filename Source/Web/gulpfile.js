/// <binding Clean='clean' />
'use strict';

var gulp = require("gulp"),
  rimraf = require("rimraf"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  cssmin = require("gulp-cssmin"),
  uglify = require("gulp-uglify"),
  project = require("./project.json");

var publicRoot = "./" + project.webroot + "/";
var contentRoot = "./Content/";
var paths = {
  js: contentRoot + "JS/**/*.js",
  ts: contentRoot + "JS/**/*.ts",
  scss: contentRoot + "CSS/**/*.scss",
  jsDest: publicRoot + "JS/",
  cssDest: publicRoot + "CSS/"
};

gulp.task("clean:js", function (cb) {
  rimraf(paths.jsDest, cb);
});

gulp.task("clean:css", function (cb) {
  rimraf(paths.cssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("compile:ts", function (cb) {

});

gulp.task("compile:scss", function (cb) {
  gulp.src(paths.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.cssDest));
});

gulp.task("min:js", function () {
  gulp.src([paths.js, "!*.min.js"], {
    base: "."
  })
    .pipe(concat(paths.concatJsDest))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
  gulp.src([paths.cssDest, "!*.min.css"])
    .pipe(cssmin())
    .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);