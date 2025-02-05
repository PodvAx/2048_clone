import { HIDDEN_CLASS } from "./constants";

const headerButton = document.querySelector(".header__button");
const confirmContainer = document.querySelector(".confirm");
const confirmText = document.querySelector(".confirm__text");
const confirmYesButton = document.querySelector(".confirm__button--yes");
const confirmNoButton = document.querySelector(".confirm__button--no");
const confirmWinMessage = document.querySelector(
  ".confirm__message.message--win",
);
const confirmLoseMessage = document.querySelector(
  ".confirm__message.message--lose",
);

const SHOWED_CONFIRM_CLASS = "confirm--showed";
const DEFAULT_YES_TEXT = "Yes";
const DEFAULT_NO_TEXT = "No";
const ANIMATION_DURATION = 400;

function setMessageVisibility(element, message, isVisible) {
  if (isVisible) {
    element.textContent = message;
    element.classList.remove(HIDDEN_CLASS);
  } else {
    element.classList.add(HIDDEN_CLASS);
  }
}

function setButtonAction(button, action) {
  button.onclick = () => {
    if (action) action();
    hideConfirm();
  };
}

export function showConfirm(data) {
  const {
    text,
    yesText,
    noText,
    onConfirm,
    onReject,
    isWin,
    winMessage,
    isLose,
    loseMessage,
  } = data;

  setMessageVisibility(confirmWinMessage, winMessage, isWin);
  setMessageVisibility(confirmLoseMessage, loseMessage, isLose);

  confirmText.textContent = text;
  confirmYesButton.textContent = yesText || DEFAULT_YES_TEXT;
  confirmNoButton.textContent = noText || DEFAULT_NO_TEXT;

  setButtonAction(confirmYesButton, onConfirm);
  setButtonAction(confirmNoButton, onReject);

  if (!confirmContainer) {
    return;
  }

  confirmContainer.classList.remove(HIDDEN_CLASS);

  requestAnimationFrame(() => {
    confirmContainer.classList.add(SHOWED_CONFIRM_CLASS);
    headerButton.disabled = true;
  });
}

export function hideConfirm() {
  if (!confirmContainer) {
    return;
  }

  setTimeout(() => {
    setMessageVisibility(confirmWinMessage, "", false);
    setMessageVisibility(confirmLoseMessage, "", false);
    confirmContainer.classList.add(HIDDEN_CLASS);
  }, ANIMATION_DURATION);

  requestAnimationFrame(() => {
    confirmContainer.classList.remove(SHOWED_CONFIRM_CLASS);
    headerButton.disabled = false;
  });
}
