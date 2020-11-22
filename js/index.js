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

const mainField = document.getElementById("GameField");

const playersRanking = document.getElementById("Ranking");

const myStorage = window.localStorage;

const FIELD_SIZE = 5


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


const reset = () => {
  if (timeinterval) {
    clearInterval(timeinterval);
  }
  printDefaults();
  name.value = "";
  score = 0;
  isStartGamePressed = false;

}

/**
*   Timer
*/


const getTimeRemaining = endtime => {
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

  myStorage.setItem(name.value, finalScore.textContent);
  updateList();
}

/**
*   Buttons
*/


const startGame = () => {
  reset();
  let deadline = new Date(Date.parse(new Date()) + 60 * 1000);
  initializeClock(deadline);
  isStartGamePressed = true;
  updateGameFields()
}

const newGame = () => {
  if (score == 0 && isStartGamePressed == false) {
    alert("Play this one - you won\'t regret it!");
    return;
  }
  showForm();

  reset();
}

/**
*   TODO: create game logic 
*/  


const addScore = () => {
  if (!isStartGamePressed) {
    return;
  }
  score++;
  printScore(counter,score);
}

const gameLogic = target => {
  gameFields[target.id].isActive = false;
  target.style.visibility = 'hidden';
  addScore();
  addNewBlocks();
}

const addNewBlocks = () => {
  let randomId = Math.floor(Math.random() * gameFields.length);
  let randomAmount = Math.random() <= 0.4;

  while (gameFields[randomId].isActive != false){
    randomId = Math.floor(Math.random() * gameFields.length);
  }

  gameFields[randomId].isActive = true;
  document.getElementById(randomId).style.visibility = 'visible';
}


const setRandomColor = () => {
  let color
  switch (Math.abs(Math.ceil(Math.random() * 10 - 4))) {
    case 0:
    color = "red"; 
    break;
    case 1:
    color = "orange"; 
    break;
    case 2:
    color = "yellow"; 
    break;
    case 3:
    color = "lightgreen"; 
    break;
    case 4:
    color = "cyan"; 
    break;
    case 5:
    color = "blue"; 
    break;
    case 6:
    color = "violet";
    break;
    default:
    alert( "Unexpected error" );
  }
  return color;
}

let gameFields = Array(25).fill().map( gameField=> {
  return {
    color : setRandomColor(),
    isActive: Math.random() <= 0.1
  }
});

const availableGameFields = (gameField) => { gameField.isActive == true ;}


const printGameFields = () => {
  let ids = 0;

  if (!gameFields.some(availableGameFields)) {
      gameFields[Math.floor(Math.random() * gameFields.length)].isActive = true;   
  }

  for (var i = 0; i < FIELD_SIZE; i++) {
    let wrapper = document.createElement('div');
    wrapper.className = "center columns-wrapper-5";
    mainField.appendChild(wrapper);

    for (var j = 0; j < FIELD_SIZE; j++) {
      let newElement = document.createElement('div');
      newElement.className = "center neu-center neu-cube";
      newElement.style.backgroundColor = gameFields[ids].color;
      newElement.id = ids;
      wrapper.appendChild(newElement);
      ids++;
    }
  }
}

const updateGameFields = () => {

  for (var i = 0; i < gameFields.length; i++) {
    if (!gameFields[i].isActive) {
        document.getElementById(i).style.visibility = 'hidden';
    }
  }
}


printGameFields();

/**
*   side-bar impl
*/


const updateList = () => {
  if (Object.keys(localStorage).length === 0) {
    return;
  }

  let li = document.createElement('li');
  li.appendChild(document.createTextNode(name.value + " : " + myStorage.getItem(name.value)));
  playersRanking.appendChild(li);
}

const getAllStorage = () => {
  let rankingList = [];
  let keys = Object.keys(localStorage);
  let key;

  for (let i = 0; key = keys[i]; i++) {
    rankingList.push(key + ' : ' +localStorage.getItem(key));
  }
  return rankingList;
}

const printListOfPlayers = () => {
  let rankingList = getAllStorage();
  let keys = Object.keys(localStorage);
  let key;

  for (let i = 0; key = keys[i]; i++) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode( rankingList[i]));
    playersRanking.appendChild(li);
  }

}

printListOfPlayers();

startBtn.addEventListener("click", () => { startGame() });
newGameBtn.addEventListener("click", () => { newGame() });
saveBtn.addEventListener("click", () => { hideForm() });
mainField.addEventListener("click", (element) => { 
  element = element || window.event;
  if(element.target.className=="center columns-wrapper-5"){
    return;
  }
  gameLogic(element.target); 
});



//TODO: CREATE ENDGAME
//REFACTOR JS
// ADD STYLES