import assert from "assert";
import fs from "fs";
import fileInput from "../index";

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-single.template.html`
);

const tests = [
  { name: "document.body", select: (container: HTMLElement) => container },
  {
    name: "file input",
    selector: (container: HTMLElement) =>
      container.querySelector<HTMLElement>(".usa-file-input"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`File input initialized at ${name}`, () => {
    describe("file input: single file input", () => {
      let container: HTMLElement;

      let dragText;

      beforeEach(() => {
        container = render(TEMPLATE).container;
        fileInput.on(containerSelector(container));
        dragText = body.querySelector(".usa-file-input__drag-text");
      });

      afterEach(() => {
        fileInput.off(containerSelector(container));
        body.innerHTML = "";
      });

      it('uses singular "file" if there is not a "multiple" attribute', () => {
        assert.strictEqual(dragText.innerHTML, "Drag file here or");
      });
    });
  });
});
