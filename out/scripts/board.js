(function () {
  const { BOARD_ROWS, BOARD_COLS } = window.Tetris.constants;

  function createEmptyBoard() {
    return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null));
  }

  function isInsideBoard(row, col) {
    return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
  }

  function isValidPosition(board, piece, deltaRow, deltaCol, matrixOverride) {
    const matrix = matrixOverride || piece.matrix;
    const nextRow = piece.row + deltaRow;
    const nextCol = piece.col + deltaCol;

    for (let row = 0; row < matrix.length; row += 1) {
      for (let col = 0; col < matrix[row].length; col += 1) {
        if (!matrix[row][col]) {
          continue;
        }

        const boardRow = nextRow + row;
        const boardCol = nextCol + col;

        if (boardCol < 0 || boardCol >= BOARD_COLS || boardRow >= BOARD_ROWS) {
          return false;
        }

        if (boardRow >= 0 && board[boardRow][boardCol]) {
          return false;
        }
      }
    }

    return true;
  }

  function mergePiece(board, piece) {
    const nextBoard = board.map((row) => row.slice());

    for (let row = 0; row < piece.matrix.length; row += 1) {
      for (let col = 0; col < piece.matrix[row].length; col += 1) {
        if (!piece.matrix[row][col]) {
          continue;
        }

        const boardRow = piece.row + row;
        const boardCol = piece.col + col;

        if (isInsideBoard(boardRow, boardCol)) {
          nextBoard[boardRow][boardCol] = piece.type;
        }
      }
    }

    return nextBoard;
  }

  function clearCompletedLines(board) {
    const remaining = board.filter((row) => row.some((cell) => cell === null));
    const clearedLines = BOARD_ROWS - remaining.length;

    while (remaining.length < BOARD_ROWS) {
      remaining.unshift(Array(BOARD_COLS).fill(null));
    }

    return {
      board: remaining,
      clearedLines,
    };
  }

  window.Tetris = window.Tetris || {};
  window.Tetris.board = {
    createEmptyBoard,
    isValidPosition,
    mergePiece,
    clearCompletedLines,
  };
})();
