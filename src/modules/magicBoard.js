const MagicBoard = () => {
  // Magic board for win calculation
  const board = [
    [2, 7, 6],
    [9, 5, 1],
    [4, 3, 8],
  ];

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
   * @param {*} row - row to calculate
   * @param {*} rowIndex - row index to calculate
   * @returns the magic board sum of that row
   */
  const calculateRow = (row, rowIndex) => {
    let rowSum = 0;

    for (let colIndex = 0; colIndex < 3; colIndex++) {
      if (row[colIndex] === "X") rowSum += board[rowIndex][colIndex];
      else if (row[colIndex] === "O") rowSum -= board[rowIndex][colIndex];
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

      if (row[colIndex] === "X") colSum += board[rowIndex][colIndex];
      else if (row[colIndex] === "O") colSum -= board[rowIndex][colIndex];
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

      if (row[i] === "X") diagSum += board[i][i];
      else if (row[i] === "O") diagSum -= board[i][i];
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

      if (row[colIndex] === "X") antiDiagSum += board[rowIndex][colIndex];
      else if (row[colIndex] === "O") antiDiagSum -= board[rowIndex][colIndex];

      colIndex--;
    }

    return antiDiagSum;
  };

  return {
    checkWinner,
  };
};

export { MagicBoard };
