// Slide variables initialization
const conSlider = document.querySelector(".con-sider");
const textSide = document.querySelector(".text-side");
const gameSlide = document.querySelector(".game-side");
const arrowUp = document.querySelector(".up");
const arrowDown = document.querySelector(".down");
const slideLength = gameSlide.querySelectorAll("div").length;
const currenrGame = document.querySelector("#current_game");

let activeSlide = 0;
let doodleGameStarted = false;
let flappyGameStarted = false;
let ticTacToeGameStarted = true;

// Set initial game
t_setGame();

// Set text side position
textSide.style.top = `-${(slideLength - 1) * 100}vh`;

// Event listener for the arrow up button
arrowUp.addEventListener("click", function () {
  changeSlide("up");
});

// Event listener for the arrow down button
arrowDown.addEventListener("click", function () {
  changeSlide("down");
});

// Function to change slides
function changeSlide(direction) {
  const slideHeight = conSlider.clientHeight;

  if (direction === "up") {
    activeSlide++;
    if (activeSlide > slideLength - 1) {
      activeSlide = 0;
    }
  }

  if (direction === "down") {
    activeSlide--;
    if (activeSlide < 0) {
      activeSlide = slideLength - 1;
    }
  }

  // Start the respective game based on the active slide
  switch (activeSlide) {
    case 0:
      if (!ticTacToeGameStarted) {
        t_setGame();
        ticTacToeGameStarted = true;
      }
      break;
    case 1:
      if (!doodleGameStarted) {
        doodle_start();
        doodleGameStarted = true;
      }
      break;
    case 2:
      if (!flappyGameStarted) {
        f_flappy_start();
        flappyGameStarted = true;
      }
      break;
  }

  // Slide transition
  gameSlide.style.transform = `translateY(-${activeSlide * slideHeight}px)`;
  textSide.style.transform = `translateY(${activeSlide * slideHeight}px)`;
}
