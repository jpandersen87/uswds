import gulp from "gulp";
import mocha from "gulp-mocha";

const { src } = gulp;

const mochaConfig = {
  config: "packages/uswds-core/src/js/utils/test/.mocharc.json",
};

// Export our tasks.
export function unitTests() {
  return src("packages/usa-*/**/*.spec.js").pipe(mocha(mochaConfig));
}
export function sassTests() {
  return src("packages/uswds-core/src/test/sass.spec.js").pipe(mocha());
}
