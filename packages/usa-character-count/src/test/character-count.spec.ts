import fs from "fs";
import path from "path";
import CharacterCount from "../index";
import { render } from "../../../../src/test/render";

const { VALIDATION_MESSAGE, MESSAGE_INVALID_CLASS } = CharacterCount;

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/character-count.template.html"),
  {
    encoding: "utf-8",
  }
);

const EVENTS = {
  /**
   * send an input event
   * @param {HTMLElement} el the element to sent the event to
   */
  input: (el: HTMLElement) => {
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
  describe(`character count component initialized at ${name}`, () => {
    let container: HTMLElement;

    let root: HTMLElement;
    let input: HTMLInputElement;
    let requirementsMessage: HTMLElement;
    let statusMessageVisual: HTMLElement;
    let statusMessageSR: HTMLElement;

    beforeEach(() => {
      container = render(TEMPLATE).container;

      CharacterCount.on(containerSelector(container));

      root = characterCountSelector(container)!;
      input = root.querySelector(".usa-character-count__field")!;
      requirementsMessage = root.querySelector(
        ".usa-character-count__message"
      )!;
      statusMessageVisual = root.querySelector(".usa-character-count__status")!;
      statusMessageSR = root.querySelector(".usa-character-count__sr-status")!;
    });

    afterEach(() => {
      CharacterCount.off(containerSelector(container));
    });

    it("hides the requirements hint for screen readers", () => {
      expect(requirementsMessage).toHaveClass("usa-sr-only");
    });

    it("creates a visual status message on init", () => {
      expect(
        container.querySelectorAll(".usa-character-count__status")
      ).toHaveLength(1);
    });

    it("creates a screen reader status message on init", () => {
      expect(
        container.querySelectorAll(".usa-character-count__sr-status")
      ).toHaveLength(1);
    });

    it("adds initial status message for the character count component", () => {
      expect(statusMessageVisual).toHaveTextContent(/^20 characters allowed$/);
      expect(statusMessageSR).toHaveTextContent(/^20 characters allowed$/);
    });

    it("informs the user how many more characters they are allowed", () => {
      input.value = "1";

      EVENTS.input(input);

      expect(statusMessageVisual).toHaveTextContent(/^19 characters left$/);
    });

    it("informs the user they are allowed a single character", () => {
      input.value = "1234567890123456789";

      EVENTS.input(input);

      expect(statusMessageVisual).toHaveTextContent(/^1 character left$/);
    });

    it("informs the user they are over the limit by a single character", () => {
      input.value = "123456789012345678901";

      EVENTS.input(input);

      expect(statusMessageVisual).toHaveTextContent(/^1 character over limit$/);
    });

    it("informs the user how many characters they will need to remove", () => {
      input.value = "1234567890123456789012345";

      EVENTS.input(input);

      expect(statusMessageVisual).toHaveTextContent(
        /^5 characters over limit$/
      );
    });

    it("should show the component and input as valid when the input is under the limit", () => {
      input.value = "1";

      EVENTS.input(input);

      expect(input.validationMessage).toStrictEqual("");
      expect(statusMessageVisual).not.toHaveClass(MESSAGE_INVALID_CLASS);
    });

    it("should show the component and input as invalid when the input is over the limit", () => {
      input.value = "123456789012345678901";

      EVENTS.input(input);

      expect(input.validationMessage).toStrictEqual(VALIDATION_MESSAGE);
      expect(statusMessageVisual).toHaveClass(MESSAGE_INVALID_CLASS);
    });

    it("should not allow for innerHTML of child elements ", () => {
      Array.from(statusMessageVisual.childNodes).forEach((childNode) => {
        expect(childNode.nodeType).toStrictEqual(Node.TEXT_NODE);
      });
    });
  });
});
