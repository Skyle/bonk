// Strikter Modus um zu vermeiden, dass undeklarierte Variablen genutzt werden
"use strict";
// Variablen werden deklariert und manche auch schon initialisiert

// TODO Array mit allen im Spiel vorhandenen Entitäten (Ball, Paddel)
let entities = [];

// DEPRECATED Erste Zeit für den Framecounter
let letzteSekunde = Date.now();

// Richtungstasten
let pressedOben = false;
let pressedUnten = false;

// Die kompletten Optionen als Object
// Die Elemente werden erst gesetzt, wenn das Fenster geladen ist
const optionen = {
  running: { element: null, wert: false },
  clickerElement: null,
  ausgefahren: false,
  padding: 12,
  speed: {
    wert: 1,
    faktor: 1,
    element: null,
  },
  // Zufallfaktoren um den Start etwas abwechselnd zu gestalten
  startParameter: {
    xMin: 1,
    xMax: 2,
    yMin: -0.6,
    yMax: 0.6,
  },
};
const ball = {
  name: "ball",
  size: 24,
  element: null,
  pos: { x: 0, y: 0 },
  vec: { x: 0, y: 0 },
};

// Das Spielerpaddel
const paddel = {
  name: "paddel",
  speed: 4,
  height: 128,
  width: 12,
  element: null,
  pos: { x: 0, y: 0 },
  vec: { x: 0, y: 0 },
};
const counter = { count: 0, element: null };
let animation = null;

// Wenn der Browser die ganze Seite geladen hat, beginnen wir damit unser Programm aufzubauen
window.onload = () => {
  // Unser Ball bekommt sein DOM-Element zugeordnet
  ball.element = document.getElementById("ball");
  // Und wird in das Array unserer Entitäten gepusht
  entities.push(ball);

  // Der Punktezähler bekommt sein Element
  counter.element = document.getElementById("counter");

  // Die Checkbox, die bestimmt ob das Spiel läuft, wird referenziert
  optionen.running.element = document.getElementById("runningCheckbox");

  // Der Slider für die Geschwindigkeit wird seinem Element zugeordnet
  optionen.speed.element = document.getElementById("speedSlider");

  paddel.element = document.getElementById("paddel");

  // Die Optionen bekommen ihr Element
  optionen.clickerElement = document.getElementById("optionen-clicker");

  // Läuft Checkbox onClick Handler
  optionen.running.element.onclick = (e) => {
    if (e.target.checked) {
      resume();
    } else {
      pause();
    }
  };
  // EventListener für Tastenanschläge
  document.addEventListener("keydown", untendruecker);
  document.addEventListener("keyup", obenlasser);

  // Alles wird auf den Ursprungszustand gesetzt und das Spiel wird gestartet
  reset();
  start();
};

// Definition der onChange Handler
function changeEventHandler(event) {
  optionen.speed.faktor = event.target.value;
  stop();
  start();
}

// Animations-Loop
function update() {
  if (optionen.running.wert) {
    move();
    collisionsCheck();
    const speed = Math.sqrt(ball.vec.x ** 2 + ball.vec.y ** 2);
    animation = window.requestAnimationFrame(update);
  }
}

// Falls die Fenstergröße verändert wird, wird das Spiel zurückgesetzt
window.onresize = () => {
  centerPaddel();
};

// Setzt das Spielfeld auf den Ausgangszustand
function reset() {
  // Zentrieren des Balls
  centerBall();
  centerPaddel();
  counter.count = 0;
  counter.element.innerHTML = counter.count;
}

// Funktion zum Spielstart
function start() {
  giveBallInitialVelocity();
  optionen.running.wert = true;
  update();
  console.log("Animation wird begonnen");
}

function pause() {
  optionen.running.wert = false;
}

function stop() {
  optionen.running.wert = false;
  window.cancelAnimationFrame(animation);
  reset();
}

function resume() {
  optionen.running.wert = true;
  update();
}

// Funktionen zur Bewegungssteuerung
function move() {
  moveBall();
  movePaddel();
}

function centerBall() {
  const halbeWeite = window.innerWidth / 2;
  const halbeHoehe = window.innerHeight / 2;
  ball.pos.x = halbeWeite - ball.size / 2;
  ball.pos.y = halbeHoehe - ball.size / 2;
  translateBall(ball.pos.x, ball.pos.y);
}

function centerPaddel() {
  const halbeHoehe = window.innerHeight / 2;
  paddel.pos.x = window.innerWidth - paddel.width * 2;
  paddel.pos.y = halbeHoehe - paddel.height / 2;
  translatePaddel(paddel.pos.x, paddel.pos.y);
}

function moveBall() {
  ball.pos.x += ball.vec.x;
  ball.pos.y += ball.vec.y;
  translateBall(ball.pos.x, ball.pos.y);
}

function movePaddel() {
  if (pressedUnten && !pressedOben) {
    paddel.pos.y += paddel.speed;
  }
  if (pressedOben && !pressedUnten) {
    paddel.pos.y -= paddel.speed;
  }
  checkPaddelOutOfBound();
  translatePaddel(paddel.pos.x, paddel.pos.y);
}

function translateBall(xCord, yCord) {
  ball.element.style.transform = "translate(" + xCord + "px ," + yCord + "px)";
}

function translatePaddel(x, y) {
  paddel.element.style.transform = "translate(" + x + "px ," + y + "px)";
}

function giveBallInitialVelocity() {
  const initialXVelo =
    optionen.speed.wert *
    optionen.speed.faktor *
    (Math.random() *
      (optionen.startParameter.xMax - optionen.startParameter.xMin) +
      optionen.startParameter.xMin);
  const initialYVelo =
    optionen.speed.wert *
    optionen.speed.faktor *
    (Math.random() *
      (optionen.startParameter.yMax - optionen.startParameter.yMin) +
      optionen.startParameter.yMin);

  ball.vec.x = initialXVelo;
  ball.vec.y = initialYVelo;
}

// Kollisionsabfragen
function collisionsCheck() {
  // Überprüft ob der Ball auf der rechten Seite gegen den Bildschirmrand kommt
  if (ball.pos.x + ball.size >= window.innerWidth) {
    ball.vec.x = -ball.vec.x;
  }
  // Überprüft ob der Ball auf der linken Seite gegen den Bildschirmrand kommt
  if (ball.pos.x <= 0) {
    ball.vec.x = -ball.vec.x;
  }
  if (ball.pos.y <= 0) {
    ball.vec.y = -ball.vec.y;
  }
  if (ball.pos.y + ball.size >= window.innerHeight) {
    ball.vec.y = -ball.vec.y;
  }
  if (ball.pos.x + 2 * paddel.width * 2 >= window.innerWidth) {
    console.log("auf der höhe");
    if (
      ball.pos.y + ball.size >= paddel.pos.y &&
      ball.pos.y <= paddel.pos.y + paddel.height
    ) {
      ball.vec.x = -ball.vec.x;
      incrementCounter();
    } else {
      console.log("tod");
      stop();
      start();
    }
  }
}

function checkPaddelOutOfBound() {
  if (paddel.pos.y < 0) {
    paddel.pos.y = 0;
  }
  if (paddel.pos.y + paddel.height > window.innerHeight) {
    paddel.pos.y = window.innerHeight - paddel.height;
  }
}

// DOM-Manipulationsfuntionen
function incrementCounter() {
  counter.count++;
  counter.element.innerHTML = counter.count;
}

// Funktionen um gedrückte Tasten zu registrieren
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
