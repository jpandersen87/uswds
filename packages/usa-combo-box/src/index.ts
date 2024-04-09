import keymap from "receptor/keymap";
import selectOrMatches from "../../uswds-core/src/js/utils/select-or-matches";
import behavior from "../../uswds-core/src/js/utils/behavior";
import Sanitizer from "../../uswds-core/src/js/utils/sanitizer";
import { PREFIX } from "../../uswds-core/src/js/config";
import { CLICK } from "../../uswds-core/src/js/events";

export const COMBO_BOX_CLASS = `${PREFIX}-combo-box`;
export const COMBO_BOX_PRISTINE_CLASS = `${COMBO_BOX_CLASS}--pristine`;
export const SELECT_CLASS = `${COMBO_BOX_CLASS}__select`;
export const INPUT_CLASS = `${COMBO_BOX_CLASS}__input`;
export const CLEAR_INPUT_BUTTON_CLASS = `${COMBO_BOX_CLASS}__clear-input`;
export const CLEAR_INPUT_BUTTON_WRAPPER_CLASS = `${CLEAR_INPUT_BUTTON_CLASS}__wrapper`;
export const INPUT_BUTTON_SEPARATOR_CLASS = `${COMBO_BOX_CLASS}__input-button-separator`;
export const TOGGLE_LIST_BUTTON_CLASS = `${COMBO_BOX_CLASS}__toggle-list`;
export const TOGGLE_LIST_BUTTON_WRAPPER_CLASS = `${TOGGLE_LIST_BUTTON_CLASS}__wrapper`;
export const LIST_CLASS = `${COMBO_BOX_CLASS}__list`;
export const LIST_OPTION_CLASS = `${COMBO_BOX_CLASS}__list-option`;
export const LIST_OPTION_FOCUSED_CLASS = `${LIST_OPTION_CLASS}--focused`;
export const LIST_OPTION_SELECTED_CLASS = `${LIST_OPTION_CLASS}--selected`;
export const STATUS_CLASS = `${COMBO_BOX_CLASS}__status`;

export const COMBO_BOX = `.${COMBO_BOX_CLASS}`;
export const SELECT = `.${SELECT_CLASS}`;
export const INPUT = `.${INPUT_CLASS}`;
export const CLEAR_INPUT_BUTTON = `.${CLEAR_INPUT_BUTTON_CLASS}`;
export const TOGGLE_LIST_BUTTON = `.${TOGGLE_LIST_BUTTON_CLASS}`;
export const LIST = `.${LIST_CLASS}`;
export const LIST_OPTION = `.${LIST_OPTION_CLASS}`;
export const LIST_OPTION_FOCUSED = `.${LIST_OPTION_FOCUSED_CLASS}`;
export const LIST_OPTION_SELECTED = `.${LIST_OPTION_SELECTED_CLASS}`;
export const STATUS = `.${STATUS_CLASS}`;

export const DEFAULT_FILTER = ".*{{query}}.*";

export const noop = () => {};

/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement|HTMLSelectElement} el The element to update
 * @param {string} value The new value of the element
 */
export const changeElementValue = (
  el: HTMLInputElement | HTMLSelectElement,
  value = ""
) => {
  const elementToChange = el;
  elementToChange.value = value;

  const event = new CustomEvent("change", {
    bubbles: true,
    cancelable: true,
    detail: { value },
  });
  elementToChange.dispatchEvent(event);
};

/**
 * The elements within the combo box.
 * @typedef {Object} ComboBoxContext
 * @property {HTMLElement} comboBoxEl
 * @property {HTMLSelectElement} selectEl
 * @property {HTMLInputElement} inputEl
 * @property {HTMLUListElement} listEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLLIElement} focusedOptionEl
 * @property {HTMLLIElement} selectedOptionEl
 * @property {HTMLButtonElement} toggleListBtnEl
 * @property {HTMLButtonElement} clearInputBtnEl
 * @property {boolean} isPristine
 * @property {boolean} disableFiltering
 */
