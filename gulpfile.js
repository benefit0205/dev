// plugin
var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	watch = require('gulp-watch'),
	browserSync = require('browser-sync'),
	pngquant = require('imagemin-pngquant'),
	using = require('gulp-using'),
	cached = require('gulp-cached'),
	remember = require('gulp-remember'),
	uglify = require('gulp-uglify'),
	webpack = require('gulp-webpack'),
	pleeease = require('gulp-pleeease'),
	iconfont = require('gulp-iconfont'),
	consolidate  = require('gulp-consolidate'),
	csscomb = require('gulp-csscomb');

// directory
var dir = {
	src: '_src',
	dist: 'dist'
};
// autoprefixer
var BROWSERS = [
	'last 2 versions',
	'ie 9',
	'Android 4.0'
];
var fontName = 'myfont';

// stylus
gulp.task('stylus', function () {
	return gulp.src(dir.src + '/styl/**/*.styl')
		.pipe(cached())
		.pipe(using())
		.pipe(stylus())
		.pipe(remember())
		.pipe(concat('all.css'))
		.pipe(pleeease({autoprefixer: { 'browsers': BROWSERS },
			minifier: true}))
		.pipe(rename({extname: '.min.css'}))
		.pipe(gulp.dest(dir.src + '/css/'));
});

// ローカルサーバ構築&ライブリロード
gulp.task('browserSyncTask', function(){
	browserSync.init({
		server : {
			baseDir: './',
			directory: true
		},
		files : [
				dir.src + '/{,**/}*.html',
				dir.src + '/{,**/}*.css'
		]
	});
	gulp.watch([dir.src + '/styl/**/*.styl'], ['stylus', browserSync.reload]);
});

// css sort
gulp.task('csscomb', function(){
	return gulp.src(dir.src + '/{,**/}*.css')
		.pipe(csscomb())
		.pipe(gulp.dest(dir.dist));
});

// 画像圧縮タスク *納品時に行うこと
gulp.task('optimizeImg', function(){
	gulp.src(dir.src + '/images/*.+(jpg|jpeg|png|gif)')
		.pipe(pngquant({quality: '60-80', speed: 1})())
		.pipe(gulp.dest(dir.src + '/images/'));
});

// js min
gulp.task('uglify', function(){
	gulp.src([dir.src + '/js/**/*.js', !dir.src + '/js/min/**/.js'])
		.pipe(uglify())
		.pipe(gulp.dest(dir.src + '/js/min'));
});

// js webpack
gulp.task('webpack',function(){
	return gulp.src([dir.src + '/js/webpack/*.js'])
		.pipe(webpack({output:{filename: 'common.js'}}))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(dir.src + '/js/min/'))
});

// iconfont
gulp.task( 'iconfont', function () {
	gulp.src( [ dir.src + '/src/icons/*.svg' ] )
		.pipe( iconfont( {
			fontName: fontName,
			appendCodepoints: true
		} ) )
		.on( 'codepoints', function( codepoints, options ) {
			gulp.src(dir.src + '/src/icons/icon.css')
				.pipe(consolidate( 'underscore', {
					glyphs: codepoints,
					fontName: fontName,
					fontPath: '../fonts/',
					prefix: 'icon'
				} ) )
				.pipe( gulp.dest( dir.src + '/build/css/' ) );
		} )
		.pipe( gulp.dest( dir.src + '/build/fonts/' ) );
} );

