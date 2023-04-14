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
    let turn = 0;
    

    const gameboard = (() => {
        let gameboard = [
            "", "", "",
            "", "", "",
            "", "", "",
        ];
    
        const display = () => {
            let index = 0;
            gameboard.forEach((tile) => {
                const tileElement = document.createElement("button");

                tileElement.classList.add("tile");

                tileElement.setAttribute("data-index", index++)

                tileElement.textContent = tile;

                gameContainer.appendChild(tileElement)
            });
        };

        const changeTile = (index, symbol) => gameboard[index] = symbol;

        const printBoard = () => console.log(gameboard);

        const resetBoard = () => gameboard = [
            "", "", "",
            "", "", "",
            "", "", "",
        ];
    
        return {
            display,
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
        const tileIndex = event.target.getAttribute("data-index");
        let symbol = "";
        isPlayer1Turn() ? symbol = player1.getSymbol() : symbol = player2.getSymbol();

        // Update board with new play
        updateBoard(symbol, tileIndex, event.target)

        // Update turn count
        turn++;
        
        // DEBUG
        gameboard.printBoard();
        
        // Check if game is over

    };

    const updateBoard = (symbol, index, tile) => {
        if (tile.textContent === "") {
            tile.textContent = symbol;
            gameboard.changeTile(index, symbol);
        }
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

    const isGameFinished = () => turn >= 9;

    return {
        displayBoard,
        initGame,
        resetGame,
        isGameFinished,
    };
})();

const reset = document.getElementById("reset");
reset.addEventListener("click", game.resetGame)

game.displayBoard();
game.initGame();