export type ComboBoxContext = {
  comboBoxEl: HTMLElement;
  selectEl: HTMLSelectElement;
  inputEl: HTMLInputElement;
  listEl: HTMLUListElement;
  statusEl: HTMLDivElement;
  focusedOptionEl: HTMLLIElement;
  selectedOptionEl: HTMLLIElement;
  toggleListBtnEl: HTMLButtonElement;
  clearInputBtnEl: HTMLButtonElement;
  isPristine: boolean;
  disableFiltering: boolean;
};

/**
 * Get an object of elements belonging directly to the given
 * combo box component.
 *
 * @param {HTMLElement} el the element within the combo box
 * @returns {ComboBoxContext} elements
 */
export const getComboBoxContext = (el: HTMLElement): ComboBoxContext => {
  const comboBoxEl = el.closest<HTMLElement>(COMBO_BOX);

  if (!comboBoxEl) {
    throw new Error(`Element is missing outer ${COMBO_BOX}`);
  }

  const selectEl = comboBoxEl.querySelector<HTMLSelectElement>(SELECT)!;
  const inputEl = comboBoxEl.querySelector<HTMLInputElement>(INPUT)!;
  const listEl = comboBoxEl.querySelector<HTMLUListElement>(LIST)!;
  const statusEl = comboBoxEl.querySelector<HTMLDivElement>(STATUS)!;
  const focusedOptionEl =
    comboBoxEl.querySelector<HTMLLIElement>(LIST_OPTION_FOCUSED)!;
  const selectedOptionEl =
    comboBoxEl.querySelector<HTMLLIElement>(LIST_OPTION_SELECTED)!;
  const toggleListBtnEl =
    comboBoxEl.querySelector<HTMLButtonElement>(TOGGLE_LIST_BUTTON)!;
  const clearInputBtnEl =
    comboBoxEl.querySelector<HTMLButtonElement>(CLEAR_INPUT_BUTTON)!;

  const isPristine = comboBoxEl.classList.contains(COMBO_BOX_PRISTINE_CLASS);
  const disableFiltering = comboBoxEl.dataset.disableFiltering === "true";

  return {
    comboBoxEl,
    selectEl,
    inputEl,
    listEl,
    statusEl,
    focusedOptionEl,
    selectedOptionEl,
    toggleListBtnEl,
    clearInputBtnEl,
    isPristine,
    disableFiltering,
  };
};

/**
 * Disable the combo-box component
 *
 * @param {HTMLInputElement} el An element within the combo box component
 */
export const disable = (el: HTMLInputElement) => {
  const { inputEl, toggleListBtnEl, clearInputBtnEl } = getComboBoxContext(el);

  clearInputBtnEl.hidden = true;
  clearInputBtnEl.disabled = true;
  toggleListBtnEl.disabled = true;
  inputEl.disabled = true;
};

/**
 * Check for aria-disabled on initialization
 *
 * @param {HTMLInputElement} el An element within the combo box component
 */
export const ariaDisable = (el: HTMLInputElement) => {
  const { inputEl, toggleListBtnEl, clearInputBtnEl } = getComboBoxContext(el);

  clearInputBtnEl.hidden = true;
  clearInputBtnEl.setAttribute("aria-disabled", "true");
  toggleListBtnEl.setAttribute("aria-disabled", "true");
  inputEl.setAttribute("aria-disabled", "true");
};

/**
 * Enable the combo-box component
 *
 * @param {HTMLInputElement} el An element within the combo box component
 */
export const enable = (el: HTMLInputElement) => {
  const { inputEl, toggleListBtnEl, clearInputBtnEl } = getComboBoxContext(el);

  clearInputBtnEl.hidden = false;
  clearInputBtnEl.disabled = false;
  toggleListBtnEl.disabled = false;
  inputEl.disabled = false;
};

/**
 * Enhance a select element into a combo box component.
 *
 * @param {HTMLElement} _comboBoxEl The initial element of the combo box component
 */
