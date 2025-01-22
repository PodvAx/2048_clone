import { Game } from "./gameLogic.js";
import { updateGrid } from "./animation.js";
import { addSwipeControls } from "./swipeControls.js";
import { updateGameLayout } from "./updateGameLayout.js";
import { buildField } from "./buildField.js";

const game = new Game();
const tileContainer = document.querySelector(".tile-container");
const scoreDisplay = document.querySelector(".game-score");
const startButton = document.querySelector(".header__button--start");

const render = () => {
  updateGrid(game, tileContainer);
  scoreDisplay.textContent = game.score;

  if (game.win) {
    document.querySelector(".message-container").classList.remove("hidden");
    document.querySelector(".message-win").classList.remove("hidden");
  } else if (game.lose) {
    document.querySelector(".message-container").classList.remove("hidden");
    document.querySelector(".message-lose").classList.remove("hidden");
  }
};

const handleKeyPress = (e) => {
  if (game.win || game.lose) return;

  const directionMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  if (directionMap[e.key]) {
    game.move(directionMap[e.key]);
    render();
  }
};

document.addEventListener(
  "touchstart",
  function (e) {
    if (e.touches.length > 1) {
      e.preventDefault(); // Забороняє масштабування при багатоточкових дотиках
    }
  },
  { passive: false },
); // Пасивний слухач повинен бути відключений для `preventDefault`

document.addEventListener("gesturestart", function (e) {
  e.preventDefault(); // Забороняє масштабування жестом "щипок"
});

document.addEventListener("keydown", handleKeyPress);

startButton.addEventListener("click", () => {
  document.querySelector(".message-container").classList.add("hidden");
  document.querySelector(".message-win").classList.add("hidden");
  document.querySelector(".message-lose").classList.add("hidden");
  document.querySelector(".message-start").classList.add("hidden");
  tileContainer.innerHTML = "";
  game.resetGame();
  render();
});

window.addEventListener("resize", updateGameLayout);

window.addEventListener("load", () => {
  buildField();
  updateGameLayout();
});

addSwipeControls(game, render);

render();
