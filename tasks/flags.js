/* eslint-disable no-import-assign */
import { logMessage } from "./utils/doc-util.js";
// eslint-disable-next-line no-unused-vars
import { test, cleanup } from "./utils/cflags.js";

export function noTest(done) {
  logMessage("no-test", "Disabling linting and tests for all assets.");
  test = false;
  done();
}
export function noCleanup(done) {
  logMessage("no-cleanup", "Disabling cleanup of distribution directories.");
  cleanup = false;
  done();
}