export const enhanceComboBox = (_comboBoxEl: HTMLElement) => {
  const comboBoxEl = _comboBoxEl.closest<HTMLInputElement>(COMBO_BOX);

  if (!comboBoxEl || comboBoxEl?.dataset.enhanced) return;

  const selectEl = comboBoxEl.querySelector<HTMLSelectElement>("select");

  if (!selectEl) {
    throw new Error(`${COMBO_BOX} is missing inner select`);
  }

  const selectId = selectEl.id;
  const selectLabel = document.querySelector(`label[for="${selectId}"]`);
  const listId = `${selectId}--list`;
  const listIdLabel = `${selectId}-label`;
  const assistiveHintID = `${selectId}--assistiveHint`;
  const additionalAttributes: { [k: string]: string }[] = [];
  const { defaultValue } = comboBoxEl.dataset;
  const { placeholder } = comboBoxEl.dataset;
  let selectedOption;

  if (placeholder) {
    additionalAttributes.push({ placeholder });
  }

  if (defaultValue) {
    for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
      const optionEl = selectEl.options[i];

      if (optionEl.value === defaultValue) {
        selectedOption = optionEl;
        break;
      }
    }
  }

  /**
   * Throw error if combobox is missing a label or label is missing
   * `for` attribute. Otherwise, set the ID to match the <ul> aria-labelledby
   */
  if (!selectLabel || !selectLabel.matches(`label[for="${selectId}"]`)) {
    throw new Error(
      `${COMBO_BOX} for ${selectId} is either missing a label or a "for" attribute`
    );
  } else {
    selectLabel.setAttribute("id", listIdLabel);
  }

  selectLabel.setAttribute("id", listIdLabel);
  selectEl.setAttribute("aria-hidden", "true");
  selectEl.setAttribute("tabindex", "-1");
  selectEl.classList.add("usa-sr-only", SELECT_CLASS);
  selectEl.id = "";
  selectEl.value = "";

  ["required", "aria-label", "aria-labelledby"].forEach((name) => {
    if (selectEl.hasAttribute(name)) {
      const value = selectEl.getAttribute(name);
      additionalAttributes.push({ [name]: value! });
      selectEl.removeAttribute(name);
    }
  });

  // sanitize doesn't like functions in template literals
  const input = document.createElement("input");
  input.setAttribute("id", selectId);
  input.setAttribute("aria-owns", listId);
  input.setAttribute("aria-controls", listId);
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-describedby", assistiveHintID);
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("autocomplete", "off");
  input.setAttribute("class", INPUT_CLASS);
  input.setAttribute("type", "text");
  input.setAttribute("role", "combobox");
  additionalAttributes.forEach((attr) =>
    Object.keys(attr).forEach((key) => {
      const value = Sanitizer.escapeHTML`${attr[key]!}`;
      input.setAttribute(key, value);
    })
  );

  comboBoxEl.insertAdjacentElement("beforeend", input);

  comboBoxEl.insertAdjacentHTML(
    "beforeend",
    Sanitizer.escapeHTML`
    <span class="${CLEAR_INPUT_BUTTON_WRAPPER_CLASS}" tabindex="-1">
        <button type="button" class="${CLEAR_INPUT_BUTTON_CLASS}" aria-label="Clear the select contents">&nbsp;</button>
      </span>
      <span class="${INPUT_BUTTON_SEPARATOR_CLASS}">&nbsp;</span>
      <span class="${TOGGLE_LIST_BUTTON_WRAPPER_CLASS}" tabindex="-1">
        <button type="button" tabindex="-1" class="${TOGGLE_LIST_BUTTON_CLASS}" aria-label="Toggle the dropdown list">&nbsp;</button>
      </span>
      <ul
        tabindex="-1"
        id="${listId}"
        class="${LIST_CLASS}"
        role="listbox"
        aria-labelledby="${listIdLabel}"
        hidden>
      </ul>
      <div class="${STATUS_CLASS} usa-sr-only" role="status"></div>
      <span id="${assistiveHintID}" class="usa-sr-only">
        When autocomplete results are available use up and down arrows to review and enter to select.
        Touch device users, explore by touch or with swipe gestures.
      </span>`
  );

  if (selectedOption) {
    const { inputEl } = getComboBoxContext(comboBoxEl);
    changeElementValue(selectEl, selectedOption.value);
    changeElementValue(inputEl, selectedOption.text);
    comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
  }

  if (selectEl.disabled) {
    disable(comboBoxEl);
    selectEl.disabled = false;
  }

  if (selectEl.hasAttribute("aria-disabled")) {
    ariaDisable(comboBoxEl);
    selectEl.removeAttribute("aria-disabled");
  }

  comboBoxEl.dataset.enhanced = "true";
};

