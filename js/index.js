

const displayTimer = document.getElementById("timer");



function printNumbers(from, to) {
  let current = from;
  setTimeout(function go() {
    let delta = to - current;
    console.log(delta);
    displayTimer.innerHTML = delta.toString(); 
    if (current < to) {
      setTimeout(go, 1000);
    }
    current++;
  }, 1000);
}

// использование:
printNumbers(1, 60);