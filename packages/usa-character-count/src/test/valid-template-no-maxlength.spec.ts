import fs from "fs";
import path from "path";
import CharacterCount from "../index";
import { render } from "../../../../src/test/render";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/valid-template-no-maxlength.template.html"),
  { encoding: "utf-8" }
);

const EVENTS = {
  /**
   * send an input event
   * @param {HTMLElement} el the element to sent the event to
   */
  input: (el: HTMLInputElement) => {
    el.dispatchEvent(new KeyboardEvent("input", { bubbles: true }));
  },
};

const characterCountSelector = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(".usa-character-count");

const tests = [
  { name: "document.body", selector: (container: HTMLElement) => container },
  { name: "character count", selector: characterCountSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`character count component without maxlength initialized at ${name}`, () => {
    let container: HTMLElement;

    let root: HTMLElement;
    let input: HTMLInputElement;
    let requirementsMessage: HTMLElement;

    beforeEach(() => {
      container = render(TEMPLATE).container;
      CharacterCount.on(containerSelector(container));
      root = characterCountSelector(container)!;
      input = root.querySelector<HTMLInputElement>(
        ".usa-character-count__field"
      )!;
      requirementsMessage = root.querySelector(
        ".usa-character-count__message"
      )!;
    });

    afterEach(() => {
      CharacterCount.off(containerSelector(container));
    });

    it("should not update an initial message for the character count component", () => {
      expect(requirementsMessage).toHaveTextContent(/^$/);
    });

    it("should not inform the user of remaining characters when typing", () => {
      input.value = "1";

      EVENTS.input(input);

      expect(requirementsMessage).toHaveTextContent(/^$/);
    });
  });
});
