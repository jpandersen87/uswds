import gulp from "gulp";
import { unitTests, sassTests } from "./test.js";
import { lintSass, typecheck } from "./lint.js";
import { compileSass } from "./sass.js";
import { compileJS } from "./javascript.js";
import { build } from "./build.js";

const { watch: _watch, series, parallel } = gulp;

/**
 * Watch Sass and JS files.
 */
function watchFiles() {
  // Watch all my sass files and compile sass if a file changes.
  _watch("./src/**/**/*.scss", parallel(lintSass, compileSass));

  // Watch all my JS files and compile if a file changes.
  _watch("./src/**/**/*.js", series(parallel(typecheck, compileJS)));

  // Watch all my unit tests and run if a file changes.
  _watch(
    "./src/**/*.spec.js",
    series(series(unitTests, sassTests), (done) => done())
  );
}

// eslint-disable-next-line import/prefer-default-export
export const watch = series(build, watchFiles);
