import { stopAnimation, updateAnimation } from "./tipAnimation";
import { HIDDEN_CLASS, LOCAL_STORAGE_KEY_HIDE_TIP } from "./constants";

const ID_TIP_CHECKBOX = "tip-checkbox";
const CLASS_TIP_CLOSE_BUTTON = "tip__button";
const CLASS_SHOW_TIP_BUTTON = "header__show-tip";
const CLASS_TIP_CONTAINER = "tip";

const checkboxInput = document.querySelector("#" + ID_TIP_CHECKBOX);
const closeButton = document.querySelector("." + CLASS_TIP_CLOSE_BUTTON);
const showTipBtn = document.querySelector("." + CLASS_SHOW_TIP_BUTTON);
const tipContainer = document.querySelector("." + CLASS_TIP_CONTAINER);

function setTipVisibility(isVisible) {
  if (isVisible) {
    tipContainer.classList.remove(HIDDEN_CLASS);
    updateAnimation();
  } else {
    tipContainer.classList.add(HIDDEN_CLASS);
    stopAnimation();
  }
}

export function showTip() {
  setTipVisibility(true);

  checkboxInput.checked =
    localStorage.getItem(LOCAL_STORAGE_KEY_HIDE_TIP) === "true";
}

export function hideTip() {
  setTipVisibility(false);
  localStorage.setItem(LOCAL_STORAGE_KEY_HIDE_TIP, checkboxInput.checked);
}

closeButton.addEventListener("click", hideTip);
showTipBtn.addEventListener("click", showTip);
