const spiel = {
  baelle: [],
  running: true,
  animation: null,
  speed: 2,
  grav: 0.2,
  spielfeld: { element: null },
};

window.onload = function () {
  spiel.spielfeld.element = document.getElementById("spielfeld");
  const spielfeld = spiel.spielfeld.element;
  for (let index = 0; index < 10; index++) {
    const neuerBall = createBall(
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random()
    );
    spiel.baelle.push(neuerBall);
    spielfeld.append(neuerBall.element);
  }

  update();
};

function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = (num >> 8) & 255;
  var b = num & 255;
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function createBall(x, y, vx, vy) {
  const ball = {
    element: null,
    pos: { x, y },
    vec: { x: vx, y: vy },
    size: 24,
  };
  ball.element = document.createElement("div");
  ball.element.style.position = "absolute";
  ball.element.style.width = ball.size + "px";
  ball.element.style.height = ball.size + "px";
  ball.element.style.backgroundColor = getRandomRgb();
  ball.element.style.borderRadius = "50%";
  return ball;
}

window.onresize = function () {
  for (const ball of spiel.baelle) {
    ball.vec.x += Math.random() < 0.5 ? -1 : 1;
  }
};

function update() {
  if (spiel.running) {
    for (const ball of spiel.baelle) {
      ball.vec.y = ball.vec.y + spiel.grav;
      ball.pos.x = ball.pos.x + ball.vec.x * spiel.speed;
      ball.pos.y = ball.pos.y + ball.vec.y * spiel.speed - spiel.grav;
      if (ball.pos.x + ball.size > window.innerWidth) {
        const mehr = ball.pos.x + ball.size - window.innerWidth;
        ball.pos.x = window.innerWidth - mehr - ball.size;
        ball.vec.x = -ball.vec.x;
      } else if (ball.pos.y + ball.size > window.innerHeight) {
        const mehr = ball.pos.y + ball.size - window.innerHeight;
        ball.pos.y = window.innerHeight - mehr - ball.size;
        ball.vec.y = -ball.vec.y * 0.85;
        ball.vec.x = ball.vec.x * 0.85;
      } else if (ball.pos.x <= 0) {
        const mehr = 0 - ball.pos.x;
        ball.pos.x = mehr;
        ball.vec.x = -ball.vec.x;
      } else if (ball.pos.y <= 0) {
        const mehr = 0 - ball.pos.y;
        ball.pos.y = mehr;
        ball.vec.y = -ball.vec.y;
      }
      translateBall(ball);
    }

    spiel.animation = requestAnimationFrame(update);
  }
}

function translateBall(ball) {
  ball.element.style.transform =
    "translate(" + ball.pos.x + "px ," + ball.pos.y + "px)";
}
