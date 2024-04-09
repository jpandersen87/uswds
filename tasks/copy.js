import gulp from "gulp";
import rename from "gulp-rename";
import { logMessage } from "./utils/doc-util.js";

const { src, dest } = gulp;

export function copyTheme() {
  logMessage("copyTheme", "Copying theme settings files to /dist/theme");
  return src("packages/uswds-core/src/theme/*.scss").pipe(dest("dist/theme"));
}
export function copySass() {
  logMessage("copySass", "Copying Sass stylesheets to /dist/scss");
  return src("src/**/**/*.scss").pipe(dest("dist/scss"));
}
export function copyIcons() {
  logMessage("copyIcons", "Copying Material icons to dist/img/material-icons");
  return src(["node_modules/@material-design-icons/svg/filled/*"]).pipe(
    dest("dist/img/material-icons")
  );
}
export function copyImages() {
  logMessage("copyImages", "Copying images to /dist/img");
  return src(["packages/**/src/img/**/[!_]*.{png,jpg,gif,webp,svg,ico}"])
    .pipe(
      // use only the part of the path specific to the package img dir
      rename((path) => {
        // eslint-disable-next-line no-param-reassign
        path.dirname = path.dirname.replace(/[a-z-]+?\/src\/img/i, "");
        return path;
      })
    )
    .pipe(dest("dist/img"));
}
export function copyFonts() {
  logMessage("copyFonts", "Copying fonts to /dist/fonts");
  return src("packages/uswds-core/src/assets/fonts/**/*").pipe(
    dest("dist/fonts")
  );
}
