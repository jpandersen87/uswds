import fs from "fs";
import path from "path";
import CharacterCount from "../index";
import { render } from "../../../../src/test/render";

const INVALID_TEMPLATE_NO_WRAPPER = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-wrapper.template.html"),
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
  describe(`character count input without wrapping element initialized at ${name}`, () => {
    let container: HTMLElement;

    it("should throw an error when a character count component is created with no wrapping class", () => {
      container = render(INVALID_TEMPLATE_NO_WRAPPER).container;
      expect(() =>
        CharacterCount.on(containerSelector(container))
      ).toThrowError(
        ".usa-character-count__field is missing outer .usa-character-count"
      );
    });
  });
});
