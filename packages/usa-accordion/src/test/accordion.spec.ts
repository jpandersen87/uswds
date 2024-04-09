import fs from "fs";
import Accordion from "../index";
import { render } from "../../../../src/test/render";

const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`, {
  encoding: "utf-8",
});

// `aria` prefixed attributes
const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "hidden";
const MULTISELECTABLE = "data-allow-multiple";

const accordionSelector = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(".usa-accordion");
const contentSelector = (container: HTMLElement, button: HTMLElement) =>
  container.querySelector<HTMLElement>(`#${button.getAttribute(CONTROLS)}`);
const tests = [
  { name: "document.body", selector: (container: HTMLElement) => container },
  { name: "accordion", selector: accordionSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Accordion behavior when initialized at ${name}`, () => {
    let container: HTMLElement;

    let root: HTMLElement;
    let button1: HTMLButtonElement;
    let button2: HTMLButtonElement;
    let content1: HTMLElement;
    let content2: HTMLElement;

    beforeEach(() => {
      container = render(TEMPLATE).container;
      Accordion.on(containerSelector(container)!);

      root = accordionSelector(container)!;
      const buttons = root!.querySelectorAll<HTMLButtonElement>(
        ".usa-accordion__button"
      );
      const [btn1, btn2] = buttons;
      button1 = btn1;
      button2 = btn2;
      content1 = contentSelector(container, button1)!;
      content2 = contentSelector(container, button2)!;
    });

    afterEach(() => {
      Accordion.off(containerSelector(container)!);
    });

    describe("DOM state", () => {
      it('has an "aria-expanded" attribute', () => {
        assert(button1.getAttribute(EXPANDED));
      });

      it('has an "aria-controls" attribute', () => {
        assert(button1.getAttribute(CONTROLS));
      });

      describe("accordion.show()", () => {
        beforeEach(() => {
          Accordion.hide(button1);
          Accordion.show(button1);
        });

        it('toggles button aria-expanded="true"', () => {
          assert.strictEqual(button1.getAttribute(EXPANDED), "true");
        });

        it('toggles content "hidden" off', () => {
          assert(content1.getAttribute(HIDDEN) !== "true");
        });
      });

      describe("accordion.hide()", () => {
        beforeEach(() => {
          Accordion.show(button1);
          Accordion.hide(button1);
        });

        it('toggles button aria-expanded="false"', () => {
          assert.strictEqual(button1.getAttribute(EXPANDED), "false");
        });

        it('toggles content "hidden" on', () => {
          assert(content1.hasAttribute(HIDDEN));
        });
      });
    });

    describe("interaction", () => {
      it("shows the second item when clicked", () => {
        button2.click();
        // first button and section should be collapsed
        assert.strictEqual(button1.getAttribute(EXPANDED), "false");
        assert(content1.hasAttribute(HIDDEN));
        // second should be expanded
        assert.strictEqual(button2.getAttribute(EXPANDED), "true");
        assert(content2.getAttribute(HIDDEN) !== "true");
      });

      it("keeps multiple sections open with data-allow-multiple", () => {
        root.setAttribute(MULTISELECTABLE, "");

        button2.click();
        button1.click();

        assert.strictEqual(button1.getAttribute(EXPANDED), "true");
        assert(content1.getAttribute(HIDDEN) !== "true");
        // second should be expanded
        assert.strictEqual(button2.getAttribute(EXPANDED), "true");
        assert(content2.getAttribute(HIDDEN) !== "true");
      });
    });
  });
});
