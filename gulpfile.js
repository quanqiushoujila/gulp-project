'use strict';

var gulp = require('gulp');
//css
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
//html
var htmlmin = require('gulp-htmlmin');
//js
var uglify = require('gulp-uglify');
//images
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var clean = require('gulp-clean');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('styles', function() {
    gulp.src('app/styles/**/*.css')
    	.pipe(changed('dist/styles'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(reload({ stream: true }));

    gulp.src('app/styles/**/*.scss')
    	.pipe(changed('dist/styles'))
        .pipe(sourcemaps.init())
        .pipe(sass({
        			outputStyle: 'compact' ,
        			precision: 10,
        			includePaths: ['.']
        		}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(reload({ stream: true }));
});

gulp.task('html', function() {
	gulp.src('app/*.html')
		.pipe(changed('dist/*.html'))
		.pipe(gulp.dest('dist/'))
		.pipe(reload({ stream: true }));
});

gulp.task('scripts', function(){
	gulp.src('app/scripts/**/*.js')
		.pipe(changed('dist/scripts'))
		.pipe(gulp.dest('dist/scripts'))
		.pipe(reload({ stream: true }));
});

gulp.task('images', function(){
	gulp.src('app/images/**/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配 .{png,jpg,gif,svg}
		.pipe(changed('dist/images'))
	    .pipe(imagemin({
	      progressive: true, // 无损压缩JPG图片
	      svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
	      use: [pngquant()] // 使用pngquant插件进行深度压缩
	    }))
	    .pipe(gulp.dest('dist/images')) // 输出路径
	    .pipe(reload({ stream: true }));
});

gulp.task('fonts', function(){
	gulp.src('app/fonts/**/*.{eot,svg,ttf,woff,woff2,css}') //指明源文件路径、并进行文件匹配 .{eot,svg,ttf,woff,woff2}
		.pipe(changed('dist/fonts'))
		.pipe(gulp.dest('dist/fonts'))
		.pipe(reload({ stream: true }));

});


gulp.task('clean', function() {
    gulp.src(['dist'], { read: false })
        .pipe(clean());
});

gulp.task('cleanmaps', function() {
  	gulp.src(['dist/css/maps','dist/js/maps'], {read: false})
    	.pipe(clean());
});

gulp.task('watch', function(){
	gulp.watch('app/styles/**/*.scss', ['styles']);
	//gulp.watch('app/fonts/**/*.{eot,svg,ttf,woff,woff2,css}', ['fonts']);
	gulp.watch('app/scripts/**/*.js', ['scripts']);
	gulp.watch('app/images/**/*.{png,jpg,gif,svg}', ['images']);
	gulp.watch('app/*.html', ['html']);
});

gulp.task('default', ['styles', 'fonts', 'scripts', 'images', 'html']);

gulp.task("serve", ['watch'], function(){
	browserSync({
		server:{
			baseDir:"./dist"
		},function(err, bs) {
		    console.log(bs.options.getIn(["urls", "local"]));
		}
	});

});
