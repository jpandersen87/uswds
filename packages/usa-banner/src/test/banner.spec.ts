import fs from "fs";
import banner from "../index";
import { render } from "../../../../src/test/render";

const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`, {
  encoding: "utf-8",
});
const EXPANDED = "aria-expanded";
const EXPANDED_CLASS = "usa-banner__header--expanded";
const HIDDEN = "hidden";

const tests = [
  { name: "document.body", selector: (container: HTMLElement) => container },
  {
    name: "banner",
    selector: (container: HTMLElement) =>
      container.querySelector<HTMLElement>(".usa-banner"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Banner initialized at ${name}`, () => {
    let container: HTMLElement;

    let header: HTMLElement;
    let button: HTMLElement;
    let content: HTMLElement;

    beforeEach(() => {
      container = render(TEMPLATE).container;
      header = container.querySelector(".usa-banner__header")!;
      button = container.querySelector(".usa-banner__button")!;
      content = container.querySelector(".usa-banner__content")!;
      banner.on(containerSelector(container)!);
    });

    afterEach(() => {
      banner.off(containerSelector(container)!);
    });

    it("initializes closed", () => {
      expect(header).not.toHaveClass(EXPANDED_CLASS);
      expect(button).toHaveAttribute(EXPANDED, "false");
      expect(content).toHaveAttribute(HIDDEN);
    });

    it("opens when you click the button", () => {
      button.click();
      expect(header).toHaveClass(EXPANDED_CLASS);
      expect(button).toHaveAttribute(EXPANDED, "true");
      expect(content).not.toHaveAttribute(HIDDEN);
    });

    it("closes when you click the button again", () => {
      button.click();
      button.click();
      expect(header).not.toHaveClass(EXPANDED_CLASS);
      expect(button).toHaveAttribute(EXPANDED, "false");
      expect(content).toHaveAttribute(HIDDEN);
    });
  });
});
