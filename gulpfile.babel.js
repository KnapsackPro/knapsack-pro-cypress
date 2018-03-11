import gulp from 'gulp';
import del from 'del';
import ts from 'gulp-typescript';

const tsProject = ts.createProject('tsconfig.json');
const paths = {
  src: tsProject.config.include,
  dest: tsProject.config.compilerOptions.outDir,
};

export function clean() {
  return del([
    `${paths.dest}/**`,
    `!${paths.dest}`
  ]);
}

export function compile() {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(paths.dest));
}

export function watch() {
  gulp.watch(paths.src, compile);
}

export const build = gulp.series(
  clean,
  compile,
  watch
);

export default build;
