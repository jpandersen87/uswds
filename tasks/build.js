import gulp from "gulp";
import { logIntroduction, logMessage } from "./utils/doc-util.js";
import { buildSprite } from "./svg-sprite.js";
import { compileSass } from "./sass.js";
import { compileJS } from "./javascript.js";
import {
  copyTheme,
  copyFonts,
  copyIcons,
  copyImages,
  copySass,
} from "./copy.js";
import { cleanDist } from "./clean.js";

const { series, parallel } = gulp;

// eslint-disable-next-line import/prefer-default-export
export const build = series(
  (done) => {
    logIntroduction();
    logMessage("build", "Creating distribution directories.");
    done();
  },
  cleanDist,
  parallel(copyTheme, copyImages, copyFonts, copyIcons, copySass),
  buildSprite,
  compileJS,
  compileSass
);
