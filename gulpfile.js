var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload'); // 自动刷新页面
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var fileinclude = require('gulp-file-include');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps'); //便于压缩后代码调试
var replace = require('gulp-replace');
var amdOptimize = require("amd-optimize");//require 优化
var requirejsOptimize = require('gulp-requirejs-optimize');
//本地服务器
gulp.task('webserver', function () {
	connect.server({
		livereload : true
	});
});

// less 文件
gulp.task('less', function(){
    return gulp.src('./src/css/less/*-page.less')
        .pipe(sourcemaps.init())//sourcemaps
        .pipe(less())//编译less
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/css/'))
        .pipe(minifycss())//压缩css
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});
//requirejs
gulp.task('scripts', function () {
    return gulp.src('./src/js/*.js')
        .pipe(requirejsOptimize())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});
// html 整合
gulp.task('html', function () {
    return gulp.src(['./html/*.html'])
    .pipe(replace('../src/','./'))
    .pipe(fileinclude({
    	prefix : '@@',
    	basepath : './html/modules'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload())
});

//清空文件
gulp.task('clean',function(){
	return gulp.src(['./dist','./src/css/*.css'])
		.pipe(clean());
});

//图片压缩
gulp.task('images',function(){
	return gulp.src('./src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
		.pipe(connect.reload())
})

// copy lib文件夹
gulp.task('copy',  function() {
  return gulp.src('./lib/*')
    .pipe(gulp.dest('./dist/lib'))
});

gulp.task('watch',function(){
	gulp.watch(['src/js/**/*.js','./src/js/*.js'],['scripts'])
	gulp.watch('src/css/**/*.less',['less'])
	gulp.watch('src/images/**',['images'])
	gulp.watch(['html/*.html','html/**/*.html'],['html'])
});

gulp.task('default',['webserver','clean'],function(){
	return gulp.start(['copy','less','images','html','scripts','watch']) 
})