/**
 * Manage the focused element within the list options when
 * navigating via keyboard.
 *
 * @param {HTMLElement} el An anchor element within the combo box component
 * @param {HTMLElement} nextEl An element within the combo box component
 * @param {Object} options options
 * @param {boolean} options.skipFocus skip focus of highlighted item
 * @param {boolean} options.preventScroll should skip procedure to scroll to element
 */
export const highlightOption = (
  el: HTMLElement,
  nextEl: HTMLElement,
  {
    skipFocus,
    preventScroll,
  }: { skipFocus?: boolean; preventScroll?: boolean } = {}
) => {
  const { inputEl, listEl, focusedOptionEl } = getComboBoxContext(el);

  if (focusedOptionEl) {
    focusedOptionEl.classList.remove(LIST_OPTION_FOCUSED_CLASS);
    focusedOptionEl.setAttribute("tabIndex", "-1");
  }

  if (nextEl) {
    inputEl.setAttribute("aria-activedescendant", nextEl.id);
    nextEl.setAttribute("tabIndex", "0");
    nextEl.classList.add(LIST_OPTION_FOCUSED_CLASS);

    if (!preventScroll) {
      const optionBottom = nextEl.offsetTop + nextEl.offsetHeight;
      const currentBottom = listEl.scrollTop + listEl.offsetHeight;

      if (optionBottom > currentBottom) {
        listEl.scrollTop = optionBottom - listEl.offsetHeight;
      }

      if (nextEl.offsetTop < listEl.scrollTop) {
        listEl.scrollTop = nextEl.offsetTop;
      }
    }

    if (!skipFocus) {
      nextEl.focus({ preventScroll });
    }
  } else {
    inputEl.setAttribute("aria-activedescendant", "");
    inputEl.focus();
  }
};

/**
 * Generate a dynamic regular expression based off of a replaceable and possibly filtered value.
 *
 * @param {string} el An element within the combo box component
 * @param {string} query The value to use in the regular expression
 * @param {object} extras An object of regular expressions to replace and filter the query
 */
export const generateDynamicRegExp = (
  filter: string,
  query = "",
  extras: { [k: string]: string | undefined } = {}
) => {
  const escapeRegExp = (text: string) =>
    text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  let find = filter.replace(/{{(.*?)}}/g, (m, $1) => {
    const key = $1.trim();
    const queryFilter = extras[key];
    if (key !== "query" && queryFilter) {
      const matcher = new RegExp(queryFilter, "i");
      const matches = query.match(matcher);

      if (matches) {
        return escapeRegExp(matches[1]);
      }

      return "";
    }
    return escapeRegExp(query);
  });

  find = `^(?:${find})$`;

  return new RegExp(find, "i");
};

/**
 * Display the option list of a combo box component.
 *
 * @param {HTMLElement} el An element within the combo box component
 */
