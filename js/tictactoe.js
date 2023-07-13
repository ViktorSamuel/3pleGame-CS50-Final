// Initialize the game board and player variables
var t_board;
var t_playerO = "O";
var t_playerX = "X";
var t_currPlayer = t_playerO;
var t_gameOver = false;

window.onload = function () {
  t_setGame();
};

function t_setGame() {
  // Initialize the game board
  t_board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];

  var t_boardElement = document.getElementById("tic-tac-toe-board");

  // Clear the board element
  while (t_boardElement.firstChild) {
    t_boardElement.removeChild(t_boardElement.firstChild);
  }

  // Create the tiles for the board
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");

      // Add line classes for styling
      if (r == 0 || r == 1) {
        tile.classList.add("horizontal-line");
      }
      if (c == 0 || c == 1) {
        tile.classList.add("vertical-line");
      }

      tile.innerText = "";
      tile.addEventListener("click", t_setTile);
      t_boardElement.appendChild(tile);
    }
  }

  t_gameOver = false;
}

function t_setTile() {
  if (t_gameOver) {
    return;
  }

  let coords = this.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  if (t_board[r][c] != ' ') {
    return;
  }

  // Set the tile with the current player's symbol
  t_board[r][c] = t_currPlayer;
  this.innerText = t_currPlayer;

  // Switch players
  if (t_currPlayer == t_playerO) {
    t_currPlayer = t_playerX;
  } else {
    t_currPlayer = t_playerO;
  }

  t_checkWinner();
}

function t_checkWinner() {
  // Check for winning conditions
  for (let r = 0; r < 3; r++) {
    if (
      t_board[r][0] == t_board[r][1] &&
      t_board[r][1] == t_board[r][2] &&
      t_board[r][0] != ' '
    ) {
      for (let i = 0; i < 3; i++) {
        let tile = document.getElementById(r.toString() + "-" + i.toString());
        tile.classList.add("winner");
      }
      t_gameOver = true;
      return;
    }
  }

  for (let c = 0; c < 3; c++) {
    if (
      t_board[0][c] == t_board[1][c] &&
      t_board[1][c] == t_board[2][c] &&
      t_board[0][c] != ' '
    ) {
      for (let i = 0; i < 3; i++) {
        let tile = document.getElementById(i.toString() + "-" + c.toString());
        tile.classList.add("winner");
      }
      t_gameOver = true;
      return;
    }
  }

  if (
    t_board[0][0] == t_board[1][1] &&
    t_board[1][1] == t_board[2][2] &&
    t_board[0][0] != ' '
  ) {
    for (let i = 0; i < 3; i++) {
      let tile = document.getElementById(i.toString() + "-" + i.toString());
      tile.classList.add("winner");
    }
    t_gameOver = true;
    return;
  }

  if (
    t_board[0][2] == t_board[1][1] &&
    t_board[1][1] == t_board[2][0] &&
    t_board[0][2] != ' '
  ) {
    let tile = document.getElementById("0-2");
    tile.classList.add("winner");

    tile = document.getElementById("1-1");
    tile.classList.add("winner");

    tile = document.getElementById("2-0");
    tile.classList.add("winner");

    t_gameOver = true;
    return;
  }
}

function t_resetGame() {
  var t_boardElement = document.getElementById("tic-tac-toe-board");

  // Clear the board element
  while (t_boardElement.firstChild) {
    t_boardElement.removeChild(t_boardElement.firstChild);
  }

  // Reset game variables
  t_currPlayer = t_playerO;
  t_gameOver = false;

  t_setGame();
}
