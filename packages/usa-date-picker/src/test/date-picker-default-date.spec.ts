import fs from "fs";
import path from "path";
import assert from "assert";
import EVENTS from "./events";
import DatePicker from "../index";

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-default-date.template.html")
);

const datePickerSelector = () => document.querySelector(".usa-date-picker");
const tests = [
  { name: "document.body", select: (container: HTMLElement) => container },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`date picker component with default date initialized at ${name}`, () => {
    let container: HTMLElement;

    let root;
    let input;
    let button;
    const getCalendarEl = (query) =>
      root.querySelector(
        `.usa-date-picker__calendar${query ? ` ${query}` : ""}`
      );

    beforeEach(() => {
      container = render(TEMPLATE).container;
      DatePicker.on(containerSelector(container));
      root = datePickerSelector();
      input = root.querySelector(".usa-date-picker__external-input");
      button = root.querySelector(".usa-date-picker__button");
    });

    afterEach(() => {
      DatePicker.off(containerSelector(container));
      window.onerror = null;
      body.textContent = "";
    });

    it("should display the input date when an input date is present", () => {
      input.value = "06/20/2020";

      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown"
      );
      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-06-20",
        "focuses correct date"
      );
    });

    it("should display the default date when the input date is empty", () => {
      input.value = "";

      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown"
      );
      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date"
      );
    });

    it("should display the default date when the input date is invalid", () => {
      input.value = "";

      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown"
      );
      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date"
      );
    });
  });
});
