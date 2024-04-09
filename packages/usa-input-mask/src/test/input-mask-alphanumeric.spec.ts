import fs from "fs";
import path from "path";
import assert from "assert";
import InputMask from "../index";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/input-mask-alphanumeric.template.html")
);

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el) => {
  el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
};

const inputMaskingSelector = () => document.querySelector(".usa-input-masking");
const tests = [
  { name: "document.body", select: (container: HTMLElement) => container },
  { name: "input mask", selector: inputMaskingSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`input mask component initialized at ${name}`, () => {
    let container: HTMLElement;

    let root;
    let input;
    let shell;

    beforeEach(() => {
      container = render(TEMPLATE).container;
      InputMask.on(containerSelector(container));

      root = inputMaskingSelector();
      input = root.querySelector(".usa-input");
    });

    afterEach(() => {
      InputMask.off(containerSelector(container));
      body.textContent = "";
    });

    it("formats an alphanumeric example to A1B 2C3", () => {
      input.value = "A1B2C3";

      EVENTS.input(input);
      shell = root.querySelector(".usa-input-mask--content");
      assert.strictEqual(shell.textContent, "A1B 2C3");
    });
  });
});
