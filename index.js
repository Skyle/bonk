// Strikter Modus um zu vermeiden, dass undeklarierte Variablen genutzt werden
"use strict";
// Variablen werden deklariert und manche auch schon initialisiert
// Die Ballgröße in Pisel
let ballSize = 24;

// TODO Array mit allen im Spiel vorhandenen Entitäten (Ball, Paddel)
let entities = [];

// DEPRECATED Erste Zeit für den Framecounter
let letzteSekunde = Date.now();

// Die kompletten Optionen als Object
// Die Elemente werden erst gesetzt, wenn das Fenster geladen ist
const optionen = {
  running: { element: null, wert: false },
  clickerElement: null,
  ausgefahren: false,
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

  // Die Optionen bekommen ihr Element
  optionen.clickerElement = document.getElementById("optionen-clicker");

  // Läuft Checkbox
  optionen.running.element.onclick = (e) => {
    if (e.target.checked) {
      resume();
    } else {
      pause();
    }
  };
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
  console.log(optionen.running.wert);
  if (optionen.running.wert) {
    move();
    collisionsCheck();
    const speed = Math.sqrt(ball.vec.x ** 2 + ball.vec.y ** 2);
    animation = window.requestAnimationFrame(update);
  }
}

// Falls die Fenstergröße verändert wird, wird das Spiel zurückgesetzt
/* window.onresize = () => {
  stop();
  reset();
  start();
};
*/

// Setzt das Spielfeld auf den Ausgangszustand
function reset() {
  // Zentrieren des Balls
  centerBall();
  counter.count = 0;
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
}

function centerBall() {
  const halbeWeite = window.innerWidth / 2;
  const halbeHoehe = window.innerHeight / 2;
  ball.pos.x = halbeWeite - ballSize / 2;
  ball.pos.y = halbeHoehe - ballSize / 2;
  translateBall(ball.pos.x, ball.pos.y);
}

function moveBall() {
  ball.pos.x += ball.vec.x;
  ball.pos.y += ball.vec.y;
  translateBall(ball.pos.x, ball.pos.y);
}

function translateBall(xCord, yCord) {
  ball.element.style.transform = "translate(" + xCord + "px ," + yCord + "px)";
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
  if (ball.pos.x + ballSize >= window.innerWidth) {
    ball.vec.x = -ball.vec.x;
    incrementCounter();
  }
  // Überprüft ob der Ball auf der linken Seite gegen den Bildschirmrand kommt
  if (ball.pos.x <= 0) {
    ball.vec.x = -ball.vec.x;
    incrementCounter();
  }
  if (ball.pos.y <= 0) {
    ball.vec.y = -ball.vec.y;
    incrementCounter();
  }
  if (ball.pos.y + ballSize >= window.innerHeight) {
    ball.vec.y = -ball.vec.y;
    incrementCounter();
  }
}

// DOM-Manipulationsfuntionen
function incrementCounter() {
  counter.count++;
  counter.element.innerHTML = counter.count;
}
