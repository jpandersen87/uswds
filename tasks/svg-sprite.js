/* eslint-disable arrow-body-style */
import gulp from "gulp";
import svgSprite from "gulp-svgstore";
import rename from "gulp-rename";
import del from "del";
import { logError, logMessage } from "./utils/doc-util.js";
import { copyIcons } from "./copy.js";
import config from "../packages/usa-icon/src/usa-icons.config.js";

const { src, dest, series } = gulp;
const { material, materialDeprecated, uswds } = config;

const svgPath = "dist/img";

export function cleanIcons() {
  return del(`${svgPath}/usa-icons`);
}

export function collectIcons() {
  logMessage(
    "collectIcons",
    "Collecting default icon set in dist/img/usa-icons"
  );
  return src([
    `node_modules/@material-design-icons/svg/filled/{${material}}.svg`,
    `packages/usa-icon/src/img/material-icons-deprecated/{${materialDeprecated}}.svg`,
    `packages/usa-icon/src/img/uswds-icons/{${uswds}}.svg`,
  ]).pipe(dest(`${svgPath}/usa-icons`));
}

export function buildSprite(done) {
  return src(`${svgPath}/usa-icons/*.svg`)
    .pipe(svgSprite())
    .on("error", logError)
    .pipe(dest(svgPath))
    .on("end", () => done());
}

export function renameSprite() {
  return src(`${svgPath}/usa-icons.svg`)
    .pipe(rename(`${svgPath}/sprite.svg`))
    .pipe(dest(`./`));
}

export function cleanSprite() {
  return del(`${svgPath}/usa-icons.svg`);
}

export const buildSpriteStandalone = series(
  copyIcons,
  cleanIcons,
  collectIcons,
  buildSprite,
  renameSprite,
  cleanSprite
);

export default series(
  cleanIcons,
  collectIcons,
  buildSprite,
  renameSprite,
  cleanSprite
);
