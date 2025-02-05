export const handleKeyPress = (game, render) => (e) => {
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

export const handleTouchStart = (e) => {
  if (e.touches.length > 1) {
    e.preventDefault(); // Забороняє масштабування при багатоточкових дотиках
  }
};

export const handleGestureStart = (e) => {
  e.preventDefault(); // Забороняє масштабування жестом "щипок"
};
