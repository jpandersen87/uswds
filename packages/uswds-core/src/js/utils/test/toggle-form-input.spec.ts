import assert from "assert";
import fs from "fs";
import path from "path";
import toggleFormInput from "../toggle-form-input";

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/toggle.template.html"));

const CONTROL_SELECTOR = ".usa-show-password";
const PASSWORD_SELECTOR = "#password";
const CONFIRM_SELECTOR = "#confirmPassword";
const HIDE_TEXT = "Hide my typing";
const SHOW_TEXT = "Show my typing";

describe("toggleFormInput", () => {
  let container: HTMLElement;
  let maskControl;
  let password;
  let confirmPassword;

  beforeEach(() => {
    container = render(TEMPLATE).container;

    maskControl = body.querySelector(CONTROL_SELECTOR);
    password = body.querySelector(PASSWORD_SELECTOR);
    confirmPassword = body.querySelector(CONFIRM_SELECTOR);
  });

  afterEach(() => {
    body.textContent = "";
  });

  it("defaults to masked", () => {
    assert.strictEqual(password.type, "password");
    assert.strictEqual(maskControl.textContent, SHOW_TEXT);
  });

  it("switches type of inputs from password to text when true", () => {
    toggleFormInput(maskControl);
    assert.strictEqual(password.type, "text");
    assert.strictEqual(confirmPassword.type, "text");
  });

  it("changes text of mask control element to match show/hide text", () => {
    toggleFormInput(maskControl);
    assert.strictEqual(maskControl.textContent, HIDE_TEXT);

    toggleFormInput(maskControl);
    assert.strictEqual(maskControl.textContent, SHOW_TEXT);
  });
});
