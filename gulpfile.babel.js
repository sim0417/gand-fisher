import gulp from 'gulp';
import autoPrefixer from 'gulp-autoprefixer';
import miniCss from 'gulp-csso';
import gulpBro from 'gulp-bro';
import babelify from 'babelify';
import del from 'del';
import ws from 'gulp-webserver';
import htmlmin from 'gulp-html-minifier';
import imagemin from 'gulp-imagemin';
import gulpSass from 'gulp-sass';
gulpSass.compiler = require('node-sass');

const routes = {
  img: {
    watch: 'src/img/*',
    src: 'src/img/**/*',
    dest: 'build/img',
  },
  scss: {
    watch: 'src/scss/**/*.scss',
    src: 'src/scss/style.scss',
    dest: 'build/css',
  },
  js: {
    watch: 'src/js/**/*.js',
    src: 'src/js/**/*.js',
    dest: 'build/js',
  },
  html: {
    watch: 'src/index.html',
    src: 'src/index.html',
    dest: 'build/',
  },
  video: {
    src: 'src/videos/*',
    dest: 'build/videos',
  },
};

const img = () =>
  gulp.src(routes.img.src, { allowEmpty: true }).pipe(imagemin()).pipe(gulp.dest(routes.img.dest));

// const video = () =>
//   gulp.src(routes.video.src, { allowEmpty: true }).pipe(gulp.dest(routes.video.dest));

const html = () =>
  gulp
    .src(routes.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(routes.html.dest));

const styles = () =>
  gulp
    .src(routes.scss.src, { allowEmpty: true })
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(
      autoPrefixer({
        cascade: false,
      })
    )
    .pipe(miniCss())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src, { allowEmpty: true })
    .pipe(
      gulpBro({
        transform: [
          babelify.configure({
            presets: ['@babel/preset-env'],
          }),
          [
            'uglifyify',
            {
              global: true,
            },
          ],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const clean = () => del(['build', '.publish']);

const webserver = () =>
  gulp.src('build').pipe(
    ws({
      livereload: true,
      open: true,
    })
  );

const watch = () => {
  gulp.watch(routes.html.watch, html);
  gulp.watch(routes.img.watch, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js).on('change', () => html());
};

const prepare = gulp.series([clean, img]);
const assets = gulp.series([html, styles, js]);
const live = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
