//board
let f_board;
let f_boardWidth = 360;
let f_boardHeight = 640;
let f_context;

//bird
let f_birdWidth = 34; //width/height ratio = 408/228 = 17/12
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

//pipes
let f_pipeArray = [];
let f_pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let f_pipeHeight = 512;
let f_pipeX = f_boardWidth;
let f_pipeY = 0;

let f_topPipeImg;
let f_bottomPipeImg;

//physics
let f_velocityX = -2; //pipes moving left speed
let f_velocityY = 0; //bird jump speed
let f_gravity = 0.4;

let f_gameOver = true;
let f_score = 0;

function f_flappy_start() {
    f_board = document.getElementById("flappy-board");
    f_board.height = f_boardHeight;
    f_board.width = f_boardWidth;
    f_context = f_board.getContext("2d"); //used for drawing on the board

    //draw flappy bird
    // f_context.fillStyle = "green";
    // f_context.fillRect(f_bird.x, f_bird.y, f_bird.width, f_bird.height);

    //load images
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
    f_context.fillText("Press arrow up to strart", 5, 90);

    setInterval(f_placePipes, 1500); //every 1.5 seconds
    document.addEventListener("keydown", f_moveBird);
}

function f_update() {
    requestAnimationFrame(f_update);
    if (f_gameOver) {
        return;
    }
    f_context.clearRect(0, 0, f_board.width, f_board.height);

    //bird
    f_velocityY += f_gravity;
    // f_bird.y += f_velocityY;
    f_bird.y = Math.max(f_bird.y + f_velocityY, 0); //apply gravity to current f_bird.y, limit the f_bird.y to top of the canvas
    f_context.drawImage(f_birdImg, f_bird.x, f_bird.y, f_bird.width, f_bird.height);

    if (f_bird.y > f_board.height) {
        f_gameOver = true;
    }

    //pipes
    for (let i = 0; i < f_pipeArray.length; i++) {
        let pipe = f_pipeArray[i];
        pipe.x += f_velocityX;
        f_context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && f_bird.x > pipe.x + pipe.width) {
            f_score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (f_detectCollision(f_bird, pipe)) {
            f_gameOver = true;
        }
    }

    //clear pipes
    while (f_pipeArray.length > 0 && f_pipeArray[0].x < -f_pipeWidth) {
        f_pipeArray.shift(); //removes first element from the array
    }

    //score
    f_context.fillStyle = "white";
    f_context.font="20px sans-serif";
    f_context.fillText(f_score, 5, 45);

    if (f_gameOver) {
        f_context.fillStyle = "red";
        f_context.fillText("GAME OVER press arrow up to restart", 10, 90);
    }
}

function f_placePipes() {
    if (f_gameOver) {
        return;
    }

    //(0-1) * f_pipeHeight/2.
    // 0 -> -128 (f_pipeHeight/4)
    // 1 -> -128 - 256 (f_pipeHeight/4 - f_pipeHeight/2) = -3/4 f_pipeHeight
    let randomPipeY = f_pipeY - f_pipeHeight/4 - Math.random()*(f_pipeHeight/2);
    let openingSpace = f_board.height/4;

    let topPipe = {
        img : f_topPipeImg,
        x : f_pipeX,
        y : randomPipeY,
        width : f_pipeWidth,
        height : f_pipeHeight,
        passed : false
    }
    f_pipeArray.push(topPipe);

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

function f_moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        f_velocityY = -6;

        //reset game
        if (f_gameOver) {
            f_bird.y = f_birdY;
            f_pipeArray = [];
            f_score = 0;
            f_gameOver = false;
        }
    }
}

function f_detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}