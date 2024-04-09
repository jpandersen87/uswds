import assert from "assert";
import fs from "fs";
import fileInput from "../index";

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-disabled.template.html`
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
    describe("file input is disabled", () => {
      let container: HTMLElement;

      let component;

      beforeEach(() => {
        container = render(TEMPLATE).container;
        fileInput.on(containerSelector(container));
        component = body.querySelector(".usa-file-input");
      });

      afterEach(() => {
        fileInput.off(containerSelector(container));
        body.innerHTML = "";
      });

      it("has disabled styling", () => {
        const expectedClass = "usa-file-input--disabled";
        assert.strictEqual(
          component.getAttribute("class").includes(expectedClass),
          true
        );
      });
    });
  });
});
