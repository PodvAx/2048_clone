export const addSwipeControls = (game, render) => {
  const tileContainer = document.querySelector(".tile-container");
  let startX = 0;
  let startY = 0;

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

    // Визначення напряму свайпу
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 30) {
        game.move("right");
      } else if (diffX < -30) {
        game.move("left");
      }
    } else {
      if (diffY > 30) {
        game.move("down");
      } else if (diffY < -30) {
        game.move("up");
      }
    }

    render();
  });
};
