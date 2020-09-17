const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const imgMin = require("gulp-imagemin");
const imgCompress = require("imagemin-jpeg-recompress");
/*const svgSprite = require("gulp-svg-sprite");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");*/
const svgSymbol = require("gulp-svg-symbols");
const { watch } = require("browser-sync");
const browserSync = require("browser-sync").create();

const html = () => {
  return gulp
    .src("./index.html")
    .pipe(gulp.dest("./build"))
    .pipe(browserSync.stream());
};
const css = () => {
  return gulp
    .src("./css/styles.css")
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
};
const fonts = () => {
  gulp.src("./fonts/*.ttf").pipe(ttf2woff()).pipe(gulp.dest("./build/fonts"));
  return gulp
    .src("./fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(gulp.dest("./build/fonts"));
};
const img = () => {
  return gulp
    .src("./img/*")
    .pipe(
      imgMin([
        imgCompress({
          loops: 4,
          min: 70,
          max: 80,
          quality: "high",
        }),
        imgMin.optipng(),
        imgMin.svgo(),
      ])
    )
    .pipe(gulp.dest("./build/img"));
};
const sprites = () => {
  return gulp
    .src("./img/*.svg")
    .pipe(svgSymbol())
    .pipe(gulp.dest("./build/img"))
    .pipe(browserSync.stream());
};

const server = () => {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
  });
  watch("./index.html", html);
  watch("./img/*.svg", sprites);
  watch("./css/styles.css", css);
};

exports.html = html;
exports.css = css;
exports.fonts = fonts;
exports.img = img;
exports.sprites = sprites;
exports.server = server;

exports.default = gulp.series(sprites, html, fonts, img, css, server);
