import assert from "assert";
import fs from "fs";
import path from "path";
import skipnav from "../index";

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

describe("skip nav link", () => {
  let container: HTMLElement;

  let skipLink;
  let topLink;
  let main;

  beforeEach(() => {
    container = render(TEMPLATE).container;
    skipLink = body.querySelector(".usa-skipnav");
    topLink = body.querySelector(".usa-footer__return-to-top a");
    main = body.querySelector("main");
    skipnav.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    skipnav.off(body);
  });

  it('skipnav link sets tabindex="0" when clicked', () => {
    skipLink.click();
    assert.strictEqual(main.getAttribute("tabindex"), "0");
  });

  it('skipnav link sets tabindex="-1" when blurred', () => {
    skipLink.click();
    assert.strictEqual(main.getAttribute("tabindex"), "0");

    main.focus(); // XXX jsdom doesn't do this for us
    main.blur();
    assert.strictEqual(main.getAttribute("tabindex"), "-1");
  });

  it('return to top link sets tabindex="0" when clicked', () => {
    topLink.click();
    assert.strictEqual(main.getAttribute("tabindex"), "0");
  });
});
