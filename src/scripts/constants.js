(function () {
  const BOARD_ROWS = 20;
  const BOARD_COLS = 10;
  const CELL_SIZE = 30;
  const PREVIEW_CELL_SIZE = 28;
  const LINES_PER_LEVEL = 10;
  const INITIAL_DROP_INTERVAL = 700;
  const MIN_DROP_INTERVAL = 120;
  const SOFT_DROP_INTERVAL = 45;
  const SCORE_TABLE = {
    1: 100,
    2: 300,
    3: 500,
    4: 800,
  };

  const COLORS = {
    I: "#41d9d2",
    O: "#ffd166",
    T: "#b388eb",
    S: "#7bdc65",
    Z: "#ff6b6b",
    J: "#5794ff",
    L: "#ff9f43",
    GHOST: "rgba(255, 255, 255, 0.16)",
    GRID: "rgba(255, 255, 255, 0.08)",
    BOARD_BG: "#08131a",
    LOCKED_STROKE: "rgba(255, 255, 255, 0.18)",
  };

  window.Tetris = window.Tetris || {};
  window.Tetris.constants = {
    BOARD_ROWS,
    BOARD_COLS,
    CELL_SIZE,
    PREVIEW_CELL_SIZE,
    LINES_PER_LEVEL,
    INITIAL_DROP_INTERVAL,
    MIN_DROP_INTERVAL,
    SOFT_DROP_INTERVAL,
    SCORE_TABLE,
    COLORS,
  };
})();