export const displayList = (el: HTMLElement) => {
  const {
    comboBoxEl,
    selectEl,
    inputEl,
    listEl,
    statusEl,
    isPristine,
    disableFiltering,
  } = getComboBoxContext(el);
  let selectedItemId: string | undefined;
  let firstFoundId: string | undefined;

  const listOptionBaseId = `${listEl.id}--option-`;

  const inputValue = (inputEl.value || "").toLowerCase();
  const filter = comboBoxEl.dataset.filter ?? DEFAULT_FILTER;
  const regex = generateDynamicRegExp(filter, inputValue, comboBoxEl.dataset);

  const options = [];
  for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
    const optionEl = selectEl.options[i];
    const optionId = `${listOptionBaseId}${options.length}`;

    if (
      optionEl.value &&
      (disableFiltering ||
        isPristine ||
        !inputValue ||
        regex.test(optionEl.text))
    ) {
      if (selectEl.value && optionEl.value === selectEl.value) {
        selectedItemId = optionId;
      }

      if (disableFiltering && !firstFoundId && regex.test(optionEl.text)) {
        firstFoundId = optionId;
      }
      options.push(optionEl);
    }
  }

  const numOptions = options.length;
  const optionHtml = options.map((option, index) => {
    const optionId = `${listOptionBaseId}${index}`;
    const classes = [LIST_OPTION_CLASS];
    let tabindex = "-1";
    let ariaSelected = "false";

    if (optionId === selectedItemId) {
      classes.push(LIST_OPTION_SELECTED_CLASS, LIST_OPTION_FOCUSED_CLASS);
      tabindex = "0";
      ariaSelected = "true";
    }

    if (!selectedItemId && index === 0) {
      classes.push(LIST_OPTION_FOCUSED_CLASS);
      tabindex = "0";
    }

    const li = document.createElement("li");

    li.setAttribute("aria-setsize", options.length.toString());
    li.setAttribute("aria-posinset", (index + 1).toString());
    li.setAttribute("aria-selected", ariaSelected);
    li.setAttribute("id", optionId);
    li.setAttribute("class", classes.join(" "));
    li.setAttribute("tabindex", tabindex);
    li.setAttribute("role", "option");
    li.setAttribute("data-value", option.value);
    li.textContent = option.text;

    return li;
  });

  const noResults = document.createElement("li");
  noResults.setAttribute("class", `${LIST_OPTION_CLASS}--no-results`);
  noResults.textContent = "No results found";

  listEl.hidden = false;

  if (numOptions) {
    listEl.innerHTML = "";
    optionHtml.forEach((item) =>
      listEl.insertAdjacentElement("beforeend", item)
    );
  } else {
    listEl.innerHTML = "";
    listEl.insertAdjacentElement("beforeend", noResults);
  }

  inputEl.setAttribute("aria-expanded", "true");

  statusEl.textContent = numOptions
    ? `${numOptions} result${numOptions > 1 ? "s" : ""} available.`
    : "No results.";

  let itemToFocus;

  if (isPristine && selectedItemId) {
    itemToFocus = listEl.querySelector<HTMLElement>(`#${selectedItemId}`);
  } else if (disableFiltering && firstFoundId) {
    itemToFocus = listEl.querySelector<HTMLElement>(`#${firstFoundId}`);
  }

  if (itemToFocus) {
    highlightOption(listEl, itemToFocus, {
      skipFocus: true,
    });
  }
};

/**
 * Hide the option list of a combo box component.
 *
 * @param {HTMLElement} el An element within the combo box component
 */
export const hideList = (el: HTMLElement) => {
  const { inputEl, listEl, statusEl, focusedOptionEl } = getComboBoxContext(el);

  statusEl.innerHTML = "";

  inputEl.setAttribute("aria-expanded", "false");
  inputEl.setAttribute("aria-activedescendant", "");

  if (focusedOptionEl) {
    focusedOptionEl.classList.remove(LIST_OPTION_FOCUSED_CLASS);
  }

  listEl.scrollTop = 0;
  listEl.hidden = true;
};

/**
 * Select an option list of the combo box component.
 *
 * @param {HTMLElement} listOptionEl The list option being selected
 */
export const selectItem = (listOptionEl: HTMLLIElement) => {
  const { comboBoxEl, selectEl, inputEl } = getComboBoxContext(listOptionEl);

  changeElementValue(selectEl, listOptionEl.dataset.value);
  changeElementValue(inputEl, listOptionEl.textContent ?? undefined);
  comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
  hideList(comboBoxEl);
  inputEl.focus();
};

/**
 * Clear the input of the combo box
 *
 * @param {HTMLButtonElement} clearButtonEl The clear input button
 */
