const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {
        getName,
        getSymbol,
    }
};

const game = (() => {
  const playerOpponent = "player";
  const easyOpponent = "easy";
  const hardOpponent = "hard";
  const unbeatableOpponent = "unbeatable";

  const gameContainer = document.getElementById("game-container");
  const player1 = Player("Player1", "X");
  const player2 = Player("Player2", "O");
  const magicBoard = [
    [2, 7, 6],
    [9, 5, 1],
    [4, 3, 8],
  ];

  let playerSymbol = "X";
  let currentOpponent = "player";
  let currentPlayer = "X";
  let turn = 0;
  let bestMove = null;

  const gameboard = (() => {
    let gameboard = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    const display = () => {
      let rowIndex = 0;

      gameboard.forEach((row) => {
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

    const getBoard = () => gameboard;

    const getRow = (rowIndex) => gameboard[rowIndex];

    const changeTile = (row, col, symbol) => (gameboard[row][col] = symbol);

    const printBoard = () => console.log(gameboard);

    const resetBoard = () =>
      (gameboard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);

    const disableTiles = () => {
      const tiles = document.querySelectorAll(".tile");
      tiles.forEach((tile) => {
        tile.disabled = true;
        tile.classList.toggle("disabled");
      });
    };

    return {
      display,
      getBoard,
      getRow,
      changeTile,
      resetBoard,
      disableTiles,
      printBoard,
    };
  })();

  const displayBoard = () => {
    gameboard.display();

    // Add event listeners to tiles
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => tile.addEventListener("click", playTurn));
  };

  const initGame = () => {
    // Reset game
    resetGame();
  };

  const setupOpponent = (event) => {
    currentOpponent = event.target.value;
  };

  const setupPlayer = (event) => {
    playerSymbol = event.target.value;

    // Add selected styling on clicked button
    event.target.classList.add("selected");

    // Remove selected styling on the other button
    const other =
      playerSymbol === "X"
        ? document.querySelector(".O")
        : document.querySelector(".X");
    other.classList.remove("selected");
  };

  const playTurn = (event) => {
    const tile = event.target;
    const tileRow = tile.getAttribute("data-row");
    const tileCol = tile.getAttribute("data-col");
    let symbol = isPlayer1Turn() ? player1.getSymbol() : player2.getSymbol();

    if (tile.textContent === "") {
      makePlay(symbol, tileRow, tileCol, tile);
      endTurn(tileRow, tileCol);
    }
    if (turn > 0) disableVersusSelection();
  };

  const disableVersusSelection = () => {
    const versus = document.querySelector("#versus");
    versus.classList.add("disabled");
    versus.disabled = true;
  };

  const botTurn = () => {
    let tile;
    switch (currentOpponent) {
      case easyOpponent:
        let randomMove = getRandomMove();

        tile = document.querySelector(
          `button[data-row='${randomMove["row"]}'][data-col='${randomMove["col"]}']`
        );

        // Make a play on the square with that index
        makePlay(
          player2.getSymbol(),
          randomMove["row"],
          randomMove["col"],
          tile
        );
        endTurn(randomMove["row"], randomMove["col"]);

        break;

      case hardOpponent:
        let move;

        if (Math.random() > 0.8) {
          move = getBestMove();
        } else {
          move = getRandomMove();
        }

        tile = document.querySelector(
          `button[data-row='${move["row"]}'][data-col='${move["col"]}']`
        );

        makePlay(player2.getSymbol(), move["row"], move["col"], tile);
        endTurn(move["row"], move["col"]);

        break;

      case unbeatableOpponent:
        let bestMove = getBestMove();

        tile = document.querySelector(
          `button[data-row='${bestMove["row"]}'][data-col='${bestMove["col"]}']`
        );

        makePlay(player2.getSymbol(), bestMove["row"], bestMove["col"], tile);
        endTurn(bestMove["row"], bestMove["col"]);

        break;

      default:
        console.log("botTurn: oopsie!");
        break;
    }
  };

  const getRandomMove = () => {
    // Store index of all free spaces
    let possibleMoves = getPossibleMoves(gameboard.getBoard());

    // Choose a free space randomly
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  };

  const getBestMove = () => {
    let board = gameboard.getBoard();
    let bestScore = Infinity;
    let bestMove;

    getPossibleMoves(board).forEach((move) => {
      board[move["row"]][move["col"]] = "O";

      let score = minimax(board, 0, "X");

      board[move["row"]][move["col"]] = "";

      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    return bestMove;
  };

  const minimax = (boardState, depth, player) => {
    // Check if anyone won
    let result = checkWinner(boardState);
    if (result !== 0 || isTie(boardState)) {
      return result;
    }

    if (player === "O") {
      let bestScore = Infinity;
      let bestMove = {};

      getPossibleMoves(boardState).forEach((move) => {
        boardState[move.row][move.col] = "O";

        let score = minimax(boardState, depth + 1, "X");

        boardState[move.row][move.col] = "";

        if (score < bestScore) {
          bestScore = score;
          bestMove = { row: move.row, col: move.col };
        }
      });

      return bestScore;
    } else {
      let bestScore = -Infinity;
      let bestMove = {};

      getPossibleMoves(boardState).forEach((move) => {
        boardState[move.row][move.col] = "X";

        let score = minimax(boardState, depth + 1, "O");

        boardState[move.row][move.col] = "";

        if (score > bestScore) {
          bestScore = score;
          bestMove = { row: move.row, col: move.col };
        }
      });

      return bestScore;
    }
  };

  const getPossibleMoves = (boardState) => {
    let freeSpaces = [];

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      for (let colIndex = 0; colIndex < 3; colIndex++) {
        if (boardState[rowIndex][colIndex] === "")
          freeSpaces.push({ row: rowIndex, col: colIndex });
      }
    }

    return freeSpaces;
  };

  const makePlay = (symbol, row, col, tile) => {
    updateBoard(symbol, row, col, tile);
    gameboard.changeTile(row, col, symbol);
  };

  const endTurn = (row, col) => {
    turn++;

    updateTurnText();

    // Check if game is over
    if (isGameOver(gameboard.getBoard(), row, col)) return;
    else if (!isPlayer1Turn() && playingAgainstBot()) {
      botTurn();
    }
  };

  const playingAgainstBot = () => {
    return currentOpponent != playerOpponent;
  };

  const updateTurnText = () => {
    const text = document.querySelector("#turn-text");
    if (isPlayer1Turn()) text.textContent = `${player1.getName()}'s turn`;
    else text.textContent = `${player2.getName()}'s turn`;
  };

  const updateBoard = (symbol, rowIndex, colIndex, tile) => {
    tile.textContent = symbol;
    gameboard.changeTile(rowIndex, colIndex, symbol);
  };

  const isPlayer1Turn = () => turn % 2 === 0;

  const resetGame = () => {
    // Reset tiles
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
      tile.textContent = "";
      tile.disabled = false;
      tile.classList.remove("disabled");
    });

    // Reset turn
    turn = 0;

    // Reset gameboard
    gameboard.resetBoard();

    // Reset versus selection
    const versus = document.querySelector("#versus");
    versus.classList.remove("disabled");
    versus.disabled = false;

    // Reset turn text
    const text = document.querySelector("#turn-text");
    text.textContent = `${player1.getName()}'s turn`;
  };

  const isGameOver = (boardState, rowIndex, colIndex) => {
    const winner = checkWinnerFromPlay(boardState, rowIndex, colIndex);

    if (isTie(boardState) || winner !== 0) {
      switch (winner) {
        case 15:
          showWinner(player1.getName());
          break;
        case -15:
          showWinner(player2.getName());
          break;
        default:
          if (isTie(boardState)) {
            showWinner("");
          }
          break;
      }
      gameboard.disableTiles();

      return true;
    }

    return false;
  };

  // Returns 15 if player 1 wins, -15 if player 2 wins, 0 if no winner
  const checkWinner = (boardState) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let winner = checkWinnerFromPlay(boardState, i, j);
        if (winner != 0) {
          return winner;
        }
      }
    }

    return 0;
  };

  const checkWinnerFromPlay = (boardState, rowIndex, colIndex) => {
    let sums = [];

    // Calculate rows
    sums.push(calculateRow(boardState[rowIndex], rowIndex));

    // Calculate columns
    sums.push(calculateCol(boardState, colIndex));

    // Calculate diagonal
    if (rowIndex == colIndex) {
      sums.push(calculateDiag(boardState));
    }

    // Calculate anti diagonal
    if (+rowIndex + +colIndex === 2) {
      sums.push(calculateAntiDiag(boardState));
    }

    // Check if there's any calculation (= 15 || = -15)
    let winner = 0;
    sums.forEach((sum) => {
      switch (sum) {
        case 15:
          winner = sum;
          break;
        case -15:
          winner = sum;
          break;
        default:
          break;
      }
    });

    return winner;
  };

  const showWinner = (winner) => {
    const text = document.querySelector("#turn-text");

    if (winner === "") {
      text.textContent = "It's a draw!";
    } else {
      text.textContent = `${winner} won!`;
    }
  };

  const calculateRow = (row, rowIndex) => {
    let rowSum = 0;

    for (let colIndex = 0; colIndex < 3; colIndex++) {
      if (row[colIndex] === player1.getSymbol())
        rowSum += magicBoard[rowIndex][colIndex];
      else if (row[colIndex] === player2.getSymbol())
        rowSum -= magicBoard[rowIndex][colIndex];
    }

    return rowSum;
  };

  const calculateCol = (boardState, colIndex) => {
    let colSum = 0;

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const row = boardState[rowIndex];

      if (row[colIndex] === player1.getSymbol())
        colSum += magicBoard[rowIndex][colIndex];
      else if (row[colIndex] === player2.getSymbol())
        colSum -= magicBoard[rowIndex][colIndex];
    }

    return colSum;
  };

  const calculateDiag = (boardState) => {
    let diagSum = 0;

    for (let i = 0; i < 3; i++) {
      const row = boardState[i];

      if (row[i] === player1.getSymbol()) diagSum += magicBoard[i][i];
      else if (row[i] === player2.getSymbol()) diagSum -= magicBoard[i][i];
    }

    return diagSum;
  };

  const calculateAntiDiag = (boardState) => {
    let antiDiagSum = 0;
    let colIndex = 2;

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const row = boardState[rowIndex];

      if (row[colIndex] === player1.getSymbol())
        antiDiagSum += magicBoard[rowIndex][colIndex];
      else if (row[colIndex] === player2.getSymbol())
        antiDiagSum -= magicBoard[rowIndex][colIndex];

      colIndex--;
    }

    return antiDiagSum;
  };

  const isTie = (boardState) => {
    let occupied = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardState[i][j] !== "") {
          occupied++;
        }
      }
    }
    return occupied === 9;
  };

  return {
    displayBoard,
    initGame,
    resetGame,
    setupOpponent,
    setupPlayer,
  };
})();

const reset = document.getElementById("reset");
reset.addEventListener("click", game.resetGame);

const xSymbol = document.querySelector(".X");
const oSymbol = document.querySelector(".O");
xSymbol.addEventListener("click", game.setupPlayer);
oSymbol.addEventListener("click", game.setupPlayer);

const opponent = document.getElementById("versus");
opponent.addEventListener("change", game.setupOpponent);


game.displayBoard();
game.initGame();