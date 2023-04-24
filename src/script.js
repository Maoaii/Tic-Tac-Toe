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

    let currentOpponent = "";
    let turn = 0;

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
    
                    tileElement.setAttribute("data-row", rowIndex)
                    tileElement.setAttribute("data-col", colIndex)
    
                    tileElement.textContent = tile;
    
                    gameContainer.appendChild(tileElement)
    
                    colIndex++;
                })
                rowIndex++;
            });
        };

        const getBoard = () => gameboard;
    
        const getRow = (rowIndex) => gameboard[rowIndex];
    
        const changeTile = (row, col, symbol) => gameboard[row][col] = symbol;
    
        const printBoard = () => console.log(gameboard);
    
        const resetBoard = () => gameboard = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];

        const disableTiles = () => {
            const tiles = document.querySelectorAll(".tile");
            tiles.forEach(tile =>  {
                tile.disabled = true;
                tile.classList.toggle("disabled")
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
        tiles.forEach(tile => tile.addEventListener("click", playTurn));
    }

    const initGame = () => {
        setupOpponent();

        // Reset game
        resetGame();
    };

    

    const setupOpponent = () => {
        currentOpponent = document.getElementById("versus").value;;
    };

    const playTurn = (event) => {
        const tile = event.target;
        const tileRow = tile.getAttribute("data-row");
        const tileCol = tile.getAttribute("data-col");
        let symbol = isPlayer1Turn() ? player1.getSymbol() : player2.getSymbol();;

        if (tile.textContent === "") {
            makePlay(symbol, tileRow, tileCol, tile);
            endTurn(tileRow, tileCol);
        }
        if (turn > 0)
            disableVersusSelection();
    };

    const disableVersusSelection = () => {
        const versus = document.querySelector("#versus");
        versus.classList.add("disabled");
        versus.disabled = true;
    }
    
    const botTurn = () => {
        switch(currentOpponent) {
            case easyOpponent:
                // Store index of all free spaces
                let possibleMoves = getPossibleMoves(gameboard.getBoard());

                // Choose an free space randomly
                let choosenSquare = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                const tile = document.querySelector(`button[data-row='${choosenSquare["row"]}'][data-col='${choosenSquare["col"]}']`);
                
                // Make a play on the square with that index
                makePlay(player2.getSymbol(), choosenSquare["row"], choosenSquare["col"], tile);
                endTurn(choosenSquare["row"], choosenSquare["col"]);
                
                break;

            case hardOpponent:
                break

            case unbeatableOpponent:
                // Call minmax function and get a list of scores
                minmax(gameboard.getBoard(), isPlayer1Turn() ? player1.getSymbol() : player2.getSymbol(), 0);

                // Choose the score/play that matches the best play for the current player
                

                // Make play

                break;
                
            default:
                console.log("botTurn: oopsie!");
            break;
        }
    }

    const getPossibleMoves = (boardState) => {
        let freeSpaces = [];

        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            for (let colIndex = 0; colIndex < 3; colIndex++) {
                if (boardState[rowIndex][colIndex] === "")
                    freeSpaces.push({row: rowIndex, col: colIndex});
            }
        }

        return freeSpaces;
    }

    // Given a board, checks if someone wins or there is a tie
    const getNewGameState = (boardState, move, player) => {
        boardState[move["row"]][move["col"]] = player;

        return boardState;
    }

    const minmax = (boardState, player, depth) => {
        // Check game over
        // If over, return the score
        const winner = checkWinner(boardState);
        if (winner != 0 || isGameOver(boardState)) {
            return winner;
        }

        let scores = [];
        let moves = [];

        // Get list of possible moves
        const possibleMoves = getPossibleMoves(boardState);

        // For each new move, run the minmax function and store the scores and moves
        possibleMoves.forEach(move => {
            const possibleGame = getNewGameState(boardState, move, player);
            scores.push(minmax(possibleGame, isPlayer1Turn() ? player2.getSymbol() : player1.getSymbol(), depth + 1));
            moves.push(move);
        });

        console.log(scores);
        console.log(moves);

        // Find the best play for current player

        // Make play
    }

    const makePlay = (symbol, row, col, tile) => {
        updateBoard(symbol, row, col, tile)
        gameboard.changeTile(row, col, symbol);
    };

    const endTurn = (row, col) => {
        turn++;

        updateTurnText();        

        // Check if game is over
        if (isGameOver(gameboard.getBoard(), row, col))
            return;
        else if (!isPlayer1Turn() && playingAgainstBot()) {
            botTurn();
        }
    }

    const playingAgainstBot = () => {
        return currentOpponent != playerOpponent;
    }
    
    const updateTurnText = () => {
        const text = document.querySelector("#turn-text");
        if (isPlayer1Turn())
            text.textContent = `${player1.getName()}'s turn`;
        else 
            text.textContent = `${player2.getName()}'s turn`;
    }

    const updateBoard = (symbol, rowIndex, colIndex, tile) => {
        tile.textContent = symbol;
        gameboard.changeTile(rowIndex, colIndex, symbol);
    }

    const isPlayer1Turn = () => turn % 2 === 0;

    const resetGame = () => {
        // Reset tiles
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => {
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

        if (isTie() || winner !== 0) {
            gameboard.disableTiles();
            showWinner(winner === 15 ? player1.getName() : player2.getName());
            return true;
        }

        return false;
    };

    const checkWinner = (boardState) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const winner = checkWinnerFromPlay(boardState, i, j);
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
        if ((+rowIndex + +colIndex) === 2) {
            sums.push(calculateAntiDiag(boardState));
        }

        // Check if there's any calculation (= 15 || = -15)
        let winner = 0;
        sums.forEach(sum => {
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
    }

    const showWinner = (winner) => {
        const text = document.querySelector("#turn-text");

        if (winner === "") {
            text.textContent = "It's a draw!"
        }
        else {
            text.textContent = `${winner} won!`;
        }
    };

    const calculateRow = (row, rowIndex) => {
        let rowSum = 0;

        for (let colIndex = 0; colIndex < 3; colIndex++) {
            if (row[colIndex] === player1.getSymbol())
                rowSum += magicBoard[rowIndex][colIndex]
            else if (row[colIndex] === player2.getSymbol())
                rowSum -= magicBoard[rowIndex][colIndex]
        }

        return rowSum;
    }

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
    }

    const calculateDiag = (boardState) => {
        let diagSum = 0;

        for (let i = 0; i < 3; i++) {
            const row = boardState[i];

            if (row[i] === player1.getSymbol())
                diagSum += magicBoard[i][i];
            else if (row[i] === player2.getSymbol())
                diagSum -= magicBoard[i][i];
        }

        return diagSum;
    }

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
    }

    const isTie = () => turn >= 9;

    return {
        displayBoard,
        initGame,
        resetGame,
        setupOpponent,
    };
})();

const reset = document.getElementById("reset");
reset.addEventListener("click", game.resetGame)

const opponent = document.getElementById("versus");
opponent.addEventListener("change", game.setupOpponent);

game.displayBoard();
game.initGame();