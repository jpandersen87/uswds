import fs from "fs";
import path from "path";
import ComboBox from "../index";
import { render } from "../../../../src/test/render";
import userEvent from "@testing-library/user-event";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-filter.template.html"),
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
    describe("combo box component with filter attribute", () => {
      let container: HTMLElement;

      let root: HTMLElement;
      let input: HTMLElement;
      let list: HTMLElement;

      beforeEach(() => {
        container = render(TEMPLATE).container;
        root = containerSelector(container)!;
        ComboBox.on(root);
        input = root.querySelector(".usa-combo-box__input")!;
        list = root.querySelector(".usa-combo-box__list")!;
      });

      afterEach(() => {
        ComboBox.off(root);
      });

      it("should display and filter the option list after a character is typed", async () => {
        await userEvent.type(input, "st");

        assert.ok(!list.hidden, "should display the option list");
        assert.strictEqual(
          list.children.length,
          2,
          "should filter the item by the string starting with the option"
        );
      });
    });
  });
});
