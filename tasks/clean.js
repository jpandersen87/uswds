/**
 * Clean tasks - Clean compiled dist directories.
 */

// Include Our Plugins
import del from "del";
import { cleanup } from "./utils/cflags.js";
import { logMessage } from "./utils/doc-util.js";

// Clean generated Dist directory.
// eslint-disable-next-line import/prefer-default-export
export function cleanDist(done) {
  if (!cleanup) {
    logMessage(
      "clean-dist",
      "Skipping cleaning up the distribution directories."
    );
    return done();
  }
  logMessage("clean-dist", "Removing distribution directories.");

  return del("dist");
}
