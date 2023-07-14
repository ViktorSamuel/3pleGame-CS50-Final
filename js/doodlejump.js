// Board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

// Doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
  img: null,
  x: doodlerX,
  y: doodlerY,
  width: doodlerWidth,
  height: doodlerHeight
};

// Physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

// Platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = true;

function doodle_start() {
  // Initialize the Doodle Jump game
  board = document.getElementById("doodle-board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // Load images
  doodlerRightImg = new Image();
  doodlerRightImg.src = "./img/doodler-right.png";
  doodler.img = doodlerRightImg;
  doodlerRightImg.onload = function () {
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
  };

  doodlerLeftImg = new Image();
  doodlerLeftImg.src = "./img/doodler-left.png";

  platformImg = new Image();
  platformImg.src = "./img/platform.png";

  // Set initial velocity and score
  velocityY = initialVelocityY;
  score = 0;
  maxScore = 0;

  // Place initial platforms
  placePlatforms();

  // Start game loop
  requestAnimationFrame(update);

  // Listen for key events to move the doodler
  document.addEventListener("keydown", moveDoodler);
}

function update() {
  // Update the game state
    requestAnimationFrame(update);

    if (gameOver) {
    // Display game over message and restart prompt
        context.clearRect(0, 0, board.width, board.height);
        context.fillStyle = "black";
        context.font = "24px sans-serif";

        const text = "Press 'Space' to Start";
        const textWidth = context.measureText(text).width;
        const textX = (boardWidth - textWidth) / 2;
        const textY = boardHeight / 2;

        context.fillText(text, textX, textY);
        return;
    }

  context.clearRect(0, 0, board.width, board.height);

  // Update doodler position
  doodler.x += velocityX;

  if (doodler.x > boardWidth) {
    doodler.x = 0;
  } else if (doodler.x + doodler.width < 0) {
    doodler.x = boardWidth;
  }

  velocityY += gravity;
  doodler.y += velocityY;

  if (doodler.y > board.height) {
    gameOver = true;
  }

  context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

  // Update platforms
  for (let i = 0; i < platformArray.length; i++) {
    let platform = platformArray[i];

    if (velocityY < 0 && doodler.y < boardHeight * 3 / 4) {
      platform.y -= initialVelocityY;
    }

    if (detectCollision(doodler, platform) && velocityY >= 0) {
      velocityY = initialVelocityY;
    }

    context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
  }

  // Remove offscreen platforms and add new platform
  while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
    platformArray.shift();
    newPlatform();
  }

  // Update and display score
  updateScore();
  context.fillStyle = "black";
  context.font = "16px sans-serif";
  context.fillText(score, 5, 20);
}

function moveDoodler(e) {
  // Move the doodler and restart the game if it's over
  if (e.code == "ArrowRight" || e.code == "KeyD") {
    velocityX = 4;
    doodler.img = doodlerRightImg;
  } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    velocityX = -4;
    doodler.img = doodlerLeftImg;
  } else if (e.code == "Space" && gameOver) {
    // Reset game
    doodler = {
      img: doodlerRightImg,
      x: doodlerX,
      y: doodlerY,
      width: doodlerWidth,
      height: doodlerHeight
    };

    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
  }
}

function placePlatforms() {
  // Place initial platforms
  platformArray = [];

  let platform = {
    img: platformImg,
    x: boardWidth / 2,
    y: boardHeight - 50,
    width: platformWidth,
    height: platformHeight
  };

  platformArray.push(platform);

  for (let i = 0; i < 6; i++) {
    let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
    let platform = {
      img: platformImg,
      x: randomX,
      y: boardHeight - 75 * i - 150,
      width: platformWidth,
      height: platformHeight
    };

    platformArray.push(platform);
  }
}

function newPlatform() {
  // Add a new platform above the screen
  let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
  let platform = {
    img: platformImg,
    x: randomX,
    y: -platformHeight,
    width: platformWidth,
    height: platformHeight
  };

  platformArray.push(platform);
}

function detectCollision(a, b) {
  // Check for collision between two objects
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function updateScore() {
  // Update the score based on the doodler's movement
  let points = Math.floor(50 * Math.random());

  if (velocityY < 0) {
    maxScore += points;
    if (score < maxScore) {
      score = maxScore;
    }
  } else if (velocityY >= 0) {
    maxScore -= points;
  }
}
