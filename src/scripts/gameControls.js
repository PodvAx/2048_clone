import { Game } from "./gameLogic.js";
import { updateGrid } from "./gridAnimation.js";
import { showTip } from "./tip.js";
import { showConfirm } from "./confirm.js";
import { startConfetti, stopConfetti } from "./confetti.js";
import {
  HIDDEN_CLASS,
  LOCAL_STORAGE_KEY_HIDE_TIP,
  loseConfirmData,
  winConfirmData,
} from "./constants.js";

const CLASS_TILE_CONTAINER = "tile-container";
const CLASS_SCORE = "game-score";
const CLASS_BEST_SCORE = "game-best-score";
const CLASS_BODY_GAME_OVER = "body--game-over";
const CLASS_GAME_MESSAGE_CONTAINER = "game__message-container";
const CLASS_MESSAGE_START = "message--start";
const CLASS_RESTART_BUTTON = "header__button--restart";
const CLASS_START_BUTTON = "header__button--start";

const RESTART_BUTTON_TEXT = "Restart";

const CONFETTI_ANIMATION_DURATION = 50 * 1000;
const LOSE_APEARENCE_DELAY = 1000;

export const game = new Game();

const tileContainer = document.querySelector("." + CLASS_TILE_CONTAINER);
const scoreDisplay = document.querySelector("." + CLASS_SCORE);
const bestScoreDisplay = document.querySelector("." + CLASS_BEST_SCORE);
const startButton = document.querySelector("." + CLASS_START_BUTTON);

export const render = () => {
  requestAnimationFrame(() => updateGrid(game, tileContainer));
  scoreDisplay.textContent = game.score;
  bestScoreDisplay.textContent = game.bestScore;

  if (game.win) handleWin();
  else if (game.lose) handleLose();
};

const handleWin = () => {
  startConfetti();

  showConfirm({
    ...winConfirmData,
    onConfirm: () => {
      clearTimeout(timerId);
      stopConfetti();
      game.win = false;
      game.hasContinued = true;
      render();
    },
    onReject: () => {
      clearTimeout(timerId);
      stopConfetti();
      restartGame();
    },
  });

  const timerId = setTimeout(stopConfetti, CONFETTI_ANIMATION_DURATION);
};

const handleLose = () => {
  document.body.classList.add(CLASS_BODY_GAME_OVER);

  setTimeout(() => {
    requestAnimationFrame(() => {
      showConfirm({
        ...loseConfirmData,
        onConfirm: () => {
          document.body.classList.remove(CLASS_BODY_GAME_OVER);
          restartGame();
        },
        onReject: () => {
          document.body.classList.remove(CLASS_BODY_GAME_OVER);
        },
      });
    });
  }, LOSE_APEARENCE_DELAY);
};

export const startGame = () => {
  document
    .querySelector("." + CLASS_GAME_MESSAGE_CONTAINER)
    .classList.add(HIDDEN_CLASS);
  document.querySelector("." + CLASS_MESSAGE_START).classList.add(HIDDEN_CLASS);
  tileContainer.innerHTML = "";

  if (localStorage.getItem(LOCAL_STORAGE_KEY_HIDE_TIP) !== "true") {
    showTip();
  }

  game.resetGame();
  render();
  startButton.textContent = RESTART_BUTTON_TEXT;
  startButton.classList.add(CLASS_RESTART_BUTTON);
};

export const restartGame = () => startGame();
