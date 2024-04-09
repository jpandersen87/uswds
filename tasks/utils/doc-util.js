import log from "fancy-log";
import ansiColors from "ansi-colors";
import _pkg from "../../package.json" assert { type: "json" };

const { white, yellow, cyan, magenta, red, green } = ansiColors;

const shellPrefix = "$";

export function drawFlag() {
  log(white(""));
  log(white("* * * * * ========================"));
  log(white("* * * * * ========================"));
  log(white("* * * * * ========================"));
  log(white("* * * * * ========================"));
  log(white("=================================="));
  log(white("=================================="));
  log(white("=================================="));
  log(white(""));
}

export const pkg = _pkg;
export const dirName = `${pkg.name}-${pkg.version}`;
export function logIntroduction(message) {
  const introMessage = message || "USWDS";
  log(yellow(`${introMessage} v${pkg.version}`));
  drawFlag();
}
export function logCommand(name, message) {
  log(shellPrefix, cyan(name), magenta(message));
}
export function logHelp(name, message) {
  log(shellPrefix, cyan(name), yellow(message));
}
export function logData(name, message) {
  log(cyan(name), yellow(message));
}
export function logError(name, message) {
  log(red(name), yellow(message));
}
export function logMessage(name, message) {
  log(cyan(name), green(message));
}
