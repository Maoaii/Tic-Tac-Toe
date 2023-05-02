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
  const updateBoard = (symbol, tile) => {
    const tileRow = tile.getAttribute("data-row");
    const tileCol = tile.getAttribute("data-col");

    tile.textContent = symbol;
    board[tileRow][tileCol] = symbol;
  };

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

  /**
   * @param {*} boardState - current state of the board
   * @returns the possible moves on the current state of the board
   */
  const getPossibleMoves = (boardState = getBoard()) => {
    let freeSpaces = [];

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      for (let colIndex = 0; colIndex < 3; colIndex++) {
        if (boardState[rowIndex][colIndex] === "")
          freeSpaces.push({ row: rowIndex, col: colIndex });
      }
    }

    return freeSpaces;
  };

  const isTileEmpty = (tile) => {
    const tileRow = tile.getAttribute("data-row");
    const tileCol = tile.getAttribute("data-col");

    return tile.textContent === "";
  };

  return {
    display,
    getBoard,
    updateBoard,
    resetBoard,
    disableTiles,
    enableTiles,
    getPossibleMoves,
    isTileEmpty,
  };
};

export { Gameboard };
