"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var rename = require("gulp-rename");
var runSequence = require('gulp-run-sequence');
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var minify = require("gulp-csso");

var imagemin = require("gulp-imagemin");

gulp.task("style", function() {
  gulp.src("scss/style.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer({browsers: [
      "last 2 versions"
      ]})
    ]))
  .pipe(gulp.dest("css"))

  .pipe(server.stream());
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("scss/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("images", function() {
  return gulp.src("img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
    ]))
  .pipe(gulp.dest("img"));
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "*.html"
    ], {
      base: "."
    })
  .pipe(gulp.dest("build"));
});

gulp.task('build', function(cb) {
  runSequence('clean', ["copy", "style", "images", "symbols"], cb);
});

var del = require("del");
gulp.task("clean", function() {
  return del("build");
});
