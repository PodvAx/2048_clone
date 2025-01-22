import { GAME_SIZE } from "./utils/constants";

export function updateGameLayout() {
  const root = document.documentElement;
  const gameSize = GAME_SIZE; // Кількість плиток у рядку/стовпці
  const headerHeightRatio = 0.3;
  const verticalMarginsRatio = 0.1;
  const horizontalMarginsRatio = 0.1;
  const gapRatio = 0.1; // Відступи між плитками

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Максимально можливий розмір base-unit
  const maxBaseUnitWidth = Math.floor(
    (screenWidth * (1 - horizontalMarginsRatio) * 0.9) / gameSize,
  );
  const maxBaseUnitHeight = Math.floor(
    (screenHeight * (1 - verticalMarginsRatio - headerHeightRatio) * 0.9) /
      gameSize,
  );

  const baseUnit = Math.min(maxBaseUnitWidth, maxBaseUnitHeight);

  const cellGap = Math.floor(baseUnit * gapRatio);
  const borderRadius = Math.floor(baseUnit * 0.1);

  root.style.setProperty("--game-size", gameSize);
  root.style.setProperty("--base-unit", `${baseUnit}px`);
  root.style.setProperty("--cell-gap", `${cellGap}px`);
  root.style.setProperty("--border-radius", `${borderRadius}px`);
}
