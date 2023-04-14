const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {
        getName,
        getSymbol,
    }
};

const game = (() => {
    const gameContainer = document.getElementById("game-container");
    const player1 = Player("human1", "X");
    const player2 = Player("human2", "O");
    const magicBoard = [
        [2, 7, 6],
        [9, 5, 1],
        [4, 3, 8],
    ];

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

        const getRow = (rowIndex) => gameboard[rowIndex];

        const getCol = (colIndex) => gameboard[colIndex];

        const changeTile = (row, col, symbol) => gameboard[row][col] = symbol;

        const printBoard = () => console.log(gameboard);

        const resetBoard = () => gameboard = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
    
        return {
            display,
            getRow,
            getCol,
            changeTile,
            resetBoard,
            printBoard,
        };
    })();
    

    const displayBoard = () => gameboard.display();

    const initGame = () => {
        // Add event listeners to tiles
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => tile.addEventListener("click", playTurn));

        // Reset game
        resetGame()
    };

    const playTurn = (event) => {
        const tile = event.target;
        const tileRow = tile.getAttribute("data-row");
        const tileCol = tile.getAttribute("data-col");
        let symbol = "";

        isPlayer1Turn() ? symbol = player1.getSymbol() : symbol = player2.getSymbol();


        if (tile.textContent === "") {
            // Update board with new play
            updateBoard(symbol, tileRow, tileCol, tile);
    
            // Update turn count
            turn++;

            // Check if game is over
            checkGameOver(tileRow, tileCol);
        }
    };

    const updateBoard = (symbol, rowIndex, colIndex, tile) => {
        tile.textContent = symbol;
        gameboard.changeTile(rowIndex, colIndex, symbol);
    }

    const isPlayer1Turn = () => turn % 2 === 0;

    const resetGame = () => {
        // Reset tiles
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => tile.textContent = "");

        // Reset turn
        turn = 0;

        // Reset gameboard
        gameboard.resetBoard();
    };

    const checkGameOver = (rowIndex, colIndex) => {
        let sums = [];
        
        // Calculate rows
        let rowSum = calculateRow(gameboard.getRow(rowIndex), rowIndex);
        sums.push(rowSum);
        
        // Calculate columns
        let colSum = calculateCol(colIndex);
        sums.push(colSum);
        
        // Calculate diagonals
        if (rowIndex == colIndex) {
            let diagSum = calculateDiag();
            sums.push(diagSum);
        }

        if ((+rowIndex + +colIndex) === 2) {
            let antiDiagSum = calculateAntiDiag();
            sums.push(antiDiagSum);
        }

        // Check if there's any calculation (= 15 || = -15)
        sums.forEach(sum => {
            if (sum === 15)
                console.log("X won");
            else if (sum === -15)
                console.log("O won");
        });
    };

    const calculateRow = (row, rowIndex) => {
        let rowSum = 0;

        for (let col = 0; col < 3; col++) {

            if (row[col] === "X")
                rowSum += magicBoard[rowIndex][col]
            else if (row[col] === "O")
                rowSum -= magicBoard[rowIndex][col]
        }

        return rowSum;
    }

    const calculateCol = (colIndex) => {
        let colSum = 0;

        for (let r = 0; r < 3; r++) {
            const row = gameboard.getRow(r);

            if (row[colIndex] === "X")
                colSum += magicBoard[r][colIndex];
            else if (row[colIndex] === "O")
                colSum -= magicBoard[r][colIndex];
        }

        return colSum;
    }

    const calculateDiag = () => {
        let diagSum = 0;

        for (let i = 0; i < 3; i++) {
            const row = gameboard.getRow(i);

            if (row[i] === "X")
                diagSum += magicBoard[i][i];
            else if (row[i] === "O")
                diagSum -= magicBoard[i][i];
        }

        return diagSum;
    }

    const calculateAntiDiag = () => {
        let antiDiagSum = 0;
        let colIndex = 2;

        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            const row = gameboard.getRow(rowIndex);

            if (row[colIndex] === "X")
                antiDiagSum += magicBoard[rowIndex][colIndex];
            else if (row[colIndex] === "O")
                antiDiagSum -= magicBoard[rowIndex][colIndex];
            
            colIndex--;
        }

        return antiDiagSum;
    }

    const isGameFinished = () => turn >= 9;

    return {
        displayBoard,
        initGame,
        resetGame,
    };
})();

const reset = document.getElementById("reset");
reset.addEventListener("click", game.resetGame)

game.displayBoard();
game.initGame();