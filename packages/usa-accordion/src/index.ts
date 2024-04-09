import select from "../../uswds-core/src/js/utils/select";
import behavior from "../../uswds-core/src/js/utils/behavior";
import toggle from "../../uswds-core/src/js/utils/toggle";
import isElementInViewport from "../../uswds-core/src/js/utils/is-in-viewport";
import { CLICK } from "../../uswds-core/src/js/events";
import { PREFIX } from "../../uswds-core/src/js/config";

const ACCORDION = `.${PREFIX}-accordion, .${PREFIX}-accordion--bordered`;
const BANNER_BUTTON = `.${PREFIX}-banner__button`;
const BUTTON = `.${PREFIX}-accordion__button[aria-controls]:not(${BANNER_BUTTON})`;
const EXPANDED = "aria-expanded";
const MULTISELECTABLE = "data-allow-multiple";

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */
const getAccordionButtons = (accordion: HTMLElement): HTMLButtonElement[] => {
  const buttons = select<HTMLButtonElement>(BUTTON, accordion);

  return buttons.filter((button) => button.closest(ACCORDION) === accordion);
};

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
const toggleButton = (
  button: HTMLButtonElement,
  expanded?: boolean
): boolean => {
  const accordion = button.closest<HTMLElement>(ACCORDION);
  let safeExpanded = expanded;

  if (!accordion) {
    throw new Error(`${BUTTON} is missing outer ${ACCORDION}`);
  }

  safeExpanded = toggle(button, expanded);

  // XXX multiselectable is opt-in, to preserve legacy behavior
  const multiselectable = accordion.hasAttribute(MULTISELECTABLE);

  if (safeExpanded && !multiselectable) {
    getAccordionButtons(accordion).forEach((other) => {
      if (other !== button) {
        return toggle(other, false);
      }
    });
  }

  return false;
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */
const showButton = (button: HTMLButtonElement) => toggleButton(button, true);

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */
const hideButton = (button: HTMLButtonElement) => toggleButton(button, false);

const accordion = behavior(
  {
    [CLICK]: {
      [BUTTON](this: HTMLButtonElement) {
        toggleButton(this);

        if (this.getAttribute(EXPANDED) === "true") {
          // We were just expanded, but if another accordion was also just
          // collapsed, we may no longer be in the viewport. This ensures
          // that we are still visible, so the user isn't confused.
          if (!isElementInViewport(this)) this.scrollIntoView();
        }
      },
    },
  },
  {
    init(root: HTMLElement) {
      select<HTMLButtonElement>(BUTTON, root).forEach((button) => {
        const expanded = button.getAttribute(EXPANDED) === "true";
        toggleButton(button, expanded);
      });
    },
    ACCORDION,
    BUTTON,
    show: showButton,
    hide: hideButton,
    toggle: toggleButton,
    getButtons: getAccordionButtons,
  }
);

export default accordion;
