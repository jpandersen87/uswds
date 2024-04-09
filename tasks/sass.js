import autoprefixer from "autoprefixer";
import csso from "postcss-csso";
import discardComments from "postcss-discard-comments";
import gulp from "gulp";
import postcss from "gulp-postcss";
import replace from "gulp-replace";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import sassEmbedded from "sass-embedded";
import gulpSourcemaps from "gulp-sourcemaps";
import { logMessage, logError } from "./utils/doc-util.js";
import pkg from "../package.json" assert { type: "json" };

const { src, dest } = gulp;
const { init, write } = gulpSourcemaps;
const sass = gulpSass(sassEmbedded);

// eslint-disable-next-line import/prefer-default-export
export function compileSass() {
  logMessage("sass", "Compiling Sass");
  const pluginsProcess = [discardComments(), autoprefixer()];
  const pluginsMinify = [csso({ forceMediaMerge: false })];

  return src("src/stylesheets/uswds.scss")
    .pipe(init({ largeFile: true }))
    .pipe(
      sass({
        includePaths: ["./packages"],
        outputStyle: "expanded",
      }).on("error", function handleError(error) {
        logError(error);
        this.emit("end");
      })
    )
    .pipe(postcss(pluginsProcess))
    .pipe(replace(/\buswds @version\b/g, `uswds v${pkg.version}`))
    .pipe(dest("dist/css"))
    .pipe(postcss(pluginsMinify))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(write("."))
    .pipe(dest("dist/css"));
}
