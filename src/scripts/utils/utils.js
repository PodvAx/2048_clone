export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

export const transpose = (grid) =>
  grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));

export const reverseRows = (grid) => grid.map((row) => row.slice().reverse());

export const deepCopy = (grid) => grid.map((row) => [...row]);

export const throttle = (func, limit) => {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};
