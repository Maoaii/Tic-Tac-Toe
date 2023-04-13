const Player = (name) => {
    const getName = () => name;

    return {
        getName,
    }
};

const game = (() => {
    const gameContainer = document.getElementById("game-container");
    const human = Player("human");
    const bot = Player("bot");
    

    const gameboard = (() => {
        let gameboard = [
            "O", "O", "O",
            "O", "O", "O",
            "O", "O", "O",
        ];
    
        const display = () => {
            gameboard.forEach((tile) => {
                const tileElement = document.createElement("div");
                tileElement.classList.add("tile");
                tileElement.textContent = tile;
                gameContainer.appendChild(tileElement)
            });
        };
    
        return {
            display,
        };
    })();
    

    const displayBoard = () => gameboard.display();

    return {
        displayBoard,
    };
})();

game.displayBoard();