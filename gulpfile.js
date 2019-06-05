const gulp     = require('gulp'),
      sass     = require('gulp-sass'),
      sassGlob = require('gulp-sass-glob'),
      concat   = require('gulp-concat');

const config = {
  src   : {
    mainSass: 'src/common.blocks/main.sass',
    js      : 'src/common.blocks/**/*.js',
    sass    : 'src/common.blocks/**/*.sass',
  }, out: {
    css: 'static/css', js: 'static/js',
  },
};

gulp.task('mainSass', function() {
  return gulp.src(config.src.mainSass).
              pipe(sassGlob()).
              pipe(sass().on('error', sass.logError)).
              pipe(gulp.dest(config.out.css));
});

gulp.task('js', function() {
  return gulp.src(config.src.js).
              pipe(concat('main.js')).
              pipe(gulp.dest(config.out.js));
});

gulp.task('build', gulp.series(['mainSass', 'js']));

gulp.task('watch', function() {
  gulp.watch([config.src.sass, config.src.js], gulp.series('build'));
});
