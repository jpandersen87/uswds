import assert from "assert";
import fs from "fs";
import path from "path";
import LanguageSelector from "../index";

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const EVENTS = {
  escape(el) {
    const escapeKeyEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });

    el.dispatchEvent(escapeKeyEvent);
  },
  focusOut(el) {
    const focusOutEvent = new Event("focusout", {
      bubbles: true,
      cancelable: true,
    });

    el.dispatchEvent(focusOutEvent);
  },
};

describe("language selector component", () => {
  let container: HTMLElement;

  let language;
  let languageList;
  let languageButton;
  let languageLink;

  beforeEach(() => {
    container = render(TEMPLATE).container;
    language = body.querySelector(".usa-language-container");
    languageList = body.querySelector(".usa-language__submenu");
    languageButton = body.querySelector(".usa-language__link");
    languageLink = language.querySelector("a");
    LanguageSelector.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    LanguageSelector.off(body);
  });

  it("shows the language dropdown when the language button is clicked", () => {
    const languageMenu = body.querySelector("#language-options");

    languageButton.click();
    assert.strictEqual(languageMenu.getAttribute("hidden"), null);
  });

  it("hides the visible language menu when the body is clicked", () => {
    const languageMenu = body.querySelector("#language-options");

    languageButton.click();
    assert.strictEqual(languageMenu.getAttribute("hidden"), null);
    body.click();
    assert.strictEqual(languageMenu.hasAttribute("hidden"), true);
  });

  it("collapses dropdown when a language link is clicked", () => {
    languageButton.click();
    languageLink.click();
    assert.strictEqual(languageButton.getAttribute("aria-expanded"), "false");
  });

  it("collapses dropdown when the Escape key is hit", () => {
    languageButton.click();
    EVENTS.escape(languageButton);
    assert.strictEqual(languageButton.getAttribute("aria-expanded"), "false");
  });

  it("contains a role of button", () => {
    assert.strictEqual(languageButton.getAttribute("role"), "button");
  });

  it("contains aria-controls of language-options", () => {
    assert.strictEqual(
      languageButton.getAttribute("aria-controls"),
      "language-options"
    );
  });

  it("contains an id of language-options", () => {
    assert.strictEqual(languageList.getAttribute("id"), "language-options");
  });
});
