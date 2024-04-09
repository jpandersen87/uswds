import keymap from "receptor/keymap";
import behavior from "../../uswds-core/src/js/utils/behavior";

const ANCHOR_BUTTON = `a[class*="usa-button"]`;

const toggleButton = (event: Event) => {
  event.preventDefault();
  (event.target as HTMLElement).click();
};

const anchorButton = behavior({
  keydown: {
    [ANCHOR_BUTTON]: keymap({
      " ": toggleButton,
    }),
  },
});

export default anchorButton;
