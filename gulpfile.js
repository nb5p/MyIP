const gulp = require('gulp');
const htmlmin = require("gulp-htmlmin");
const htmlclean = require("gulp-htmlclean");

let minifyHTML = () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            collapseWhitespace: true
        }))
        .pipe(htmlclean())
        .pipe(gulp.dest('dist'));
}

exports.minifyHTML = minifyHTML;

gulp.task('build', gulp.series(
    minifyHTML
));

gulp.task('default', gulp.parallel('build'));