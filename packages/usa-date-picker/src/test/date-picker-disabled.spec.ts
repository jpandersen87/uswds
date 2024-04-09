import fs from "fs";
import path from "path";
import assert from "assert";
import EVENTS from "./events";
import DatePicker from "../index";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-disabled.template.html")
);

const datePickerSelector = () => document.querySelector(".usa-date-picker");
const tests = [
  { name: "document.body", select: (container: HTMLElement) => container },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`date picker component initialized at ${name} - disabled initialization`, () => {
    let container: HTMLElement;

    let root;
    let button;
    const getCalendarEl = (query) =>
      root.querySelector(
        `.usa-date-picker__calendar${query ? ` ${query}` : ""}`
      );

    beforeEach(() => {
      container = render(TEMPLATE).container;
      DatePicker.on(containerSelector(container));
      root = datePickerSelector();
      button = root.querySelector(".usa-date-picker__button");
    });

    afterEach(() => {
      DatePicker.off(containerSelector(container));
      window.onerror = null;
      body.textContent = "";
    });

    it("should not display the calendar when the button is clicked as it is disabled", () => {
      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        true,
        "the calendar is hidden"
      );
    });

    it("should display the calendar when the button is clicked once the component is enabled", () => {
      DatePicker.enable(root);
      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "the calendar is shown"
      );
    });
  });
});
