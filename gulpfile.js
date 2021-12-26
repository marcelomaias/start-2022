const { src, dest, watch, series} = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');


const files = {
    viewsSrc: 'src/views/pages/*.njk',
    templates: 'src/views',
    scss: 'src/scss/**/*.scss',
    css: 'dist/css',
    jsSrc: 'src/js/*.js',
    jsDist: 'dist/js',
    imgSrc: 'src/images/*.{jpg,png}',
    imgDist: 'dist/images',
    webpSrc: 'dist/images/*.{jpg,png}'
}

function html() {
  return src(files.viewsSrc)
    .pipe(nunjucks({path: [files.templates]}))
    .pipe(dest('dist'))
}


//compile, prefix, and min scss
function styles() {
  return src(files.scss)
    .pipe(sass())
    .pipe(prefix('last 2 versions'))
    .pipe(minify())
    .pipe(dest(files.css))
};

//optimize and move images
function images() {
  return src(files.imgSrc)
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 80, progressive: true }),
      imagemin.optipng({ optimizationLevel: 2 }),
    ]))
    .pipe(dest(files.imgDist))
};

//optimize and move images
function webp() {
  return src(files.webpSrc)
    .pipe(imagewebp())
    .pipe(dest(files.imgDist))
};


// minify js
function jsmin(){
  return src(files.jsSrc)
    .pipe(terser())
    .pipe(dest(files.jsDist));
}

//watchtask
function watchTask(){
  watch(files.templates, html);
  watch(files.scss, styles);
  watch(files.jsSrc, jsmin);
  watch(files.imgSrc, images);
  watch(files.webpSrc, webp);
}


// Default Gulp task 
exports.default = series(
  html,
  styles,
  jsmin,
  images,
  webp,
  watchTask
);