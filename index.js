let linkesPaddel = {
  element: document.getElementById("links"),
  pos: { x: 0, y: 0 },
  vec: { x: 0, y: 0 },
};
let rechtesPaddel = {
  element: document.getElementById("rechts"),
  pos: { x: 0, y: 0 },
  vec: { x: 0, y: 0 },
};
let ball = {
  element: document.getElementById("ball"),
  pos: { x: 0, y: 0 },
  vec: { x: 0, y: 0 },
};

let runningCheckbox = document.getElementById("running");
let resetButton = document.getElementById("reset");
resetButton.onclick = () => {
  resetAll();
};

let framesInterval;
runningCheckbox.onclick = (e) => {
  if (e.target.checked) {
    start();
    framesInterval = setInterval(update, 16.66666666);
  } else {
    clearInterval(framesInterval);
    console.log("aus");
  }
};

window.onload = () => {
  init();
};
let pressedOben = false;
let pressedUnten = false;
const paddelSpeed = 8;

document.addEventListener("keydown", untendruecker);
document.addEventListener("keyup", obenlasser);

// Pausiert das Spielt und resettet den Ball wenn man das Fenster resizet
window.addEventListener("resize", function () {
  resetAll();
  clearInterval(framesInterval);
  runningCheckbox.checked = false;
});
function untendruecker(e) {
  if (e.key === "ArrowUp") {
    pressedOben = true;
  }
  if (e.key === "ArrowDown") {
    pressedUnten = true;
  }
}

function obenlasser(e) {
  if (e.key === "ArrowUp") {
    pressedOben = false;
  }
  if (e.key === "ArrowDown") {
    pressedUnten = false;
  }
}

function update() {
  moveRechtesPaddel();
  moveBall();
}

function moveRechtesPaddel() {
  if (pressedUnten && !pressedOben) {
    const style = getComputedStyle(rechtesPaddel);
    const alteHoehe = removePixel(style.top);
    const neueHoehe = alteHoehe + paddelSpeed;
    const vh = window.innerHeight;
    const paddelHoehe = removePixel(style.height);
    if (paddelHoehe + alteHoehe < vh) {
      const neueHoeheMitPixel = neueHoehe + "px";
      rechtesPaddel.style.top = neueHoeheMitPixel;
    } else {
      rechtesPaddel.style.top = vh - paddelHoehe + "px";
    }
  }
  if (pressedOben && !pressedUnten) {
    const style = getComputedStyle(rechtesPaddel);
    const alteHoehe = removePixel(style.top);
    const neueHoehe = alteHoehe - paddelSpeed;
    if (neueHoehe >= 0) {
      const neueHoeheMitPixel = neueHoehe + "px";
      rechtesPaddel.style.top = neueHoeheMitPixel;
    } else {
      rechtesPaddel.style.top = "0px";
    }
  }
}

function removePixel(hoehe) {
  return parseFloat(hoehe.substring(0, hoehe.length - 2));
}

function init() {
  console.log("Fertig geladen");
  resetAll();
}

function moveBall() {
  console.log(ball.pos.x);
  ball.pos.x = ball.pos.x + ball.vec.x;
  updateBallPosition(ball.pos.x + ball.vec.x);
}

function resetAll() {
  resetBall();
  resetPaddel("rechts");
  resetPaddel("links");
}

function resetPaddel(seite) {
  const halbeHoehe = window.innerHeight / 2;
  updatePaddelPosition(halbeHoehe - 64, seite);
}

function resetBall() {
  const halbeHoehe = window.innerHeight / 2;
  const halbeWeite = window.innerWidth / 2;
  ball.pos.x = halbeWeite - 12;
  ball.pos.y = halbeHoehe - 12;
  updateBallPosition(ball.pos.x, ball.pos.y);
}

function updateBallPosition(x, y) {
  ball.element.style.left = x + "px";
  ball.element.style.top = y + "px";
}

function updatePaddelPosition(y, seite = "rechts") {
  if (seite === "rechts") {
    rechtesPaddel.element.style.top = y + "px";
  } else {
    linkesPaddel.element.style.top = y + "px";
  }
}

function start() {
  resetBall();
  ball.vec.x = paddelSpeed;
}
