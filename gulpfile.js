const gulp = require('gulp');
// Sassをコンパイルするプラグインの読み込み
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const concatCss = require('gulp-concat-css');
const jsfiles=[
  'src/mappagecompo.js','src/tabcompo.js','src/toppagecompo.js','src/bottonmap.js'
];
// style.scssをタスクを作成する
gulp.task('default', function () {
  // style.scssファイルを取得gulp.watch('css/style.scss',function(){
  gulp.src('css/*.scss')
    // Sassのコンパイルを実行
    .pipe(sass())
    .pipe(concatCss("style.css"))
    // cssフォルダー以下に保存
    .pipe(gulp.dest('dist'));
   gulp.src(jsfiles)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});
