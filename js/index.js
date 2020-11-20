const startBtn = document.getElementById("Start")
const newGameBtn = document.getElementById("NewGame")

const points = document.getElementById("Points")
const counter = points.querySelector(".counter")

const clock = document.getElementById("Timer");
const minutesSpan = clock.querySelector(".minutes");
const secondsSpan = clock.querySelector(".seconds");


let timeinterval;
let score = 0;
let isStartGamePressed = false;

const printDefaults = () => {
  minutesSpan.innerHTML = "01"
  secondsSpan.innerHTML = "00";
  counter.innerHTML = "<b>0</b>";
}


const reset = function() {
  if (timeinterval) {
    clearInterval(timeinterval);
  }
  printDefaults();

  score = 0;
  isStartGamePressed = false;

}


function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  return {
    minutes: minutes,
    seconds: seconds
  };
}



const initializeClock = (id, endtime) => {


  const updateClock = () => {
    var t = getTimeRemaining(endtime);
    minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
    secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
  }

  updateClock();
  timeinterval = setInterval(updateClock, 1000);
}



const startGame = () => {
  reset();
  let deadline = new Date(Date.parse(new Date()) + 60 * 1000);
  initializeClock("Timer", deadline);
  isStartGamePressed = true;
}

const newGame = function() {
  if (score == 0 && isStartGamePressed == false) {
      alert("Play this one - you won\'t regret it!");
      return;
  }

  reset();
}

startBtn.addEventListener("click", () => { startGame()});
newGameBtn.addEventListener("click", () => { newGame()});


// TODO: create game logic 
// TODO: create new form to save the name
// TODO: implement reset method


