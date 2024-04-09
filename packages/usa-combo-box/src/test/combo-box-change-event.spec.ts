import fs from "fs";
import path from "path";
import ComboBox from "../index";
import { Mock } from "vitest";
import { render } from "../../../../src/test/render";
import userEvent from "@testing-library/user-event";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-change-event.template.html"),
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
    describe("combo box component change event dispatch", () => {
      let container: HTMLElement;

      let root: HTMLElement;
      let input: HTMLInputElement;
      let inputChangeSpy: Mock;
      let select: HTMLSelectElement;
      let selectChangeSpy: Mock;
      let list: HTMLElement;

      beforeEach(() => {
        container = render(TEMPLATE).container;
        root = containerSelector(container)!;
        ComboBox.on(root);
        input = root.querySelector(".usa-combo-box__input")!;
        select = root.querySelector(".usa-combo-box__select")!;
        list = root.querySelector(".usa-combo-box__list")!;
        inputChangeSpy = vi.fn();
        selectChangeSpy = vi.fn();

        select.addEventListener("change", selectChangeSpy);
        input.addEventListener("change", inputChangeSpy);
      });

      afterEach(() => {
        input.removeEventListener("change", inputChangeSpy);
        select.removeEventListener("change", selectChangeSpy);
        ComboBox.off(root);
      });

      it("enhances a select element into a combo box component", () => {
        assert.ok(input, "adds an input element");
        assert.ok(select, "select element exists");
        assert.ok(list, "adds an list element");
      });

      it("should emit change events when selecting an item from the option list when clicking a list option", async () => {
        await userEvent.click(input);
        await userEvent.click(list.children[0]);

        assert.strictEqual(
          select.value,
          "apple",
          "should set that item to being the select option"
        );
        assert.strictEqual(
          input.value,
          "Apple",
          "should set that item to being the input value"
        );

        assert.ok(
          selectChangeSpy.mock.lastCall,
          "should have dispatched a change event from the select"
        );
        assert.ok(
          inputChangeSpy.mock.lastCall,
          "should have dispatched a change event from the input"
        );
      });

      it("should emit change events when resetting input values when an incomplete item is submitted through enter", async () => {
        select.value = "apple";

        await userEvent.type(input, "a");

        assert.ok(!list.hidden, "should display the option list");

        await userEvent.type(input, "{Enter}");

        assert.strictEqual(select.value, "apple");
        assert.strictEqual(
          input.value,
          "Apple",
          "should reset the value on the input"
        );
        assert.ok(
          !selectChangeSpy.mock.lastCall,
          "should not have dispatched a change event"
        );
        assert.ok(
          inputChangeSpy.mock.lastCall,
          "should have dispatched a change event"
        );
      });

      it("should emit change events when closing the list but not the clear the input value when escape is performed while the list is open", async () => {
        select.value = "apple";

        await userEvent.type(input, "a");

        assert.ok(!list.hidden, "should display the option list");

        await userEvent.keyboard("{escape}");

        assert.strictEqual(
          select.value,
          "apple",
          "should not change the value of the select"
        );
        assert.strictEqual(
          input.value,
          "Apple",
          "should reset the value in the input"
        );
        assert.ok(
          !selectChangeSpy.mock.lastCall,
          "should not have dispatched a change event"
        );
        assert.ok(
          inputChangeSpy.mock.lastCall,
          "should have dispatched a change event"
        );
      });

      it("should emit change events when setting the input value when a complete selection is submitted by pressing enter", async () => {
        await userEvent.type(input, "fig");

        assert.ok(!list.hidden, "should display the option list");

        await userEvent.keyboard("{enter}");

        assert.strictEqual(
          select.value,
          "fig",
          "should set that item to being the select option"
        );
        assert.strictEqual(
          input.value,
          "Fig",
          "should set that item to being the input value"
        );
        assert.ok(
          selectChangeSpy.mock.lastCall,
          "should have dispatched a change event"
        );
        assert.ok(
          inputChangeSpy.mock.lastCall,
          "should have dispatched a change event"
        );
      });

      it("should emit change events when selecting the focused list item in the list when pressing enter on a focused item", async () => {
        await userEvent.type(input, "emo{arrowdown}");

        const focusedOption = document.activeElement!;
        assert.strictEqual(
          focusedOption.textContent,
          "Lemon",
          "should focus the first item in the list"
        );

        await userEvent.keyboard("{enter}");

        assert.strictEqual(
          select.value,
          "lemon",
          "select the first item in the list"
        );
        assert.strictEqual(
          input.value,
          "Lemon",
          "should set the value in the input"
        );
        assert.ok(
          selectChangeSpy.mock.lastCall,
          "should have dispatched a change event"
        );
        assert.ok(
          inputChangeSpy.mock.lastCall,
          "should have dispatched a change event"
        );
      });

      it("should emit change events when pressing escape from a focused item", async () => {
        select.value = "grapefruit";

        await userEvent.type(input, "dew");

        assert.ok(
          !list.hidden && list.children.length,
          "should display the option list with options"
        );
        await userEvent.keyboard("{arrowdown}");
        const focusedOption = document.activeElement!;
        assert.strictEqual(
          focusedOption.textContent,
          "Honeydew melon",
          "should focus the first item in the list"
        );
        await userEvent.keyboard("{escape}");

        assert.ok(list.hidden, "should hide the option list");
        assert.strictEqual(
          select.value,
          "grapefruit",
          "should not change the value of the select"
        );
        assert.strictEqual(
          input.value,
          "Grapefruit",
          "should reset the value in the input"
        );
        assert.ok(
          !selectChangeSpy.mock.lastCall,
          "should not have dispatched a change event"
        );
        assert.ok(
          inputChangeSpy.mock.lastCall,
          "should have dispatched a change event"
        );
      });
    });
  });
});
