const Controls = () => {
  const xSymbol = document.querySelector(".X");
  const oSymbol = document.querySelector(".O");

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
   * Updates the current turn's text element
   */
  const updateTurnText = (isPlayer1) => {
    const text = document.querySelector("#turn-text");

    text.textContent = `${isPlayer1 ? "X" : "O"}'s turn`;
  };

  const resetTurnText = () => {
    const text = document.querySelector("#turn-text");
    text.textContent = `X's turn`;
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

  const updatePlayerSelection = (selected) => {
    selected.classList.add("selected");

    // Remove selected styling on the other button
    const other =
      selected.value === xSymbol.value
        ? document.querySelector(".O")
        : document.querySelector(".X");
    other.classList.remove("selected");
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
  };

  /**
   * Disables the versus selection controls
   */
  const disableVersusSelection = () => {
    disableButton(document.querySelector("#versus"));
  };

  const enableVersusSelection = () => {
    enableButton(document.querySelector("#versus"));
  };

  return {
    showWinner,
    updateTurnText,
    resetTurnText,
    disableButton,
    enableButton,
    updatePlayerSelection,
    disablePlayerSelection,
    enablePlayerSelection,
    disableVersusSelection,
    enableVersusSelection,
  };
};

export { Controls };