export const clearInput = (clearButtonEl: HTMLButtonElement) => {
  const { comboBoxEl, listEl, selectEl, inputEl } =
    getComboBoxContext(clearButtonEl);
  const listShown = !listEl.hidden;

  if (selectEl.value) changeElementValue(selectEl);
  if (inputEl.value) changeElementValue(inputEl);
  comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS);

  if (listShown) displayList(comboBoxEl);
  inputEl.focus();
};

/**
 * Reset the select based off of currently set select value
 *
 * @param {HTMLElement} el An element within the combo box component
 */
export const resetSelection = (el: HTMLElement) => {
  const { comboBoxEl, selectEl, inputEl } = getComboBoxContext(el);

  const selectValue = selectEl.value;
  const inputValue = (inputEl.value || "").toLowerCase();

  if (selectValue) {
    for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
      const optionEl = selectEl.options[i];
      if (optionEl.value === selectValue) {
        if (inputValue !== optionEl.text) {
          changeElementValue(inputEl, optionEl.text);
        }
        comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
        return;
      }
    }
  }

  if (inputValue) {
    changeElementValue(inputEl);
  }
};

/**
 * Select an option list of the combo box component based off of
 * having a current focused list option or
 * having test that completely matches a list option.
 * Otherwise it clears the input and select.
 *
 * @param {HTMLElement} el An element within the combo box component
 */
export const completeSelection = (el: HTMLElement) => {
  const { comboBoxEl, selectEl, inputEl, statusEl } = getComboBoxContext(el);

  statusEl.textContent = "";

  const inputValue = (inputEl.value || "").toLowerCase();

  if (inputValue) {
    for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
      const optionEl = selectEl.options[i];
      if (optionEl.text.toLowerCase() === inputValue) {
        changeElementValue(selectEl, optionEl.value);
        changeElementValue(inputEl, optionEl.text);
        comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
        return;
      }
    }
  }

  resetSelection(comboBoxEl);
};

/**
 * Handle the escape event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
export const handleEscape = (event: KeyboardEvent) => {
  const { comboBoxEl, inputEl } = getComboBoxContext(
    event.target as HTMLElement
  );

  hideList(comboBoxEl);
  resetSelection(comboBoxEl);
  inputEl.focus();
};

/**
 * Handle the down event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
export const handleDownFromInput = (event: KeyboardEvent) => {
  const { comboBoxEl, listEl } = getComboBoxContext(
    event.target as HTMLElement
  );

  if (listEl.hidden) {
    displayList(comboBoxEl);
  }

  const nextOptionEl =
    listEl.querySelector<HTMLLIElement>(LIST_OPTION_FOCUSED) ||
    listEl.querySelector<HTMLLIElement>(LIST_OPTION);

  if (nextOptionEl) {
    highlightOption(comboBoxEl, nextOptionEl);
  }

  event.preventDefault();
};

/**
 * Handle the enter event from an input element within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
export const handleEnterFromInput = (event: KeyboardEvent) => {
  const { comboBoxEl, listEl } = getComboBoxContext(
    event.target as HTMLElement
  );
  const listShown = !listEl.hidden;

  completeSelection(comboBoxEl);

  if (listShown) {
    hideList(comboBoxEl);
  }

  event.preventDefault();
};

/**
 * Handle the down event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
export const handleDownFromListOption = (event: KeyboardEvent) => {
  const focusedOptionEl = event.target as HTMLElement;
  const nextOptionEl = focusedOptionEl.nextElementSibling as HTMLElement;

  if (nextOptionEl) {
    highlightOption(focusedOptionEl, nextOptionEl);
  }

  event.preventDefault();
};

/**
 * Handle the space event from an list option element within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
export const handleSpaceFromListOption = (event: KeyboardEvent) => {
  selectItem(event.target as HTMLLIElement);
  event.preventDefault();
};

/**
 * Handle the enter event from list option within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
export const handleEnterFromListOption = (event: KeyboardEvent) => {
  selectItem(event.target as HTMLLIElement);
  event.preventDefault();
};

/**
 * Handle the up event from list option within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
export const handleUpFromListOption = (event: KeyboardEvent) => {
  const { comboBoxEl, listEl, focusedOptionEl } = getComboBoxContext(
    event.target as HTMLElement
  );
  const nextOptionEl = focusedOptionEl?.previousElementSibling as HTMLElement;
  const listShown = !listEl.hidden;

  highlightOption(comboBoxEl, nextOptionEl);

  if (listShown) {
    event.preventDefault();
  }

  if (!nextOptionEl) {
    hideList(comboBoxEl);
  }
};

/**
 * Select list option on the mouseover event.
 *
 * @param {MouseEvent} event The mouseover event
 * @param {HTMLLIElement} listOptionEl An element within the combo box component
 */
