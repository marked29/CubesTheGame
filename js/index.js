// Buttons-section
const startBtn = document.getElementById("Start");
const newGameBtn = document.getElementById("NewGame");
const saveBtn = document.getElementById("Save");

// Point-section
const points = document.getElementById("Points");
const counter = points.querySelector(".counter");
const finalScore = document.getElementById("Score");

// Timer-section
const clock = document.getElementById("Timer");
const minutesSpan = clock.querySelector(".minutes");
const secondsSpan = clock.querySelector(".seconds");

// Overlay-section
const overlay = document.getElementById("Hidden");
const name = document.getElementById("Name");

// Game field & Ranking
const mainField = document.getElementById("GameField");
const playersRanking = document.getElementById("Ranking");

const myStorage = window.localStorage;

const _FIELD_ROWS = 5;
const _FIELD_COLS = 11;
const _FIELD_COLS_CLASS = "columns-wrapper-11";

const _SECONDS_TIME = 60;
const _ARRAY_SIZE = _FIELD_ROWS * _FIELD_COLS;

let _timeInterval;
let _score = 0;
let _isStartGamePressed = false;
let _timeLimitExceeded = false;



const printDefaults = () => {
  minutesSpan.innerHTML = "01"
  secondsSpan.innerHTML = "00";
  counter.innerHTML = "<b>0</b>";
  name.value = "";
}

const printScore = (id ,point) => {
  id.innerHTML = point.toString();
}

const reset = () => {
  
  resetTimer();
  resetEventListeners();
  resetGameField();

  printDefaults();
  
  _score = 0;
  _isStartGamePressed = false;
}

const resetTimer = () => {
    if (_timeInterval) {
    clearInterval(_timeInterval);
  }
}

const detectElementId = element => {
    element = element || window.event;
    let illegalClassName = "center " + _FIELD_COLS_CLASS;
    if(element.target.className==illegalClassName){
      return;
    }
    gameLogic(element.target); 
}

const resetEventListeners = () => {
  saveBtn.removeEventListener("click", () => { hideForm() });
  mainField.removeEventListener("click", (element) => { 
    detectElementId(element);
  });
}

const resetGameField = () => {

  for (var i = 0; i < _gameFields.length; i++) {
    let cube = document.getElementById(i); 
    cube.style.backgroundColor = "#ffffff83";
    cube.style.visibility = "visible";
  }
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
      _timeLimitExceeded = true;
      newGame()
    }
    minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
    secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
  }

  updateClock();
  _timeInterval = setInterval(updateClock, 1000);
}


/**
*  Save-name form
*/ 
const showForm = () => {
  overlay.style.display = 'grid';
  saveBtn.addEventListener("click", () => { hideForm() });

  printScore(finalScore, _score);
  reset();
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
  let deadline = new Date(Date.parse(new Date()) + _SECONDS_TIME * 1000);
  initializeClock(deadline);
  _isStartGamePressed = true;
  updateGameFields()
  mainField.addEventListener("click", (element) => { 
    detectElementId(element);
  });

}

const newGame = () => {
  if (_score == 0 && _isStartGamePressed == false) {
    alert("Play this one - you won\'t regret it!");
    return;
  }
  showForm();
}

/**
*  Game logic 
*/  
const addScore = () => {
  if (!_isStartGamePressed) {
    return;
  }
  _score++;
  printScore(counter,_score);
}

const addNewBlocks = () => {
  let randomId = Math.floor(Math.random() * _gameFields.length);
  let randomAmount = Math.random() <= 0.4;

  while (_gameFields[randomId].isActive != false){
    randomId = Math.floor(Math.random() * _gameFields.length);
  }

  _gameFields[randomId].isActive = true;
  document.getElementById(randomId).style.visibility = 'visible';
}

const gameLogic = target => {
  if (!_isStartGamePressed) {
    return;
  }

  _gameFields[target.id].isActive = false;
  target.style.visibility = 'hidden';
  addScore();
  addNewBlocks();
}

const setRandomColor = () => {
  let color
  switch (Math.abs(Math.ceil(Math.random() * 10 - 4))) {
    case 0:
    color = "#FFAEAD"; 
    break;
    case 1:
    color = "#FFD5C5"; 
    break;
    case 2:
    color = "#FFFEE0"; 
    break;
    case 3:
    color = "#BBF4FF"; 
    break;
    case 4:
    color = "#A2DDFF"; 
    break;
    case 5:
    color = "#D9D1FF"; 
    break;
    case 6:
    color = "#DCEDC1";
    break;
    default:
    alert( "Unexpected error" );
  }
  return color;
}

let _gameFields = Array(_ARRAY_SIZE).fill().map( gameField=> {
  return {
    color : setRandomColor(),
    isActive: Math.random() <= 0.1
  }
});

const availableGameFields = (gameField) => { gameField.isActive == true ;}

const printGameFields = () => {
  let ids = 0;

  if (!_gameFields.some(availableGameFields)) {
      _gameFields[Math.floor(Math.random() * _gameFields.length)].isActive = true;   
  }

  for (var i = 0; i < _FIELD_ROWS; i++) {
    let wrapper = document.createElement('div');
    wrapper.className = "center " + _FIELD_COLS_CLASS;
    mainField.appendChild(wrapper);

    for (var j = 0; j < _FIELD_COLS; j++) {
      let newElement = document.createElement('div');
      newElement.className = "center neu-center neu-cube";
      newElement.id = ids;
      wrapper.appendChild(newElement);
      ids++;
    }
  }
}

const updateGameFields = () => {

  for (var i = 0; i < _gameFields.length; i++) {

    let cube = document.getElementById(i); 
    cube.style.backgroundColor = _gameFields[i].color;
    
    if (!_gameFields[i].isActive) {
        cube.style.visibility = 'hidden';
    }
  }
}


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


printGameFields();
printListOfPlayers();

startBtn.addEventListener("click", () => { startGame() });
newGameBtn.addEventListener("click", () => { newGame() });