import select from "../../uswds-core/src/js/utils/select";
import behavior from "../../uswds-core/src/js/utils/behavior";
import debounce from "../../uswds-core/src/js/utils/debounce";
import { PREFIX } from "../../uswds-core/src/js/config";

const CHARACTER_COUNT_CLASS = `${PREFIX}-character-count`;
const CHARACTER_COUNT = `.${CHARACTER_COUNT_CLASS}`;
const INPUT = `.${PREFIX}-character-count__field`;
const MESSAGE = `.${PREFIX}-character-count__message`;
const VALIDATION_MESSAGE = "The content is too long.";
const MESSAGE_INVALID_CLASS = `${PREFIX}-character-count__status--invalid`;
const STATUS_MESSAGE_CLASS = `${CHARACTER_COUNT_CLASS}__status`;
const STATUS_MESSAGE_SR_ONLY_CLASS = `${CHARACTER_COUNT_CLASS}__sr-status`;
const STATUS_MESSAGE = `.${STATUS_MESSAGE_CLASS}`;
const STATUS_MESSAGE_SR_ONLY = `.${STATUS_MESSAGE_SR_ONLY_CLASS}`;
const DEFAULT_STATUS_LABEL = `characters allowed`;

/**
 * The elements within the combo box.
 * @typedef {Object} CharacterCountElements
 * @property {HTMLElement} characterCountEl
 * @property {HTMLElement} messageEl
 */
export type CharacterCountElements = {
  characterCountEl: HTMLElement;
  messageEl: HTMLElement;
};

/**
 * Returns the root and message element for an character count input
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
 * @returns {CharacterCountElements} elements The root and message element.
 */
export const getCharacterCountElements = (
  inputEl: HTMLElement
): CharacterCountElements => {
  const characterCountEl = inputEl.closest<HTMLElement>(CHARACTER_COUNT);

  if (!characterCountEl) {
    throw new Error(`${INPUT} is missing outer ${CHARACTER_COUNT}`);
  }

  const messageEl = characterCountEl.querySelector<HTMLElement>(MESSAGE);

  if (!messageEl) {
    throw new Error(`${CHARACTER_COUNT} is missing inner ${MESSAGE}`);
  }

  return { characterCountEl, messageEl };
};

/**
 * Move maxlength attribute to a data attribute on usa-character-count
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
 */
export const setDataLength = (inputEl: HTMLElement) => {
  const { characterCountEl } = getCharacterCountElements(inputEl);

  const maxlength = inputEl.getAttribute("maxlength");

  if (!maxlength) return;

  inputEl.removeAttribute("maxlength");
  characterCountEl.setAttribute("data-maxlength", maxlength);
};

/**
 * Create and append status messages for visual and screen readers
 *
 * @param {HTMLDivElement} characterCountEl - Div with `.usa-character-count` class
 * @description  Create two status messages for number of characters left;
 * one visual status and another for screen readers
 */
export const createStatusMessages = (characterCountEl: HTMLElement) => {
  const statusMessage = document.createElement("div");
  const srStatusMessage = document.createElement("div");
  const maxLength = characterCountEl.dataset.maxlength;
  const defaultMessage = `${maxLength} ${DEFAULT_STATUS_LABEL}`;

  statusMessage.classList.add(`${STATUS_MESSAGE_CLASS}`, "usa-hint");
  srStatusMessage.classList.add(
    `${STATUS_MESSAGE_SR_ONLY_CLASS}`,
    "usa-sr-only"
  );

  statusMessage.setAttribute("aria-hidden", "true");
  srStatusMessage.setAttribute("aria-live", "polite");

  statusMessage.textContent = defaultMessage;
  srStatusMessage.textContent = defaultMessage;

  characterCountEl.append(statusMessage, srStatusMessage);
};

/**
 * Returns message with how many characters are left
 *
 * @param {number} currentLength - The number of characters used
 * @param {number} maxLength - The total number of characters allowed
 * @returns {string} A string description of how many characters are left
 */
export const getCountMessage = (
  currentLength: number,
  maxLength: number
): string => {
  let newMessage = "";

  if (currentLength === 0) {
    newMessage = `${maxLength} ${DEFAULT_STATUS_LABEL}`;
  } else {
    const difference = Math.abs(maxLength - currentLength);
    const characters = `character${difference === 1 ? "" : "s"}`;
    const guidance = currentLength > maxLength ? "over limit" : "left";

    newMessage = `${difference} ${characters} ${guidance}`;
  }

  return newMessage;
};

/**
 * Updates the character count status for screen readers after a 1000ms delay.
 *
 * @param {HTMLElement} msgEl - The screen reader status message element
 * @param {string} statusMessage - A string of the current character status
 */
export const srUpdateStatus = debounce(
  (msgEl: HTMLElement, statusMessage: string) => {
    const srStatusMessage = msgEl;
    srStatusMessage.textContent = statusMessage;
  },
  1000
);

/**
 * Update the character count component
 *
 * @description On input, it will update visual status, screenreader
 * status and update input validation (if over character length)
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
 */
export const updateCountMessage = (
  inputEl: HTMLInputElement | HTMLTextAreaElement
) => {
  const { characterCountEl } = getCharacterCountElements(inputEl);
  const currentLength = inputEl.value.length;
  const maxLength = parseInt(
    characterCountEl.getAttribute("data-maxlength")!,
    10
  );
  const statusMessage = characterCountEl.querySelector(STATUS_MESSAGE);
  const srStatusMessage = characterCountEl.querySelector(
    STATUS_MESSAGE_SR_ONLY
  );
  const currentStatusMessage = getCountMessage(currentLength, maxLength);

  if (!maxLength) return;

  const isOverLimit = currentLength > 0 && currentLength > maxLength;

  statusMessage!.textContent = currentStatusMessage;
  srUpdateStatus(srStatusMessage, currentStatusMessage);

  if (isOverLimit && !inputEl.validationMessage) {
    inputEl.setCustomValidity(VALIDATION_MESSAGE);
  }

  if (!isOverLimit && inputEl.validationMessage === VALIDATION_MESSAGE) {
    inputEl.setCustomValidity("");
  }

  statusMessage!.classList.toggle(MESSAGE_INVALID_CLASS, isOverLimit);
};

/**
 * Initialize component
 *
 * @description On init this function will create elements and update any
 * attributes so it can tell the user how many characters are left.
 * @param  {HTMLInputElement|HTMLTextAreaElement} inputEl the components input
 */
export const enhanceCharacterCount = (
  inputEl: HTMLInputElement | HTMLTextAreaElement
) => {
  const { characterCountEl, messageEl } = getCharacterCountElements(inputEl);

  // Hide hint and remove aria-live for backwards compatibility
  messageEl.classList.add("usa-sr-only");
  messageEl.removeAttribute("aria-live");

  setDataLength(inputEl);
  createStatusMessages(characterCountEl);
};

const characterCount = behavior(
  {
    input: {
      [INPUT](this: HTMLInputElement | HTMLTextAreaElement) {
        updateCountMessage(this);
      },
    },
  },
  {
    init(root: HTMLInputElement | HTMLTextAreaElement) {
      select(INPUT, root).forEach((input) => enhanceCharacterCount(input));
    },
    MESSAGE_INVALID_CLASS,
    VALIDATION_MESSAGE,
    STATUS_MESSAGE_CLASS,
    STATUS_MESSAGE_SR_ONLY_CLASS,
    DEFAULT_STATUS_LABEL,
    createStatusMessages,
    getCountMessage,
    updateCountMessage,
  }
);

export default characterCount;
