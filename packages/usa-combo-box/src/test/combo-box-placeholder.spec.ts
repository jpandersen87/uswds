import fs from "fs";
import path from "path";
import ComboBox from "../index";
import { render } from "../../../../src/test/render";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-placeholder.template.html"),
  { encoding: "utf-8" }
);

const tests = [
  { name: "document.body", selector: (container: HTMLElement) => container },
  {
    name: "combo box",
    selector: (container: HTMLElement) =>
      container.querySelector<HTMLElement>(".usa-combo-box"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Combo box initialized at ${name}`, () => {
    describe("combo box component with placeholder attribute", () => {
      let container: HTMLElement;

      let root: HTMLElement;
      let input: HTMLInputElement;

      beforeEach(() => {
        container = render(TEMPLATE).container;
        root = containerSelector(container)!;
        ComboBox.on(root);
        input = root.querySelector(".usa-combo-box__input")!;
      });

      afterEach(() => {
        ComboBox.off(root);
      });

      it("enhances a select element into a combo box component", () => {
        assert.ok(input, "adds an input element");
        assert.strictEqual(
          input.placeholder,
          "Select one...",
          "transfers placeholder attribute from combo box"
        );
      });
    });
  });
});
