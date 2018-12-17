const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass');
const clean = require('gulp-dest-clean');
const rename = require('gulp-rename');
const foreach = require('gulp-foreach');


gulp.task('html-include', () => {
    return gulp.src('src/html/**.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('extensionless-create', function () {
    return gulp.src(['public/*.html', '!public/index.html'])
        .pipe(foreach(function (stream, file) {
            return stream
                .pipe(rename('index.html'))
                .pipe(gulp.dest('public/' + file.relative.substring(file.relative.lastIndexOf('/') + 1, file.relative.lastIndexOf('.')) + '/'));
        }));
});

gulp.task('html-assets', () => {
    return gulp.src('src/assets/**')
        .pipe(gulp.dest('public/assets'));
});

gulp.task('css', function () {
    return gulp.src('./src/scss/style.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(clean('./public/css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('build', gulp.series('html-include', 'extensionless-create', 'html-assets', 'css'));

gulp.task('dev', () => {
    gulp.watch('src/**', gulp.series('build'))
});

