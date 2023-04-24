const board = 
[
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

function minmax(boardState, player, depth) {
    const currState = getGameState(boardState);
    if (currState != 0 || gameIsOver(boardState)) {
        return currState;
    }

    let scores = [];
    let moves = [];
    
    const possibleMoves = getPossibleMoves(boardState);
    console.log(possibleMoves);

    possibleMoves.forEach(move => {
        const possibleGame = getNewBoardState(boardState, move, player);
        scores.push(minmax(possibleGame, (player * -1), depth + 1));
        moves.push(move);
    });
    
    
    console.log(scores);
    console.log(moves);
}

function getNewBoardState(boardState, move, player) {
    const x = move[0];
    const y = move[1];

    let newBoard = boardState;
    newBoard[x][y] = player;

    console.log("new")
    console.log(newBoard)
    console.log("old")
    console.log(boardState)

    return newBoard;
}

function getPossibleMoves(boardState) {
    let possibleMoves = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (boardState[i][j] === 0) {
                possibleMoves.push([i, j]);
            }
        }
    }

    return possibleMoves;
}

function getGameState(boardState) {
    if (checkRows(boardState) === 10 || checkCols(boardState) === 10 || checkDiag(boardState) === 10 || checkAntiDiag(boardState) === 10) {
        return 10;
    }
    if (checkRows(boardState) === -10 || checkCols(boardState) === -10 || checkDiag(boardState) === -10 || checkAntiDiag(boardState) === -10) {
        return -10;
    }

    return 0;
}

function checkRows(boardState) {
    for (let i = 0; i < 3; i++) {
        if (boardState[i][0] === boardState[i][1] === boardState[i][2] === 1) {
            return 10;
        }
        if (boardState[i][0] === boardState[i][1] === boardState[i][2] === -1) {
            return -10;
        }
    }


    return 0;
}

function checkCols(boardState) {
    for (let i = 0; i < 3; i++) {
        if (boardState[0][i] === boardState[1][i] === boardState[2][i] === 1) {
            return 10;
        }
        else if (boardState[0][i] === boardState[1][i] === boardState[2][i] === -1) {
            return -10;
        }
    }

    return 0;
} 

function checkDiag(boardState) {
    if (boardState[0][0] === boardState[1][1] === boardState[2][2] === 1) {
        return 10;
    }
    else if (boardState[0][0] === boardState[1][1] === boardState[2][2] === -1) {
        return -10;
    }

    return 0;
}

function checkAntiDiag(boardState) {
    if (boardState[2][0] === boardState[1][1] === boardState[0][2] === 1) {
        return 10;
    }
    else if (boardState[2][0] === boardState[1][1] === boardState[0][2] === -1) {
        return -10;
    }

    return 0;
}

function gameIsOver(boardState) {
    let occupied = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (boardState[i][j] != 0) {
                occupied++;
            }
        }
    }

    return occupied === 9;
}

minmax(board, 1, 0);