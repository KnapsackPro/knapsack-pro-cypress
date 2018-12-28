import gulp from 'gulp';
import del from 'del';
import ts from 'gulp-typescript';
import gFilter from 'gulp-filter';
import chmod from 'gulp-chmod';

const tsProject = ts.createProject('tsconfig.json');
const paths = {
  src: tsProject.config.include,
  dest: tsProject.config.compilerOptions.outDir,
};

export function clean() {
  return del([`${paths.dest}/**`, `!${paths.dest}`]);
}

export function compile() {
  const filterBinFiles = gFilter(
    `${tsProject.config.compilerOptions.outDir}/knapsack-pro-cypress.js`,
    { restore: true },
  );

  return (
    tsProject
      .src()
      .pipe(tsProject())
      .js // compile TypeScript to JavaScript
      .pipe(filterBinFiles) // filter a subset of the files
      // make them executable
      .pipe(chmod(0o755))
      // bring back the previously filtered out files
      .pipe(filterBinFiles.restore)
      .pipe(gulp.dest(paths.dest))
  );
}

export function watch() {
  gulp.watch(paths.src, compile);
}

export const build = gulp.series(clean, compile, watch);

export default build;
