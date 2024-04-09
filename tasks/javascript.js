/* eslint-disable arrow-body-style */

import gulp from "gulp";
import buffer from "vinyl-buffer";
import browserify from "browserify";
import { spawn } from "child_process";
import rename from "gulp-rename";
import source from "vinyl-source-stream";
import gulpSourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import merge from "merge-stream";
import { logMessage, pkg, logError } from "./utils/doc-util.js";

const { dest, src } = gulp;
const { init, write } = gulpSourcemaps;

export function compileJS() {
  logMessage("javascript", "Compiling JavaScript");
  const packageName = pkg.name.replace("@uswds/", "");
  const streams = Object.entries({
    [packageName]: browserify({
      entries: ["packages/uswds-core/src/js/start.js"],
      debug: true,
    })
      .transform("babelify", {
        global: true,
        presets: ["@babel/preset-env"],
      })
      .bundle()
      .pipe(source(`${packageName}.js`))
      .pipe(buffer()),
    "uswds-init": src("packages/uswds-core/src/js/uswds-init.js"),
  }).map(([basename, stream]) =>
    stream
      .pipe(rename({ basename }))
      .pipe(dest("dist/js"))
      .pipe(init({ loadMaps: true }))
      .on("error", function handleError(error) {
        logError(error);
        this.emit("end");
      })
      .pipe(uglify())
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(write("."))
      .pipe(dest("dist/js"))
  );

  return merge(streams);
}
export function typeCheck() {
  return new Promise((resolve, reject) => {
    spawn("./node_modules/.bin/tsc", { stdio: "inherit" })
      .on("error", reject)
      .on("exit", (code) => {
        if (code === 0) {
          logMessage("typecheck", "TypeScript likes our code!");
          resolve();
        } else {
          reject(new Error("TypeScript failed, see output for details!"));
        }
      });
  });
}
