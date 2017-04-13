/*--------------------------------------------------*/
/* ПОДКЛЮЧЕНИЕ МОДУЛЕЙ */
"use strict";

const gulp = require("gulp");
const webServer = require("browser-sync");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const run = require("run-sequence");
const rename = require("gulp-rename");
const del = require("del");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const mqpacker = require("css-mqpacker");
const minifyCSS = require("gulp-csso");
const beautifyCSS = require("gulp-csscomb");
const uglifyJS = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const webp = require("gulp-webp");
const webpCSS = require("webpcss");


/*--------------------------------------------------*/
/* ОБРАБОТКА HTML */

/* Сборка HTML */
gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"))
    .pipe(webServer.reload({stream: true}));
});


/*--------------------------------------------------*/
/* ОБРАБОТКА CSS */

/* Компиляция LESS */
gulp.task("css", function () {
  return gulp.src("source/less/index.less")
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(less())
    .pipe(postcss([
      webpCSS.default,
      autoprefixer({browsers: ["last 2 versions"]}),
      mqpacker()]))
    .pipe(beautifyCSS())
    .pipe(rename("style.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(minifyCSS())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(webServer.reload({stream: true}));
});


/*--------------------------------------------------*/
/* ОБРАБОТКА JAVASCRIPT */

/* Обработка моих скриптов */
gulp.task("js", function () {
  return gulp.src("source/js/components/*.js")
    .pipe(plumber())
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(uglifyJS())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(webServer.reload({stream: true}));
});

/* Обработка библиотек, внешних скриптов */
gulp.task("vendorsJS", function () {
  return gulp.src("source/js/vendors/*.js")
    .pipe(plumber())
    .pipe(uglifyJS())
    .pipe(gulp.dest("build/js"))
    .pipe(webServer.reload({stream: true}));
});


/*--------------------------------------------------*/
/* ОБРАБОТКА ШРИФТОВ */

/* Копирование шрифтов */
gulp.task("copyFonts", function () {
  return gulp.src("source/fonts/*.{woff,woff2}")
    .pipe(gulp.dest("build/fonts"));
});


/*--------------------------------------------------*/
/* ОБРАБОТКА ГРАФИКИ */

/* Оптимизация растровых изображений */
gulp.task("optimizeImages", function () {
  return gulp.src("source/images/*.{png,jpg,jpeg,gif,ico}")
    .pipe(imagemin([imagemin.optipng({
      optimizationLevel: 3
    }), imagemin.jpegtran({
      progressive: true
    })]))
    .pipe(gulp.dest("build/images"));
});

/* Оптимизация векторных изображений */
gulp.task("optimizeSvg", function () {
  return gulp.src("source/images/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("build/images"));
});

/* Генерация инлайнового SVG-спрайта */
gulp.task("symbols", function () {
  return gulp.src("source/images/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/images"));
});

/* Конвертирование растровых изображений в webp*/
gulp.task("webp", function () {
  return gulp.src("build/images/*.{png,jpg,jpeg}")
    .pipe(webp())
    .pipe(gulp.dest("build/images"));
});


/*--------------------------------------------------*/
/* РАЗНОЕ */

/* Локальный сервер, отслеживание изменений */
gulp.task("serve", function () {
  webServer.init({
    server: "build",
    startPath: "index.html"
  });
  gulp.watch("source/*.html", ["html"]);
  gulp.watch("source/less/**/*.less", ["css"]);
  gulp.watch("source/js/components/*.js", ["js"]);
  gulp.watch("source/js/vendors/*.js", ["vendorsJS"]);
});

/* Очистка папки сборки */
gulp.task("cleaning", function () {
  return del.sync("build");
});

/* Сборка проекта */
gulp.task("build", function (fn) {
  run(
    "cleaning",
    "optimizeImages",
    "webp",
    "optimizeSvg",
    "symbols",
    "copyFonts",
    "html",
    "css",
    "js",
    "vendorsJS",
    fn
  );
});

/* Задача по умолчанию */
gulp.task("default", ["serve"]);
