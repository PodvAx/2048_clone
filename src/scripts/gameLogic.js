import { randomInt, transpose, reverseRows, deepCopy } from "./utils.js";

/**
 * Core game logic for 2048.
 */
export class Game {
  constructor(size = 4) {
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
    const emptyCells = [];

    this.grid.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) emptyCells.push({ row: rowIndex, col: colIndex });
      });
    });

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[randomInt(0, emptyCells.length)];

      this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;

      this.newTiles.push({ row, col });
    }
  }

  move(direction, tileContainer) {
    const originalGrid = deepCopy(this.grid);

    this.newTiles = [];

    if (direction === "up") this.grid = transpose(this.grid);
    if (direction === "down") this.grid = reverseRows(transpose(this.grid));
    if (direction === "right") this.grid = reverseRows(this.grid);

    for (let row = 0; row < this.size; row++) {
      const { result, moves } = this.slideAndMerge(
        this.grid[row],
        row,
        tileContainer,
        direction,
      );

      this.grid[row] = result;
      if (moves.length > 0) this.movesAndMerges.push(...moves);
    }

    if (direction === "up") this.grid = transpose(this.grid);
    if (direction === "down") this.grid = transpose(reverseRows(this.grid));
    if (direction === "right") this.grid = reverseRows(this.grid);

    if (JSON.stringify(originalGrid) !== JSON.stringify(this.grid)) {
      this.spawnTile();
      this.checkGameState();
    }
  }

  calculateMoves(row, direction, rowIndex) {
    const moves = [];
    const result = Array(row.length).fill(0);
    const occupiedPositions = new Array(row.length).fill(false);

    let targetIndex = 0; // Позиція, куди можна зсунути плитку

    const addMove = ({ fromCol, toCol, fromRow, toRow, value, isMerged }) => {
      if (fromCol === toCol && fromRow === toRow) return;
      moves.push({ fromCol, toCol, fromRow, toRow, value, isMerged });
    };

    // const addMerge = (rowI, colIndex, val) => {
    //   merges.push({ row: rowI, col: colIndex, value: val });
    // };

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
      if (row[i] === 0) continue; // Пропускаємо нулі

      if (result[targetIndex] === 0) {
        // Позиція порожня
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
        // Значення збігаються, об'єднуємо плитки
        result[targetIndex] *= 2;
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
        targetIndex++; // Наступна позиція
      } else {
        // Значення різні, рухаємо до наступної доступної позиції
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

    return moves;
  }

  slideAndMerge(row, rowIndex, tileContainer, direction) {
    const filteredRow = row.filter((val) => val !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        this.score += filteredRow[i];
        filteredRow[i + 1] = 0;
      }
    }

    const mergedRow = filteredRow.filter((val) => val !== 0);
    const result = mergedRow.concat(
      Array(this.size - mergedRow.length).fill(0),
    );

    const moves = this.calculateMoves(row, direction, rowIndex);

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
