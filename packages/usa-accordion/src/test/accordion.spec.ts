import assert from "assert";
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
    let button1: HTMLElement;
    let button2: HTMLElement;
    let content1: HTMLElement;
    let content2: HTMLElement;

    beforeEach(() => {
      container = render(TEMPLATE).container;
      Accordion.on(containerSelector(container));

      root = accordionSelector(container)!;
      const buttons = root!.querySelectorAll<HTMLElement>(
        ".usa-accordion__button"
      );
      const [btn1, btn2] = buttons;
      button1 = btn1;
      button2 = btn2;
      content1 = contentSelector(container, button1)!;
      content2 = contentSelector(container, button2)!;
    });

    afterEach(() => {
      Accordion.off(containerSelector(container));
    });

    describe("DOM state", () => {
      it('has an "aria-expanded" attribute', () => {
        expect(button1).toHaveAttribute(EXPANDED);
      });

      it('has an "aria-controls" attribute', () => {
        expect(button1).toHaveAttribute(CONTROLS);
      });

      describe("accordion.show()", () => {
        beforeEach(() => {
          Accordion.hide(button1);
          Accordion.show(button1);
        });

        it('toggles button aria-expanded="true"', () => {
          expect(button1).toHaveAttribute(EXPANDED, "true");
        });

        it('toggles content "hidden" off', () => {
          expect(content1).not.toHaveAttribute(HIDDEN, "true");
        });
      });

      describe("accordion.hide()", () => {
        beforeEach(() => {
          Accordion.show(button1);
          Accordion.hide(button1);
        });

        it('toggles button aria-expanded="false"', () => {
          expect(button1).toHaveAttribute(EXPANDED, "false");
        });

        it('toggles content "hidden" on', () => {
          expect(content1).toHaveAttribute(HIDDEN);
        });
      });
    });

    describe("interaction", () => {
      it("shows the second item when clicked", () => {
        button2.click();
        // first button and section should be collapsed
        expect(button1).toHaveAttribute(EXPANDED, "false");
        expect(content1).toHaveAttribute(HIDDEN);
        // second should be expanded
        expect(button2).toHaveAttribute(EXPANDED, "true");
        expect(content2).not.toHaveAttribute(HIDDEN, true);
      });

      it("keeps multiple sections open with data-allow-multiple", () => {
        root.setAttribute(MULTISELECTABLE, "");

        button2.click();
        button1.click();

        expect(button1).toHaveAttribute(EXPANDED, "true");
        expect(content1).not.toHaveAttribute(HIDDEN, true);
        // second should be expanded
        expect(button2).toHaveAttribute(EXPANDED, "true");
        expect(content2).not.toHaveAttribute(HIDDEN, true);
      });
    });
  });
});
