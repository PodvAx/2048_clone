export const GAME_SIZE = 4;
export const HIDDEN_CLASS = "hidden";
export const LOCAL_STORAGE_KEY_HIDE_TIP = "hideTip";
export const LOCAL_STORAGE_KEY_BEST_SCORE = "bestScore";

export const winConfirmData = {
  text: "Do you want to continue playing?",
  yesText: "Continue",
  noText: "Restart",
  isWin: true,
  winMessage: "Winner! Congrats! You did it!",
};

export const loseConfirmData = {
  text: "Do you want to try again?",
  yesText: "Restart",
  noText: "Cancel",
  isLose: true,
  loseMessage: "Game Over! You lost!",
};

export const restartConfirmData = {
  text: "Are you sure you want to restart the game?",
};
