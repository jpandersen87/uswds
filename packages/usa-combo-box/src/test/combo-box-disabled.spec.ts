import fs from "fs";
import path from "path";
import assert from "assert";
import ComboBox from "../index";
import { render } from "../../../../src/test/render";
import userEvent from "@testing-library/user-event";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-disabled.template.html"),
  { encoding: "utf-8" }
);

const comboBoxSelector = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(".usa-combo-box");
const tests = [
  { name: "document.body", selector: (container: HTMLElement) => container },
  { name: "combo box", selector: comboBoxSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Combo box initialized at ${name}`, () => {
    describe("combo box component - disabled enhancement", () => {
      let container: HTMLElement;

      let root: HTMLElement;
      let comboBox: HTMLElement;
      let input: HTMLInputElement;
      let select: HTMLSelectElement;
      let toggle: HTMLElement;
      let list: HTMLElement;

      beforeEach(() => {
        container = render(TEMPLATE).container;
        root = containerSelector(container)!;
        ComboBox.on(root);
        comboBox = comboBoxSelector(container)!;
        input = root.querySelector(".usa-combo-box__input")!;
        select = root.querySelector(".usa-combo-box__select")!;
        toggle = root.querySelector(".usa-combo-box__toggle-list")!;
        list = root.querySelector(".usa-combo-box__list")!;
      });

      afterEach(() => {
        ComboBox.off(root);
      });

      it("enhances a select element into a combo box component", () => {
        assert.ok(input, "adds an input element");
        assert.strictEqual(
          input.disabled,
          true,
          "transfers disabled attribute to combo box"
        );
        assert.strictEqual(
          select.disabled,
          false,
          "removes disabled attribute from select"
        );
      });

      it("should not show the list when clicking the disabled input", async () => {
        await userEvent.click(input);

        assert.ok(list.hidden, "should not display the option list");
      });

      it("should not show the list when clicking the disabled button", async () => {
        await userEvent.click(toggle);

        assert.ok(list.hidden, "should not display the option list");
      });

      it("should show the list when clicking the input once the component has been enabled", async () => {
        ComboBox.enable(comboBox);
        await userEvent.click(input);

        assert.ok(!list.hidden, "should display the option list");
      });
    });
  });
});
