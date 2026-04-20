(function () {
  const SHAPES = {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    O: [
      [1, 1],
      [1, 1],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  };

  function cloneMatrix(matrix) {
    return matrix.map((row) => row.slice());
  }

  function rotateMatrix(matrix) {
    const size = matrix.length;
    const rotated = Array.from({ length: size }, () => Array(size).fill(0));

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        rotated[col][size - 1 - row] = matrix[row][col];
      }
    }

    return rotated;
  }

  function createBag() {
    const bag = Object.keys(SHAPES);

    for (let index = bag.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const temp = bag[index];
      bag[index] = bag[swapIndex];
      bag[swapIndex] = temp;
    }

    return bag;
  }

  function createPiece(type) {
    return {
      type,
      matrix: cloneMatrix(SHAPES[type]),
      row: 0,
      col: 0,
    };
  }

  window.Tetris = window.Tetris || {};
  window.Tetris.pieces = {
    SHAPES,
    rotateMatrix,
    createBag,
    createPiece,
  };
})();
