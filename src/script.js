import { Gameboard } from "./modules/gameboard.js";
import { AI } from "./modules/ai.js";
import { MagicBoard } from "./modules/magicBoard.js";
import { Controls } from "./modules/controls.js";

const game = (() => {
  const player1 = "X";
  const player2 = "O";
  const ai = AI();
  const gameboard = Gameboard();
  const magicBoard = MagicBoard();
  const controls = Controls();

  let playerSymbol = "X";
  let opponentSymbol = "O";
  let currentPlayer = playerSymbol;
  let playingAgainstBot = false;
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
    playingAgainstBot = event.target !== "player";

    if (!playingAgainstBot) {
      controls.disablePlayerSelection();
    } else {
      ai.setupDifficulty(event.target.value);
      controls.enablePlayerSelection();
    }
  };

  /**
   *
   * @param {*} event - type of player choosen, X or O
   */
  const setupPlayer = (event) => {
    // Setup symbol
    playerSymbol = event.target.value;

    // Add selected styling on clicked button
    controls.updatePlayerSelection(event.target);

    opponentSymbol = playerSymbol === player1 ? player2 : player1;

    // If user wants to be second, make AI play
    if (playerIsSecond()) botTurn();
  };

  /**
   * If player clicks on an empty tile, update the board
   *
   * @param {*} event - tile clicked by player
   */
  const playTurn = (event) => {
    if (gameboard.isTileEmpty(event.target)) {
      gameboard.updateBoard(currentPlayer, event.target);
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
    currentPlayer =
      currentPlayer === playerSymbol ? opponentSymbol : playerSymbol;

    controls.updateTurnText(currentPlayer === player1);

    // Disable stuff if first turn
    if (isPlaying) {
      controls.disablePlayerSelection();
      controls.disableVersusSelection();
    }

    // Check if game is over
    if (isGameOver(gameboard.getBoard())) {
      gameboard.disableTiles();

      return;
    } else if (playingAgainstBot && isOpponentTurn()) {
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
    gameboard.updateBoard(currentPlayer, tile);
    endTurn();
  };

  /**
   * @returns true if player is second to play, false otherwise
   */
  const playerIsSecond = () => {
    return playerSymbol === player2;
  };

  /**
   * @returns true if it's the opponent's turn, false otherwise
   */
  const isOpponentTurn = () => {
    return currentPlayer === opponentSymbol;
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
    currentPlayer = "X";

    // Reset turn text
    controls.resetTurnText();

    // Reset gameboard
    gameboard.resetBoard();

    // Enable tiles
    gameboard.enableTiles();

    // Reset versus selection
    controls.enableVersusSelection();

    // Reset player selection
    if (playingAgainstBot) {
      controls.enablePlayerSelection();
    } else {
      controls.disablePlayerSelection();
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
          controls.showWinner(player1);
          break;
        case -15:
          controls.showWinner(player2);
          break;
        default:
          if (isTie(boardState)) {
            controls.showWinner("");
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
