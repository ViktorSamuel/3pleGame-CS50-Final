// Board
let f_board;
let f_boardWidth = 360;
let f_boardHeight = 640;
let f_context;

// Bird
let f_birdWidth = 34;
let f_birdHeight = 24;
let f_birdX = f_boardWidth / 8;
let f_birdY = f_boardHeight / 2;
let f_birdImg;

let f_bird = {
  x: f_birdX,
  y: f_birdY,
  width: f_birdWidth,
  height: f_birdHeight
};

// Pipes
let f_pipeArray = [];
let f_pipeWidth = 64;
let f_pipeHeight = 512;
let f_pipeX = f_boardWidth;
let f_pipeY = 0;

let f_topPipeImg;
let f_bottomPipeImg;

// Physics
let f_velocityX = -2;
let f_velocityY = 0;
let f_gravity = 0.4;

let f_gameOver = true;
let f_score = 0;

function f_flappy_start() {
  // Initialize the Flappy Bird game
  f_board = document.getElementById("flappy-board");
  f_board.height = f_boardHeight;
  f_board.width = f_boardWidth;
  f_context = f_board.getContext("2d");

  // Load bird image
  f_birdImg = new Image();
  f_birdImg.src = "../img/flappybird.png";
  f_birdImg.onload = function () {
    f_context.drawImage(f_birdImg, f_bird.x, f_bird.y, f_bird.width, f_bird.height);
  };

  // Load pipe images
  f_topPipeImg = new Image();
  f_topPipeImg.src = "../img/toppipe.png";

  f_bottomPipeImg = new Image();
  f_bottomPipeImg.src = "../img/bottompipe.png";

  // Start game loop
  requestAnimationFrame(f_update);

  // Display initial message
  f_context.font = "24px sans-serif";
  f_context.fillText("Press arrow up to start", 40, 90);

  // Place pipes periodically
  setInterval(f_placePipes, 1500);

  // Listen for key events to move the bird
  document.addEventListener("keydown", f_moveBird);
}

function f_update() {
  // Update the game state
  requestAnimationFrame(f_update);
  if (f_gameOver) {
    return;
  }
  f_context.clearRect(0, 0, f_board.width, f_board.height);

  // Update bird position
  f_velocityY += f_gravity;
  f_bird.y = Math.max(f_bird.y + f_velocityY, 0);
  f_context.drawImage(f_birdImg, f_bird.x, f_bird.y, f_bird.width, f_bird.height);

  if (f_bird.y > f_board.height) {
    f_gameOver = true;
  }

  // Update pipe positions and detect collisions
  for (let i = 0; i < f_pipeArray.length; i++) {
    let pipe = f_pipeArray[i];
    pipe.x += f_velocityX;
    f_context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && f_bird.x > pipe.x + pipe.width) {
      f_score += 0.5;
      pipe.passed = true;
    }

    if (f_detectCollision(f_bird, pipe)) {
      f_gameOver = true;
    }
  }

  // Remove offscreen pipes
  while (f_pipeArray.length > 0 && f_pipeArray[0].x < -f_pipeWidth) {
    f_pipeArray.shift();
  }

  // Display score and game over message
  f_context.fillStyle = "white";
  f_context.font = "18px sans-serif";
  f_context.fillText(f_score, 5, 45);

  if (f_gameOver) {
    f_context.fillStyle = "red";
    f_context.fillText("GAME OVER press arrow up to restart", 10, 90);
  }
}

function f_placePipes() {
  // Place new pipes on the screen
  if (f_gameOver) {
    return;
  }

  let randomPipeY = f_pipeY - f_pipeHeight / 4 - Math.random() * (f_pipeHeight / 2);
  let openingSpace = f_board.height / 4;

  let topPipe = {
    img: f_topPipeImg,
    x: f_pipeX,
    y: randomPipeY,
    width: f_pipeWidth,
    height: f_pipeHeight,
    passed: false
  };
  f_pipeArray.push(topPipe);

  let bottomPipe = {
    img: f_bottomPipeImg,
    x: f_pipeX,
    y: randomPipeY + f_pipeHeight + openingSpace,
    width: f_pipeWidth,
    height: f_pipeHeight,
    passed: false
  };
  f_pipeArray.push(bottomPipe);
}

function f_moveBird(e) {
  // Move the bird and restart the game if it's over
  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
    f_velocityY = -6;

    if (f_gameOver) {
      f_bird.y = f_birdY;
      f_pipeArray = [];
      f_score = 0;
      f_gameOver = false;
    }
  }
}

function f_detectCollision(a, b) {
  // Check for collision between two objects
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
