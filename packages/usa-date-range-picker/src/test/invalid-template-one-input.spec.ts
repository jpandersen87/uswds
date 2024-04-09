import fs from "fs";
import path from "path";
import assert from "assert";
import DatePicker from "../../../usa-date-picker/src/index";
import DateRangePicker from "../index";

const INVALID_TEMPLATE_ONE_INPUT = fs.readFileSync(
  path.join(__dirname, "/invalid-template-one-input.template.html")
);

const dateRangePickerSelector = () =>
  document.querySelector(".usa-date-range-picker");
const tests = [
  { name: "document.body", select: (container: HTMLElement) => container },
  { name: "date range picker", selector: dateRangePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Date range picker without second date picker initialized at ${name}`, () => {
    let container: HTMLElement;

    beforeEach(() => {
      body.innerHTML = INVALID_TEMPLATE_ONE_INPUT;
      DatePicker.on(containerSelector(container));
    });

    afterEach(() => {
      DatePicker.off(containerSelector(container));
      DateRangePicker.off(containerSelector(container));
      body.textContent = "";
    });

    it('should throw an error when a date range picker without two "usa-date-picker" elements', () => {
      assert.throws(() => DateRangePicker.on(containerSelector(container)), {
        message:
          ".usa-date-range-picker is missing second '.usa-date-picker' element",
      });
    });
  });
});
