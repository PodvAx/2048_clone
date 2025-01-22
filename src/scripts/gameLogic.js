import { GAME_SIZE } from "./utils/constants.js";
import { randomInt, transpose, reverseRows, deepCopy } from "./utils/utils.js";

export class Game {
  constructor(size = GAME_SIZE) {
    this.size = size;
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.win = false;
    this.lose = false;
    this.newTiles = [];
    this.movesAndMerges = [];
  }

  createEmptyGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  spawnTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[randomInt(0, emptyCells.length)];

      this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;

      this.newTiles.push({ row, col });
    }
  }

  getEmptyCells() {
    const emptyCells = [];

    this.grid.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) emptyCells.push({ row: rowIndex, col: colIndex });
      });
    });

    return emptyCells;
  }

  transformGrid(direction, reverse = false) {
    const transposeAndReverse = (grid) => reverseRows(transpose(grid));
    const reverseAndTranspose = (grid) => transpose(reverseRows(grid));

    switch (direction) {
      case "up":
        this.grid = transpose(this.grid);
        break;
      case "down":
        this.grid = reverse
          ? reverseAndTranspose(this.grid)
          : transposeAndReverse(this.grid);
        break;
      case "right":
        this.grid = reverseRows(this.grid);
        break;
    }
  }

  move(direction, tileContainer) {
    const originalGrid = deepCopy(this.grid);

    this.newTiles = [];
    this.movesAndMerges = [];

    this.transformGrid(direction);

    for (let row = 0; row < this.size; row++) {
      const { result, moves } = this.slideAndMerge(
        this.grid[row],
        row,
        direction,
      );

      this.grid[row] = result;
      if (moves.length > 0) this.movesAndMerges.push(...moves);
    }

    this.transformGrid(direction, true);

    if (JSON.stringify(originalGrid) !== JSON.stringify(this.grid)) {
      this.spawnTile();
      this.checkGameState();
    }
  }

  slideAndMerge(row, rowIndex, direction) {
    const moves = [];
    const result = Array(row.length).fill(0);
    const occupiedPositions = new Array(row.length).fill(false);
    let targetIndex = 0;

    const addMove = ({ fromCol, toCol, fromRow, toRow, value, isMerged }) => {
      if (fromCol === toCol && fromRow === toRow) return;
      moves.push({ fromCol, toCol, fromRow, toRow, value, isMerged });
    };

    const getCoordinates = (i, tIndex) => {
      let fromCol, toCol, fromRow, toRow;

      switch (direction) {
        case "left":
          fromCol = i;
          toCol = tIndex;
          fromRow = rowIndex;
          toRow = rowIndex;
          break;
        case "right":
          fromCol = Math.abs(i - (this.size - 1));
          toCol = Math.abs(tIndex - (this.size - 1));
          fromRow = rowIndex;
          toRow = rowIndex;
          break;
        case "up":
          fromCol = rowIndex;
          toCol = rowIndex;
          fromRow = i;
          toRow = tIndex;
          break;
        case "down":
          fromCol = rowIndex;
          toCol = rowIndex;
          fromRow = Math.abs(i - (this.size - 1));
          toRow = Math.abs(tIndex - (this.size - 1));
          break;
      }

      return { fromCol, toCol, fromRow, toRow };
    };

    for (let i = 0; i < row.length; i++) {
      if (row[i] === 0) continue;

      if (result[targetIndex] === 0) {
        result[targetIndex] = row[i];

        const { fromCol, toCol, fromRow, toRow } = getCoordinates(
          i,
          targetIndex,
        );

        addMove({
          fromCol,
          toCol,
          fromRow,
          toRow,
          value: row[i],
          isMerged: false,
        });
      } else if (
        result[targetIndex] === row[i] &&
        !occupiedPositions[targetIndex]
      ) {
        result[targetIndex] *= 2;
        this.score += result[targetIndex];
        occupiedPositions[targetIndex] = true;

        const { fromCol, toCol, fromRow, toRow } = getCoordinates(
          i,
          targetIndex,
        );

        addMove({
          fromCol,
          toCol,
          fromRow,
          toRow,
          value: row[i],
          isMerged: true,
        });
        targetIndex++;
      } else {
        targetIndex++;
        result[targetIndex] = row[i];

        const { fromCol, toCol, fromRow, toRow } = getCoordinates(
          i,
          targetIndex,
        );

        addMove({
          fromCol,
          toCol,
          fromRow,
          toRow,
          value: row[i],
          isMerged: false,
        });
      }
    }

    return { result, moves };
  }

  checkGameState() {
    if (this.grid.flat().includes(2048)) this.win = true;

    const movesAvailable = () => {
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          if (this.grid[row][col] === 0) return true;
          if (
            col < this.size - 1 &&
            this.grid[row][col] === this.grid[row][col + 1]
          )
            return true;
          if (
            row < this.size - 1 &&
            this.grid[row][col] === this.grid[row + 1][col]
          )
            return true;
        }
      }

      return false;
    };

    if (!movesAvailable()) this.lose = true;
  }

  resetGame() {
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.win = false;
    this.lose = false;
    this.spawnTile();
    this.spawnTile();
  }
}
