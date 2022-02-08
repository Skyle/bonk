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

let counterElement = document.getElementById("counter");
let speedElement = document.getElementById("speed");

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
const xSlow = 0.98;
let fpsFaktor = 16.666666666666668;
fpsFaktor = 15.4;
const ySpeedUp = 1.24;
let counter = 0;
let ballSpeed = 0;

window.onload = () => {
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
// Die Hauptschleifenfunktion
// Wird jede Aktualisierung aufgerufen und aktualisiert die Spieldaten
function update() {
  // Als erstes darf der Spieler sein Paddel bewergen
  moveRechtesPaddel();
  moveBall();
  ballSpeed = calculateSpeed(ball.vec.x, ball.vec.y);
  speedElement.innerHTML = ballSpeed;
}

// Benutzereingaben werden überprüft und dementsprechend das Passel bewegt
function moveRechtesPaddel() {
  // Es wird immer nur die Eingabe akzeptiert, bei der nur eine Taste gedrückt wird
  // Falls die Pfeiltaste nach Unten gedrückt wird
  if (pressedUnten && !pressedOben) {
    // Das Paddel wird um den paddelSpeed nach unten versetzt
    rechtesPaddel.pos.y = rechtesPaddel.pos.y + paddelSpeed;
    // Falls das Paddel unten gegen den Fensterrand kommt, wird es auf den letzten möglichen Wert gesetzt
    if (rechtesPaddel.pos.y + 128 + padding > window.innerHeight) {
      rechtesPaddel.pos.y = window.innerHeight - 128 - padding;
    }
    // Jetzt erfolgt die DOM-Manipulation
    updatePaddelPosition(rechtesPaddel.pos.y);
  }
  // Und das gleiche nochmal um zu checken, ob das Paddel oben gegenkommt
  if (pressedOben && !pressedUnten) {
    rechtesPaddel.pos.y = rechtesPaddel.pos.y - paddelSpeed;
    if (rechtesPaddel.pos.y < padding) {
      rechtesPaddel.pos.y = padding;
    }
    updatePaddelPosition(rechtesPaddel.pos.y, "rechts");
  }
}

// Entfernt das Pixel-Suffix aus einem String
// vielleicht deprecated
function removePixel(hoehe) {
  return parseFloat(hoehe.substring(0, hoehe.length - 2));
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
  // Ball und Paddel haben die gleiche x-Position
  if (ball.pos.x + 2 * ballSize >= window.innerWidth) {
    // Ball trifft den Bereich der y-Achse auf der sich das Paddel befindet
    // Damit treffen sich Ball und Paddel
    // TODO Es können mehrere treffen direkt hintereinander erfolgen
    if (
      (ball.pos.y >= rechtesPaddel.pos.y &&
        ball.pos.y <= rechtesPaddel.pos.y + paddelSize) ||
      (ball.pos.y + ballSize >= rechtesPaddel.pos.y &&
        ball.pos.y + ballSize <= rechtesPaddel.pos.y + paddelSize)
    ) {
      // Bei jedem Treffer wird er Counter um 1 erhöht
      counter++;
      counterElement.innerHTML = counter;
      // Der Ball soll abhängig von der Bewergung des Paddels beschleunigt werden
      // Es gibt 2 Checks, jeweils 1 für hoch und runter
      // Ball und Paddel bewegen sich in die selbe Richtung
      if (pressedUnten && !pressedOben && ball.vec.y >= 0) {
        ball.vec.x = -ball.vec.x * xSpeedUp;
        ball.vec.y = ball.vec.y * ySpeedUp + 1.5;
      } else if (pressedOben && !pressedUnten && ball.vec.y <= 0) {
        ball.vec.x = -ball.vec.x * xSpeedUp;
        ball.vec.y = ball.vec.y * ySpeedUp - 1.5;
        // Ball und Paddel bewegen sich in die entgegengesetzte Richtung
      } else if (pressedOben && !pressedUnten && ball.vec.y >= 0) {
        ball.vec.x = -ball.vec.x * xSlow;
        ball.vec.y = ball.vec.y * 0.9 - 0.8;
      } else if (pressedUnten && !pressedOben && ball.vec.y <= 0) {
        ball.vec.x = -ball.vec.x * xSlow;
        ball.vec.y = ball.vec.y * 0.9 + 0.8;
      } else {
        ball.vec.x = -ball.vec.x * xSpeedUp;
      }
    }
  }
  updateBallPosition(ball.pos.x, ball.pos.y);
}

function calculateSpeed(x, y) {
  return Math.sqrt(x ** 2 + y ** 2);
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
// Steuerfunktionen zur Animation

function resetAll() {
  resetBall();
  resetPaddel("rechts");
  resetPaddel("links");
  counter = 0;
  counterElement.innerHTML = 0;
}

function start() {
  resetAll();
  const yMin = -3;
  const yMax = 3;
  const xMax = 1.2;
  const xMin = 0.8;
  const xRandom = Math.random() * (xMax - xMin) + xMin;
  const startVectorX = paddelSpeed * 0.8 * xRandom;
  ball.vec.x = startVectorX;
  const startVectorY = Math.random() * (yMax - yMin) + yMin;
  ball.vec.y = startVectorY;
  framesInterval = setInterval(update, fpsFaktor);
}

function stop() {
  clearInterval(framesInterval);
}

function pause() {
  clearInterval(framesInterval);
}

function resume() {
  framesInterval = setInterval(update, fpsFaktor);
}
