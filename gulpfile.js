// 载入外挂
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
// 任务处理的文件路径配置
var paths = {
    js: [ // js目录
        'src/js/*'
    ],
    scss: [
         'src/css/**/*.scss'
    ],
    img: [
         'src/images/*'
    ],
    html: [
        'src/html/*'
    ],
    lib: { // 第三方依赖文件
        js: [
            // 'bower_components/bootstrap/dist/js/bootstrap.js',
            // 'bower_components/jquery/jquery.js'
        ],
        css: [
            // 'bower_components/bootstrap/dist/css/bootstrap.css'
        ],
        img: [
            // 'bower_components/bootstrap/dist/images/*'
        ]
    }
};
var output = "server/assets/"; // output
var input = "src/css/"; // output
// 样式
gulp.task('styles', function() {
  return sass(paths.scss, { style: 'expanded' })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest( output + '/css'))
    .pipe(gulp.dest( input))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(output + '/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// 脚本
gulp.task('scripts', function() {
  return gulp.src(paths.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(output + '/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(output + '/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// 图片
gulp.task('images', function() {
  return gulp.src(paths.img)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(output + '/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// 清理
gulp.task('clean', function() {
  return gulp.src([output], {read: false})
    .pipe(clean());
});

// 预设任务
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// 看手
gulp.task('watch', function() {

  // 看守所有.scss档
  gulp.watch(paths.scss, ['styles']);

  // 看守所有.js档
  gulp.watch(paths.js, ['scripts']);

  // 看守所有图片档
  gulp.watch(paths.img, ['images']);

  // 建立即时重整伺服器
  var server = livereload();

  // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
  gulp.watch([output]).on('change', function(file) {
    server.changed(file.path);
  });

});
