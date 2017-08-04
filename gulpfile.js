let gulp = require('gulp');

gulp.task('move_dist', function() {
  return gulp.src('dist/**/*')
    .pipe(gulp.dest('aframe-navigation/dist'))
});

gulp.task('watch', function() {
   gulp.watch('dist/**/*', ['move_dist']);
});

gulp.task('default', [ 'move_dist', 'watch' ]);