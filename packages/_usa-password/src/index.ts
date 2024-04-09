import behavior from "../../uswds-core/src/js/utils/behavior";
import toggleFormInput from "../../uswds-core/src/js/utils/toggle-form-input";

import { CLICK } from "../../uswds-core/src/js/events";
import { PREFIX } from "../../uswds-core/src/js/config";

const LINK = `.${PREFIX}-show-password`;

function toggle(this: Element, event: Event) {
  event.preventDefault();
  toggleFormInput(this);
}

export default behavior({
  [CLICK]: {
    [LINK]: toggle,
  },
});
