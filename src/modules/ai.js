const easyOpponent = "easy";
const hardOpponent = "hard";
const unbeatableOpponent = "unbeatable";

import { MagicBoard } from "./magicBoard.js";

const AI = () => {
  const magicBoard = MagicBoard();
  let difficulty = "";

  const getMove = (boardState, currentPlayer) => {
    let move;

    // Depending on the choosen bot, play a different move
    switch (difficulty) {
      case easyOpponent:
        move = getRandomMove(boardState);

        break;

      case hardOpponent:
        if (Math.random() > 0.8) {
          move = getBestMove(boardState, currentPlayer);
        } else {
          move = getRandomMove(boardState);
        }

        break;

      case unbeatableOpponent:
        move = getBestMove(boardState, currentPlayer);

        break;

      default:
        console.log("botTurn: oopsie!");
        break;
    }

    return move;
  };

  const setupDifficulty = (aiType) => {
    difficulty = aiType;
  };

  /**
   * @returns a random possible move
   */
  const getRandomMove = (boardState) => {
    const possibleMoves = getPossibleMoves(boardState);

    // Choose a free space randomly
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  };

  /**
   * @returns the best possible move
   */
  const getBestMove = (boardState, currentPlayer) => {
    let possibleMoves = getPossibleMoves(boardState);
    let bestScore;
    let bestMove;

    // This player is maximizing
    if (currentPlayer === "X") {
      bestScore = -Infinity;

      // For each possible move, check its' score for the player
      possibleMoves.forEach((move) => {
        // Make the play
        boardState[move["row"]][move["col"]] = currentPlayer;

        // Check if the games down the tree are good
        let score = minimax(boardState, 0, "O");

        // Remove play
        boardState[move["row"]][move["col"]] = "";

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

      possibleMoves.forEach((move) => {
        // Make the play
        boardState[move["row"]][move["col"]] = currentPlayer;

        // Check if the games down the tree are good
        let score = minimax(boardState, 0, "X");

        // Remove play
        boardState[move["row"]][move["col"]] = "";

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
    let possibleMoves = getPossibleMoves(boardState);

    // Check if anyone won
    let result = magicBoard.checkWinner(boardState);
    if (result !== 0 || isTie(possibleMoves)) {
      if (result > 0) {
        return result - depth;
      } else {
        return result + depth;
      }
    }

    // This player is maximizing
    if (player === "X") {
      let bestScore = -Infinity;

      // For each possible move, check its' score for the player
      possibleMoves.forEach((move) => {
        // Make the play
        boardState[move.row][move.col] = player;

        // Check if the games down the tree are good
        let score = minimax(boardState, depth + 1, "O");

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
      possibleMoves.forEach((move) => {
        // Make the play
        boardState[move.row][move.col] = player;

        // Check if the games down the tree are good
        let score = minimax(boardState, depth + 1, "X");

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

  const isTie = (possibleMoves) => {
    return possibleMoves.length === 0;
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

  return {
    setupDifficulty,
    getMove,
  };
};

export { AI };
