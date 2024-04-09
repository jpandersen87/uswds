import { screen } from "@testing-library/dom";

afterEach(() => {
  document.body.innerHTML = "";
});

export function render(html: string) {
  document.body.innerHTML = html;
  return {
    container: document.body,
    screen,
  };
}
