const { src, dest, watch, series} = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const browserSync = require("browser-sync");
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
const { argv } = require("yargs");
const gulpLoadPlugins = require("gulp-load-plugins");
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const modernizr = require('gulp-modernizr');


const $ = gulpLoadPlugins();
const port = argv.port || 9000;
const server = browserSync.create();

const isProd = process.env.NODE_ENV === "production";

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

function scripts() {
  const b = browserify({
    entries: "src/js/main.js",
    transform: babelify,
    debug: true
  });
  return b
    .bundle()
    .pipe(source("bundle.js"))
    .pipe($.plumber())
    .pipe(buffer())
    .pipe($.if(!isProd, $.sourcemaps.init({ loadMaps: true })))
    .pipe($.if(!isProd, $.sourcemaps.write(".")))
    .pipe(dest(files.jsDist))
    // .pipe(server.reload({ stream: true }));
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

function modernizrTask() {
  return src(files.jsSrc)
  .pipe(modernizr({
    'options': ['setClasses'],
    'tests': [
      'webp'
    ]
  }))
  .pipe(dest(files.jsDist))
}
// minify js
// function jsmin(){
//   return src(files.jsSrc)
//     .pipe(terser())
//     .pipe(dest(files.jsDist));
// }

function serve() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: ["./dist"],
      routes: {
        "/node_modules": "node_modules"
      }
    }
  });

  watch(files.templates, html);
  watch(files.scss, styles);
  watch(files.jsSrc, scripts);
  watch(files.imgSrc, images);
  watch(files.webpSrc, webp);
  watch([files.templates, files.scss, files.imgSrc, files.jsSrc]).on(
    "change",
    server.reload
  );
}


// Default Gulp task 
exports.default = series(
  html,
  styles,
  scripts,
  modernizrTask,
  images,
  webp,
  serve
);