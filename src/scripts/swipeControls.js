import { handleTouchMove } from "./eventHandlers";

export const addSwipeControls = (game, render) => {
  const tileContainer = document.querySelector(".tile-container");
  let startX = 0;
  let startY = 0;

  tileContainer.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });

  tileContainer.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];

    startX = touch.clientX;
    startY = touch.clientY;
  });

  tileContainer.addEventListener("touchend", (e) => {
    if (game.win || game.lose) return;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    const swipeThereshold = 30;

    if (
      Math.abs(diffX) < swipeThereshold &&
      Math.abs(diffY) < swipeThereshold
    ) {
      return;
    }

    // Визначення напряму свайпу
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > swipeThereshold) {
        game.move("right");
      } else {
        game.move("left");
      }
    } else {
      if (diffY > swipeThereshold) {
        game.move("down");
      } else {
        game.move("up");
      }
    }

    render();
  });
};