export const handleMouseover = (listOptionEl: HTMLLIElement) => {
  const isCurrentlyFocused = listOptionEl.classList.contains(
    LIST_OPTION_FOCUSED_CLASS
  );

  if (isCurrentlyFocused) return;

  highlightOption(listOptionEl, listOptionEl, {
    preventScroll: true,
  });
};

/**
 * Toggle the list when the button is clicked
 *
 * @param {HTMLElement} el An element within the combo box component
 */
export const toggleList = (el: HTMLElement) => {
  const { comboBoxEl, listEl, inputEl } = getComboBoxContext(el);

  if (listEl.hidden) {
    displayList(comboBoxEl);
  } else {
    hideList(comboBoxEl);
  }

  inputEl.focus();
};

/**
 * Handle click from input
 *
 * @param {HTMLInputElement} el An element within the combo box component
 */
export const handleClickFromInput = (el: HTMLInputElement) => {
  const { comboBoxEl, listEl } = getComboBoxContext(el);

  if (listEl.hidden) {
    displayList(comboBoxEl);
  }
};

const comboBox = behavior(
  {
    [CLICK]: {
      [INPUT](this: HTMLInputElement) {
        if (this.disabled) return;
        handleClickFromInput(this);
      },
      [TOGGLE_LIST_BUTTON](this: HTMLButtonElement) {
        if (this.disabled) return;
        toggleList(this);
      },
      [LIST_OPTION](this: HTMLLIElement) {
        selectItem(this);
      },
      [CLEAR_INPUT_BUTTON](this: HTMLButtonElement) {
        if (this.disabled) return;
        clearInput(this);
      },
    },
    focusout: {
      [COMBO_BOX](this: HTMLElement, event: FocusEvent) {
        if (!this.contains(event.relatedTarget as HTMLElement)) {
          resetSelection(this);
          hideList(this);
        }
      },
    },
    keydown: {
      [COMBO_BOX]: keymap({
        Escape: handleEscape,
      }),
      [INPUT]: keymap({
        Enter: handleEnterFromInput,
        ArrowDown: handleDownFromInput,
        Down: handleDownFromInput,
      }),
      [LIST_OPTION]: keymap({
        ArrowUp: handleUpFromListOption,
        Up: handleUpFromListOption,
        ArrowDown: handleDownFromListOption,
        Down: handleDownFromListOption,
        Enter: handleEnterFromListOption,
        " ": handleSpaceFromListOption,
        "Shift+Tab": noop,
      }),
    },
    input: {
      [INPUT](this: HTMLInputElement) {
        const comboBoxEl = this.closest<HTMLElement>(COMBO_BOX);
        comboBoxEl?.classList.remove(COMBO_BOX_PRISTINE_CLASS);
        displayList(this);
      },
    },
    mouseover: {
      [LIST_OPTION](this: HTMLLIElement) {
        handleMouseover(this);
      },
    },
  },
  {
    init(root: HTMLElement) {
      selectOrMatches(COMBO_BOX, root).forEach((comboBoxEl) => {
        enhanceComboBox(comboBoxEl);
      });
    },
    getComboBoxContext,
    enhanceComboBox,
    generateDynamicRegExp,
    disable,
    enable,
    displayList,
    hideList,
    COMBO_BOX_CLASS,
  }
);

export default comboBox;
