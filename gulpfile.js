// Include gulp helpers.
import gulp from "gulp";

const { series, parallel } = gulp;

// Include Our tasks.
//
// Each task is broken apart to it's own node module.
// Check out the ./tasks directory for more.
import { noCleanup as _noCleanup, noTest as _noTest } from "./tasks/flags.js";
import {
  buildSprite as _buildSprite,
  buildSpriteStandalone as _buildSpriteStandalone,
} from "./tasks/svg-sprite.js";
import {
  compileJS as _compileJS,
  typeCheck as _typeCheck,
} from "./tasks/javascript.js";
import {
  unitTests as _unitTests,
  sassTests as _sassTests,
} from "./tasks/test.js";
import {
  lintSass as _lintSass,
  typecheck as _typecheck,
} from "./tasks/lint.js";
import { build as _build } from "./tasks/build.js";
import { release as _release } from "./tasks/release.js";
import { watch as _watch } from "./tasks/watch.js";
import { compileSass as _compileSass } from "./tasks/sass.js";
import { cleanDist as _cleanDist } from "./tasks/clean.js";

/**
 * *Flags*
 */
export const noTest = _noTest;
export const noCleanup = _noCleanup;

/**
 * *Clean tasks*
 */
export const cleanDist = _cleanDist;

/**
 * *Lint tasks*
 */
export const lintSass = _lintSass;
export const typecheck = _typecheck;
export const lint = parallel(_lintSass, _typecheck);

/**
 * *Test tasks*
 * sassTests: Sass unit tests.
 * unitTests: Component unit tests.
 * test: Run all tests.
 */

export const sassTests = _sassTests;
export const unitTests = _unitTests;
export const test = series(_typeCheck, _lintSass, _sassTests, _unitTests);

/**
 * *Build tasks*
 * buildSprite: Generate new spritesheet based on SVGs in `src/img/usa-icons/`.
 * buildSass: Lint, copy normalize, and compile sass.
 * buildJS: Lint, copy normalize, and compile sass.
 * release: Builds USWDS and returns a zip with sha256 hash and filesize.
 */
export const buildSpriteStandalone = _buildSpriteStandalone;
export const buildSprite = _buildSprite;
export const compileSass = _compileSass;

export const buildSass = series(_lintSass, _compileSass);
export const buildJS = series(_typeCheck, _compileJS);
export const buildUSWDS = _build;
export const release = _release;

/**
 * *Watch task*
 * Builds USWDS and component library, and watches
 * for changes in scss, js, twig, yml, and unit tests.
 */
export const watch = _watch;

// Default Task
export default buildUSWDS;
