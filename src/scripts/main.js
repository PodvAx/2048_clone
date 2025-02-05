import { addSwipeControls } from "./swipeControls.js";
import { updateGameLayout } from "./updateGameLayout.js";
import { buildField } from "./buildField.js";
import { showConfirm } from "./confirm.js";
import { throttle } from "./utils/utils.js";
import { restartConfirmData } from "./constants.js";
import {
  handleGestureStart,
  handleKeyPress,
  handleTouchStart,
} from "./eventHandlers.js";
import { game, render, restartGame, startGame } from "./gameControls.js";

const CLASS_START_BUTTON = "header__button--start";

const startButton = document.querySelector("." + CLASS_START_BUTTON);

startButton.addEventListener("click", () => {
  if (startButton.classList.contains("header__button--restart")) {
    showConfirm({
      ...restartConfirmData,
      onConfirm: () => restartGame(),
    });

    return;
  }

  startGame();
});

document.addEventListener("touchstart", handleTouchStart, { passive: false });
document.addEventListener("gesturestart", handleGestureStart);

document.addEventListener(
  "keydown",
  throttle(handleKeyPress(game, render), 100),
);

window.addEventListener("resize", updateGameLayout);

window.addEventListener("load", () => {
  buildField();
  updateGameLayout();
});

addSwipeControls(game, render);

render();
