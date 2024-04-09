import fs from "fs";
import path from "path";
import CharacterCount from "../index";
import { render } from "../../../../src/test/render";

const INVALID_TEMPLATE_NO_MESSAGE = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-message.template.html"),
  { encoding: "utf-8" }
);

const tests = [
  { name: "document.body", selector: (container: HTMLElement) => container },
  {
    name: "character count",
    selector: (container: HTMLElement) =>
      container.querySelector<HTMLElement>(".usa-character-count"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`character count component without message initialized at ${name}`, () => {
    let container: HTMLElement;

    afterEach(() => {
      CharacterCount.off(containerSelector(container));
    });

    it("should throw an error when a character count component is created with no message element", () => {
      container = render(INVALID_TEMPLATE_NO_MESSAGE).container;
      expect(() =>
        CharacterCount.on(containerSelector(container))
      ).toThrowError(
        ".usa-character-count is missing inner .usa-character-count__message"
      );
    });
  });
});
