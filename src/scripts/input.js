(function () {
  function bindInput(game) {
    document.addEventListener("keydown", (event) => {
      const key = event.key;

      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "x", "X", "p", "P", "r", "R", "Enter"].includes(key)) {
        event.preventDefault();
      }

      if (key === "Enter") {
        game.start();
        return;
      }

      if (key === "p" || key === "P") {
        game.togglePause();
        return;
      }

      if (key === "r" || key === "R") {
        game.restart();
        return;
      }

      if (!game.isInteractive()) {
        return;
      }

      switch (key) {
        case "ArrowLeft":
          game.move(-1);
          break;
        case "ArrowRight":
          game.move(1);
          break;
        case "ArrowDown":
          game.softDrop();
          break;
        case "ArrowUp":
        case "x":
        case "X":
          game.rotate();
          break;
        case " ":
          game.hardDrop();
          break;
        default:
          break;
      }
    });
  }

  window.Tetris = window.Tetris || {};
  window.Tetris.input = {
    bindInput,
  };
})();
