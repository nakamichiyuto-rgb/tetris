(function () {
  const { BOARD_ROWS, BOARD_COLS, CELL_SIZE, PREVIEW_CELL_SIZE, COLORS } =
    window.Tetris.constants;

  function drawCell(context, x, y, size, color, stroke) {
    context.fillStyle = color;
    context.fillRect(x, y, size, size);
    context.strokeStyle = stroke;
    context.lineWidth = 2;
    context.strokeRect(x + 1, y + 1, size - 2, size - 2);
  }

  function fillGrid(context, width, height, cellSize) {
    context.strokeStyle = COLORS.GRID;
    context.lineWidth = 1;

    for (let x = 0; x <= width; x += cellSize) {
      context.beginPath();
      context.moveTo(x + 0.5, 0);
      context.lineTo(x + 0.5, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += cellSize) {
      context.beginPath();
      context.moveTo(0, y + 0.5);
      context.lineTo(width, y + 0.5);
      context.stroke();
    }
  }

  function getGhostPiece(board, piece, isValidPosition) {
    const ghost = {
      type: piece.type,
      matrix: piece.matrix,
      row: piece.row,
      col: piece.col,
    };

    while (isValidPosition(board, ghost, 1, 0)) {
      ghost.row += 1;
    }

    return ghost;
  }

  function drawMatrix(context, matrix, type, offsetRow, offsetCol, cellSize, stroke) {
    for (let row = 0; row < matrix.length; row += 1) {
      for (let col = 0; col < matrix[row].length; col += 1) {
        if (!matrix[row][col]) {
          continue;
        }

        drawCell(
          context,
          (offsetCol + col) * cellSize,
          (offsetRow + row) * cellSize,
          cellSize,
          COLORS[type],
          stroke || COLORS.LOCKED_STROKE
        );
      }
    }
  }

  function renderBoard(context, board, activePiece, boardUtils) {
    const width = BOARD_COLS * CELL_SIZE;
    const height = BOARD_ROWS * CELL_SIZE;
    context.clearRect(0, 0, width, height);
    context.fillStyle = COLORS.BOARD_BG;
    context.fillRect(0, 0, width, height);
    fillGrid(context, width, height, CELL_SIZE);

    for (let row = 0; row < board.length; row += 1) {
      for (let col = 0; col < board[row].length; col += 1) {
        const type = board[row][col];
        if (!type) {
          continue;
        }

        drawCell(
          context,
          col * CELL_SIZE,
          row * CELL_SIZE,
          CELL_SIZE,
          COLORS[type],
          COLORS.LOCKED_STROKE
        );
      }
    }

    if (!activePiece) {
      return;
    }

    const ghostPiece = getGhostPiece(board, activePiece, boardUtils.isValidPosition);
    for (let row = 0; row < ghostPiece.matrix.length; row += 1) {
      for (let col = 0; col < ghostPiece.matrix[row].length; col += 1) {
        if (!ghostPiece.matrix[row][col]) {
          continue;
        }

        const ghostRow = ghostPiece.row + row;
        const ghostCol = ghostPiece.col + col;
        drawCell(
          context,
          ghostCol * CELL_SIZE,
          ghostRow * CELL_SIZE,
          CELL_SIZE,
          COLORS.GHOST,
          "rgba(255, 255, 255, 0.12)"
        );
      }
    }

    drawMatrix(
      context,
      activePiece.matrix,
      activePiece.type,
      activePiece.row,
      activePiece.col,
      CELL_SIZE
    );
  }

  function renderNext(context, nextPiece) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = COLORS.BOARD_BG;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    if (!nextPiece) {
      return;
    }

    const matrix = nextPiece.matrix;
    const offsetCol = Math.floor((context.canvas.width / PREVIEW_CELL_SIZE - matrix.length) / 2);
    const offsetRow = Math.floor((context.canvas.height / PREVIEW_CELL_SIZE - matrix.length) / 2);

    drawMatrix(
      context,
      matrix,
      nextPiece.type,
      offsetRow,
      offsetCol,
      PREVIEW_CELL_SIZE,
      COLORS.LOCKED_STROKE
    );
  }

  window.Tetris = window.Tetris || {};
  window.Tetris.renderer = {
    renderBoard,
    renderNext,
  };
})();
