import stylelint from "stylelint";
import { spawn } from "child_process";
import { logMessage } from "./utils/doc-util.js";

const { formatters, lint } = stylelint;

const IGNORE_STRING = "This file is ignored";
const PROJECT_SASS_SRC = "./packages";

export function ignoreStylelintIgnoreWarnings(lintResults) {
  return formatters.string(
    lintResults.reduce((memo, result) => {
      const { warnings } = result;
      const fileIsIgnored = warnings.some((warning) =>
        RegExp(IGNORE_STRING, "i").test(warning.text)
      );

      if (!fileIsIgnored) {
        memo.push(result);
      }

      return memo;
    }, [])
  );
}

export function typecheck() {
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

export async function lintSass(callback) {
  const { errored, output } = await lint({
    files: [
      `${PROJECT_SASS_SRC}/**/*.scss`,
      `!${PROJECT_SASS_SRC}/uswds/**/*.scss`,
      `!${PROJECT_SASS_SRC}/uswds-elements/lib/**/*.scss`,
    ],
    formatter: "string",
  });

  callback(errored ? new Error(output) : null);
}
