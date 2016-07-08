'use strict'

// Load plugins
const gulp = require('gulp')
const sass = require('gulp-ruby-sass')
const cssnano = require('gulp-cssnano')
const rename = require('gulp-rename')
const include = require('gulp-include')
const gutil = require('gulp-util')
const rimraf = require('gulp-rimraf')
const revall = require('gulp-rev-all')
const livereload = require('gulp-livereload')
const serveStatic = require('serve-static')
const flatten = require('gulp-flatten')

// Define paths
const paths = {
  styles: ['stylesheets/*.scss', 'stylesheets/*.sass']
}

// CSS
gulp.task('css', function () {
  return sass('stylesheets/**/*.scss', {precision: 6, loadPath: [process.cwd() + 'stylesheets/includes', process.cwd() + 'vendor']})
    .on('error', sass.logError)
    .pipe(gulp.dest('dist/stylesheets'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/stylesheets'))
})

// Clean up
gulp.task('clean', function () {
  return gulp.src(['dist/stylesheets', 'dist/fonts', 'dist/*.html'], {read: false})
    .pipe(rimraf())
})

// Rev all files
gulp.task('rev', function () {
  gulp.src('dist/**')
    .pipe(revall({ ignore: [/^\/favicon.ico$/g, '.html'] }))
    .pipe(gulp.dest('rev'))
})

// Copy fonts
gulp.task('fonts', function () {
  gulp.src('fonts/**/*.{eot,svg,ttf,woff}')
    .pipe(flatten())
    .pipe(gulp.dest('dist/fonts'))
})

// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('css', 'fonts')
})

// Setup connect server
gulp.task('connect', function () {
  const connect = require('connect')
  const app = connect()
    .use(require('connect-livereload')({ port: 35729 }))
    .use(serveStatic('dist'))

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000')
    })
})

// Serve
gulp.task('serve', ['connect'], function () {
  require('opn')('http://localhost:9000')
})

// Watch
gulp.task('watch', ['connect', 'serve'], function () {
  // Watch SASS files
  gulp.watch('stylesheets/**/*.scss', ['css'])

  // Watch for fonts
  gulp.watch('fonts/**/*.{eot,svg,ttf.woff}', ['fonts'])

  // Create LiveReload server
  var server = livereload()

  // Watch any files in assets folder reload on change
  gulp.watch(['dist/**', 'dist/*.html']).on('change', function (file) {
    server.changed(file.path)
  })
})
