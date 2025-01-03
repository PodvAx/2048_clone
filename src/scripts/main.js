import { Game } from "./gameLogic.js";
import { updateGrid } from "./animation.js";

const game = new Game();
const tileContainer = document.querySelector(".tile-container");
const scoreDisplay = document.querySelector(".game-score");
const startButton = document.querySelector(".start");

const render = () => {
  updateGrid(game, tileContainer);
  scoreDisplay.textContent = game.score;

  if (game.win) {
    document.querySelector(".message-win").classList.remove("hidden");
  } else if (game.lose) {
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

document.addEventListener("keydown", handleKeyPress);

startButton.addEventListener("click", () => {
  document.querySelector(".message-win").classList.add("hidden");
  document.querySelector(".message-lose").classList.add("hidden");
  document.querySelector(".message-start").classList.add("hidden");
  tileContainer.innerHTML = "";
  game.resetGame();
  render();
});

// Initialize the game
render();
