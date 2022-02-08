let linkesPaddel = {
  element: document.getElementById("links"),
  pos: { y: 0 },
  vec: { y: 0 },
};
let rechtesPaddel = {
  element: document.getElementById("rechts"),
  pos: { y: 0 },
  vec: { y: 0 },
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
  stop();
  start();
};

let framesInterval;
runningCheckbox.onclick = (e) => {
  if (e.target.checked) {
    resume();
  } else {
    pause();
  }
};

let pressedOben = false;
let pressedUnten = false;

// Globale Variablen
const paddelSpeed = 12;
const paddelSize = 128;
const padding = 8;
const ballSize = 24;
const xSpeedUp = 1.05;
const fpsFaktor = 16.666666666666668;
const ySpeedUp = 1.36;

window.onload = () => {
  init();
  start();
};

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
    rechtesPaddel.pos.y = rechtesPaddel.pos.y + paddelSpeed;
    if (rechtesPaddel.pos.y + 128 + padding > window.innerHeight) {
      rechtesPaddel.pos.y = window.innerHeight - 128 - padding;
    }
    updatePaddelPosition(rechtesPaddel.pos.y);
  }
  if (pressedOben && !pressedUnten) {
    rechtesPaddel.pos.y = rechtesPaddel.pos.y - paddelSpeed;
    if (rechtesPaddel.pos.y < padding) {
      rechtesPaddel.pos.y = padding;
    }
    updatePaddelPosition(rechtesPaddel.pos.y, "rechts");
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
  ball.pos.x = ball.pos.x + ball.vec.x;
  ball.pos.y = ball.pos.y + ball.vec.y;
  if (ball.pos.x > window.innerWidth) {
    stop();
    start();
  }
  if (ball.pos.x <= 0) {
    ball.vec.x = -ball.vec.x;
  }
  if (ball.pos.y <= 0) {
    ball.vec.y = -ball.vec.y;
  }
  if (ball.pos.y + ballSize >= window.innerHeight) {
    ball.vec.y = -ball.vec.y;
  }
  if (ball.pos.x + 2 * ballSize >= window.innerWidth) {
    if (
      (ball.pos.y >= rechtesPaddel.pos.y &&
        ball.pos.y <= rechtesPaddel.pos.y + paddelSize) ||
      (ball.pos.y + ballSize >= rechtesPaddel.pos.y &&
        ball.pos.y + ballSize <= rechtesPaddel.pos.y + paddelSize)
    ) {
      if (pressedUnten && !pressedOben && ball.vec.y >= 0) {
        ball.vec.x = -ball.vec.x * xSpeedUp;
        ball.vec.y = ball.vec.y * ySpeedUp + 2.5;
        console.log("schneller", ball.vec.y, ball.vec.x);
      } else if (pressedOben && !pressedUnten && ball.vec.y <= 0) {
        ball.vec.x = -ball.vec.x * xSpeedUp;
        ball.vec.y = ball.vec.y * ySpeedUp - 2.5;
        console.log("schneller", ball.vec.y, ball.vec.x);
      } else if (pressedOben && !pressedUnten && ball.vec.y >= 0) {
        ball.vec.x = -ball.vec.x * 0.95;
        ball.vec.y = ball.vec.y * 0.8 - 1.6;
        console.log("langsamer", ball.vec.y, ball.vec.x);
      } else if (pressedUnten && !pressedOben && ball.vec.y <= 0) {
        ball.vec.x = -ball.vec.x * 0.95;
        ball.vec.y = ball.vec.y * 0.8 + 1.6;
        console.log("langsamer", ball.vec.y, ball.vec.x);
      } else {
        ball.vec.x = -ball.vec.x * xSpeedUp;
        console.log("normal", ball.vec.x);
      }
    }
  }
  updateBallPosition(ball.pos.x, ball.pos.y);
}

function resetAll() {
  resetBall();
  resetPaddel("rechts");
  resetPaddel("links");
}

function resetPaddel(seite) {
  if (seite === "rechts") {
    const halbeHoehe = window.innerHeight / 2;
    rechtesPaddel.pos.y = halbeHoehe - 64;
    updatePaddelPosition(halbeHoehe - 64, seite);
  }
}

function resetBall() {
  const halbeHoehe = window.innerHeight / 2;
  const halbeWeite = window.innerWidth / 2;
  ball.pos.x = halbeWeite - 12;
  ball.pos.y = halbeHoehe - 12;
  ball.vec.x = 0;
  ball.vec.y = 0;
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
  resetAll();
  const yMin = -2;
  const yMax = 2;
  const xMax = 1.2;
  const xMin = 0.8;
  const xRandom = Math.random() * (xMax - xMin) + xMin;
  const startVectorX = paddelSpeed * 0.8 * xRandom;
  ball.vec.x = startVectorX;
  const startVectorY = Math.random() * (yMax - yMin) + yMin;
  ball.vec.y = startVectorY;
  framesInterval = setInterval(update, fpsFaktor);
  console.log("start", startVectorY, startVectorX);
}

function stop() {
  clearInterval(framesInterval);
  console.log("stop");
}

function pause() {
  clearInterval(framesInterval);
  console.log("pause");
}

function resume() {
  framesInterval = setInterval(update, fpsFaktor);
  console.log("weiter geht's");
}
