import behavior from "../../uswds-core/src/js/utils/behavior";
import select from "../../uswds-core/src/js/utils/select";
import { CLICK } from "../../uswds-core/src/js/events";
import { PREFIX } from "../../uswds-core/src/js/config";
import toggle from "../../uswds-core/src/js/utils/toggle";

const HEADER = `.${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;
const BANNER_BUTTON = `${HEADER} [aria-controls]`;

/**
 * Toggle Banner display and class.
 * @param {Event} event
 */
const toggleBanner = function toggleEl(this: HTMLElement, event: Event) {
  event.preventDefault();
  const trigger = (event.target as HTMLElement).closest(BANNER_BUTTON)!;

  toggle(trigger);
  this.closest(HEADER)?.classList.toggle(EXPANDED_CLASS);
};

export default behavior(
  {
    [CLICK]: {
      [BANNER_BUTTON]: toggleBanner,
    },
  },
  {
    init(root: HTMLElement) {
      select(BANNER_BUTTON, root).forEach((button: HTMLElement) => {
        const expanded = button.getAttribute(EXPANDED_CLASS) === "true";
        toggle(button, expanded);
      });
    },
  }
);
