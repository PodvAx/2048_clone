import { GAME_SIZE } from "./utils/constants";

export function buildField() {
  const field = document.querySelector(".field");

  for (let i = 0; i < GAME_SIZE * GAME_SIZE; i++) {
    const cell = document.createElement("div");

    cell.classList.add("field__cell");
    field.appendChild(cell);
  }
}
