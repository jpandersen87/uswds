import fs from "fs";
import path from "path";
import ComboBox from "../index";
import { render } from "../../../../src/test/render";

const INVALID_TEMPLATE_NO_MESSAGE = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-select.template.html"),
  {
    encoding: "utf-8",
  }
);

describe("character count component without message", () => {
  let container: HTMLElement;

  afterEach(() => {
    ComboBox.off(container);
  });

  it("should throw an error when a combo box component is created with no select element", () => {
    container = render(INVALID_TEMPLATE_NO_MESSAGE).container;
    assert.throws(
      () => ComboBox.on(),
      ".usa-combo-box is missing inner select"
    );
  });
});
