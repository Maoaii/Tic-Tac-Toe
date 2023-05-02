const gameContainer = document.getElementById("game-container");

const Gameboard = () => {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  /**
   * Displays the current board
   */
  const display = () => {
    let rowIndex = 0;

    board.forEach((row) => {
      let colIndex = 0;

      row.forEach((tile) => {
        const tileElement = document.createElement("button");

        tileElement.classList.add("tile");

        tileElement.setAttribute("data-row", rowIndex);
        tileElement.setAttribute("data-col", colIndex);

        tileElement.textContent = tile;

        gameContainer.appendChild(tileElement);

        colIndex++;
      });

      rowIndex++;
    });
  };

  /**
   * @returns the current board
   */
  const getBoard = () => [...board];

  /**
   * @param {*} row - row of the tile to change
   * @param {*} col - columns of the tile to change
   * @param {*} symbol - symbol to change to
   * @returns the new board
   */
  const changeTile = (row, col, symbol) => (board[row][col] = symbol);

  /**
   * Resets the current board
   */
  const resetBoard = () => {
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
      tile.textContent = "";
    });
  };

  /**
   * Disables the board tiles from being clicked
   */
  const disableTiles = () => {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
      tile.disabled = true;
      tile.classList.add("disabled");
    });
  };

  /**
   * Enables the board tiles to be clicked
   */
  const enableTiles = () => {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
      tile.disabled = false;
      tile.classList.remove("disabled");
    });
  };

  return {
    display,
    getBoard,
    changeTile,
    resetBoard,
    disableTiles,
    enableTiles,
  };
};

export { Gameboard };
