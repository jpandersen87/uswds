import fs from "fs";
import path from "path";
import assert from "assert";
import DatePicker from "../index";

const INVALID_TEMPLATE_NO_INPUT = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-input.template.html")
);

const datePickerSelector = () => document.querySelector(".usa-date-picker");
const tests = [
  { name: "document.body", select: (container: HTMLElement) => container },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Date picker without input initialized at ${name}`, () => {
    let container: HTMLElement;

    beforeEach(() => {
      body.innerHTML = INVALID_TEMPLATE_NO_INPUT;
    });

    afterEach(() => {
      DatePicker.off(containerSelector(container));
      body.textContent = "";
    });

    it('should throw an error when date picker is activated without a wrapping "usa-date-picker"', () => {
      assert.throws(() => DatePicker.on(containerSelector(container)), {
        message: ".usa-date-picker is missing inner input",
      });
    });
  });
});
