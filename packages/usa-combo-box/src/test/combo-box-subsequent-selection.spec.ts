import fs from "fs";
import path from "path";
import ComboBox from "../index";
import { render } from "../../../../src/test/render";
import userEvent from "@testing-library/user-event";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-subsequent-selection.template.html"),
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
    describe("combo box component - subsequent selection", () => {
      let container: HTMLElement;

      let root: HTMLElement;
      let comboBox: HTMLElement;
      let input: HTMLInputElement;
      let select: HTMLSelectElement;
      let list: HTMLElement;

      beforeEach(() => {
        container = render(TEMPLATE).container;
        root = containerSelector(container)!;
        ComboBox.on(root);
        comboBox = comboBoxSelector(container)!;
        input = root.querySelector(".usa-combo-box__input")!;
        select = root.querySelector(".usa-combo-box__select")!;
        list = root.querySelector(".usa-combo-box__list")!;
      });

      afterEach(() => {
        ComboBox.off(root);
      });

      it("should display the full list and focus the selected item when the input is pristine (after fresh selection)", async () => {
        assert.ok(
          comboBox.classList.contains("usa-combo-box--pristine"),
          "pristine class added after selection"
        );
        await userEvent.click(input);

        assert.ok(!list.hidden, "should show the option list");
        assert.strictEqual(
          list.children.length,
          select.options.length - 1,
          "should have all of the initial select items in the list except placeholder empty items"
        );
        const highlightedOption = list.querySelector(
          ".usa-combo-box__list-option--focused"
        )!;
        assert.ok(
          highlightedOption.classList.contains(
            "usa-combo-box__list-option--focused"
          ),
          "should style the focused item in the list"
        );
        assert.strictEqual(
          highlightedOption.textContent,
          "Blackberry",
          "should be the previously selected item"
        );
      });

      it("should display the filtered list when the input is dirty (characters inputted)", async () => {
        await userEvent.click(input);
        assert.strictEqual(
          list.children.length,
          select.options.length - 1,
          "should have all of the initial select items in the list except placeholder empty items"
        );

        await userEvent.type(input, "COBOL");

        assert.ok(
          !comboBox.classList.contains("usa-combo-box--pristine"),
          "pristine class is removed after input"
        );
        assert.strictEqual(
          list.children.length,
          1,
          "should only show the filtered items"
        );
      });

      it("should show a clear button when the input has a selected value present", () => {
        assert.ok(
          comboBox.classList.contains("usa-combo-box--pristine"),
          "pristine class added after selection"
        );
        assert.ok(
          comboBox.querySelector(".usa-combo-box__clear-input"),
          "clear input button is present"
        );
      });

      it("should clear the input when the clear button is clicked", async () => {
        assert.strictEqual(select.value, "blackberry");
        assert.strictEqual(input.value, "Blackberry");

        await userEvent.click(
          comboBox.querySelector(".usa-combo-box__clear-input")!
        );

        assert.strictEqual(
          select.value,
          "",
          "should clear the value on the select"
        );
        assert.strictEqual(
          input.value,
          "",
          "should clear the value on the input"
        );
        assert.strictEqual(
          document.activeElement,
          input,
          "should focus the input"
        );
      });

      it("should update the filter and begin filtering once a pristine input value is changed", async () => {
        input.value = "go";
        await userEvent.click(input);
        await userEvent.keyboard("{enter}");

        assert.strictEqual(
          input.value,
          "Blackberry",
          "should set that item to the input value"
        );
        await userEvent.click(input);
        assert.strictEqual(
          list.children.length,
          select.options.length - 1,
          "should have all of the initial select items in the list except placeholder empty items"
        );

        await userEvent.type(input, "Fig");

        assert.strictEqual(
          list.children.length,
          1,
          "should only show the filtered items"
        );
      });
    });
  });
});
