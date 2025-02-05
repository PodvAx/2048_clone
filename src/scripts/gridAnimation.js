const CLASS_MOVING_TILE = "moving-tile";
const CLASS_MERGE_ANIMATION = "merge-animation";
const CLASS_NEW_TILE = "new-tile";
const CLASS_TILE = "tile";

function updateTilePosition({ tile, toCol, toRow, value, isMerged }) {
  tile.classList.add(CLASS_MOVING_TILE);

  tile.style.setProperty("--x", toCol);
  tile.style.setProperty("--y", toRow);

  tile.dataset.x = toCol;
  tile.dataset.y = toRow;

  if (isMerged) {
    tile.textContent = value * 2;
    tile.classList.remove(`tile--${value}`);
    tile.classList.add(`tile--${value * 2}`);
    tile.classList.add(CLASS_MERGE_ANIMATION);

    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove(CLASS_MERGE_ANIMATION);
      },
      { once: true },
    );
  }
}

function removeInvalidTiles({ tiles, grid, tileContainer }) {
  tiles.forEach((tile) => {
    const x = parseInt(tile.dataset.x, 10);
    const y = parseInt(tile.dataset.y, 10);

    if (!grid[y] || grid[y][x] !== parseInt(tile.textContent, 10)) {
      tileContainer.removeChild(tile);
    }
  });
}

function createTile({ col, row, value, newTiles }) {
  const tile = document.createElement("div");

  tile.className = `${CLASS_TILE} tile--${value}`;
  tile.textContent = value;

  if (newTiles.some((t) => t.row === row && t.col === col)) {
    tile.classList.add(CLASS_NEW_TILE);
  }

  tile.style.setProperty("--x", col);
  tile.style.setProperty("--y", row);
  tile.dataset.x = col;
  tile.dataset.y = row;

  return tile;
}

function clearTileClasses(tiles) {
  tiles.forEach((tile) => {
    tile.classList.remove(
      CLASS_NEW_TILE,
      CLASS_MOVING_TILE,
      CLASS_MERGE_ANIMATION,
    );
  });
}

export const updateGrid = (game, tileContainer) => {
  const { size, grid, newTiles, movesAndMerges } = game;

  const tiles = tileContainer.querySelectorAll("." + CLASS_TILE);

  clearTileClasses(tiles);

  movesAndMerges.forEach(
    ({ fromCol, fromRow, toCol, toRow, value, isMerged }) => {
      const tile = tileContainer.querySelector(
        `.tile[data-x="${fromCol}"][data-y="${fromRow}"]`,
      );

      if (tile) {
        updateTilePosition({ tile, toCol, toRow, value, isMerged });
      }
    },
  );

  setTimeout(() => {
    removeInvalidTiles({ tiles, grid, tileContainer });

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const value = grid[row][col];

        if (value !== 0) {
          const existingTile = tileContainer.querySelector(
            `.tile[data-x="${col}"][data-y="${row}"]`,
          );

          if (!existingTile) {
            const tile = createTile({ col, row, value, newTiles });

            tileContainer.appendChild(tile);
          }
        }
      }
    }
  }, 100);
};
