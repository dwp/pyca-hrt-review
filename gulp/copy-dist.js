const gulp = require('gulp'),
  runSequence = require('run-sequence'),
  options = {
    copy: {
      app: { from: 'app/**/*', to: 'dist/app' },
      gulp: { from: 'gulp/**/*', to: 'dist/gulp' },
      modules: { from: 'node_modules/**/*', to: 'dist/node_modules'},
      lib: { from: 'lib/**/*', to: 'dist/lib' },
      public: { from: 'public/**/*', to: 'dist/public' },
      gov: { from: 'govuk_modules/**/*', to: 'dist/govuk_modules' },
      files: { from: './*.{js,json}', to: 'dist' }
    }
  };

Object.keys(options.copy).forEach((key) => {
  gulp.task(`copy-${key}`, () => {
    return gulp.src(options.copy[key].from)
      .pipe(gulp.dest(options.copy[key].to));
  });
});

gulp.task('copy-dist', ['generate-assets'], (done) => {
  return runSequence(Object.keys(options.copy).map((key) => { return `copy-${key}`}), done);
});
