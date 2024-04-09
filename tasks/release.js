import spawn from "cross-spawn";
import gulp from "gulp";
import { createHash as _createHash } from "crypto";
import { readFileSync, existsSync, mkdirSync, writeFile } from "fs";
import { dirName, logMessage, logError, logData } from "./utils/doc-util.js";
import { build } from "./build.js";

const { series } = gulp;

const hash = _createHash("sha256");

const version = dirName.replace("@uswds/", "");

// Create a hash from the compiled tgz users can compare and verify
// their download is authentic.
export function createHash(file) {
  logMessage("createHash", "Generating sha256sum hash from ZIP file.");

  const fileBuffer = readFileSync(file);
  hash.update(fileBuffer);
  const dir = "./security";
  const hex = hash.digest("hex");
  const fileName = `${dir}/${version}-zip-hash.txt`;

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  writeFile(fileName, hex, (error) => {
    if (error) {
      return logError(`Error writing hash: ${error}`);
    }

    return logMessage("createHash", `Created sha256sum hash: ${hex}`);
  });
}

export function zipArchives(done) {
  const zip = spawn("npm", ["pack"]);

  logMessage("zip-archives", `Creating a tgz archive in root directory`);

  zip.stdout.on("data", (data) => logData("zip-archives", `Created ${data}`));

  zip.stderr.on("data", (data) => logError("zip-archives", data));

  // @TODO get data from stdout
  zip.on("close", (code) => {
    if (code === 0) {
      createHash(`./uswds-${version}.tgz`);
      done();
    }
  });
}

export const release = series(
  (done) => {
    logMessage("release", `Creating a tgz archive at ./uswds-${version}.tgz`);
    done();
  },
  build,
  zipArchives
);
