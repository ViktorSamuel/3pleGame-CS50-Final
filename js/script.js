// Slide variables initialization
const conSlider = document.querySelector(".con-sider");
const textSide = document.querySelector(".text-side");
const gameSlide = document.querySelector(".game-side");
const arrowUp = document.querySelector(".up");
const arrowDown = document.querySelector(".down");
const slideLength = gameSlide.querySelectorAll("div").length;
const currenrGame = document.querySelector("#current_game");

let activeSlide = 0;

// initialize games
t_setGame();
doodle_start();
f_flappy_start();

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

  // Slide transition
  gameSlide.style.transform = `translateY(-${activeSlide * slideHeight}px)`;
  textSide.style.transform = `translateY(${activeSlide * slideHeight}px)`;
}
