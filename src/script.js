import { Gameboard } from "./gameboard.js";
import { Player } from "./player.js";


const game = (() => {
  const playerOpponent = "player";
  const easyOpponent = "easy";
  const hardOpponent = "hard";
  const unbeatableOpponent = "unbeatable";

  const player1 = Player("Player1", "X");
  const player2 = Player("Player2", "O");
  // Magic board for win calculation
  const magicBoard = [
    [2, 7, 6],
    [9, 5, 1],
    [4, 3, 8],
  ];

  let gameboard = Gameboard();
  let isPlayer1 = true;
  let playerSymbol = "X";
  let opponentSymbol = "O";
  let currentOpponent = "player";
  let currentPlayer = "X";
  let isPlaying = false;

  /**
   * Displays the board on the screen and adds event listeners to the tiles
   */
  const displayBoard = () => {
    gameboard.display();

    // Add event listeners to tiles
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => tile.addEventListener("click", playTurn));
  };

  /**
   * @param {*} event - type of opponent choosen, player, easy, hard or unbeatable
   */
  const setupOpponent = (event) => {
    currentOpponent = event.target.value;

    if (isPvP()) {
      disablePlayerSelection();
    } else {
      enablePlayerSelection();
    }
  };

  /**
   * @returns true if playing agains a player, false otherwise
   */
  const isPvP = () => {
    return currentOpponent === playerOpponent;
  };

  /**
   *
   * @param {*} event - type of player choosen, X or O
   */
  const setupPlayer = (event) => {
    // Setup symbol
    playerSymbol = event.target.value;

    // Add selected styling on clicked button
    event.target.classList.add("selected");

    // Remove selected styling on the other button
    const other =
      playerSymbol === player1.getSymbol()
        ? document.querySelector(".O")
        : document.querySelector(".X");
    other.classList.remove("selected");

    opponentSymbol = other.value;

    // If user wants to be second, make AI play
    if (playerIsSecond()) botTurn();
  };

  /**
   * If player clicks on an empty tile, update the board
   *
   * @param {*} event - tile clicked by player
   */
  const playTurn = (event) => {
    const tile = event.target;
    const tileRow = tile.getAttribute("data-row");
    const tileCol = tile.getAttribute("data-col");

    if (tile.textContent === "") {
      updateBoard(currentPlayer, tileRow, tileCol, tile);
      endTurn();
    }
  };

  /**
   * Alters state variables and passes the turn to the next player
   *
   * @returns if game is over after the turn
   */
  const endTurn = () => {
    // Update state variables
    isPlaying = true;
    isPlayer1 = !isPlayer1;
    currentPlayer =
      currentPlayer === playerSymbol ? opponentSymbol : playerSymbol;

    updateTurnText();

    // Disable stuff if first turn
    if (isPlaying) {
      disablePlayerSelection();
      disableVersusSelection();
    }

    // Check if game is over
    if (isGameOver(gameboard.getBoard())) {
      gameboard.disableTiles();

      return;
    } else if (playingAgainstBot() && isOpponentTurn()) {
      botTurn();
    }
  };

  /**
   * AI turn, based on opponent choosen
   */
  const botTurn = () => {
    let move;

    // Depending on the choosen bot, play a different move
    switch (currentOpponent) {
      case easyOpponent:
        move = getRandomMove();

        break;

      case hardOpponent:
        if (Math.random() > 0.8) {
          move = getBestMove();
        } else {
          move = getRandomMove();
        }

        break;

      case unbeatableOpponent:
        move = getBestMove();

        break;

      default:
        console.log("botTurn: oopsie!");
        break;
    }

    const tile = document.querySelector(
      `button[data-row='${move["row"]}'][data-col='${move["col"]}']`
    );

    // Make a play on the square with that index
    updateBoard(currentPlayer, move["row"], move["col"], tile);
    endTurn();
  };

  /**
   * @returns a random possible move
   */
  const getRandomMove = () => {
    // Store index of all free spaces
    let possibleMoves = getPossibleMoves(gameboard.getBoard());

    // Choose a free space randomly
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  };

  /**
   * @returns the best possible move
   */
  const getBestMove = () => {
    let board = gameboard.getBoard();
    let bestScore;
    let bestMove;

    // This player is maximizing
    if (currentPlayer === player1.getSymbol()) {
      bestScore = -Infinity;

      // For each possible move, check its' score for the player
      getPossibleMoves(board).forEach((move) => {
        // Make the play
        board[move["row"]][move["col"]] = currentPlayer;

        // Check if the games down the tree are good
        let score = minimax(board, 0, player2.getSymbol());

        // Remove play
        board[move["row"]][move["col"]] = "";

        // If the games down the tree show a win, update best move
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      });
    }
    // This player is minimizing
    else {
      bestScore = Infinity;

      getPossibleMoves(board).forEach((move) => {
        // Make the play
        board[move["row"]][move["col"]] = currentPlayer;

        // Check if the games down the tree are good
        let score = minimax(board, 0, player1.getSymbol());

        // Remove play
        board[move["row"]][move["col"]] = "";

        // If the games down the tree show a win, update best move
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      });
    }

    return bestMove;
  };

  /**
   * @param {*} boardState - current state of the board
   * @param {*} depth - depth of recursive search
   * @param {*} player - player maximizing or minimizing the play
   * @returns the score of the outcome
   */
  const minimax = (boardState, depth, player) => {
    // Check if anyone won
    let result = checkWinner(boardState);
    if (result !== 0 || isTie(boardState)) {
      if (result > 0) {
        return result - depth;
      } else {
        return result + depth;
      }
    }

    // This player is maximizing
    if (player === player1.getSymbol()) {
      let bestScore = -Infinity;

      // For each possible move, check its' score for the player
      getPossibleMoves(boardState).forEach((move) => {
        // Make the play
        boardState[move.row][move.col] = player;

        // Check if the games down the tree are good
        let score = minimax(boardState, depth + 1, player2.getSymbol());

        // Remove play
        boardState[move.row][move.col] = "";

        // If the games down the tree show a win, update best move
        if (score > bestScore) {
          bestScore = score;
        }
      });

      return bestScore;
    }
    // This player is minimizing
    else {
      let bestScore = Infinity;

      // For each possible move, check its' score for the player
      getPossibleMoves(boardState).forEach((move) => {
        // Make the play
        boardState[move.row][move.col] = player;

        // Check if the games down the tree are good
        let score = minimax(boardState, depth + 1, player1.getSymbol());

        // Remove play
        boardState[move.row][move.col] = "";

        // If the games down the tree show a win, update best move
        if (score < bestScore) {
          bestScore = score;
        }
      });

      return bestScore;
    }
  };

  /**
   * @param {*} boardState - current state of the board
   * @returns the possible moves on the current state of the board
   */
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

  /**
   * @returns true if player is second to play, false otherwise
   */
  const playerIsSecond = () => {
    return playerSymbol === player2.getSymbol();
  };

  /**
   * @returns true if it's the opponent's turn, false otherwise
   */
  const isOpponentTurn = () => {
    return currentPlayer === opponentSymbol;
  };

  /**
   * @returns true if current opponent is an AI, false otherwise
   */
  const playingAgainstBot = () => {
    return currentOpponent != playerOpponent;
  };

  /**
   * Disables button and turns down the opacity
   *
   * @param {*} button - button to be disabled
   */
  const disableButton = (button) => {
    button.classList.add("disabled");
    button.disabled = true;
  };

  /**
   * Enables button and turns up the opacity
   *
   * @param {*} button - button to be enabled
   */
  const enableButton = (button) => {
    button.classList.remove("disabled");
    button.disabled = false;
  };

  /**
   * Disables the player selection controls
   */
  const disablePlayerSelection = () => {
    [xSymbol, oSymbol].forEach((btn) => {
      disableButton(btn);
    });
  };

  /**
   * Enables the player selection controls
   */
  const enablePlayerSelection = () => {
    [xSymbol, oSymbol].forEach((btn) => {
      enableButton(btn);
    });

    xSymbol.classList.add("selected");
    oSymbol.classList.remove("selected");
    playerSymbol = player1.getSymbol();
    opponentSymbol = player2.getSymbol();
  };

  /**
   * Disables the versus selection controls
   */
  const disableVersusSelection = () => {
    const versus = document.querySelector("#versus");
    versus.classList.add("disabled");
    versus.disabled = true;
  };

  /**
   * Updates the current turn's text element
   */
  const updateTurnText = () => {
    const text = document.querySelector("#turn-text");

    text.textContent = `${
      isPlayer1 ? player1.getName() : player2.getName()
    }'s turn`;
  };

  /**
   * Updates the current board with a new play
   *
   * @param {*} symbol - symbol to place on board
   * @param {*} rowIndex - row to place symbol
   * @param {*} colIndex - column to place symbol
   * @param {*} tile - tile to place symbol
   */
  const updateBoard = (symbol, rowIndex, colIndex, tile) => {
    tile.textContent = symbol;
    gameboard.changeTile(rowIndex, colIndex, symbol);
  };

  /**
   * Resets:
   * - playing states;
   * - turns
   * - turn text
   * - gameboard
   * - game tiles
   * - versus selection controls
   * - player selection controls if playing agains an AI
   */
  const resetGame = () => {
    // Reset playing state
    isPlaying = false;

    // Reset current player
    currentPlayer = player1.getSymbol();

    // Reset turn text
    const text = document.querySelector("#turn-text");
    text.textContent = `${player1.getName()}'s turn`;

    // Reset gameboard
    gameboard.resetBoard();

    // Enable tiles
    gameboard.enableTiles();

    // Reset versus selection
    enableButton(document.querySelector("#versus"));

    // Reset player selection
    if (currentOpponent !== playerOpponent) {
      enablePlayerSelection();
    } else {
      disablePlayerSelection();
    }
  };

  /**
   * @param {*} boardState - current state of the board
   * @returns 15 if player1 wins, -15 if player2 wins, 0 if no one wins
   */
  const checkWinner = (boardState) => {
    let sums = [];

    // Calculate rows
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      sums.push(calculateRow(boardState[rowIndex], rowIndex));
    }

    // Calculate columns
    for (let colIndex = 0; colIndex < 3; colIndex++) {
      sums.push(calculateCol(boardState, colIndex));
    }

    // Calculate diagonal
    sums.push(calculateDiag(boardState));

    // Calculate anti diagonal
    sums.push(calculateAntiDiag(boardState));

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

  /**
   * Displays the current winner
   *
   * @param {*} winner - current winner
   */
  const showWinner = (winner) => {
    const text = document.querySelector("#turn-text");

    if (winner === "") {
      text.textContent = "It's a draw!";
    } else {
      text.textContent = `${winner} won!`;
    }
  };

  /**
   * @param {*} row - row to calculate
   * @param {*} rowIndex - row index to calculate
   * @returns the magic board sum of that row
   */
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

  /**
   * @param {*} boardState - current state of the board
   * @param {*} rowIndex - column index to calculate
   * @returns the magic board sum of that row
   */
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

  /**
   * @param {*} boardState - current state of the board
   * @returns the magic board sum of that diag
   */
  const calculateDiag = (boardState) => {
    let diagSum = 0;

    for (let i = 0; i < 3; i++) {
      const row = boardState[i];

      if (row[i] === player1.getSymbol()) diagSum += magicBoard[i][i];
      else if (row[i] === player2.getSymbol()) diagSum -= magicBoard[i][i];
    }

    return diagSum;
  };

  /**
   * @param {*} boardState - current state of the board
   * @returns the magic board sum of that antidiag
   */
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

  /**
   * @param {*} boardState - current state of the board
   * @returns true if game is over: tie or someone wins; false otherwise
   */
  const isGameOver = (boardState) => {
    const winner = checkWinner(boardState);

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

      return true;
    }

    return false;
  };

  /**
   *
   * @param {*} boardState - current state of the board
   * @returns true if it's a tie, false otherwise
   */
  const isTie = (boardState) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardState[i][j] === "") {
          return false;
        }
      }
    }
    return true;
  };

  return {
    displayBoard,
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
game.resetGame();
