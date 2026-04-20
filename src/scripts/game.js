(function () {
  const { constants, pieces, board: boardUtils, renderer } = window.Tetris;
  const {
    BOARD_COLS,
    INITIAL_DROP_INTERVAL,
    LINES_PER_LEVEL,
    MIN_DROP_INTERVAL,
    SCORE_TABLE,
  } = constants;

  class TetrisGame {
    constructor(options) {
      this.boardContext = options.boardContext;
      this.nextContext = options.nextContext;
      this.dom = options.dom;
      this.audio = options.audio;
      this.board = boardUtils.createEmptyBoard();
      this.activePiece = null;
      this.nextPiece = null;
      this.bag = [];
      this.score = 0;
      this.level = 1;
      this.lines = 0;
      this.state = "ready";
      this.lastFrame = 0;
      this.dropAccumulator = 0;
      this.animationFrameId = null;
      this.syncUI();
      this.render();
    }

    refillBagIfNeeded() {
      if (!this.bag.length) {
        this.bag = pieces.createBag();
      }
    }

    pullPiece() {
      this.refillBagIfNeeded();
      return pieces.createPiece(this.bag.shift());
    }

    positionPiece(piece) {
      piece.row = -this.getTopOffset(piece.matrix);
      piece.col = Math.floor((BOARD_COLS - piece.matrix[0].length) / 2);
      return piece;
    }

    getTopOffset(matrix) {
      for (let row = 0; row < matrix.length; row += 1) {
        if (matrix[row].some(Boolean)) {
          return row;
        }
      }
      return 0;
    }

    resetState() {
      this.board = boardUtils.createEmptyBoard();
      this.activePiece = null;
      this.nextPiece = null;
      this.bag = [];
      this.score = 0;
      this.level = 1;
      this.lines = 0;
      this.dropAccumulator = 0;
      this.lastFrame = 0;
    }

    start() {
      this.audio.unlock();

      if (this.state === "running") {
        return;
      }

      if (this.state === "ready" || this.state === "gameover") {
        this.resetState();
        this.nextPiece = this.positionPiece(this.pullPiece());
        this.spawnPiece();
      }

      this.state = "running";
      this.lastFrame = 0;
      this.syncUI();
      this.render();
      this.scheduleLoop();
    }

    restart() {
      this.state = "ready";
      this.cancelLoop();
      this.resetState();
      this.syncUI();
      this.render();
    }

    togglePause() {
      if (this.state === "ready" || this.state === "gameover") {
        return;
      }

      if (this.state === "paused") {
        this.state = "running";
        this.lastFrame = 0;
        this.syncUI();
        this.scheduleLoop();
        return;
      }

      this.state = "paused";
      this.cancelLoop();
      this.syncUI();
      this.render();
    }

    isInteractive() {
      return this.state === "running";
    }

    scheduleLoop() {
      if (this.animationFrameId !== null) {
        return;
      }

      this.animationFrameId = requestAnimationFrame((timestamp) => this.tick(timestamp));
    }

    cancelLoop() {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    tick(timestamp) {
      if (this.state !== "running") {
        this.animationFrameId = null;
        return;
      }

      if (!this.lastFrame) {
        this.lastFrame = timestamp;
      }

      const delta = timestamp - this.lastFrame;
      this.lastFrame = timestamp;
      this.dropAccumulator += delta;

      if (this.dropAccumulator >= this.getDropInterval()) {
        this.dropAccumulator = 0;
        this.stepDown();
      }

      this.render();
      this.animationFrameId = requestAnimationFrame((nextTimestamp) => this.tick(nextTimestamp));
    }

    getDropInterval() {
      const adjusted = INITIAL_DROP_INTERVAL - (this.level - 1) * 55;
      return Math.max(MIN_DROP_INTERVAL, adjusted);
    }

    spawnPiece() {
      const piece = this.nextPiece || this.positionPiece(this.pullPiece());
      this.activePiece = this.positionPiece(piece);
      this.nextPiece = this.positionPiece(this.pullPiece());

      if (!boardUtils.isValidPosition(this.board, this.activePiece, 0, 0)) {
        this.handleGameOver();
      }
    }

    move(direction) {
      if (!boardUtils.isValidPosition(this.board, this.activePiece, 0, direction)) {
        return false;
      }

      this.activePiece.col += direction;
      this.render();
      return true;
    }

    rotate() {
      const rotated = pieces.rotateMatrix(this.activePiece.matrix);
      const kicks = [0, -1, 1, -2, 2];

      for (let index = 0; index < kicks.length; index += 1) {
        const offset = kicks[index];
        if (boardUtils.isValidPosition(this.board, this.activePiece, 0, offset, rotated)) {
          this.activePiece.matrix = rotated;
          this.activePiece.col += offset;
          this.render();
          return true;
        }
      }

      return false;
    }

    softDrop() {
      this.dropAccumulator = 0;
      if (this.stepDown()) {
        this.score += 1;
        this.syncUI();
      }
    }

    hardDrop() {
      let distance = 0;
      while (boardUtils.isValidPosition(this.board, this.activePiece, 1, 0)) {
        this.activePiece.row += 1;
        distance += 1;
      }

      this.score += distance * 2;
      this.lockPiece();
      this.syncUI();
      this.render();
    }

    stepDown() {
      if (boardUtils.isValidPosition(this.board, this.activePiece, 1, 0)) {
        this.activePiece.row += 1;
        return true;
      }

      this.lockPiece();
      return false;
    }

    lockPiece() {
      this.board = boardUtils.mergePiece(this.board, this.activePiece);
      const { board, clearedLines } = boardUtils.clearCompletedLines(this.board);
      this.board = board;

      this.audio.playLockSound({ clearedLines });

      if (clearedLines > 0) {
        this.lines += clearedLines;
        this.score += (SCORE_TABLE[clearedLines] || 0) * this.level;
        this.level = Math.floor(this.lines / LINES_PER_LEVEL) + 1;
      }

      this.spawnPiece();
      this.syncUI();
    }

    handleGameOver() {
      this.state = "gameover";
      this.cancelLoop();
      this.syncUI();
      this.render();
    }

    syncUI() {
      this.dom.score.textContent = String(this.score);
      this.dom.level.textContent = String(this.level);
      this.dom.lines.textContent = String(this.lines);

      const statusMap = {
        ready: {
          badge: "READY",
          title: "Press Start",
          message: "ボタンまたは Enter でゲーム開始",
          overlayVisible: true,
        },
        running: {
          badge: "RUNNING",
          title: "",
          message: "",
          overlayVisible: false,
        },
        paused: {
          badge: "PAUSED",
          title: "Paused",
          message: "P キーまたは Start / Resume で再開",
          overlayVisible: true,
        },
        gameover: {
          badge: "GAME OVER",
          title: "Game Over",
          message: "R キーまたは Restart でリトライ",
          overlayVisible: true,
        },
      };

      const status = statusMap[this.state];
      this.dom.statusBadge.textContent = status.badge;
      this.dom.overlayTitle.textContent = status.title;
      this.dom.overlayMessage.textContent = status.message;
      this.dom.overlay.classList.toggle("visible", status.overlayVisible);
      this.dom.pauseButton.disabled = this.state === "ready" || this.state === "gameover";
    }

    render() {
      renderer.renderBoard(this.boardContext, this.board, this.activePiece, boardUtils);
      renderer.renderNext(this.nextContext, this.nextPiece);
    }
  }

  window.Tetris = window.Tetris || {};
  window.Tetris.game = {
    TetrisGame,
  };
})();
