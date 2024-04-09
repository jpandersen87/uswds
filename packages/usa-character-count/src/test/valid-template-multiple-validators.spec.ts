import fs from "fs";
import path from "path";
import CharacterCount from "../index";
import { render } from "../../../../src/test/render";
import userEvent from "@testing-library/user-event";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/valid-template-multiple-validators.template.html"),
  { encoding: "utf-8" }
);

const characterCountSelector = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(".usa-character-count");
const tests = [
  { name: "document.body", selector: (container: HTMLElement) => container },
  { name: "character count", selector: characterCountSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`character count component with multiple validators initialized at ${name}`, () => {
    let container: HTMLElement;

    let root: HTMLElement;
    let input: HTMLInputElement;

    beforeEach(() => {
      container = render(TEMPLATE).container;
      CharacterCount.on(containerSelector(container));

      root = characterCountSelector(container)!;
      input = root.querySelector(".usa-character-count__field")!;
    });

    afterEach(() => {
      CharacterCount.off(containerSelector(container));
    });

    it("assert that input constraint validation adds a validation message", async () => {
      input.value = "abcd5";

      await userEvent.type(input, "abcd5");

      expect(input.validationMessage).toStrictEqual(
        "Constraints not satisfied"
      );
    });

    it("assert that input constraint validation does not overwrite a custom message", async () => {
      input.setCustomValidity("There is an error");
      input.value = "abcd5";

      await userEvent.type(input, "abcd5");

      expect(input.validationMessage).toStrictEqual("There is an error");
    });

    it("should not affect the validation message when a custom error message is already present", async () => {
      input.setCustomValidity("There is an error");
      input.value = "abcdef";

      await userEvent.type(input, "abcdef");

      expect(input.validationMessage).toStrictEqual("There is an error");
    });

    it("should not affect the validation message when the input is already invalid", async () => {
      input.value = "abcde5";

      await userEvent.type(input, "abcde5");

      expect(input.validationMessage).toStrictEqual(
        "Constraints not satisfied"
      );
    });

    it("should clear the validation message when input is only invalid by character count validation", async () => {
      input.value = "abcdef";

      await userEvent.type(input, "abcdef");

      expect(input.validationMessage).toStrictEqual(
        CharacterCount.VALIDATION_MESSAGE
      );

      await userEvent.type(input, "abcde");

      expect(input.validationMessage).toStrictEqual("");
    });
  });
});
