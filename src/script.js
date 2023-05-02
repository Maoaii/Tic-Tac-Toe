import { Gameboard } from "./gameboard.js";
import { Player } from "./player.js";
import { AI } from "./ai.js";
import { MagicBoard } from "./magicBoard.js";

const game = (() => {
  const playerOpponent = "player";
  const player1 = Player("Player1", "X");
  const player2 = Player("Player2", "O");
  const ai = AI();
  const gameboard = Gameboard();
  const magicBoard = MagicBoard();

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
      ai.setupDifficulty(event.target.value);
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
    let move = ai.getMove(gameboard.getBoard(), currentPlayer);

    const tile = document.querySelector(
      `button[data-row='${move["row"]}'][data-col='${move["col"]}']`
    );

    // Make a play on the square with that index
    updateBoard(currentPlayer, move["row"], move["col"], tile);
    endTurn();
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
    gameboard.changeTile(rowIndex, colIndex, symbol, tile);
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
   * @param {*} boardState - current state of the board
   * @returns true if game is over: tie or someone wins; false otherwise
   */
  const isGameOver = (boardState) => {
    const winner = magicBoard.checkWinner(boardState);

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
  const isTie = () => {
    return gameboard.getPossibleMoves().length === 0;
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
