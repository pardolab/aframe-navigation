let gulp = require('gulp');

gulp.task('move_dist', function(){
  return gulp.src('dist/**/*')
    .pipe(gulp.dest('aframe-navigation/dist'))
});

gulp.task('move_examples', function() {
  return gulp.src('examples/**/*')
    .pipe(gulp.dest('aframe-navigation/examples'))
});

gulp.task('watch', function() {
   gulp.watch('dist/**/*', ['move_dist']);
   gulp.watch('examples/**/*', ['move_examples']);
});

gulp.task('default', [ 'move_dist', 'move_examples', 'watch' ]);