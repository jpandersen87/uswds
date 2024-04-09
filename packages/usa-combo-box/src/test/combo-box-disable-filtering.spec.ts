import fs from "fs";
import path from "path";
import ComboBox from "../index";
import { render } from "../../../../src/test/render";
import userEvent from "@testing-library/user-event";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-disable-filtering.template.html"),
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
    describe("combo box component with disable filtering attribute", () => {
      let container: HTMLElement;

      let root: HTMLElement;
      let input: HTMLElement;
      let list: HTMLElement;
      let select: HTMLSelectElement;

      beforeEach(() => {
        container = render(TEMPLATE).container;
        root = containerSelector(container)!;
        ComboBox.on(root);
        input = root.querySelector(".usa-combo-box__input")!;
        list = root.querySelector(".usa-combo-box__list")!;
        select = root.querySelector(".usa-combo-box__select")!;
      });

      afterEach(() => {
        ComboBox.off(root);
      });

      it("should display the full list and focus the first found item", async () => {
        await userEvent.type(input, "oo");

        const focusedOption = list.querySelector(
          ".usa-combo-box__list-option--focused"
        )!;
        assert.ok(!list.hidden, "should show the option list");
        assert.strictEqual(
          list.children.length,
          select.options.length - 1,
          "should have all of the initial select items in the list except placeholder empty items"
        );
        assert.strictEqual(
          focusedOption.textContent,
          "Blood orange",
          "should be the first found item"
        );
      });
    });
  });
});
