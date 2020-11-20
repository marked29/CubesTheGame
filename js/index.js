const startBtn = document.getElementById("Start");
const newGameBtn = document.getElementById("NewGame");
const saveBtn = document.getElementById("Save");

const points = document.getElementById("Points");
const counter = points.querySelector(".counter");
const finalScore = document.getElementById("Score");

const clock = document.getElementById("Timer");
const minutesSpan = clock.querySelector(".minutes");
const secondsSpan = clock.querySelector(".seconds");

const overlay = document.getElementById("Hidden");
const name = document.getElementById("Name");

const gameField = document.getElementById("GameField");

const myStorage = window.localStorage;


let timeinterval;
let score = 0;
let isStartGamePressed = false;
let timeLimitExceeded = false;




const printDefaults = () => {
  minutesSpan.innerHTML = "01"
  secondsSpan.innerHTML = "00";
  counter.innerHTML = "<b>0</b>";
}

const printScore = (id ,point) => {
  id.innerHTML = point.toString();
}


const reset = function() {
  if (timeinterval) {
    clearInterval(timeinterval);
  }
  printDefaults();

  score = 0;
  isStartGamePressed = false;

}



/**
*   Timer
*/

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  return {
    minutes: minutes,
    seconds: seconds
  };
}

const initializeClock = (endtime) => {
  const updateClock = () => {
    var t = getTimeRemaining(endtime);
    if (t.minutes == 0 && t.seconds == 0) {
      timeLimitExceeded = true;
      newGame()
    }
    minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
    secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
  }

  updateClock();
  timeinterval = setInterval(updateClock, 1000);
}


/**
*   TODO: create new form to save the name
*/ 

const showForm = () => {
  overlay.style.display = 'grid';
  printScore(finalScore, score)
}

const hideForm = () => {
  overlay.style.display = 'none';

  myStorage.setItem(name.value, finalScore.textContent)
}


/**
*   Buttons
*/

const startGame = () => {
  reset();
  let deadline = new Date(Date.parse(new Date()) + 60 * 1000);
  initializeClock(deadline);
  isStartGamePressed = true;
}

const newGame = function() {
  if (score == 0 && isStartGamePressed == false) {
      alert("Play this one - you won\'t regret it!");
      return;
  }
  showForm();
  
  // keepValues();
  reset();
}






// TODO: create game logic 

const addScore = () => {
  score++;
  printScore(counter,score);
}


// TODO: side-bar impl


startBtn.addEventListener("click", () => { startGame() });
newGameBtn.addEventListener("click", () => { newGame() });
saveBtn.addEventListener("click", () => { hideForm() });
gameField.addEventListener("click", () => { addScore() });