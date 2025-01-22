export const updateGrid = (game, tileContainer) => {
  const { size, grid, newTiles, movesAndMerges } = game;

  // 1. Очистимо класи анімації для всіх плиток, які вже є на полі
  const tiles = tileContainer.querySelectorAll(".tile");

  tiles.forEach((tile) => {
    tile.classList.remove("new-tile", "moving-tile", "merge-animation");
  });

  // 2. Оновлюємо позиції клітинок, які рухаються або об'єднуються
  movesAndMerges.forEach(
    ({ fromCol, fromRow, toCol, toRow, value, isMerged }) => {
      const tile = tileContainer.querySelector(
        `.tile[data-x="${fromCol}"][data-y="${fromRow}"]`,
      );

      if (tile) {
        // Додаємо клас руху
        tile.classList.add("moving-tile");

        // Оновлюємо CSS змінні для позицій клітинки
        tile.style.setProperty("--x", toCol);
        tile.style.setProperty("--y", toRow);

        // Оновлюємо атрибути позиції
        tile.dataset.x = toCol;
        tile.dataset.y = toRow;

        // Якщо клітинка об'єднується, додаємо клас об'єднання
        if (isMerged) {
          tile.textContent = value * 2;
          tile.classList.remove(`tile--${value}`);
          tile.classList.add(`tile--${value * 2}`);
          tile.classList.add("merge-animation");

          tile.addEventListener(
            "animationend",
            () => {
              tile.classList.remove("merge-animation");
            },
            { once: true },
          );
        }
      }
    },
  );

  // 3. Видаляємо всі клітинки, які більше не мають значень
  tiles.forEach((tile) => {
    const x = parseInt(tile.dataset.x, 10);
    const y = parseInt(tile.dataset.y, 10);

    if (!grid[y] || grid[y][x] !== parseInt(tile.textContent, 10)) {
      tileContainer.removeChild(tile);
    }
  });

  // 4. Синхронізація DOM з новими значеннями в grid (об'єднуємо кроки 4 і 5)
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const value = grid[row][col];

      if (value !== 0) {
        const existingTile = tileContainer.querySelector(
          `.tile[data-x="${col}"][data-y="${row}"]`,
        );

        if (!existingTile) {
          // Створюємо нову клітинку, якщо її ще немає
          const tile = document.createElement("div");

          tile.className = `tile tile--${value}`;
          tile.textContent = value;

          // Додаємо клас для нової клітинки
          if (newTiles.some((t) => t.row === row && t.col === col)) {
            tile.classList.add("new-tile");
          }

          // Встановлюємо позиції
          tile.style.setProperty("--x", col);
          tile.style.setProperty("--y", row);

          // Встановлюємо атрибути
          tile.dataset.x = col;
          tile.dataset.y = row;

          tileContainer.appendChild(tile);
        }
      }
    }
  }
};
