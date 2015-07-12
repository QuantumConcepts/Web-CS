/// <binding AfterBuild='build' Clean='clean' ProjectOpened='watch' />
"use strict";

var gulp = require("gulp"),
  rimraf = require("rimraf"),
  debug = require("gulp-debug"),
  sass = require("gulp-sass"),
  typescript = require("gulp-tsc"),
  concat = require("gulp-concat"),
  cssmin = require("gulp-cssmin"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  util = require("gulp-util"),
  seq = require("run-sequence"),
  project = require("./project.json");
var paths = getPaths();

gulp.task("clean:css", function (cb) {
  rimraf(paths.content.cssDest + "*", cb);
});

gulp.task("clean:fonts", function (cb) {
  rimraf(paths.content.fontsDest + "*", cb);
});

gulp.task("clean:js", function (cb) {
  rimraf(paths.content.jsDest + "*", cb);
});

gulp.task("clean:content", ["clean:css", "clean:fonts", "clean:js"]);
gulp.task("clean", ["clean:content"]);

gulp.task("compile:ts", function () {
  return gulp.src(paths.content.source.ts)
    .pipe(typescript({
      outDir: paths.content.jsDest,
      target: "ES5",
      sourceMap: true,
      noImplicitAny: true
    }))
    .pipe(gulp.dest(paths.content.jsDest));
});

gulp.task("compile:scss", function () {
  return gulp.src(paths.content.source.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.content.cssDest));
});

gulp.task("compile", ["compile:ts", "compile:scss"]);

gulp.task("min:js", function () {
  return gulp.src([paths.content.jsDest + "*.js"])
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.content.jsDest));
});

gulp.task("min:css", function () {
  return gulp.src([paths.content.cssDest + "*.css"])
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.content.cssDest));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task("copy:bower", function (cb) {
  for (var pkgName in paths.bower.packages)
    copyBowerPackage(pkgName);

  cb();
});

gulp.taks("copy:css", function (cb) {
  gulp.src(paths.content.css)
    .pipe(gulp.dest(paths.public.cssDest));
  cb();
});

gulp.taks("copy:js", function (cb) {
  gulp.src(paths.content.js)
    .pipe(gulp.dest(paths.public.jsDest));
  cb();
});

gulp.task("copy:bower-package", function (cb) {
  copyBowerPackage(util.env.package);
  cb();
});

gulp.task("copy", ["copy:css", "copy:js", "copy:bower"]);

gulp.task("build", function (cb) {
  seq("clean",
    "compile",
    "min",
    "copy:bower",
    cb);
});

gulp.task("watch", function () {
  gulp.watch(paths.content.scss, ["compile:scss"]);
  gulp.watch(paths.content.ts, ["compile:ts"]);
});

// Internal Stuff
function getPaths() {
  var paths = {
    _root: "./",
    content: {
      _root: "Content/",
      css: "CSS/*.css",
      js: "JS/*.js",
      scss: "CSS/*.scss",
      ts: "JS/*.ts"
    },
    public: {
      _root: project.webroot + "/",
      cssDest: "CSS/",
      fontsDest: "Fonts/",
      jsDest: "JS/",
    },
    bower: {
      _root: "bower_components/",
      packages: {
        bootstrap: {
          _root: "bootstrap/dist/",
          files: {
            css: ["css/bootstrap.*"],
            fonts: ["fonts/*"],
            js: ["js/bootstrap.*"]
          }
        },
        jquery: {
          _root: "jquery/dist/",
          files: {
            js: ["jquery.*"]
          }
        },
        "jquery-validate": {
          _root: "jquery-validate/dist/",
          files: {
            js: ["jquery.validate.*"]
          }
        }
      }
    }
  };

  function expandPaths(paths, root) {
    root = (root || "");

    for (var p in paths) {
      var path = paths[p];

      if (p === "_root") {
        root = root + path;
        paths[p] = root;
      }
      else {
        if (typeof path === "string")
          paths[p] = root + path;
        else
          expandPaths(path, root);
      }
    }
  }

  expandPaths(paths);

  return paths;
}

function copyBowerPackage(pkgName) {
  var pkg = paths.bower.packages[pkgName];

  if (pkg) {
    for (var f in pkg.files) {
      var files = pkg.files[f];
      var dest = paths.content[f + "Dest"];

      if (files && dest) {
        gulp.src(files)
          .pipe(gulp.dest(dest));
      }
    }
  }
}