(function () {
  function bootstrap() {
    const boardCanvas = document.getElementById("game-canvas");
    const nextCanvas = document.getElementById("next-canvas");
    const boardContext = boardCanvas.getContext("2d");
    const nextContext = nextCanvas.getContext("2d");
    const audio = new window.Tetris.audio.TetrisAudio();

    const dom = {
      score: document.getElementById("score-value"),
      level: document.getElementById("level-value"),
      lines: document.getElementById("lines-value"),
      statusBadge: document.getElementById("status-badge"),
      overlay: document.getElementById("board-overlay"),
      overlayTitle: document.getElementById("overlay-title"),
      overlayMessage: document.getElementById("overlay-message"),
      startButton: document.getElementById("start-button"),
      pauseButton: document.getElementById("pause-button"),
      restartButton: document.getElementById("restart-button"),
    };

    const game = new window.Tetris.game.TetrisGame({
      boardContext,
      nextContext,
      dom,
      audio,
    });

    dom.startButton.addEventListener("click", () => game.start());
    dom.pauseButton.addEventListener("click", () => game.togglePause());
    dom.restartButton.addEventListener("click", () => game.restart());
    window.Tetris.input.bindInput(game);
  }

  window.addEventListener("DOMContentLoaded", bootstrap);
})();
