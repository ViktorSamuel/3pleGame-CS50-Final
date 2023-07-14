// Board
let f_board;
let f_boardWidth = 360;
let f_boardHeight = 640;
let f_context;

// Bird
let f_birdWidth = 34; 
let f_birdHeight = 24;
let f_birdX = f_boardWidth/8;
let f_birdY = f_boardHeight/2;
let f_birdImg;

let f_bird = {
    x : f_birdX,
    y : f_birdY,
    width : f_birdWidth,
    height : f_birdHeight
}

// Pipes
let f_pipeArray = [];
let f_pipeWidth = 64; 
let f_pipeHeight = 512;
let f_pipeX = f_boardWidth;
let f_pipeY = 0;

let f_topPipeImg;
let f_bottomPipeImg;

// Physics
let f_velocityX = -2; // Pipes moving left speed
let f_velocityY = 0; // Bird jump speed
let f_gravity = 0.4;

let f_gameOver = true;
let f_score = 0;

// Start Flappy Bird game
function f_flappy_start() {
    // Initialize board
    f_board = document.getElementById("flappy-board");
    f_board.height = f_boardHeight;
    f_board.width = f_boardWidth;
    f_context = f_board.getContext("2d"); // Used for drawing on the board

    // Load images
    f_birdImg = new Image();
    f_birdImg.src = "./img/flappybird.png";
    f_birdImg.onload = function() {
        f_context.drawImage(f_birdImg, f_bird.x, f_bird.y, f_bird.width, f_bird.height);
    }

    f_topPipeImg = new Image();
    f_topPipeImg.src = "./img/toppipe.png";

    f_bottomPipeImg = new Image();
    f_bottomPipeImg.src = "./img/bottompipe.png";

    requestAnimationFrame(f_update);
    f_context.font="20px sans-serif";
    f_context.fillText("Press arrow up to start", 5, 90);

    setInterval(f_placePipes, 1500); // Generate pipes every 1.5 seconds
    document.addEventListener("keydown", f_moveBird);
}

// Update game state
function f_update() {
    requestAnimationFrame(f_update);
    if (f_gameOver) {
        return;
    }
    f_context.clearRect(0, 0, f_board.width, f_board.height);

    // Update bird position
    f_velocityY += f_gravity;
    f_bird.y = Math.max(f_bird.y + f_velocityY, 0); // Apply gravity to current bird position, limit bird's position to the top of the canvas
    f_context.drawImage(f_birdImg, f_bird.x, f_bird.y, f_bird.width, f_bird.height);

    if (f_bird.y > f_board.height) {
        f_gameOver = true;
    }

    // Update pipes position and check for collision
    for (let i = 0; i < f_pipeArray.length; i++) {
        let pipe = f_pipeArray[i];
        pipe.x += f_velocityX;
        f_context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Increase score if the bird has passed the pipe
        if (!pipe.passed && f_bird.x > pipe.x + pipe.width) {
            f_score += 0.5; // Increase score by 0.5 because there are 2 pipes (0.5 for each set of pipes)
            pipe.passed = true;
        }

        // Check for collision between bird and pipe
        if (f_detectCollision(f_bird, pipe)) {
            f_gameOver = true;
        }
    }

    // Clear pipes that have moved off the screen
    while (f_pipeArray.length > 0 && f_pipeArray[0].x < -f_pipeWidth) {
        f_pipeArray.shift(); // Remove the first element from the array
    }

    // Update and display the score
    f_context.fillStyle = "white";
    f_context.font="20px sans-serif";
    f_context.fillText(f_score, 5, 45);

    if (f_gameOver) {
        f_context.fillStyle = "red";
        f_context.fillText("GAME OVER. Press arrow up to restart", 10, 90);
    }
}

// Generate pipes
function f_placePipes() {
    if (f_gameOver) {
        return;
    }

    // Randomly calculate the position of the pipes
    let randomPipeY = f_pipeY - f_pipeHeight/4 - Math.random()*(f_pipeHeight/2);
    let openingSpace = f_board.height/4;

    // Create and add top pipe to the pipe array
    let topPipe = {
        img : f_topPipeImg,
        x : f_pipeX,
        y : randomPipeY,
        width : f_pipeWidth,
        height : f_pipeHeight,
        passed : false
    }
    f_pipeArray.push(topPipe);

    // Create and add bottom pipe to the pipe array
    let bottomPipe = {
        img : f_bottomPipeImg,
        x : f_pipeX,
        y : randomPipeY + f_pipeHeight + openingSpace,
        width : f_pipeWidth,
        height : f_pipeHeight,
        passed : false
    }
    f_pipeArray.push(bottomPipe);
}

// Move the bird and restart the game if it's over
function f_moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // Make the bird jump
        f_velocityY = -6;

        // Reset the game if it's over
        if (f_gameOver) {
            f_bird.y = f_birdY;
            f_pipeArray = [];
            f_score = 0;
            f_gameOver = false;
        }
    }
}

// Detect collision between two objects
function f_detectCollision(a, b) {
    return a.x < b.x + b.width &&   // Check if a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   // Check if a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  // Check if a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    // Check if a's bottom left corner passes b's top left corner
}
