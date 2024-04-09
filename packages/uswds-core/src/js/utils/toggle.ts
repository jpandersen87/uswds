const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "hidden";

export default (button: Element, expanded?: boolean | string) => {
  let safeExpanded = expanded;

  if (typeof safeExpanded !== "boolean") {
    safeExpanded = button.getAttribute(EXPANDED) === "false";
  }

  button.setAttribute(EXPANDED, safeExpanded.toString());

  const id = button.getAttribute(CONTROLS);
  const controls = id ? document.getElementById(id) : undefined;
  if (!controls) {
    throw new Error(`No toggle target found with id: "${id}"`);
  }

  if (safeExpanded) {
    controls.removeAttribute(HIDDEN);
  } else {
    controls.setAttribute(HIDDEN, "");
  }

  return safeExpanded;
};
